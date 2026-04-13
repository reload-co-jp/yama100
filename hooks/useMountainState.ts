"use client"

import { useState, useCallback } from "react"

export type SortOrder = "latitude" | "name" | "elevation" | "prefecture"

export function useMountainState(
  storageKey: string,
  totalMountains: number,
  idOffset: number = 0
) {
  const [checked, setChecked] = useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set<number>()
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        const { checked: ids } = JSON.parse(stored)
        if (Array.isArray(ids)) return new Set<number>(ids)
      } catch {
        // ignore parse errors
      }
    }
    return new Set<number>()
  })

  const [sort, setSort] = useState<SortOrder>(() => {
    if (typeof window === "undefined") return "latitude"
    const sortParam = new URLSearchParams(window.location.search).get("sort") as SortOrder | null
    if (sortParam && (["latitude", "name", "elevation", "prefecture"] as SortOrder[]).includes(sortParam)) {
      return sortParam
    }
    return "latitude"
  })

  const [digestChecked, setDigestChecked] = useState<Set<number> | null>(() => {
    if (typeof window === "undefined") return null
    const dataParam = new URLSearchParams(window.location.search).get("data")
    return dataParam ? decodeChecked(dataParam, totalMountains, idOffset) : null
  })

  const saveToStorage = useCallback((ids: Set<number>) => {
    localStorage.setItem(storageKey, JSON.stringify({ checked: [...ids] }))
  }, [storageKey])

  const toggle = useCallback((id: number) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      saveToStorage(next)
      return next
    })
  }, [saveToStorage])

  return { checked, sort, setSort, digestChecked, setDigestChecked, toggle }
}

export function encodeChecked(checked: Set<number>, total: number, offset: number): string {
  const bytes = new Uint8Array(Math.ceil(total / 8))
  for (const id of checked) {
    const bit = id - 1 - offset
    if (bit >= 0 && bit < total) {
      bytes[Math.floor(bit / 8)] |= 1 << (bit % 8)
    }
  }
  return btoa(String.fromCharCode(...Array.from(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}

export function decodeChecked(encoded: string, total: number, offset: number): Set<number> {
  try {
    const padded =
      encoded.replace(/-/g, "+").replace(/_/g, "/") +
      "==".slice(0, (4 - (encoded.length % 4)) % 4)
    const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))
    const checked = new Set<number>()
    for (let i = 0; i < total; i++) {
      if (bytes[Math.floor(i / 8)] & (1 << (i % 8))) {
        checked.add(i + 1 + offset)
      }
    }
    return checked
  } catch {
    return new Set()
  }
}
