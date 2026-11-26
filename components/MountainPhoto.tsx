"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./MountainPhoto.module.css"

// Wikipedia 記事名が山データの名称と異なるものの対応表
const wikiTitleOverrides: Record<string, string> = {
  利尻岳: "利尻山",
  阿寒岳: "雄阿寒岳",
  大雪山: "大雪山_(北海道)",
  後方羊蹄山: "羊蹄山",
  朝日岳: "大朝日岳",
  吾妻山: "吾妻連峰",
  悪沢岳: "荒川岳",
  九重山: "九重連山",
}

type PhotoInfo = { thumb: string; page: string | null } | null

// セッション中のキャッシュ（同じ山を複数回レンダリングしたときの再リクエスト防止）
const memoryCache = new Map<string, PhotoInfo>()
const inflight = new Map<string, Promise<PhotoInfo>>()
const SESSION_KEY = "yama100_photo_cache_v1"

function readSessionCache(name: string): PhotoInfo | undefined {
  try {
    const all = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "{}")
    return name in all ? all[name] : undefined
  } catch {
    return undefined
  }
}

function writeSessionCache(name: string, info: PhotoInfo) {
  try {
    const all = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "{}")
    all[name] = info
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(all))
  } catch {
    // ignore quota errors
  }
}

export function getWikiTitle(name: string) {
  return wikiTitleOverrides[name] ?? name
}

export function fetchMountainPhoto(name: string): Promise<PhotoInfo> {
  if (memoryCache.has(name)) return Promise.resolve(memoryCache.get(name)!)
  const session = readSessionCache(name)
  if (session !== undefined) {
    memoryCache.set(name, session)
    return Promise.resolve(session)
  }
  if (inflight.has(name)) return inflight.get(name)!

  const promise = fetch(
    `https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(getWikiTitle(name))}`
  )
    .then((r) => (r.ok ? r.json() : null))
    .then((data): PhotoInfo => {
      const thumb: string | undefined = data?.thumbnail?.source
      if (!thumb) return null
      return { thumb, page: data?.content_urls?.desktop?.page ?? null }
    })
    .catch(() => null)
    .then((info) => {
      memoryCache.set(name, info)
      writeSessionCache(name, info)
      inflight.delete(name)
      return info
    })
  inflight.set(name, promise)
  return promise
}

/** Wikimedia のサムネイル URL を指定幅のものに差し替える */
function resizeThumb(url: string, width: number) {
  return /\/\d+px-/.test(url) ? url.replace(/\/\d+px-/, `/${width}px-`) : url
}

type Props = {
  name: string
  /** 表示幅の目安（px）。サムネイル取得サイズの決定に使う */
  width?: 330 | 500 | 960 | 1280
  /** true のときビューポート外でも即座に取得する（ファーストビュー用） */
  eager?: boolean
  className?: string
  alt?: string
  onLoaded?: (info: PhotoInfo) => void
}

const NO_PHOTO_ICON = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 19 9.5 8l4 6.5L16 11l5 8Z" />
    <circle cx="17" cy="6" r="1.6" />
  </svg>
)

export default function MountainPhoto({
  name,
  width = 500,
  eager = false,
  className,
  alt,
  onLoaded,
}: Props) {
  const [info, setInfo] = useState<PhotoInfo | "pending">(
    memoryCache.has(name) ? memoryCache.get(name)! : "pending"
  )
  const [useFallback, setUseFallback] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const onLoadedRef = useRef(onLoaded)

  useEffect(() => {
    onLoadedRef.current = onLoaded
  })

  useEffect(() => {
    let cancelled = false
    const el = containerRef.current
    if (!el) return

    const load = () =>
      fetchMountainPhoto(name).then((result) => {
        if (cancelled) return
        setInfo(result)
        onLoadedRef.current?.(result)
      })

    if (eager || typeof IntersectionObserver === "undefined") {
      load()
      return () => {
        cancelled = true
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        load()
      },
      { rootMargin: "300px" }
    )
    observer.observe(el)
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [name, eager])

  const src =
    info && info !== "pending"
      ? useFallback
        ? info.thumb
        : resizeThumb(info.thumb, width)
      : null

  return (
    <div ref={containerRef} className={`${styles.frame} ${className ?? ""}`}>
      {info === "pending" && (
        <div className={styles.shimmer} aria-hidden="true" />
      )}
      {info === null && (
        <div className={styles.placeholder}>{NO_PHOTO_ICON}</div>
      )}
      {src && (
        <img
          alt={alt ?? `${name}の写真`}
          className={`${styles.image} ${loaded ? styles.loaded : ""}`}
          decoding="async"
          fetchPriority={eager ? "high" : "auto"}
          loading={eager ? "eager" : "lazy"}
          onError={() => {
            if (!useFallback) setUseFallback(true)
          }}
          onLoad={() => setLoaded(true)}
          src={src}
        />
      )}
    </div>
  )
}
