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

type UnifiedMountainAppProps = {
  mountains: Mountain[]
  storageKey: string
  themeColor: string
  pathPrefix: string
  heroSection: React.ReactNode
  totalCount: number
  idOffset: number
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

export default function UnifiedMountainApp({
  mountains,
  storageKey,
  themeColor,
  pathPrefix,
  heroSection,
  totalCount,
  idOffset,
}: UnifiedMountainAppProps) {
  const { checked, sort, setSort, digestChecked, setDigestChecked, toggle } =
    useMountainState(storageKey, totalCount, idOffset)
  const [copied, setCopied] = useState(false)

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

  return (
    <div>
      {digestChecked !== null && (
        <DigestModal
          mountains={digestMountains}
          hero={React.cloneElement(
            heroSection as React.ReactElement<{ count: number }>,
            {
              count: digestMountains.length,
            }
          )}
          onClose={() => setDigestChecked(null)}
        />
      )}
      {heroSection}

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

        <div style={{ flex: 1, minWidth: 0 }}>
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
                {count} / {totalCount}
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
                  background: themeColor,
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

          {groups ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
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
                    <span
                      style={{
                        color: "#666",
                        fontWeight: "normal",
                        marginLeft: "8px",
                      }}
                    >
                      {prefMountains.filter((m) => checked.has(m.id)).length} /{" "}
                      {prefMountains.length}
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
                        themeColor={themeColor}
                        pathPrefix={pathPrefix}
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
                  themeColor={themeColor}
                  pathPrefix={pathPrefix}
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
  themeColor,
  pathPrefix,
}: {
  mountain: Mountain
  isChecked: boolean
  onToggle: (id: number) => void
  themeColor: string
  pathPrefix: string
}) {
  return (
    <li
      style={{
        background: isChecked ? "#1b3a1c" : "#2a2a2a",
        borderLeft: `4px solid ${isChecked ? themeColor : "#555"}`,
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
            accentColor: themeColor,
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
              <span style={{ color: "#aaa", fontSize: ".875rem" }}>
                {mountain.elevation.toLocaleString()}m
              </span>
              <span style={{ color: "#888", fontSize: ".875rem" }}>
                {mountain.location.join("・")}
              </span>
            </div>
            <p
              style={{
                color: "#bbb",
                fontSize: ".875rem",
                lineHeight: 1.5,
                opacity: isChecked ? 0.5 : 1,
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
            href={`${pathPrefix}${mountain.id}/`}
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
import React from "react"
