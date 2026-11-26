"use client"

import { useCallback, useSyncExternalStore } from "react"
import {
  EMPTY_LIST_STATE,
  getAllListsSnapshot,
  getServerAllListsSnapshot,
  isValidSummitDate,
  readListState,
  setMountainDates,
  subscribeAll,
  subscribeList,
  toggleMountainChecked,
  type SummitDates,
} from "../lib/summitStore"

export { isValidSummitDate }
export type { SummitDates }

export function useListState(storageKey: string) {
  return useSyncExternalStore(
    useCallback(
      (listener: () => void) => subscribeList(storageKey, listener),
      [storageKey]
    ),
    () => readListState(storageKey),
    () => EMPTY_LIST_STATE
  )
}

export function useAllListsState() {
  return useSyncExternalStore(
    subscribeAll,
    getAllListsSnapshot,
    getServerAllListsSnapshot
  )
}

export function useMountainCountState(storageKey: string) {
  const { checked } = useListState(storageKey)
  return { checked }
}

// --- share digest (?data=) ------------------------------------------------

const digestCache = new Map<string, Set<number> | null>()

function readDigestFromLocation(totalMountains: number, idOffset: number) {
  const dataParam = new URLSearchParams(window.location.search).get("data")
  const cacheKey = `${dataParam ?? ""}:${totalMountains}:${idOffset}`
  if (digestCache.has(cacheKey)) return digestCache.get(cacheKey) ?? null

  const snapshot = dataParam
    ? decodeChecked(dataParam, totalMountains, idOffset)
    : null
  digestCache.set(cacheKey, snapshot)
  return snapshot
}

function subscribeLocation(listener: () => void) {
  window.addEventListener("popstate", listener)
  return () => {
    window.removeEventListener("popstate", listener)
  }
}

export function useMountainState(
  storageKey: string,
  totalMountains: number,
  idOffset: number = 0
) {
  const { checked, dates } = useListState(storageKey)
  const digestChecked = useSyncExternalStore(
    subscribeLocation,
    () => readDigestFromLocation(totalMountains, idOffset),
    () => null
  )

  const toggle = useCallback(
    (id: number) => toggleMountainChecked(storageKey, id),
    [storageKey]
  )

  const setSummitDates = useCallback(
    (id: number, nextDates: string[]) =>
      setMountainDates(storageKey, id, nextDates),
    [storageKey]
  )

  return { checked, digestChecked, toggle, dates, setSummitDates }
}

// --- share URL encoding (互換性維持のため形式は変更しない) ---------------------

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
