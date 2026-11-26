"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useAllListsState } from "../hooks/useMountainState"
import {
  CANONICAL_MOUNTAINS,
  MOUNTAIN_LISTS,
  type CanonicalMountain,
  type MountainListKey,
} from "../lib/mountainCatalog"
import { getPrefectures } from "../lib/mountainMeta"
import {
  getListProgress,
  getRegionProgress,
  getTimeline,
  getYearlyCounts,
} from "../lib/progress"
import { listPhotos } from "../lib/recordStore"
import {
  drawNames,
  drawProgress,
  drawRegions,
  drawSummit,
  drawYear,
  FORMAT_SIZE,
  loadImage,
  type ShareFormat,
} from "../lib/shareImage"
import { SITE_URL } from "../lib/site"
import { latestDate, normalizeDateKey } from "../lib/summitStore"
import { fetchMountainPhoto } from "./MountainPhoto"
import { useUrlState } from "./explorer/useUrlState"
import { DownloadIcon, LinkIcon, ShareIcon } from "./ui/Icons"
import styles from "./ShareStudio.module.css"

const TYPES = [
  { value: "progress", label: "達成状況", description: "登頂数と達成率" },
  { value: "list", label: "登頂した山", description: "山名の一覧" },
  { value: "year", label: "年間実績", description: "1年間の登頂記録" },
  { value: "region", label: "地域別", description: "地域ごとの達成度" },
  { value: "summit", label: "登頂記念", description: "1つの山の記念画像" },
] as const
type ShareType = (typeof TYPES)[number]["value"]

const URL_KEYS = ["type", "list", "year", "mountain", "format"] as const

function siteHost() {
  return SITE_URL.replace(/^https?:\/\//, "")
}

export default function ShareStudio() {
  const [params, setParams] = useUrlState(URL_KEYS)
  const snapshot = useAllListsState()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [heroImage, setHeroImage] = useState<HTMLImageElement | null>(null)
  const [summitPhoto, setSummitPhoto] = useState<{
    key: string
    image: HTMLImageElement | null
  } | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")

  const type: ShareType = (
    TYPES.some((t) => t.value === params.type) ? params.type : "progress"
  ) as ShareType
  const format: ShareFormat =
    params.format === "square" ? "square" : "landscape"
  const listEntry =
    snapshot.lists.find((entry) => entry.list.key === params.list) ??
    snapshot.lists[0]
  const list = listEntry.list

  const progress = useMemo(() => getListProgress(snapshot), [snapshot])
  const timeline = useMemo(() => getTimeline(snapshot), [snapshot])
  const years = useMemo(() => getYearlyCounts(timeline), [timeline])
  const year = years.find((y) => y.year === params.year) ?? years[0] ?? null

  // 記念画像の候補: 登頂済みの山（なければ全山）
  const summitCandidates = useMemo(() => {
    const climbed = CANONICAL_MOUNTAINS.filter((m) =>
      m.memberships.some((ms) =>
        snapshot.lists
          .find((e) => e.list.storageKey === ms.storageKey)
          ?.checked.has(ms.id)
      )
    )
    return (climbed.length ? climbed : CANONICAL_MOUNTAINS)
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, "ja"))
  }, [snapshot])
  const summitMountain: CanonicalMountain | null =
    CANONICAL_MOUNTAINS.find((m) => String(m.id) === params.mountain) ??
    summitCandidates[0] ??
    null

  useEffect(() => {
    loadImage("/images/hero-1280.jpg", false).then(setHeroImage)
  }, [])

  // 記念画像用の写真: 端末に保存した写真 > Wikipedia の写真
  const summitKey = summitMountain
    ? `${summitMountain.id}-${summitMountain.name}`
    : ""
  useEffect(() => {
    if (type !== "summit" || !summitMountain) return
    let cancelled = false
    ;(async () => {
      let image: HTMLImageElement | null = null
      try {
        const own = await listPhotos(summitMountain.id)
        if (own.length) {
          const url = URL.createObjectURL(own[own.length - 1].blob)
          image = await loadImage(url, false)
        }
      } catch {
        // IndexedDB unavailable
      }
      if (!image) {
        const info = await fetchMountainPhoto(summitMountain.name)
        if (info?.thumb) {
          const src = info.thumb.replace(/\/\d+px-/, "/1280px-")
          image = (await loadImage(src)) ?? (await loadImage(info.thumb))
        }
      }
      if (!cancelled) setSummitPhoto({ key: summitKey, image })
    })()
    return () => {
      cancelled = true
    }
  }, [type, summitMountain, summitKey])

  const summitImage = summitPhoto?.key === summitKey ? summitPhoto.image : null
  const summitLoading = type === "summit" && summitPhoto?.key !== summitKey

  // 描画
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const { width, height } = FORMAT_SIZE[format]
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const host = siteHost()

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      if (type === "progress") {
        const climbed = list.mountains.filter((m) =>
          listEntry.checked.has(m.id)
        ).length
        const dots = [...list.mountains]
          .sort((a, b) => a.id - b.id)
          .map((m) => listEntry.checked.has(m.id))
        drawProgress(
          ctx,
          format,
          { list, climbed, total: list.mountains.length, dots },
          host,
          heroImage
        )
      } else if (type === "list") {
        const names = [...list.mountains]
          .sort((a, b) => b.latitude - a.latitude)
          .filter((m) => listEntry.checked.has(m.id))
          .map((m) => m.name)
        drawNames(
          ctx,
          format,
          {
            title: `${list.label} ${names.length}座に登頂`,
            subtitle: `${names.length} / ${list.mountains.length} MOUNTAINS`,
            names,
          },
          host,
          heroImage
        )
      } else if (type === "year") {
        drawYear(
          ctx,
          format,
          {
            year: year?.year ?? String(new Date().getFullYear()),
            entries: year?.entries ?? [],
          },
          host,
          heroImage
        )
      } else if (type === "region") {
        drawRegions(
          ctx,
          format,
          { list, regions: getRegionProgress(list, listEntry.checked) },
          host,
          heroImage
        )
      } else if (type === "summit" && summitMountain) {
        const dates = summitMountain.memberships.flatMap(
          (ms) =>
            snapshot.lists.find((e) => e.list.storageKey === ms.storageKey)
              ?.dates[ms.id] ?? []
        )
        const lists = summitMountain.memberships
          .map((ms) =>
            progress.find((p) => p.list.storageKey === ms.storageKey)
          )
          .filter((p): p is NonNullable<typeof p> => Boolean(p))
          .sort(
            (a, b) =>
              MOUNTAIN_LISTS.indexOf(a.list) - MOUNTAIN_LISTS.indexOf(b.list)
          )
          .slice(0, 3)
          .map((p) => ({
            label: p.list.label,
            climbed: p.climbed,
            total: p.total,
          }))
        drawSummit(
          ctx,
          format,
          {
            name: summitMountain.name,
            elevation: summitMountain.elevation,
            prefectures: getPrefectures(summitMountain),
            date: latestDate(dates),
            lists,
          },
          host,
          summitImage
        )
      }
    }

    if (document.fonts?.ready) document.fonts.ready.then(draw)
    else draw()
  }, [
    type,
    format,
    list,
    listEntry,
    year,
    heroImage,
    summitMountain,
    summitImage,
    snapshot,
    progress,
  ])

  const fileName = `yama100-${type}-${new Date().toISOString().slice(0, 10)}.png`

  const toBlob = () =>
    new Promise<Blob | null>((resolve) => {
      try {
        canvasRef.current?.toBlob((blob) => resolve(blob), "image/png")
      } catch {
        resolve(null)
      }
    })

  const shareText = (() => {
    const climbed = list.mountains.filter((m) =>
      listEntry.checked.has(m.id)
    ).length
    switch (type) {
      case "year":
        return `${year?.year ?? ""}年は${year?.entries.length ?? 0}回登頂しました！`
      case "summit":
        return summitMountain
          ? `${summitMountain.name}（${summitMountain.elevation.toLocaleString()}m）に登頂しました！`
          : ""
      default:
        return `${list.label} ${climbed}/${list.mountains.length}座 登頂しました！`
    }
  })()
  const shareUrl = `${SITE_URL}/`

  const download = async () => {
    setBusy(true)
    const blob = await toBlob()
    setBusy(false)
    if (!blob) {
      setMessage(
        "画像を書き出せませんでした（写真の読み込み制限の可能性があります）"
      )
      return
    }
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
    setMessage("画像を保存しました")
  }

  const shareNative = async () => {
    setBusy(true)
    const blob = await toBlob()
    setBusy(false)
    const text = `${shareText} #Yama100`
    try {
      if (blob) {
        const file = new File([blob], fileName, { type: "image/png" })
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], text, url: shareUrl })
          return
        }
      }
      if (navigator.share) {
        await navigator.share({ text, url: shareUrl })
        return
      }
      await navigator.clipboard.writeText(`${text}\n${shareUrl}`)
      setMessage("共有テキストをコピーしました")
    } catch {
      // ユーザーによるキャンセル
    }
  }

  const xIntent = `https://x.com/intent/post?text=${encodeURIComponent(`${shareText} #Yama100`)}&url=${encodeURIComponent(shareUrl)}`

  return (
    <div className={styles.studio}>
      <div className={styles.controls}>
        <fieldset className={styles.fieldset}>
          <legend>画像の種類</legend>
          <div className={styles.types}>
            {TYPES.map((t) => (
              <button
                aria-pressed={type === t.value}
                className={styles.type}
                key={t.value}
                onClick={() =>
                  setParams({ type: t.value === "progress" ? null : t.value })
                }
                type="button"
              >
                <strong>{t.label}</strong>
                <span>{t.description}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {(type === "progress" || type === "list" || type === "region") && (
          <label className={styles.field}>
            <span>リスト</span>
            <select
              onChange={(e) =>
                setParams({
                  list: e.target.value === "mountains" ? null : e.target.value,
                })
              }
              value={list.key}
            >
              {MOUNTAIN_LISTS.map((l) => (
                <option key={l.key} value={l.key as MountainListKey}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>
        )}

        {type === "year" && (
          <label className={styles.field}>
            <span>年</span>
            {years.length === 0 ? (
              <p className={styles.hint}>
                登頂日が記録されていません。山の詳細ページで登頂日を記録してください。
              </p>
            ) : (
              <select
                onChange={(e) => setParams({ year: e.target.value })}
                value={year?.year ?? ""}
              >
                {years.map((y) => (
                  <option key={y.year} value={y.year}>
                    {y.year}年（{y.entries.length}回）
                  </option>
                ))}
              </select>
            )}
          </label>
        )}

        {type === "summit" && (
          <label className={styles.field}>
            <span>山</span>
            <select
              onChange={(e) => setParams({ mountain: e.target.value })}
              value={summitMountain ? String(summitMountain.id) : ""}
            >
              {summitCandidates.map((m) => {
                const dates = m.memberships.flatMap(
                  (ms) =>
                    snapshot.lists.find(
                      (e) => e.list.storageKey === ms.storageKey
                    )?.dates[ms.id] ?? []
                )
                const last = latestDate(dates)
                return (
                  <option key={`${m.id}-${m.canonicalName}`} value={m.id}>
                    {m.name}
                    {last ? `（${normalizeDateKey(last).slice(0, 4)}年）` : ""}
                  </option>
                )
              })}
            </select>
            <p className={styles.hint}>
              山の詳細ページで写真を追加すると、その写真が背景に使われます。
            </p>
          </label>
        )}

        <div className={styles.field}>
          <span>サイズ</span>
          <div className={styles.formats} role="group" aria-label="画像サイズ">
            <button
              aria-pressed={format === "landscape"}
              onClick={() => setParams({ format: null })}
              type="button"
            >
              横長 1200×630
              <small>X・Facebook向け</small>
            </button>
            <button
              aria-pressed={format === "square"}
              onClick={() => setParams({ format: "square" })}
              type="button"
            >
              正方形 1080×1080
              <small>Instagram向け</small>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.previewCol}>
        <div
          className={`${styles.preview} ${format === "square" ? styles.previewSquare : ""}`}
        >
          <canvas
            aria-label={`シェア画像のプレビュー：${shareText}`}
            className={styles.canvas}
            ref={canvasRef}
            role="img"
          />
          {summitLoading && (
            <div className={styles.loading}>写真を読み込み中…</div>
          )}
        </div>
        <div className={styles.actions}>
          <button
            className="btn btn-primary"
            disabled={busy}
            onClick={download}
            type="button"
          >
            <DownloadIcon size={18} />
            画像を保存
          </button>
          <button
            className="btn btn-secondary"
            disabled={busy}
            onClick={shareNative}
            type="button"
          >
            <ShareIcon size={18} />
            共有する
          </button>
          <a
            className="btn btn-secondary"
            href={xIntent}
            rel="noopener noreferrer"
            target="_blank"
          >
            Xでポスト
          </a>
        </div>
        <p aria-live="polite" className={styles.message}>
          {message}
        </p>
        <p className={styles.hint}>
          <LinkIcon size={14} />{" "}
          登頂状況そのものを共有したい場合は、各リストページの「共有URLをコピー」もご利用ください。
          Xでポストする場合は、保存した画像を添付してください。
        </p>
      </div>
    </div>
  )
}
