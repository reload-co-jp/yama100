"use client"

import { useEffect, useState, useCallback, Suspense, lazy } from "react"
import Link from "next/link"
import mountainsData from "../public/mountains.json"
import MountainPhoto from "./MountainPhoto"
import HeroSection from "./HeroSection"

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

type SortOrder = "latitude" | "name" | "elevation" | "prefecture"

function encodeChecked(checked: Set<number>): string {
  const bytes = new Uint8Array(13)
  for (const id of checked) {
    const bit = id - 1
    bytes[Math.floor(bit / 8)] |= 1 << (bit % 8)
  }
  return btoa(String.fromCharCode(...Array.from(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}

function decodeChecked(encoded: string): Set<number> {
  try {
    const padded =
      encoded.replace(/-/g, "+").replace(/_/g, "/") +
      "==".slice(0, (4 - (encoded.length % 4)) % 4)
    const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))
    const checked = new Set<number>()
    for (let i = 0; i < 100; i++) {
      if (bytes[Math.floor(i / 8)] & (1 << (i % 8))) {
        checked.add(i + 1)
      }
    }
    return checked
  } catch {
    return new Set()
  }
}

function sortMountains(mountains: Mountain[], sort: SortOrder): Mountain[] {
  const sorted = [...mountains]
  switch (sort) {
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

const mountains = mountainsData as Mountain[]

function MountainListItem({
  mountain,
  isChecked,
  onToggle,
}: {
  mountain: Mountain
  isChecked: boolean
  onToggle: (id: number) => void
}) {
  return (
    <li
      style={{
        background: isChecked ? "#1b3a1c" : "#2a2a2a",
        borderLeft: `4px solid ${isChecked ? "#4caf50" : "#555"}`,
        borderRadius: "6px",
        padding: "12px",
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
            accentColor: "#4caf50",
            cursor: "pointer",
            flexShrink: 0,
            height: "18px",
            marginTop: "2px",
            width: "18px",
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
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  opacity: isChecked ? 0.6 : 1,
                  textDecoration: isChecked ? "line-through" : "none",
                }}
              >
                {mountain.name}
              </span>
              <span style={{ color: "#aaa", fontSize: ".8rem" }}>
                {mountain.elevation.toLocaleString()}m
              </span>
              <span style={{ color: "#888", fontSize: ".8rem" }}>
                {mountain.location.join("・")}
              </span>
            </div>
            <p
              style={{
                color: "#bbb",
                fontSize: ".8rem",
                lineHeight: 1.5,
                opacity: isChecked ? 0.5 : 1,
              }}
            >
              {mountain.description}
            </p>
          </label>
          <Link
            href={`/mountains/${mountain.id}/`}
            style={{
              background: "#3a3a3a",
              borderRadius: "4px",
              color: "#aaa",
              display: "inline-block",
              fontSize: ".75rem",
              padding: "3px 10px",
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

function initChecked(): Set<number> {
  if (typeof window === "undefined") return new Set()
  const params = new URLSearchParams(window.location.search)
  const dataParam = params.get("data")
  if (dataParam) return decodeChecked(dataParam)
  const stored = localStorage.getItem("yama100")
  if (stored) {
    const { checked: ids } = JSON.parse(stored)
    if (Array.isArray(ids)) return new Set<number>(ids)
  }

  return new Set()
}

function initSort(): SortOrder {
  if (typeof window === "undefined") return "latitude"
  const params = new URLSearchParams(window.location.search)
  const sortParam = params.get("sort") as SortOrder | null
  if (
    sortParam &&
    (["latitude", "name", "elevation", "prefecture"] as SortOrder[]).includes(sortParam)
  ) {
    return sortParam
  }
  return "latitude"
}

export default function MountainApp() {
  const [checked, setChecked] = useState<Set<number>>(initChecked)
  const [sort, setSort] = useState<SortOrder>(initSort)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    localStorage.setItem("yama100", JSON.stringify({ checked: [...checked] }))
  }, [checked])

  const toggle = useCallback((id: number) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleShare = useCallback(async () => {
    const params = new URLSearchParams()
    params.set("data", encodeChecked(checked))
    params.set("sort", sort)
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt("以下のURLをコピーしてください", url)
    }
  }, [checked, sort])

  const sorted = sortMountains(mountains, sort)
  const groups = sort === "prefecture" ? groupByPrefecture(mountains) : null
  const count = checked.size
  const percent = Math.round((count / 100) * 100)

  return (
    <div>
      <HeroSection count={count} />

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
        {/* Map */}
        <div className="map-container">
          <Suspense
            fallback={
              <div
                style={{
                  alignItems: "center",
                  background: "#2a2a2a",
                  borderRadius: "8px",
                  color: "#aaa",
                  display: "flex",
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
            />
          </Suspense>
        </div>

        {/* List – scrollable on the right */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Progress + controls */}
          <div
            style={{
              background: "#2a2a2a",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginBottom: "16px",
              padding: "16px",
            }}
          >
            <div style={{ alignItems: "center", display: "flex", gap: "12px" }}>
              <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                {count} / 100
              </span>
              <span style={{ color: "#aaa", fontSize: ".875rem" }}>
                登頂済 ({percent}%)
              </span>
            </div>
            <div
              style={{
                background: "#444",
                borderRadius: "4px",
                height: "8px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "#4caf50",
                  borderRadius: "4px",
                  height: "100%",
                  transition: "width .3s ease",
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
                style={{ color: "#ccc", fontSize: ".875rem" }}
                htmlFor="sort"
              >
                並び順：
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOrder)}
                style={{
                  background: "#3a3a3a",
                  border: "1px solid #555",
                  borderRadius: "4px",
                  color: "#f0f0f0",
                  fontSize: ".875rem",
                  padding: "4px 8px",
                }}
              >
                <option value="latitude">北から順</option>
                <option value="name">五十音順</option>
                <option value="elevation">標高順</option>
                <option value="prefecture">都道府県別</option>
              </select>
              <button
                onClick={handleShare}
                style={{
                  background: copied ? "#388e3c" : "#1976d2",
                  border: "none",
                  borderRadius: "4px",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: ".875rem",
                  padding: "4px 12px",
                  transition: "background .2s",
                }}
              >
                {copied ? "コピーしました！" : "URLをシェア"}
              </button>
            </div>
          </div>

          {/* Mountain list */}
          {groups ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {groups.map(({ prefecture, mountains: prefMountains }) => (
                <div key={prefecture}>
                  <div
                    style={{
                      borderBottom: "1px solid #444",
                      color: "#7ecfb3",
                      fontSize: ".875rem",
                      fontWeight: "bold",
                      marginBottom: "8px",
                      paddingBottom: "4px",
                    }}
                  >
                    {prefecture}
                    <span style={{ color: "#666", fontWeight: "normal", marginLeft: "8px" }}>
                      {prefMountains.filter((m) => checked.has(m.id)).length} / {prefMountains.length}
                    </span>
                  </div>
                  <ul style={{ display: "flex", flexDirection: "column", gap: "8px", listStyle: "none", padding: 0 }}>
                    {prefMountains.map((mountain) => <MountainListItem key={mountain.id} mountain={mountain} isChecked={checked.has(mountain.id)} onToggle={toggle} />)}
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
                <MountainListItem key={mountain.id} mountain={mountain} isChecked={checked.has(mountain.id)} onToggle={toggle} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
