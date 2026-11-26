"use client"

import { lazy, Suspense, useMemo, useSyncExternalStore } from "react"
import type { CanonicalMountainMembership } from "../../lib/mountainCatalog"
import {
  readListState,
  setMountainChecked,
  subscribeAll,
} from "../../lib/summitStore"
import type { MapMountain } from "../MountainMap"

const MountainMap = lazy(() => import("../MountainMap"))

type Props = {
  mountain: MapMountain
  memberships: CanonicalMountainMembership[]
}

export default function DetailMap({ mountain, memberships }: Props) {
  const anyChecked = useSyncExternalStore(
    subscribeAll,
    () =>
      memberships.some((m) => readListState(m.storageKey).checked.has(m.id)),
    () => false
  )
  const checked = useMemo(
    () => (anyChecked ? new Set([mountain.id]) : new Set<number>()),
    [anyChecked, mountain.id]
  )
  const mountains = useMemo(() => [mountain], [mountain])

  return (
    <Suspense
      fallback={
        <div
          style={{
            alignItems: "center",
            display: "flex",
            height: "100%",
            justifyContent: "center",
          }}
        >
          地図を読み込み中…
        </div>
      }
    >
      <MountainMap
        center={[mountain.latitude, mountain.longitude]}
        checked={checked}
        label={`${mountain.name}の位置を示す地図`}
        mountains={mountains}
        onToggle={() =>
          memberships.forEach((m) =>
            setMountainChecked(m.storageKey, m.id, !anyChecked)
          )
        }
        zoom={11}
      />
    </Suspense>
  )
}
