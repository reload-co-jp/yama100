"use client"

import { lazy, Suspense, useEffect, useMemo, useState } from "react"
import MountainPhoto from "./MountainPhoto"
import {
  CanonicalMountainMembership,
  MountainRecord,
} from "../lib/mountainCatalog"

const MountainMap = lazy(() => import("./MountainMap"))

const _listeners: Record<string, Set<() => void>> = {}

function readChecked(storageKey: string) {
  try {
    const stored = localStorage.getItem(storageKey)
    if (!stored) return new Set<number>()
    const { checked } = JSON.parse(stored)
    return Array.isArray(checked) ? new Set<number>(checked) : new Set<number>()
  } catch {
    return new Set<number>()
  }
}

function writeChecked(storageKey: string, checked: Set<number>) {
  localStorage.setItem(storageKey, JSON.stringify({ checked: [...checked] }))
  _listeners[storageKey]?.forEach((listener) => listener())
}

function subscribe(storageKey: string, listener: () => void) {
  if (!_listeners[storageKey]) _listeners[storageKey] = new Set()
  _listeners[storageKey].add(listener)
  return () => {
    _listeners[storageKey].delete(listener)
  }
}

function useCanonicalMountainStatus(memberships: CanonicalMountainMembership[]) {
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])

  useEffect(() => {
    const update = () => {
      setCheckedKeys(
        memberships
          .filter((membership) => readChecked(membership.storageKey).has(membership.id))
          .map((membership) => `${membership.storageKey}:${membership.id}`)
      )
    }

    update()
    const unsubscribers = memberships.map((membership) =>
      subscribe(membership.storageKey, update)
    )
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe())
    }
  }, [memberships])

  const checkedSet = useMemo(() => new Set(checkedKeys), [checkedKeys])
  const checkedCount = memberships.filter((membership) =>
    checkedSet.has(`${membership.storageKey}:${membership.id}`)
  ).length
  const allChecked = memberships.length > 0 && checkedCount === memberships.length
  const anyChecked = checkedCount > 0

  const toggleAll = () => {
    const nextChecked = !allChecked
    memberships.forEach((membership) => {
      const next = readChecked(membership.storageKey)
      if (nextChecked) next.add(membership.id)
      else next.delete(membership.id)
      writeChecked(membership.storageKey, next)
    })
  }

  return { allChecked, anyChecked, checkedCount, checkedSet, toggleAll }
}

type Props = {
  memberships: CanonicalMountainMembership[]
  mountain: Pick<
    MountainRecord,
    "description" | "elevation" | "id" | "latitude" | "location" | "longitude" | "name"
  >
}

export default function CanonicalMountainDetailClient({
  memberships,
  mountain,
}: Props) {
  const { allChecked, anyChecked, checkedCount, checkedSet, toggleAll } =
    useCanonicalMountainStatus(memberships)

  const mapChecked = anyChecked ? new Set([mountain.id]) : new Set<number>()

  return (
    <>
      <div
        style={{
          background: "#2a2a2a",
          borderRadius: "12px",
          marginBottom: "16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "50vh",
            overflow: "hidden",
            position: "relative",
            width: "100%",
          }}
        >
          <div style={{ height: "100%", width: "100%" }}>
            <MountainPhoto name={mountain.name} size="full" />
          </div>
          {anyChecked && (
            <div
              style={{
                background: "rgba(38,166,154,0.85)",
                borderRadius: "4px",
                color: "#fff",
                fontSize: ".8rem",
                fontWeight: 600,
                padding: "4px 10px",
                position: "absolute",
                right: "12px",
                top: "12px",
              }}
            >
              {checkedCount} / {memberships.length} リストで登頂済
            </div>
          )}
        </div>

        <div style={{ padding: "12px 24px 24px" }}>
          <button
            onClick={toggleAll}
            style={{
              background: allChecked ? "#173431" : "#2a2a2a",
              border: `2px solid ${allChecked ? "#26a69a" : "#555"}`,
              borderRadius: "6px",
              color: allChecked ? "#26a69a" : "#aaa",
              cursor: "pointer",
              fontSize: ".9rem",
              fontWeight: 600,
              padding: "8px 20px",
              transition: "all .2s",
              width: "100%",
            }}
          >
            {allChecked ? "✓ 関連する全リストで登頂済み" : "関連する全リストに登頂済みを反映"}
          </button>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "14px",
            }}
          >
            {memberships.map((membership) => {
              const key = `${membership.storageKey}:${membership.id}`
              const isChecked = checkedSet.has(key)
              return (
                <a
                  key={key}
                  href={membership.listHref}
                  style={{
                    background: isChecked ? membership.themeColor : "#303030",
                    borderRadius: "999px",
                    color: isChecked ? "#fff" : "#ccc",
                    fontSize: ".8rem",
                    padding: "6px 12px",
                    textDecoration: "none",
                  }}
                >
                  {membership.label} #{membership.id} {isChecked ? "✓" : ""}
                </a>
              )
            })}
          </div>
        </div>
      </div>

      <div
        style={{
          height: "250px",
          marginTop: "16px",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Suspense
          fallback={
            <div
              style={{
                alignItems: "center",
                background: "#2a2a2a",
                color: "#aaa",
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
            mountains={[mountain]}
            checked={mapChecked}
            onToggle={toggleAll}
            center={[mountain.latitude, mountain.longitude]}
          />
        </Suspense>
      </div>
    </>
  )
}
