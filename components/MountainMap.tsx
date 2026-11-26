"use client"

import { useEffect, useRef } from "react"
import maplibregl from "maplibre-gl"
import type {
  GeoJSONSource,
  Map as MapLibreMap,
  MapLayerMouseEvent,
  Popup,
} from "maplibre-gl"
import type { Feature, FeatureCollection, Point } from "geojson"

export type MapMountain = {
  id: number
  name: string
  location: string[]
  latitude: number
  longitude: number
  elevation: number
  href?: string
}

type Props = {
  mountains: MapMountain[]
  checked: Set<number>
  /** 指定するとポップアップに登頂状態の切り替えボタンを表示する */
  onToggle?: (id: number) => void
  center?: [number, number]
  zoom?: number
  /** mountains が変わったときに全体が収まるよう表示範囲を調整する */
  fitToMountains?: boolean
  label?: string
}

type MountainFeature = Feature<
  Point,
  {
    id: number
    name: string
    location: string
    elevation: string
    href: string
    checked: boolean
  }
>

const MARKERS_SOURCE_ID = "mountains"
const MARKERS_LAYER_ID = "mountain-markers"

const CLIMBED_COLOR = "#2f7a57"
const UNCLIMBED_COLOR = "#ffffff"
const UNCLIMBED_STROKE = "#1c5585"

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (ch) =>
    ch === "&"
      ? "&amp;"
      : ch === "<"
        ? "&lt;"
        : ch === ">"
          ? "&gt;"
          : ch === '"'
            ? "&quot;"
            : "&#39;"
  )
}

function toFeatureCollection(mountains: MapMountain[], checked: Set<number>) {
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
        elevation: mountain.elevation.toLocaleString("ja-JP"),
        href: mountain.href ?? `/mountain/${mountain.id}/`,
        checked: checked.has(mountain.id),
      },
    })),
  } satisfies FeatureCollection<Point, MountainFeature["properties"]>
}

function boundsOf(mountains: MapMountain[]) {
  const bounds = new maplibregl.LngLatBounds()
  mountains.forEach((m) => bounds.extend([m.longitude, m.latitude]))
  return bounds
}

export default function MountainMap({
  mountains,
  checked,
  onToggle,
  center,
  zoom,
  fitToMountains = false,
  label = "山の位置を示す地図",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const popupRef = useRef<Popup | null>(null)
  const onToggleRef = useRef(onToggle)
  const loadedRef = useRef(false)
  const dataRef = useRef({ mountains, checked })

  useEffect(() => {
    onToggleRef.current = onToggle
    dataRef.current = { mountains, checked }
  })

  // Map initialization (runs once)
  useEffect(() => {
    if (!containerRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      center: center ? [center[1], center[0]] : [137.5, 37.5],
      zoom: zoom ?? (mountains.length === 1 ? 11 : 4.3),
      attributionControl: { compact: true },
      cooperativeGestures: false,
      style: {
        version: 8,
        sources: {
          gsi: {
            type: "raster",
            tiles: [
              "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution:
              '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener noreferrer">国土地理院</a>',
            maxzoom: 18,
          },
        },
        layers: [{ id: "gsi", type: "raster", source: "gsi" }],
      },
    })
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right"
    )
    mapRef.current = map

    map.on("load", () => {
      loadedRef.current = true
      const { mountains: currentMountains, checked: currentChecked } =
        dataRef.current
      map.addSource(MARKERS_SOURCE_ID, {
        type: "geojson",
        data: toFeatureCollection(currentMountains, currentChecked),
      })

      map.addLayer({
        id: MARKERS_LAYER_ID,
        type: "circle",
        source: MARKERS_SOURCE_ID,
        paint: {
          "circle-color": [
            "case",
            ["boolean", ["get", "checked"], false],
            CLIMBED_COLOR,
            UNCLIMBED_COLOR,
          ],
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4,
            5,
            8,
            7,
            12,
            10,
            16,
            14,
          ],
          "circle-stroke-color": [
            "case",
            ["boolean", ["get", "checked"], false],
            "#ffffff",
            UNCLIMBED_STROKE,
          ],
          "circle-stroke-width": 2,
        },
      })

      if (fitToMountains && currentMountains.length > 1) {
        map.fitBounds(boundsOf(currentMountains), {
          padding: 40,
          duration: 0,
          maxZoom: 9,
        })
      }

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
        const {
          id,
          name,
          elevation,
          location,
          href,
          checked: isChecked,
        } = feature.properties
        const canToggle = Boolean(onToggleRef.current)

        popupRef.current?.remove()
        popupRef.current = new maplibregl.Popup({
          maxWidth: "240px",
          focusAfterOpen: true,
        })
          .setLngLat(coordinates)
          .setHTML(
            `<div style="line-height:1.6;color:#1b2420;min-width:170px">
              <div style="display:inline-block;font-size:11px;font-weight:700;border-radius:999px;padding:1px 8px;margin-bottom:4px;${
                isChecked
                  ? "background:#e2efe7;color:#1e4d3a"
                  : "background:#efeee7;color:#4f5a54"
              }">${isChecked ? "✓ 登頂済" : "未登頂"}</div>
              <div style="font-weight:700;font-size:15px">${escapeHtml(name)}</div>
              <div style="font-size:13px;color:#4f5a54">${escapeHtml(elevation)}m ・ ${escapeHtml(location)}</div>
              <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
                ${
                  canToggle
                    ? `<button type="button" data-role="toggle" style="min-height:36px;padding:4px 12px;border-radius:999px;border:1.5px solid #1e4d3a;background:${
                        isChecked ? "#1e4d3a;color:#fff" : "#fff;color:#1e4d3a"
                      };font-weight:700;font-size:13px;cursor:pointer">${isChecked ? "✓ 登頂済み" : "登頂済みにする"}</button>`
                    : ""
                }
                <a href="${escapeHtml(href)}" style="display:inline-flex;align-items:center;min-height:36px;padding:4px 12px;border-radius:999px;background:#f0f7f2;color:#1e4d3a;font-weight:700;font-size:13px;text-decoration:none">詳細を見る →</a>
              </div>
            </div>`
          )
          .addTo(map)

        popupRef.current
          .getElement()
          ?.querySelector("[data-role=toggle]")
          ?.addEventListener("click", () => {
            onToggleRef.current?.(id)
            popupRef.current?.remove()
          })
      })
    })

    return () => {
      loadedRef.current = false
      popupRef.current?.remove()
      popupRef.current = null
      map.remove()
      mapRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync markers when data changes
  useEffect(() => {
    const map = mapRef.current
    if (!map || !loadedRef.current) return
    const source = map.getSource(MARKERS_SOURCE_ID) as GeoJSONSource | undefined
    source?.setData(toFeatureCollection(mountains, checked))
  }, [checked, mountains])

  // Fit bounds when the set of mountains changes (filters)
  useEffect(() => {
    const map = mapRef.current
    if (!map || !loadedRef.current || !fitToMountains || mountains.length === 0)
      return
    if (mountains.length === 1) {
      map.flyTo({
        center: [mountains[0].longitude, mountains[0].latitude],
        zoom: 10,
      })
    } else {
      map.fitBounds(boundsOf(mountains), { padding: 40, maxZoom: 9 })
    }
  }, [mountains, fitToMountains])

  return (
    <div
      aria-label={label}
      ref={containerRef}
      role="region"
      style={{ height: "100%", width: "100%" }}
    />
  )
}
