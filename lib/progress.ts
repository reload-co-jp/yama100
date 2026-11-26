// 登頂状況の集計（ダッシュボード・登頂記録・シェア画像で共通利用）

import {
  findCanonicalMountainByRecord,
  type MountainListMeta,
  type MountainRecord,
} from "./mountainCatalog"
import { getRegion } from "./mountainMeta"
import { REGIONS, type Region } from "./regions"
import {
  normalizeDateKey,
  type AllListsSnapshot,
  type SummitDates,
} from "./summitStore"

export type ListProgress = {
  list: MountainListMeta
  climbed: number
  total: number
}

export function getListProgress(snapshot: AllListsSnapshot): ListProgress[] {
  return snapshot.lists.map(({ list, checked }) => ({
    list,
    climbed: list.mountains.filter((m) => checked.has(m.id)).length,
    total: list.mountains.length,
  }))
}

export type RegionProgress = {
  region: Region
  climbed: number
  total: number
  mountains: { mountain: MountainRecord; climbed: boolean }[]
}

export function getRegionProgress(
  list: MountainListMeta,
  checked: Set<number>
): RegionProgress[] {
  const byRegion = new Map<string, RegionProgress>()
  for (const region of REGIONS)
    byRegion.set(region.key, { region, climbed: 0, total: 0, mountains: [] })
  for (const mountain of list.mountains) {
    const region = getRegion(mountain)
    if (!region) continue
    const entry = byRegion.get(region.key)!
    const climbed = checked.has(mountain.id)
    entry.total += 1
    if (climbed) entry.climbed += 1
    entry.mountains.push({ mountain, climbed })
  }
  return [...byRegion.values()].filter((entry) => entry.total > 0)
}

export type TimelineEntry = {
  date: string
  sortKey: string
  /** 山詳細ページの ID */
  pageId: number
  name: string
  elevation: number
  location: string[]
  lists: MountainListMeta[]
}

/** 全リストの登頂日を集約し、同じ山・同じ日の重複をまとめる（新しい順） */
export function getTimeline(snapshot: AllListsSnapshot): TimelineEntry[] {
  const map = new Map<string, TimelineEntry>()
  for (const { list, dates } of snapshot.lists) {
    const byId = new Map(list.mountains.map((m) => [m.id, m]))
    for (const [idStr, dateList] of Object.entries(dates as SummitDates)) {
      const mountain = byId.get(Number(idStr))
      if (!mountain) continue
      const canonical = findCanonicalMountainByRecord(mountain)
      const pageId = canonical?.id ?? mountain.id
      const nameKey = canonical?.canonicalName ?? mountain.name
      for (const date of dateList) {
        const key = `${nameKey}|${pageId}|${date}`
        const existing = map.get(key)
        if (existing) {
          if (!existing.lists.includes(list)) existing.lists.push(list)
          continue
        }
        map.set(key, {
          date,
          sortKey: normalizeDateKey(date),
          pageId,
          name: canonical?.name ?? mountain.name,
          elevation: mountain.elevation,
          location: mountain.location,
          lists: [list],
        })
      }
    }
  }
  return [...map.values()].sort((a, b) => b.sortKey.localeCompare(a.sortKey))
}

/** 全リストを通じて登頂済みの山（重複を除いた数） */
export function countUniqueClimbed(snapshot: AllListsSnapshot): number {
  const set = new Set<string>()
  for (const { list, checked } of snapshot.lists) {
    for (const mountain of list.mountains) {
      if (!checked.has(mountain.id)) continue
      const canonical = findCanonicalMountainByRecord(mountain)
      set.add(
        canonical
          ? `${canonical.canonicalName}|${canonical.id}`
          : `${list.key}|${mountain.id}`
      )
    }
  }
  return set.size
}

export function getYearlyCounts(timeline: TimelineEntry[]) {
  const map = new Map<string, TimelineEntry[]>()
  for (const entry of timeline) {
    const year = entry.sortKey.slice(0, 4)
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(entry)
  }
  return [...map.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, entries]) => ({
      year,
      entries,
      uniqueMountains: new Set(entries.map((e) => `${e.name}|${e.pageId}`))
        .size,
    }))
}
