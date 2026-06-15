"use client"

import { useEffect, useRef } from "react"
import maplibregl from "maplibre-gl"
import type {
  GeoJSONSource,
  Map as MapLibreMap,
  MapLayerMouseEvent,
  Popup,
} from "maplibre-gl"

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
  hoveredId?: number | null
}

type MountainFeature = GeoJSON.Feature<
  GeoJSON.Point,
  {
    id: number
    name: string
    location: string
    elevation: string
    checked: boolean
  }
>

const MARKERS_SOURCE_ID = "mountains"
const MARKERS_LAYER_ID = "mountain-markers"
const MARKER_STROKE_LAYER_ID = "mountain-marker-strokes"

function toFeatureCollection(mountains: Mountain[], checked: Set<number>) {
  return {
    type: "FeatureCollection",
    features: mountains.map<MountainFeature>((mountain) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [mountain.longitude, mountain.latitude],
      },
      properties: {
        id: mountain.id,
        name: mountain.name,
        location: mountain.location.join("・"),
        elevation: mountain.elevation.toLocaleString(),
        checked: checked.has(mountain.id),
      },
    })),
  } satisfies GeoJSON.FeatureCollection<
    GeoJSON.Point,
    MountainFeature["properties"]
  >
}

export default function MountainMap({
  mountains,
  checked,
  onToggle,
  center,
  zoom,
  hoveredId,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const popupRef = useRef<Popup | null>(null)
  const onToggleRef = useRef(onToggle)
  const defaultCenterRef = useRef<[number, number]>(center || [37, 137])
  const defaultZoomRef = useRef<number>(
    zoom || (mountains.length === 1 ? 12 : 5)
  )

  useEffect(() => {
    onToggleRef.current = onToggle
  })

  // Map initialization (runs once)
  useEffect(() => {
    if (!containerRef.current) return

    let mounted = true

    const init = async () => {
      if (!mounted || !containerRef.current || mapRef.current) return

      const map = new maplibregl.Map({
        container: containerRef.current,
        center: center ? [center[1], center[0]] : [137, 37],
        zoom: zoom || (mountains.length === 1 ? 12 : 5),
        style: {
          version: 8,
          sources: {
            gsi: {
              type: "raster",
              tiles: [
                "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
              ],
              tileSize: 256,
              attribution:
                '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a>',
              maxzoom: 18,
            },
          },
          layers: [
            {
              id: "gsi",
              type: "raster",
              source: "gsi",
            },
          ],
        },
      })

      mapRef.current = map

      map.on("load", () => {
        map.addSource(MARKERS_SOURCE_ID, {
          type: "geojson",
          data: toFeatureCollection(mountains, checked),
        })

        map.addLayer({
          id: MARKERS_LAYER_ID,
          type: "circle",
          source: MARKERS_SOURCE_ID,
          paint: {
            "circle-color": [
              "case",
              ["boolean", ["get", "checked"], false],
              "#4caf50",
              "#1976d2",
            ],
            "circle-opacity": 0.85,
            "circle-radius": 7,
          },
        })

        map.addLayer({
          id: MARKER_STROKE_LAYER_ID,
          type: "circle",
          source: MARKERS_SOURCE_ID,
          paint: {
            "circle-color": "transparent",
            "circle-radius": 7,
            "circle-stroke-color": [
              "case",
              ["boolean", ["get", "checked"], false],
              "#4caf50",
              "#1976d2",
            ],
            "circle-stroke-width": 2,
          },
        })

        map.on("mouseenter", MARKERS_LAYER_ID, () => {
          map.getCanvas().style.cursor = "pointer"
        })

        map.on("mouseleave", MARKERS_LAYER_ID, () => {
          map.getCanvas().style.cursor = ""
        })

        map.on("click", MARKERS_LAYER_ID, (event: MapLayerMouseEvent) => {
          const feature = event.features?.[0] as unknown as
            | MountainFeature
            | undefined
          if (!feature) return

          const coordinates = feature.geometry.coordinates as [number, number]
          const { id, name, elevation, location } = feature.properties

          popupRef.current?.remove()
          popupRef.current = new maplibregl.Popup({ maxWidth: "200px" })
            .setLngLat(coordinates)
            .setHTML(
              `<div style="font-family:sans-serif;line-height:1.5">
                <strong>${name}</strong><br>
                ${elevation}m &nbsp;${location}
              </div>`
            )
            .addTo(map)

          onToggleRef.current(id)
        })
      })
    }

    init()

    return () => {
      mounted = false
      popupRef.current?.remove()
      popupRef.current = null
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync marker colors when checked state changes
  useEffect(() => {
    const source = mapRef.current?.getSource(MARKERS_SOURCE_ID) as
      | GeoJSONSource
      | undefined
    source?.setData(toFeatureCollection(mountains, checked))
  }, [checked, mountains])

  // Zoom to hovered mountain
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (hoveredId != null) {
      const mountain = mountains.find((m) => m.id === hoveredId)
      if (mountain) {
        map.flyTo({ center: [mountain.longitude, mountain.latitude], zoom: 10 })
      }
    } else {
      map.flyTo({
        center: [defaultCenterRef.current[1], defaultCenterRef.current[0]],
        zoom: defaultZoomRef.current,
      })
    }
  }, [hoveredId, mountains])

  return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
}
