"use client"

import { useEffect, useRef } from "react"
import type { Map as LeafletMap, CircleMarker } from "leaflet"

type Mountain = {
  id: number
  name: string
  location: string[]
  latitude: number
  longitude: number
  elevation: number
}

type Props = {
  mountains: Mountain[]
  checked: Set<number>
  onToggle: (id: number) => void
  center?: [number, number]
  zoom?: number
}

function markerStyle(isChecked: boolean) {
  return {
    color: isChecked ? "#4caf50" : "#1976d2",
    fillColor: isChecked ? "#4caf50" : "#1976d2",
    fillOpacity: 0.85,
    radius: 7,
    weight: 2,
  }
}

export default function MountainMap({ mountains, checked, onToggle, center, zoom }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const markersRef = useRef(new Map<number, CircleMarker>())
  const onToggleRef = useRef(onToggle)

  useEffect(() => {
    onToggleRef.current = onToggle
  })

  // Map initialization (runs once)
  useEffect(() => {
    if (!containerRef.current) return

    let mounted = true

    const init = async () => {
      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css" as string)

      if (!mounted || !containerRef.current || mapRef.current) return

      const map = L.map(containerRef.current, {
        center: center || [37, 137],
        zoom: zoom || (mountains.length === 1 ? 12 : 5),
      })

      L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png", {
        attribution:
          '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a>',
        maxZoom: 18,
      }).addTo(map)

      mapRef.current = map

      mountains.forEach((m) => {
        const isChecked = checked.has(m.id)
        const marker = L.circleMarker(
          [m.latitude, m.longitude],
          markerStyle(isChecked)
        )
          .addTo(map)
          .bindPopup(
            `<div style="font-family:sans-serif;line-height:1.5">
              <strong>${m.name}</strong><br>
              ${m.elevation.toLocaleString()}m &nbsp;${m.location.join("・")}
            </div>`,
            { maxWidth: 200 }
          )

        marker.on("click", () => onToggleRef.current(m.id))
        markersRef.current.set(m.id, marker)
      })
    }

    init()

    const markers = markersRef.current
    return () => {
      mounted = false
      mapRef.current?.remove()
      mapRef.current = null
      markers.clear()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps


  // Sync marker colors when checked state changes
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const isChecked = checked.has(id)
      marker.setStyle(markerStyle(isChecked))
    })
  }, [checked])

  return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
}
