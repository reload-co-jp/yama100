"use client"

import { useState, useCallback, useSyncExternalStore } from "react"

export type SortOrder =
  | "number"
  | "latitude"
  | "name"
  | "elevation"
  | "prefecture"

// 登頂日: "YYYY" | "YYYY-MM" | "YYYY-MM-DD"
export type SummitDates = Record<number, string[]>

const SUMMIT_DATE_RE = /^\d{4}(-\d{2}(-\d{2})?)?$/

export function isValidSummitDate(value: string): boolean {
  return SUMMIT_DATE_RE.test(value)
}

function readStateFromStorage(storageKey: string): {
  checked: Set<number>
  dates: SummitDates
} {
  const stored = localStorage.getItem(storageKey)
  if (!stored) return { checked: new Set<number>(), dates: {} }

  const parsed = JSON.parse(stored)
  const ids = parsed.checked
  const checked = Array.isArray(ids)
    ? new Set<number>(
        ids.map(Number).filter((n: number) => Number.isInteger(n) && n > 0)
      )
    : new Set<number>()

  const dates: SummitDates = {}
  if (parsed.dates && typeof parsed.dates === "object") {
    for (const [key, value] of Object.entries(parsed.dates)) {
      const id = Number(key)
      if (!Number.isInteger(id) || !Array.isArray(value)) continue
      const valid = value.filter(
        (d): d is string => typeof d === "string" && isValidSummitDate(d)
      )
      if (valid.length) dates[id] = valid
    }
  }
  return { checked, dates }
}

const EMPTY = new Set<number>()
const EMPTY_DATES: SummitDates = {}
const _checkedListeners: Record<string, Set<() => void>> = {}
const _checkedCache: Record<
  string,
  { raw: string | null; checked: Set<number>; dates: SummitDates }
> = {}
const _digestCache = new Map<string, Set<number> | null>()

function getState(storageKey: string) {
  try {
    const raw = localStorage.getItem(storageKey)
    const cached = _checkedCache[storageKey]
    if (cached && cached.raw === raw) return cached

    const { checked, dates } = raw
      ? readStateFromStorage(storageKey)
      : { checked: EMPTY, dates: EMPTY_DATES }
    const entry = { raw, checked, dates }
    _checkedCache[storageKey] = entry
    return entry
  } catch (error) {
    console.error("Failed to parse stored mountain count:", error)
    return { raw: null, checked: EMPTY, dates: EMPTY_DATES }
  }
}

function getCheckedSnapshot(storageKey: string) {
  return getState(storageKey).checked
}

function getDatesSnapshot(storageKey: string) {
  return getState(storageKey).dates
}

function subscribeChecked(storageKey: string, listener: () => void) {
  if (!_checkedListeners[storageKey]) _checkedListeners[storageKey] = new Set()
  _checkedListeners[storageKey].add(listener)
  return () => {
    _checkedListeners[storageKey].delete(listener)
  }
}

function writeState(
  storageKey: string,
  checked: Set<number>,
  dates: SummitDates
) {
  const cleanedDates: SummitDates = {}
  for (const [idStr, list] of Object.entries(dates)) {
    if (list.length) cleanedDates[Number(idStr)] = list
  }
  const raw = JSON.stringify({ checked: [...checked], dates: cleanedDates })
  _checkedCache[storageKey] = { raw, checked, dates: cleanedDates }
  localStorage.setItem(storageKey, raw)
  _checkedListeners[storageKey]?.forEach((listener) => listener())
}

function writeChecked(storageKey: string, checked: Set<number>) {
  writeState(storageKey, checked, getState(storageKey).dates)
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
  const cacheKey = `${dataParam ?? ""}:${totalMountains}:${idOffset}`
  if (_digestCache.has(cacheKey)) return _digestCache.get(cacheKey) ?? null

  const snapshot = dataParam
    ? decodeChecked(dataParam, totalMountains, idOffset)
    : null
  _digestCache.set(cacheKey, snapshot)
  return snapshot
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
  const dates = useSyncExternalStore(
    (listener) => subscribeChecked(storageKey, listener),
    () => getDatesSnapshot(storageKey),
    () => EMPTY_DATES
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
    const url = new URL(window.location.href)
    url.searchParams.set("sort", nextSort)
    window.history.replaceState(null, "", url.toString())
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

  const setSummitDates = useCallback(
    (id: number, nextDates: string[]) => {
      const nextAll = { ...dates }
      if (nextDates.length) nextAll[id] = nextDates
      else delete nextAll[id]
      // 登頂日を追加したら自動で登頂済みにする
      const nextChecked = nextDates.length
        ? new Set(checked).add(id)
        : checked
      writeState(storageKey, nextChecked, nextAll)
    },
    [checked, dates, storageKey]
  )

  return { checked, sort, setSort, digestChecked, toggle, dates, setSummitDates }
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
