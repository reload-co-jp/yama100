"use client"

import { useSyncExternalStore } from "react"
import { MOUNTAIN_LISTS, type MountainListKey } from "../lib/mountainCatalog"

type ListProgress = {
  key: MountainListKey
  label: string
  listHref: string
  themeColor: string
  total: number
  climbed: number
}

type TimelineEntry = {
  date: string
  sortKey: string
  mountainId: number
  mountainName: string
  elevation: number
  listLabel: string
  listHref: string
  themeColor: string
}

type SummaryData = {
  progress: ListProgress[]
  timeline: TimelineEntry[]
  totalClimbed: number
  totalMountains: number
}

function normalizeDateKey(date: string): string {
  if (/^\d{4}$/.test(date)) return `${date}-01-01`
  if (/^\d{4}-\d{2}$/.test(date)) return `${date}-01`
  return date
}

function formatDate(date: string): string {
  const parts = date.split("-")
  if (parts.length === 1) return `${parts[0]}年`
  if (parts.length === 2) return `${parts[0]}年${Number(parts[1])}月`
  return `${parts[0]}年${Number(parts[1])}月${Number(parts[2])}日`
}

function loadSummaryData(): SummaryData {
  const progress: ListProgress[] = []
  const timeline: TimelineEntry[] = []
  let totalClimbed = 0
  let totalMountains = 0

  for (const list of MOUNTAIN_LISTS) {
    let checked = new Set<number>()
    const dates: Record<number, string[]> = {}

    try {
      const raw = localStorage.getItem(list.storageKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed.checked)) {
          checked = new Set(parsed.checked.map(Number))
        }
        if (parsed.dates && typeof parsed.dates === "object") {
          for (const [key, value] of Object.entries(parsed.dates)) {
            if (Array.isArray(value)) {
              dates[Number(key)] = value.filter(
                (d): d is string => typeof d === "string"
              )
            }
          }
        }
      }
    } catch {
      // 破損データはスキップ
    }

    progress.push({
      key: list.key,
      label: list.label,
      listHref: list.listHref,
      themeColor: list.themeColor,
      total: list.mountains.length,
      climbed: checked.size,
    })
    totalClimbed += checked.size
    totalMountains += list.mountains.length

    const byId = new Map(list.mountains.map((m) => [m.id, m]))
    for (const [idStr, dateList] of Object.entries(dates)) {
      const mountain = byId.get(Number(idStr))
      if (!mountain) continue
      for (const date of dateList) {
        timeline.push({
          date,
          sortKey: normalizeDateKey(date),
          mountainId: mountain.id,
          mountainName: mountain.name,
          elevation: mountain.elevation,
          listLabel: list.label,
          listHref: list.listHref,
          themeColor: list.themeColor,
        })
      }
    }
  }

  timeline.sort((a, b) => a.sortKey.localeCompare(b.sortKey))

  return { progress, timeline, totalClimbed, totalMountains }
}

let cachedRaw = ""
let cachedData: SummaryData | null = null

function getSnapshot(): SummaryData | null {
  const raw = MOUNTAIN_LISTS.map(
    (list) => localStorage.getItem(list.storageKey) ?? ""
  ).join("|")
  if (cachedData && cachedRaw === raw) return cachedData
  cachedRaw = raw
  cachedData = loadSummaryData()
  return cachedData
}

function getServerSnapshot(): SummaryData | null {
  return null
}

function subscribe(listener: () => void) {
  window.addEventListener("storage", listener)
  return () => window.removeEventListener("storage", listener)
}

export default function SummaryClient() {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  if (!data) return null

  const { progress, timeline, totalClimbed, totalMountains } = data
  const overallRate = totalMountains
    ? Math.round((totalClimbed / totalMountains) * 100)
    : 0

  // 年ごとにグルーピング
  const byYear = new Map<string, TimelineEntry[]>()
  for (const entry of timeline) {
    const year = entry.sortKey.slice(0, 4)
    if (!byYear.has(year)) byYear.set(year, [])
    byYear.get(year)!.push(entry)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* 達成度サマリー */}
      <section>
        <div
          style={{
            alignItems: "baseline",
            display: "flex",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <span style={{ color: "#f0f0f0", fontSize: "2rem", fontWeight: "bold" }}>
            {totalClimbed}
          </span>
          <span style={{ color: "#666", fontSize: "1rem" }}>
            / {totalMountains}座 登頂（全体 {overallRate}%）
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {progress.map((p) => {
            const rate = p.total ? Math.round((p.climbed / p.total) * 100) : 0
            return (
              <div key={p.key}>
                <div
                  style={{
                    color: "#ccc",
                    display: "flex",
                    fontSize: ".85rem",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span>{p.label}</span>
                  <span style={{ color: "#888" }}>
                    {p.climbed} / {p.total}（{rate}%）
                  </span>
                </div>
                <div
                  style={{
                    background: "#2a2a2a",
                    borderRadius: "4px",
                    height: "8px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      background: p.themeColor,
                      borderRadius: "4px",
                      height: "100%",
                      width: `${rate}%`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 時系列登頂データ */}
      <section>
        <h2
          style={{
            color: "#f0f0f0",
            fontSize: "1.1rem",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          登頂記録
        </h2>
        {timeline.length === 0 ? (
          <p style={{ color: "#666", fontSize: ".875rem" }}>
            登頂日を記録するとここに時系列で表示されます
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[...byYear.entries()]
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([year, entries]) => (
                <div key={year}>
                  <div
                    style={{
                      color: "#888",
                      fontSize: ".8rem",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                  >
                    {year}年（{entries.length}座）
                  </div>
                  <ul
                    style={{
                      borderLeft: "2px solid #2a2a2a",
                      display: "flex",
                      flexDirection: "column",
                      gap: 0,
                      listStyle: "none",
                      margin: 0,
                      paddingLeft: "16px",
                    }}
                  >
                    {entries.map((e, i) => (
                      <li
                        key={`${e.mountainId}-${e.date}-${i}`}
                        style={{
                          alignItems: "center",
                          borderBottom: "1px solid #222",
                          display: "flex",
                          fontSize: ".875rem",
                          gap: "10px",
                          padding: "8px 0",
                        }}
                      >
                        <span
                          style={{
                            color: "#888",
                            flexShrink: 0,
                            fontSize: ".8rem",
                            width: "110px",
                          }}
                        >
                          {formatDate(e.date)}
                        </span>
                        <span
                          style={{
                            background: e.themeColor,
                            borderRadius: "3px",
                            color: "#0a0a0a",
                            flexShrink: 0,
                            fontSize: ".65rem",
                            fontWeight: 600,
                            padding: "2px 6px",
                          }}
                        >
                          {e.listLabel}
                        </span>
                        <span style={{ color: "#f0f0f0", fontWeight: 600 }}>
                          {e.mountainName}
                        </span>
                        <span style={{ color: "#666", fontSize: ".8rem" }}>
                          {e.elevation.toLocaleString()}m
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  )
}
