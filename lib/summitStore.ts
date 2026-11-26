"use client"

// 登頂状態の localStorage ストア
//
// 保存形式（既存と互換）:
//   localStorage[storageKey] = JSON.stringify({ checked: number[], dates: { [id]: string[] } })
//
// 読み書きはすべてこのモジュールを経由させ、未知のフィールドは書き込み時にも保持する。

import { MOUNTAIN_LISTS, type MountainListMeta } from "./mountainCatalog"

// 登頂日: "YYYY" | "YYYY-MM" | "YYYY-MM-DD"
export type SummitDates = Record<number, string[]>

export type ListState = {
  raw: string | null
  checked: Set<number>
  dates: SummitDates
}

const SUMMIT_DATE_RE = /^\d{4}(-\d{2}(-\d{2})?)?$/

export function isValidSummitDate(value: string): boolean {
  return SUMMIT_DATE_RE.test(value)
}

const EMPTY_CHECKED: Set<number> = new Set()
const EMPTY_DATES: SummitDates = {}
export const EMPTY_LIST_STATE: ListState = {
  raw: null,
  checked: EMPTY_CHECKED,
  dates: EMPTY_DATES,
}

function parseListState(raw: string | null): ListState {
  if (!raw) return EMPTY_LIST_STATE
  const parsed = JSON.parse(raw)
  const ids = parsed?.checked
  const checked = Array.isArray(ids)
    ? new Set<number>(
        ids.map(Number).filter((n: number) => Number.isInteger(n) && n > 0)
      )
    : new Set<number>()

  const dates: SummitDates = {}
  if (parsed?.dates && typeof parsed.dates === "object") {
    for (const [key, value] of Object.entries(parsed.dates)) {
      const id = Number(key)
      if (!Number.isInteger(id) || !Array.isArray(value)) continue
      const valid = value.filter(
        (d): d is string => typeof d === "string" && isValidSummitDate(d)
      )
      if (valid.length) dates[id] = valid
    }
  }
  return { raw, checked, dates }
}

const cache = new Map<string, ListState>()

function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function readListState(storageKey: string): ListState {
  if (typeof window === "undefined") return EMPTY_LIST_STATE
  const raw = safeGetItem(storageKey)
  const cached = cache.get(storageKey)
  if (cached && cached.raw === raw) return cached
  let state: ListState
  try {
    state = parseListState(raw)
  } catch (error) {
    console.error("Failed to parse stored mountain state:", error)
    state = { ...EMPTY_LIST_STATE, raw }
  }
  cache.set(storageKey, state)
  return state
}

// --- subscription ---------------------------------------------------------

const listeners = new Map<string, Set<() => void>>()
const globalListeners = new Set<() => void>()
let storageEventBound = false

function notify(storageKey: string | null) {
  if (storageKey === null) {
    listeners.forEach((set) => set.forEach((listener) => listener()))
  } else {
    listeners.get(storageKey)?.forEach((listener) => listener())
  }
  globalListeners.forEach((listener) => listener())
}

function bindStorageEvent() {
  if (storageEventBound || typeof window === "undefined") return
  storageEventBound = true
  // 他タブでの変更や、インポート処理が発火する storage イベントに追従する
  window.addEventListener("storage", (event) => notify(event.key ?? null))
}

export function subscribeList(storageKey: string, listener: () => void) {
  bindStorageEvent()
  if (!listeners.has(storageKey)) listeners.set(storageKey, new Set())
  listeners.get(storageKey)!.add(listener)
  return () => {
    listeners.get(storageKey)?.delete(listener)
  }
}

export function subscribeAll(listener: () => void) {
  bindStorageEvent()
  globalListeners.add(listener)
  return () => {
    globalListeners.delete(listener)
  }
}

// --- write ----------------------------------------------------------------

export function writeListState(
  storageKey: string,
  checked: Set<number>,
  dates: SummitDates
) {
  let extra: Record<string, unknown> = {}
  try {
    const current = safeGetItem(storageKey)
    if (current) {
      const parsed = JSON.parse(current)
      if (parsed && typeof parsed === "object") extra = parsed
    }
  } catch {
    extra = {}
  }

  const cleanedDates: SummitDates = {}
  for (const [idStr, list] of Object.entries(dates)) {
    if (list.length) cleanedDates[Number(idStr)] = list
  }
  const raw = JSON.stringify({
    ...extra,
    checked: [...checked],
    dates: cleanedDates,
  })
  try {
    localStorage.setItem(storageKey, raw)
  } catch (error) {
    console.error("Failed to save mountain state:", error)
    return
  }
  cache.set(storageKey, { raw, checked, dates: cleanedDates })
  notify(storageKey)
}

export function setMountainChecked(
  storageKey: string,
  id: number,
  value: boolean
) {
  const { checked, dates } = readListState(storageKey)
  if (checked.has(id) === value) return
  const next = new Set(checked)
  if (value) next.add(id)
  else next.delete(id)
  writeListState(storageKey, next, dates)
}

export function toggleMountainChecked(storageKey: string, id: number) {
  const { checked } = readListState(storageKey)
  setMountainChecked(storageKey, id, !checked.has(id))
}

export function setMountainDates(
  storageKey: string,
  id: number,
  nextDates: string[]
) {
  const { checked, dates } = readListState(storageKey)
  const nextAll = { ...dates }
  if (nextDates.length) nextAll[id] = nextDates
  else delete nextAll[id]
  // 登頂日を追加したら自動で登頂済みにする（既存仕様）
  const nextChecked = nextDates.length ? new Set(checked).add(id) : checked
  writeListState(storageKey, nextChecked, nextAll)
}

// --- all lists snapshot ---------------------------------------------------

export type AllListsSnapshot = {
  key: string
  lists: { list: MountainListMeta; checked: Set<number>; dates: SummitDates }[]
}

let allCache: AllListsSnapshot | null = null
const SERVER_ALL: AllListsSnapshot = {
  key: "",
  lists: MOUNTAIN_LISTS.map((list) => ({
    list,
    checked: EMPTY_CHECKED,
    dates: EMPTY_DATES,
  })),
}

export function getAllListsSnapshot(): AllListsSnapshot {
  if (typeof window === "undefined") return SERVER_ALL
  const states = MOUNTAIN_LISTS.map((list) => readListState(list.storageKey))
  const key = states.map((state) => state.raw ?? "").join("\u0000")
  if (allCache && allCache.key === key) return allCache
  allCache = {
    key,
    lists: MOUNTAIN_LISTS.map((list, i) => ({
      list,
      checked: states[i].checked,
      dates: states[i].dates,
    })),
  }
  return allCache
}

export function getServerAllListsSnapshot(): AllListsSnapshot {
  return SERVER_ALL
}

// --- date helpers ---------------------------------------------------------

/** 並べ替え用に "YYYY" / "YYYY-MM" を "YYYY-MM-DD" に正規化 */
export function normalizeDateKey(date: string): string {
  if (/^\d{4}$/.test(date)) return `${date}-01-01`
  if (/^\d{4}-\d{2}$/.test(date)) return `${date}-01`
  return date
}

export function formatSummitDate(date: string): string {
  const [y, m, d] = date.split("-")
  if (d) return `${y}年${Number(m)}月${Number(d)}日`
  if (m) return `${y}年${Number(m)}月`
  return `${y}年`
}

export function latestDate(
  dates: readonly string[] | undefined
): string | null {
  if (!dates || dates.length === 0) return null
  return [...dates].sort((a, b) =>
    normalizeDateKey(b).localeCompare(normalizeDateKey(a))
  )[0]
}
