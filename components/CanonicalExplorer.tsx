"use client"

import { useCallback, useMemo } from "react"
import { useAllListsState } from "../hooks/useMountainState"
import { buildCanonicalItems } from "../lib/explorerItems"
import {
  CANONICAL_MOUNTAINS,
  type CanonicalMountainMembership,
} from "../lib/mountainCatalog"
import { setMountainChecked } from "../lib/summitStore"
import MountainExplorer from "./explorer/MountainExplorer"
import type { ExplorerItem } from "./explorer/types"

export default function CanonicalExplorer() {
  const snapshot = useAllListsState()
  const items = useMemo(() => buildCanonicalItems(), [])
  const membershipsByKey = useMemo(() => {
    const map = new Map<string, CanonicalMountainMembership[]>()
    CANONICAL_MOUNTAINS.forEach((m) =>
      map.set(`c-${m.id}-${m.canonicalName}`, m.memberships)
    )
    return map
  }, [])
  const stateByStorageKey = useMemo(
    () =>
      new Map(snapshot.lists.map((entry) => [entry.list.storageKey, entry])),
    [snapshot]
  )

  const getStatus = useCallback(
    (item: ExplorerItem) => {
      const memberships = membershipsByKey.get(item.key) ?? []
      let climbed = false
      const dates = new Set<string>()
      for (const m of memberships) {
        const state = stateByStorageKey.get(m.storageKey)
        if (!state) continue
        if (state.checked.has(m.id)) climbed = true
        state.dates[m.id]?.forEach((d) => dates.add(d))
      }
      return { climbed, dates: [...dates] }
    },
    [membershipsByKey, stateByStorageKey]
  )

  const onToggle = useCallback(
    (item: ExplorerItem) => {
      const memberships = membershipsByKey.get(item.key) ?? []
      const climbed = getStatus(item).climbed
      memberships.forEach((m) =>
        setMountainChecked(m.storageKey, m.id, !climbed)
      )
    },
    [membershipsByKey, getStatus]
  )

  return (
    <MountainExplorer
      defaultSort="latitude"
      getStatus={getStatus}
      headingId="search-results"
      items={items}
      onToggle={onToggle}
      showNumberSort={false}
      title="登録されている山"
    />
  )
}
