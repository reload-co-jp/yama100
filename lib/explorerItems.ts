import type { ExplorerItem } from "../components/explorer/types"
import {
  CANONICAL_MOUNTAINS,
  findCanonicalMountainByRecord,
  getMountainPagePathForRecord,
  type MountainListMeta,
  type MountainRecord,
} from "./mountainCatalog"
import { getDifficultyLevel, getPrefectures, getRegion } from "./mountainMeta"

export function buildListItems(list: MountainListMeta): ExplorerItem[] {
  return list.mountains.map((mountain: MountainRecord) => {
    const region = getRegion(mountain)
    const number = mountain.id - list.idOffset
    const canonical = findCanonicalMountainByRecord(mountain)
    return {
      key: `${list.key}-${mountain.id}`,
      id: mountain.id,
      number: number >= 1 && number <= list.totalCount ? number : null,
      name: mountain.name,
      aliases: canonical?.aliases ?? [],
      elevation: mountain.elevation,
      prefectures: getPrefectures(mountain),
      regionKey: region?.key ?? null,
      regionLabel: region?.label ?? null,
      latitude: mountain.latitude,
      longitude: mountain.longitude,
      difficulty: getDifficultyLevel(mountain),
      href: getMountainPagePathForRecord(mountain),
    }
  })
}

export function buildCanonicalItems(): ExplorerItem[] {
  return CANONICAL_MOUNTAINS.map((mountain) => {
    const region = getRegion(mountain)
    return {
      key: `c-${mountain.id}-${mountain.canonicalName}`,
      id: mountain.id,
      number: null,
      name: mountain.name,
      aliases: mountain.aliases,
      elevation: mountain.elevation,
      prefectures: getPrefectures(mountain),
      regionKey: region?.key ?? null,
      regionLabel: region?.label ?? null,
      latitude: mountain.latitude,
      longitude: mountain.longitude,
      difficulty: getDifficultyLevel(mountain),
      href: `/mountain/${mountain.id}/`,
      memberships: mountain.memberships.map((m) => m.label),
    }
  })
}
