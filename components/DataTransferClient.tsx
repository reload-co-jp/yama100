"use client"

import { useRef, useState, useCallback } from "react"

const STORAGE_KEYS = [
  "yama100",
  "yama200",
  "yama300",
  "yama_kanto100",
  "yama_new100",
  "yama_flowers",
  "yama_minor12",
] as const

type ExportData = {
  version: 1
  exportedAt: string
  data: Record<string, number[]>
}

export default function DataTransferClient() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<
    "idle" | "success" | "error"
  >("idle")
  const [importMessage, setImportMessage] = useState("")

  const handleExport = useCallback(() => {
    const data: Record<string, number[]> = {}
    for (const key of STORAGE_KEYS) {
      const raw = localStorage.getItem(key)
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed.checked)) {
            data[key] = parsed.checked.map(Number).filter(Number.isInteger)
          }
        } catch {
          // skip corrupted entry
        }
      }
    }

    const exportData: ExportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data,
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

  const handleImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const json = JSON.parse(ev.target?.result as string) as ExportData
          if (json.version !== 1 || typeof json.data !== "object") {
            setImportStatus("error")
            setImportMessage("ファイル形式が不正")
            return
          }

          const keys = Object.keys(json.data).filter((k) =>
            (STORAGE_KEYS as readonly string[]).includes(k)
          )
          if (keys.length === 0) {
            setImportStatus("error")
            setImportMessage("インポート可能なデータなし")
            return
          }

          const totalMountains = keys.reduce(
            (sum, k) => sum + (json.data[k]?.length ?? 0),
            0
          )
          const confirmed = window.confirm(
            `${keys.length}種類のリスト、計${totalMountains}座のデータをインポートします。\n既存データは上書きされます。続けますか？`
          )
          if (!confirmed) return

          for (const key of keys) {
            const ids = json.data[key]
            if (Array.isArray(ids)) {
              localStorage.setItem(key, JSON.stringify({ checked: ids }))
            }
          }

          window.dispatchEvent(new Event("storage"))

          setImportStatus("success")
          setImportMessage(`${keys.length}種類のリストをインポート完了`)
          setTimeout(() => setImportStatus("idle"), 3000)
        } catch {
          setImportStatus("error")
          setImportMessage("JSONの解析に失敗")
        }

        if (fileInputRef.current) fileInputRef.current.value = ""
      }
      reader.readAsText(file)
    },
    []
  )

  return (
    <div
      style={{
        background: "#2a2a2a",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "480px",
        padding: "24px",
      }}
    >
      <div>
        <h2 style={{ color: "#f0f0f0", fontSize: "1rem", fontWeight: "bold", marginBottom: "8px" }}>
          エクスポート
        </h2>
        <p style={{ color: "#aaa", fontSize: ".875rem", marginBottom: "12px" }}>
          全リストの登頂記録をJSONファイルとして保存
        </p>
        <button
          onClick={handleExport}
          style={{
            background: "#1976d2",
            border: "none",
            borderRadius: "6px",
            color: "#fff",
            cursor: "pointer",
            fontSize: ".875rem",
            padding: "8px 20px",
          }}
        >
          JSONをダウンロード
        </button>
      </div>

      <div style={{ borderTop: "1px solid #444", paddingTop: "16px" }}>
        <h2 style={{ color: "#f0f0f0", fontSize: "1rem", fontWeight: "bold", marginBottom: "8px" }}>
          インポート
        </h2>
        <p style={{ color: "#aaa", fontSize: ".875rem", marginBottom: "12px" }}>
          別デバイスでエクスポートしたJSONファイルを読み込む
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleImport}
          style={{ display: "none" }}
          id="import-file-input"
        />
        <label
          htmlFor="import-file-input"
          style={{
            background: "#388e3c",
            borderRadius: "6px",
            color: "#fff",
            cursor: "pointer",
            display: "inline-block",
            fontSize: ".875rem",
            padding: "8px 20px",
          }}
        >
          ファイルを選択
        </label>
        {importStatus !== "idle" && (
          <p
            style={{
              color: importStatus === "success" ? "#81c784" : "#e57373",
              fontSize: ".875rem",
              marginTop: "8px",
            }}
          >
            {importMessage}
          </p>
        )}
      </div>
    </div>
  )
}
