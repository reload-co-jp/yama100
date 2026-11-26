"use client"

import { MOUNTAIN_LISTS, type MountainListKey } from "../lib/mountainCatalog"
import ListExplorer from "./ListExplorer"
import { useUrlState } from "./explorer/useUrlState"
import styles from "./MapPageClient.module.css"

const KEYS = ["list"] as const

export default function MapPageClient() {
  const [params, setParams] = useUrlState(KEYS)
  const list =
    MOUNTAIN_LISTS.find((l) => l.key === params.list) ?? MOUNTAIN_LISTS[0]

  return (
    <>
      <div aria-label="表示するリスト" className={styles.tabs} role="group">
        {MOUNTAIN_LISTS.map((l) => (
          <button
            aria-pressed={l.key === list.key}
            key={l.key}
            onClick={() =>
              setParams(
                {
                  list: l.key === MOUNTAIN_LISTS[0].key ? null : l.key,
                  region: null,
                  pref: null,
                  q: null,
                } as Record<string, string | null>,
                { push: true }
              )
            }
            type="button"
          >
            {l.label}
          </button>
        ))}
      </div>
      <ListExplorer
        defaultView="map"
        headingId="map-list"
        key={list.key}
        listKey={list.key as MountainListKey}
      />
    </>
  )
}
