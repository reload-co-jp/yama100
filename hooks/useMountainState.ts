"use client"

import { useState, useCallback, useSyncExternalStore } from "react"

export type SortOrder =
  | "number"
  | "latitude"
  | "name"
  | "elevation"
  | "prefecture"

function readCheckedFromStorage(storageKey: string) {
  const stored = localStorage.getItem(storageKey)
  if (stored) {
    const { checked: ids } = JSON.parse(stored)
    if (Array.isArray(ids)) return new Set<number>(ids)
  }
  return new Set<number>()
}

const EMPTY = new Set<number>()
const _checkedListeners: Record<string, Set<() => void>> = {}

function getCheckedSnapshot(storageKey: string) {
  try {
    return readCheckedFromStorage(storageKey)
  } catch (error) {
    console.error("Failed to parse stored mountain count:", error)
    return EMPTY
  }
}

function subscribeChecked(storageKey: string, listener: () => void) {
  if (!_checkedListeners[storageKey]) _checkedListeners[storageKey] = new Set()
  _checkedListeners[storageKey].add(listener)
  return () => {
    _checkedListeners[storageKey].delete(listener)
  }
}

function writeChecked(storageKey: string, checked: Set<number>) {
  localStorage.setItem(storageKey, JSON.stringify({ checked: [...checked] }))
  _checkedListeners[storageKey]?.forEach((listener) => listener())
}

function readSortFromLocation() {
  const sortParam = new URLSearchParams(window.location.search).get(
    "sort"
  ) as SortOrder | null
  if (
    sortParam &&
    (
      ["number", "latitude", "name", "elevation", "prefecture"] as SortOrder[]
    ).includes(sortParam)
  ) {
    return sortParam
  }
  return "number"
}

function readDigestFromLocation(totalMountains: number, idOffset: number) {
  const dataParam = new URLSearchParams(window.location.search).get("data")
  return dataParam ? decodeChecked(dataParam, totalMountains, idOffset) : null
}

function subscribeLocation(listener: () => void) {
  window.addEventListener("popstate", listener)
  return () => {
    window.removeEventListener("popstate", listener)
  }
}

export function useMountainCountState(storageKey: string) {
  const checked = useSyncExternalStore(
    (listener) => subscribeChecked(storageKey, listener),
    () => getCheckedSnapshot(storageKey),
    () => EMPTY
  )

  return { checked }
}

export function useMountainState(
  storageKey: string,
  totalMountains: number,
  idOffset: number = 0
) {
  const checked = useSyncExternalStore(
    (listener) => subscribeChecked(storageKey, listener),
    () => getCheckedSnapshot(storageKey),
    () => EMPTY
  )
  const initialSort = useSyncExternalStore(
    subscribeLocation,
    readSortFromLocation,
    (): SortOrder => "number"
  )
  const digestChecked = useSyncExternalStore(
    subscribeLocation,
    () => readDigestFromLocation(totalMountains, idOffset),
    () => null
  )
  const [sortOverride, setSortOverride] = useState<SortOrder | null>(null)
  const sort = sortOverride ?? initialSort

  const setSort = useCallback((nextSort: SortOrder) => {
    setSortOverride(nextSort)
  }, [])

  const saveToStorage = useCallback(
    (ids: Set<number>) => {
      writeChecked(storageKey, ids)
    },
    [storageKey]
  )

  const toggle = useCallback(
    (id: number) => {
      const next = new Set(checked)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      saveToStorage(next)
    },
    [checked, saveToStorage]
  )

  return { checked, sort, setSort, digestChecked, toggle }
}

export function encodeChecked(
  checked: Set<number>,
  total: number,
  offset: number
): string {
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

export function decodeChecked(
  encoded: string,
  total: number,
  offset: number
): Set<number> {
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
