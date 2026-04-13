"use client"

import { useSyncExternalStore, useCallback } from "react"
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
  storageKey: string
  themeColor: string
  overlayColor: string
  activeBgColor: string
}

// Module-level caches by storageKey
const _caches: Record<string, Set<number> | null> = {}
const _listeners: Record<string, Set<() => void>> = {}
const EMPTY = new Set<number>()

function getCache(key: string) {
  if (_caches[key] !== undefined) return _caches[key]
  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      const { checked: ids } = JSON.parse(stored)
      if (Array.isArray(ids)) return (_caches[key] = new Set<number>(ids))
    }
  } catch {
    // ignore parse errors
  }
  return (_caches[key] = EMPTY)
}

function writeChecked(key: string, next: Set<number>) {
  _caches[key] = next
  localStorage.setItem(key, JSON.stringify({ checked: [...next] }))
  _listeners[key]?.forEach((l) => l())
}

function subscribe(key: string, listener: () => void) {
  if (!_listeners[key]) _listeners[key] = new Set()
  _listeners[key].add(listener)
  return () => {
    _listeners[key].delete(listener)
  }
}

export function useMountainDetail(storageKey: string, mountainId: number) {
  const subscribeFn = useCallback(
    (listener: () => void) => subscribe(storageKey, listener),
    [storageKey]
  )
  const readFn = useCallback(() => getCache(storageKey), [storageKey])

  const checked = useSyncExternalStore(subscribeFn, readFn, () => EMPTY)
  const isChecked = checked.has(mountainId)

  const toggle = () => {
    const prev = getCache(storageKey)
    const next = new Set(prev)
    if (next.has(mountainId)) next.delete(mountainId)
    else next.add(mountainId)
    writeChecked(storageKey, next)
  }

  return { isChecked, toggle, checked }
}

export default function UnifiedMountainDetailClient({
  mountain,
  storageKey,
  themeColor,
  overlayColor,
  activeBgColor,
}: Props) {
  const { isChecked, toggle } = useMountainDetail(storageKey, mountain.id)

  return (
    <>
      <div
        style={{
          height: "50vh",
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
              background: overlayColor,
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
            background: isChecked ? activeBgColor : "#2a2a2a",
            border: `2px solid ${isChecked ? themeColor : "#555"}`,
            borderRadius: "6px",
            color: isChecked ? themeColor : "#aaa",
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