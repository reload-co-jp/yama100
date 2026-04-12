"use client"

import { useSyncExternalStore } from "react"
import MountainPhoto from "./MountainPhoto"

type Mountain = {
  id: number
  name: string
  description: string
  location: string[]
  latitude: number
  longitude: number
  elevation: number
}

type Props = {
  mountain: Mountain
}

let _cache: Set<number> | null = null
const _listeners = new Set<() => void>()
const EMPTY = new Set<number>()

function readChecked(): Set<number> {
  if (_cache !== null) return _cache
  try {
    const stored = localStorage.getItem("yama300")
    if (stored) {
      const { checked: ids } = JSON.parse(stored)
      if (Array.isArray(ids)) return (_cache = new Set<number>(ids))
    }
  } catch {
    // ignore parse errors
  }
  return (_cache = EMPTY)
}

function writeChecked(next: Set<number>) {
  _cache = next
  localStorage.setItem("yama300", JSON.stringify({ checked: [...next] }))
  _listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  _listeners.add(listener)
  return () => {
    _listeners.delete(listener)
  }
}

export default function MountainDetailClient300({ mountain }: Props) {
  const checked = useSyncExternalStore(subscribe, readChecked, () => EMPTY)
  const isChecked = checked.has(mountain.id)

  const toggle = () => {
    const prev = readChecked()
    const next = new Set(prev)
    if (next.has(mountain.id)) next.delete(mountain.id)
    else next.add(mountain.id)
    writeChecked(next)
  }

  return (
    <>
      <div
        style={{
          height: "240px",
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        <div style={{ height: "100%", width: "100%" }}>
          <MountainPhoto name={mountain.name} size="full" />
        </div>
        {isChecked && (
          <div
            style={{
              background: "rgba(33,150,243,0.85)",
              borderRadius: "4px",
              color: "#fff",
              fontSize: ".8rem",
              fontWeight: 600,
              padding: "4px 10px",
              position: "absolute",
              right: "12px",
              top: "12px",
            }}
          >
            登頂済
          </div>
        )}
      </div>

      <div style={{ padding: "12px 24px 0" }}>
        <button
          onClick={toggle}
          style={{
            background: isChecked ? "#1a2d3a" : "#2a2a2a",
            border: `2px solid ${isChecked ? "#2196f3" : "#555"}`,
            borderRadius: "6px",
            color: isChecked ? "#2196f3" : "#aaa",
            cursor: "pointer",
            fontSize: ".9rem",
            fontWeight: 600,
            padding: "8px 20px",
            transition: "all .2s",
            width: "100%",
          }}
        >
          {isChecked ? "✓ 登頂済み" : "登頂済みにする"}
        </button>
      </div>
    </>
  )
}
