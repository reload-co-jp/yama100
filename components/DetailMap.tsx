"use client"

import { lazy, Suspense } from "react"
import { useMountainDetail } from "./MountainDetailClient"

const MountainMap = lazy(() => import("./MountainMap"))

type Mountain = {
  id: number
  name: string
  description: string
  location: string[]
  latitude: number
  longitude: number
  elevation: number
}

type Props = {
  mountain: Mountain
  storageKey: string
}

export default function DetailMap({ mountain, storageKey }: Props) {
  const { checked, toggle } = useMountainDetail(storageKey, mountain.id)

  return (
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
              height: "100%",
              background: "#2a2a2a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#aaa",
            }}
          >
            地図を読み込み中…
          </div>
        }
      >
        <MountainMap
          mountains={[mountain]}
          checked={checked}
          onToggle={toggle}
          center={[mountain.latitude, mountain.longitude]}
        />
      </Suspense>
    </div>
  )
}
