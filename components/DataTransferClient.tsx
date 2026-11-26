"use client"

import { useCallback, useRef, useState } from "react"
import { MOUNTAIN_LISTS } from "../lib/mountainCatalog"
import {
  getAllNotes,
  replaceAllNotes,
  type MountainNote,
} from "../lib/recordStore"
import {
  isValidSummitDate,
  readListState,
  writeListState,
  type SummitDates,
} from "../lib/summitStore"
import { DownloadIcon } from "./ui/Icons"
import styles from "./DataTransferClient.module.css"

const STORAGE_KEYS = MOUNTAIN_LISTS.map((list) => list.storageKey)

// v1: { version: 1, exportedAt, data: { [storageKey]: number[] } }  ← 既存形式（読み込み互換を維持）
// v2: { version: 2, exportedAt, data: { [storageKey]: number[] }, dates: { [storageKey]: SummitDates }, notes }
type ExportV1 = {
  version: 1
  exportedAt: string
  data: Record<string, number[]>
}
type ExportV2 = {
  version: 2
  exportedAt: string
  data: Record<string, number[]>
  dates: Record<string, SummitDates>
  notes: Record<string, MountainNote>
}

function sanitizeIds(value: unknown): number[] {
  return Array.isArray(value)
    ? value.map(Number).filter((n) => Number.isInteger(n) && n > 0)
    : []
}

function sanitizeDates(value: unknown): SummitDates {
  const result: SummitDates = {}
  if (!value || typeof value !== "object") return result
  for (const [key, list] of Object.entries(value)) {
    const id = Number(key)
    if (!Number.isInteger(id) || !Array.isArray(list)) continue
    const valid = list.filter(
      (d): d is string => typeof d === "string" && isValidSummitDate(d)
    )
    if (valid.length) result[id] = valid
  }
  return result
}

export default function DataTransferClient() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const handleExport = useCallback(() => {
    const data: Record<string, number[]> = {}
    const dates: Record<string, SummitDates> = {}
    for (const key of STORAGE_KEYS) {
      const state = readListState(key)
      if (state.raw === null) continue
      data[key] = [...state.checked]
      if (Object.keys(state.dates).length) dates[key] = state.dates
    }
    const exportData: ExportV2 = {
      version: 2,
      exportedAt: new Date().toISOString(),
      data,
      dates,
      notes: getAllNotes(),
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `yama100_backup_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string) as
          | ExportV1
          | ExportV2
        if (
          (json.version !== 1 && json.version !== 2) ||
          !json.data ||
          typeof json.data !== "object"
        ) {
          setStatus({
            type: "error",
            message: "ファイル形式が正しくありません",
          })
          return
        }

        const keys = Object.keys(json.data).filter((k) =>
          STORAGE_KEYS.includes(k)
        )
        if (keys.length === 0) {
          setStatus({
            type: "error",
            message: "インポートできるデータがありません",
          })
          return
        }

        const totalMountains = keys.reduce(
          (sum, k) => sum + sanitizeIds(json.data[k]).length,
          0
        )
        const confirmed = window.confirm(
          `${keys.length}種類のリスト、計${totalMountains}座のデータをインポートします。\n該当リストの既存データは上書きされます。続けますか？`
        )
        if (!confirmed) return

        for (const key of keys) {
          const checked = new Set(sanitizeIds(json.data[key]))
          // v1 には登頂日が含まれないため、既存の登頂日を保持する
          const dates =
            json.version === 2
              ? sanitizeDates(json.dates?.[key])
              : readListState(key).dates
          writeListState(key, checked, dates)
        }
        if (
          json.version === 2 &&
          json.notes &&
          typeof json.notes === "object"
        ) {
          replaceAllNotes(json.notes)
        }

        window.dispatchEvent(new Event("storage"))
        setStatus({
          type: "success",
          message: `${keys.length}種類のリストをインポートしました`,
        })
      } catch {
        setStatus({ type: "error", message: "JSONの読み込みに失敗しました" })
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
    }
    reader.readAsText(file)
  }, [])

  return (
    <div className={`card ${styles.panel}`}>
      <section>
        <h2 className={styles.h2}>エクスポート</h2>
        <p className={styles.text}>
          全リストの登頂状況・登頂日・ルート・メモをJSONファイルとして保存します。
        </p>
        <button
          className="btn btn-primary btn-sm"
          onClick={handleExport}
          type="button"
        >
          <DownloadIcon size={16} />
          JSONをダウンロード
        </button>
      </section>

      <section className={styles.divider}>
        <h2 className={styles.h2}>インポート</h2>
        <p className={styles.text}>
          別の端末でエクスポートしたJSONファイルを読み込みます（旧形式のファイルにも対応）。
        </p>
        <input
          accept=".json,application/json"
          className="visually-hidden"
          id="import-file-input"
          onChange={handleImport}
          ref={fileInputRef}
          type="file"
        />
        <label
          className={`btn btn-secondary btn-sm ${styles.fileLabel}`}
          htmlFor="import-file-input"
        >
          ファイルを選択
        </label>
        <p
          aria-live="polite"
          className={status?.type === "error" ? styles.error : styles.success}
        >
          {status?.message ?? ""}
        </p>
      </section>

      <p className={styles.note}>
        ※ 写真はファイルサイズが大きいため、バックアップの対象外です。
      </p>
    </div>
  )
}
