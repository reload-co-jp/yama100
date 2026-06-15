"use client"

import { useState, useCallback, Suspense, lazy, useMemo } from "react"
import Link from "next/link"
import MountainPhoto from "./MountainPhoto"
import DigestModal from "./DigestModal"
import {
  useMountainState,
  SortOrder,
  encodeChecked,
} from "../hooks/useMountainState"
import HeroSection from "./HeroSection"
import { getMountainPagePathForRecord } from "../lib/mountainCatalog"

const MountainMap = lazy(() => import("./MountainMap"))

type Mountain = {
  id: number
  name: string
  description: string
  location: string[]
  latitude: number
  longitude: number
  elevation: number
}

type MountainAppProps = {
  mountains: Mountain[]
  storageKey: string
  themeColor: string
  totalCount: number
  idOffset: number
}

function sortMountains(mountains: Mountain[], sort: SortOrder): Mountain[] {
  const sorted = [...mountains]
  switch (sort) {
    case "number":
      return sorted.sort((a, b) => a.id - b.id)
    case "latitude":
      return sorted.sort((a, b) => b.latitude - a.latitude)
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "ja"))
    case "elevation":
      return sorted.sort((a, b) => b.elevation - a.elevation)
    case "prefecture":
      return sorted.sort((a, b) => b.latitude - a.latitude)
  }
}

type PrefectureGroup = { prefecture: string; mountains: Mountain[] }

function groupByPrefecture(mountains: Mountain[]): PrefectureGroup[] {
  const sorted = [...mountains].sort((a, b) => b.latitude - a.latitude)
  const map = new Map<string, Mountain[]>()
  for (const m of sorted) {
    const pref = m.location[0]
    if (!map.has(pref)) map.set(pref, [])
    map.get(pref)!.push(m)
  }
  return Array.from(map.entries()).map(([prefecture, mountains]) => ({
    prefecture,
    mountains,
  }))
}

export default function MountainApp({
  mountains,
  storageKey,
  themeColor,
  totalCount,
  idOffset,
}: MountainAppProps) {
  const { checked, sort, setSort, digestChecked, toggle } = useMountainState(
    storageKey,
    totalCount,
    idOffset
  )
  const [copied, setCopied] = useState(false)
  const [isDigestDismissed, setIsDigestDismissed] = useState(false)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const handleShare = useCallback(async () => {
    const params = new URLSearchParams()
    params.set("data", encodeChecked(checked, totalCount, idOffset))
    params.set("sort", sort)
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`
    const text = `${checked.size}座の登頂しました！\n${url}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt("以下のテキストをコピーしてください", text)
    }
  }, [checked, sort, totalCount, idOffset])

  const sorted = useMemo(
    () => sortMountains(mountains, sort),
    [mountains, sort]
  )
  const groups = sort === "prefecture" ? groupByPrefecture(mountains) : null
  const count = checked.size
  const percent = Math.round((count / totalCount) * 100)

  const digestMountains = digestChecked
    ? mountains.filter((m) => digestChecked.has(m.id))
    : []
  const isDigestOpen = digestChecked !== null && !isDigestDismissed

  return (
    <div>
      {isDigestOpen && (
        <DigestModal
          mountains={digestMountains}
          heroType={storageKey}
          totalCount={totalCount}
          onClose={() => setIsDigestDismissed(true)}
        />
      )}
      <HeroSection
        type={storageKey}
        storageKey={storageKey}
        totalCount={totalCount}
      />

      <style>{`
        .map-container {
          flex-shrink: 0;
          height: 32rem;
          overflow: hidden;
          position: relative;
          width: 100%;
        }
        @media (min-width: 40rem) {
          .map-container {
            height: calc(100dvh - 5rem);
            position: sticky;
            top: 0;
            width: 45%;
          }
        }
      `}</style>

      <div
        style={{
          alignItems: "flex-start",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div className="map-container">
          <Suspense
            fallback={
              <div
                style={{
                  alignItems: "center",
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "10px",
                  color: "#333",
                  display: "flex",
                  fontSize: ".8rem",
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                地図を読み込み中…
              </div>
            }
          >
            <MountainMap
              mountains={mountains}
              checked={checked}
              onToggle={toggle}
              hoveredId={hoveredId}
            />
          </Suspense>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              background: "#111",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              marginBottom: "16px",
              padding: "16px 20px",
            }}
          >
            <div style={{ alignItems: "baseline", display: "flex", gap: "10px" }}>
              <span style={{ fontSize: "1.375rem", fontWeight: 600, letterSpacing: "-.02em" }}>
                {count}
                <span style={{ color: "#444", fontWeight: 400, fontSize: "1rem" }}> / {totalCount}</span>
              </span>
              <span style={{ color: "#555", fontSize: ".8rem", fontVariantNumeric: "tabular-nums" }}>
                {percent}% 登頂済
              </span>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.06)",
                borderRadius: "2px",
                height: "3px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: themeColor,
                  borderRadius: "2px",
                  height: "100%",
                  transition: "width .4s ease",
                  width: `${percent}%`,
                }}
              />
            </div>
            <div
              style={{
                alignItems: "center",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <label
                style={{ color: "#555", fontSize: ".8rem" }}
                htmlFor="sort"
              >
                並び順
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOrder)}
                style={{
                  background: "#161616",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  color: "#aaa",
                  fontSize: ".8rem",
                  padding: "5px 8px",
                }}
              >
                <option value="number">番号順</option>
                <option value="latitude">北から順</option>
                <option value="name">五十音順</option>
                <option value="elevation">標高順</option>
                <option value="prefecture">都道府県別</option>
              </select>
              <button
                onClick={handleShare}
                style={{
                  background: copied ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${copied ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "6px",
                  color: copied ? "#4ade80" : "#888",
                  cursor: "pointer",
                  fontSize: ".8rem",
                  padding: "5px 12px",
                  transition: "all .2s",
                }}
              >
                {copied ? "コピー完了" : "URLをシェア"}
              </button>
            </div>
          </div>

          {groups ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {groups.map(({ prefecture, mountains: prefMountains }) => (
                <div key={prefecture}>
                  <div
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.07)",
                      color: "#888",
                      fontSize: ".75rem",
                      fontWeight: 500,
                      letterSpacing: ".05em",
                      marginBottom: "8px",
                      paddingBottom: "6px",
                      textTransform: "uppercase",
                    }}
                  >
                    {prefecture}
                    <span
                      style={{
                        color: "#444",
                        fontWeight: "normal",
                        marginLeft: "8px",
                        textTransform: "none",
                        letterSpacing: 0,
                      }}
                    >
                      {prefMountains.filter((m) => checked.has(m.id)).length} / {prefMountains.length}
                    </span>
                  </div>
                  <ul
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      listStyle: "none",
                      padding: 0,
                    }}
                  >
                    {prefMountains.map((mountain) => (
                      <MountainListItem
                        key={mountain.id}
                        mountain={mountain}
                        isChecked={checked.has(mountain.id)}
                        onToggle={toggle}
                        onHover={setHoveredId}
                        themeColor={themeColor}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                listStyle: "none",
                padding: 0,
              }}
            >
              {sorted.map((mountain) => (
                <MountainListItem
                  key={mountain.id}
                  mountain={mountain}
                  isChecked={checked.has(mountain.id)}
                  onToggle={toggle}
                  onHover={setHoveredId}
                  themeColor={themeColor}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function MountainListItem({
  mountain,
  isChecked,
  onToggle,
  onHover,
  themeColor,
}: {
  mountain: Mountain
  isChecked: boolean
  onToggle: (id: number) => void
  onHover: (id: number | null) => void
  themeColor: string
}) {
  return (
    <li
      onMouseEnter={() => onHover(mountain.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        background: isChecked ? "rgba(74,222,128,0.04)" : "#111",
        border: `1px solid ${isChecked ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: "8px",
        padding: "12px 14px",
        transition: "background .2s, border-color .2s",
      }}
    >
      <div style={{ alignItems: "flex-start", display: "flex", gap: "12px" }}>
        <input
          id={`checkbox-${mountain.id}`}
          type="checkbox"
          checked={isChecked}
          onChange={() => onToggle(mountain.id)}
          style={{
            accentColor: themeColor,
            cursor: "pointer",
            flexShrink: 0,
            height: "16px",
            marginTop: "3px",
            width: "16px",
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <label
            htmlFor={`checkbox-${mountain.id}`}
            style={{ cursor: "pointer", display: "block", marginBottom: "6px" }}
          >
            <div
              style={{
                alignItems: "baseline",
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                marginBottom: "4px",
              }}
            >
              <span
                style={{
                  fontSize: ".9375rem",
                  fontWeight: 500,
                  letterSpacing: "-.01em",
                  opacity: isChecked ? 0.4 : 1,
                  textDecoration: isChecked ? "line-through" : "none",
                }}
              >
                {mountain.name}
              </span>
              <span style={{ color: "#444", fontSize: ".8rem", fontVariantNumeric: "tabular-nums" }}>
                {mountain.elevation.toLocaleString()}m
              </span>
              <span style={{ color: "#3a3a3a", fontSize: ".8rem" }}>
                {mountain.location.join("・")}
              </span>
            </div>
            <p
              style={{
                color: "#555",
                fontSize: ".8125rem",
                lineHeight: 1.6,
                opacity: isChecked ? 0.4 : 1,
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                display: "-webkit-box",
              }}
            >
              {mountain.description}
            </p>
          </label>
          <Link
            href={getMountainPagePathForRecord(mountain)}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "5px",
              color: "#555",
              display: "inline-block",
              fontSize: ".75rem",
              padding: "2px 9px",
              textDecoration: "none",
            }}
          >
            詳細 →
          </Link>
        </div>
        <MountainPhoto name={mountain.name} />
      </div>
    </li>
  )
}
