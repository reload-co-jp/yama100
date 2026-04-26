import Link from "next/link"
import MountainDetailClient from "./MountainDetailClient"
import DetailMap from "./DetailMap"
import RelatedMountainLinks from "./RelatedMountainLinks"
import {
  MountainDetailPageConfig,
} from "../lib/mountainDetailPage"
import { MountainRecord } from "../lib/mountainCatalog"
import { SITE_URL } from "../lib/site"

type Props = {
  config: MountainDetailPageConfig
  mountain: MountainRecord
  next: MountainRecord | null
  prev: MountainRecord | null
}

export default function MountainDetailPage({
  config,
  mountain,
  next,
  prev,
}: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: mountain.name,
    description: mountain.description,
    url: `${config.canonicalPrefix}${mountain.id}/`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: mountain.latitude,
      longitude: mountain.longitude,
      elevation: mountain.elevation,
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: mountain.location.join("・"),
      addressCountry: "JP",
    },
    additionalProperty: {
      "@type": "PropertyValue",
      name: "標高",
      value: `${mountain.elevation.toLocaleString()}m`,
    },
    isPartOf: {
      "@type": "ItemList",
      name: config.listTitle,
      url: `${SITE_URL}${config.backHref}`,
    },
  }

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ marginBottom: "20px" }}>
        <Link
          href={config.backHref}
          style={{
            color: config.backLinkColor,
            fontSize: ".875rem",
            textDecoration: "none",
          }}
        >
          {config.backLabel}
        </Link>
      </div>

      <div
        style={{
          background: "#2a2a2a",
          borderRadius: "12px",
          marginBottom: "16px",
          overflow: "hidden",
        }}
      >
        <MountainDetailClient
          mountain={mountain}
          storageKey={config.storageKey}
          themeColor={config.themeColor}
          overlayColor={config.overlayColor}
          activeBgColor={config.activeBgColor}
        />

        <div style={{ padding: "24px" }}>
          <div
            style={{
              alignItems: "baseline",
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <h1
              style={{
                color: "#fff",
                fontSize: "clamp(1.5rem, 4vw, 2rem)",
                fontWeight: 700,
                margin: 0,
              }}
            >
              {mountain.name}
            </h1>
            <span style={{ color: "#aaa", fontSize: "1rem" }}>
              {mountain.elevation.toLocaleString()}m
            </span>
          </div>

          <p style={{ color: "#888", fontSize: ".875rem", margin: "0 0 16px" }}>
            {mountain.location.join("・")}
          </p>

          <p
            style={{
              color: "#ccc",
              fontSize: ".95rem",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            {mountain.description}
          </p>

          <RelatedMountainLinks
            currentList={config.currentList}
            mountain={mountain}
          />

          <DetailMap mountain={mountain} storageKey={config.storageKey} />
        </div>
      </div>

      <div
        style={{
          background: "#2a2a2a",
          borderRadius: "8px",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "16px",
          padding: "16px",
        }}
      >
        <a
          href={`https://maps.gsi.go.jp/#15/${mountain.latitude}/${mountain.longitude}/`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#1976d2",
            borderRadius: "4px",
            color: "#fff",
            fontSize: ".875rem",
            padding: "6px 14px",
            textDecoration: "none",
          }}
        >
          国土地理院地図 →
        </a>
        <a
          href={`https://ja.wikipedia.org/wiki/${encodeURIComponent(mountain.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#3a3a3a",
            borderRadius: "4px",
            color: "#ccc",
            fontSize: ".875rem",
            padding: "6px 14px",
            textDecoration: "none",
          }}
        >
          Wikipedia →
        </a>
        <a
          href={`https://yamap.com/search/activities?keyword=${encodeURIComponent(mountain.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#3a3a3a",
            borderRadius: "4px",
            color: "#ccc",
            fontSize: ".875rem",
            padding: "6px 14px",
            textDecoration: "none",
          }}
        >
          YAMAP →
        </a>
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "space-between",
        }}
      >
        {prev ? (
          <Link
            href={`${config.canonicalPrefix}${prev.id}/`}
            style={{
              background: "#2a2a2a",
              borderRadius: "8px",
              color: "#ccc",
              fontSize: ".875rem",
              padding: "12px 16px",
              textDecoration: "none",
              flex: 1,
            }}
          >
            ← {prev.name}
          </Link>
        ) : (
          <div style={{ flex: 1 }} />
        )}
        {next ? (
          <Link
            href={`${config.canonicalPrefix}${next.id}/`}
            style={{
              background: "#2a2a2a",
              borderRadius: "8px",
              color: "#ccc",
              flex: 1,
              fontSize: ".875rem",
              padding: "12px 16px",
              textAlign: "right",
              textDecoration: "none",
            }}
          >
            {next.name} →
          </Link>
        ) : (
          <div style={{ flex: 1 }} />
        )}
      </div>
    </div>
  )
}
