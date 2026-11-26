"use client"

// 山ごとの登山記録（ルート・メモ）と写真の保存
//
// - ルート・メモ: localStorage["yama100_records"]（山詳細ページの ID 単位）
// - 写真: IndexedDB "yama100" / "photos"（容量が大きいため localStorage には保存しない）
//
// 既存の登頂状態（yama100 等のキー）には一切手を加えない。

import { useCallback, useEffect, useState, useSyncExternalStore } from "react"

export const RECORDS_STORAGE_KEY = "yama100_records"

export type MountainNote = {
  route?: string
  memo?: string
  updatedAt?: string
}

type RecordsFile = {
  version: 1
  mountains: Record<string, MountainNote>
}

const EMPTY_FILE: RecordsFile = { version: 1, mountains: {} }

let cachedRaw: string | null | undefined
let cachedFile: RecordsFile = EMPTY_FILE
const listeners = new Set<() => void>()

function readFile(): RecordsFile {
  if (typeof window === "undefined") return EMPTY_FILE
  let raw: string | null
  try {
    raw = localStorage.getItem(RECORDS_STORAGE_KEY)
  } catch {
    raw = null
  }
  if (raw === cachedRaw) return cachedFile
  cachedRaw = raw
  try {
    const parsed = raw ? JSON.parse(raw) : null
    cachedFile =
      parsed &&
      typeof parsed === "object" &&
      parsed.mountains &&
      typeof parsed.mountains === "object"
        ? { version: 1, mountains: parsed.mountains }
        : EMPTY_FILE
  } catch {
    cachedFile = EMPTY_FILE
  }
  return cachedFile
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === RECORDS_STORAGE_KEY) listener()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

export function getAllNotes(): Record<string, MountainNote> {
  return readFile().mountains
}

export function saveMountainNote(mountainId: number, note: MountainNote) {
  const file = readFile()
  const mountains = { ...file.mountains }
  const route = note.route?.trim() ?? ""
  const memo = note.memo?.trim() ?? ""
  if (!route && !memo) delete mountains[mountainId]
  else
    mountains[mountainId] = { route, memo, updatedAt: new Date().toISOString() }
  const raw = JSON.stringify({ version: 1, mountains })
  try {
    localStorage.setItem(RECORDS_STORAGE_KEY, raw)
  } catch (error) {
    console.error("Failed to save note:", error)
    return false
  }
  listeners.forEach((listener) => listener())
  return true
}

export function replaceAllNotes(mountains: Record<string, MountainNote>) {
  localStorage.setItem(
    RECORDS_STORAGE_KEY,
    JSON.stringify({ version: 1, mountains })
  )
  listeners.forEach((listener) => listener())
}

export function useMountainNote(mountainId: number): MountainNote | null {
  const file = useSyncExternalStore(subscribe, readFile, () => EMPTY_FILE)
  return file.mountains[mountainId] ?? null
}

// --- photos (IndexedDB) ---------------------------------------------------

export type StoredPhoto = {
  id: string
  mountainId: number
  blob: Blob
  createdAt: string
}

const DB_NAME = "yama100"
const DB_VERSION = 1
const PHOTO_STORE = "photos"
const MAX_PHOTO_EDGE = 1600
export const MAX_PHOTOS_PER_MOUNTAIN = 12

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not available"))
      return
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(PHOTO_STORE)) {
        const store = db.createObjectStore(PHOTO_STORE, { keyPath: "id" })
        store.createIndex("mountainId", "mountainId", { unique: false })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await openDb()
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, mode)
    const request = run(tx.objectStore(PHOTO_STORE))
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => db.close()
  })
}

export function listPhotos(mountainId: number): Promise<StoredPhoto[]> {
  return withStore<StoredPhoto[]>("readonly", (store) =>
    store.index("mountainId").getAll(mountainId)
  ).then((photos) =>
    photos.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  )
}

export function deletePhoto(id: string) {
  return withStore("readwrite", (store) => store.delete(id))
}

/** 写真を長辺 1600px の JPEG に縮小して保存する */
export async function addPhoto(mountainId: number, file: File) {
  const blob = await resizeImage(file)
  const photo: StoredPhoto = {
    id: `${mountainId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    mountainId,
    blob,
    createdAt: new Date().toISOString(),
  }
  await withStore("readwrite", (store) => store.put(photo))
  return photo
}

async function resizeImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => null)
  if (!bitmap) return file
  const scale = Math.min(
    1,
    MAX_PHOTO_EDGE / Math.max(bitmap.width, bitmap.height)
  )
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) return file
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close?.()
  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob ?? file), "image/jpeg", 0.85)
  })
}

export function useMountainPhotos(mountainId: number) {
  const [photos, setPhotos] = useState<{ id: string; url: string }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    const urls: string[] = []
    listPhotos(mountainId)
      .then((items) => {
        if (cancelled) return
        const next = items.map((item) => {
          const url = URL.createObjectURL(item.blob)
          urls.push(url)
          return { id: item.id, url }
        })
        setPhotos(next)
        setError(null)
      })
      .catch(() => {
        if (!cancelled) setError("この端末では写真を保存できません")
      })
    return () => {
      cancelled = true
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [mountainId, version])

  const refresh = useCallback(() => setVersion((v) => v + 1), [])

  return { photos, error, refresh }
}
