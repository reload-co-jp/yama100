import { notFound } from "next/navigation"
import CanonicalMountainDetailClient from "../../../components/CanonicalMountainDetailClient"
import {
  CANONICAL_MOUNTAINS,
  findCanonicalMountainBySlug,
} from "../../../lib/mountainCatalog"
import { fetchWikiThumbnail } from "../../../lib/site"

function SourceSection({
  entries,
  hideLabels,
  title,
}: {
  entries: { label: string; text: string }[]
  hideLabels?: string[]
  title: string
}) {
  if (entries.length === 0) return null

  return (
    <div
      style={{
        background: "#2a2a2a",
        borderRadius: "12px",
        marginTop: "16px",
        padding: "20px",
      }}
    >
      <h2
        style={{
          color: "#fff",
          fontSize: "1.05rem",
          margin: "0 0 14px",
        }}
      >
        {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {entries.map((entry) => {
          const visibleLabels = entry.label
            .split(" / ")
            .filter((label) => !hideLabels?.includes(label))
          return (
          <div key={`${title}-${entry.label}-${entry.text.slice(0, 24)}`}>
            {visibleLabels.length > 0 && (
              <p
                style={{
                  color: "#7ecfb3",
                  fontSize: ".8rem",
                  fontWeight: 700,
                  margin: "0 0 6px",
                }}
              >
                {visibleLabels.join(" / ")}
              </p>
            )}
            <p
              style={{
                color: "#ccc",
                fontSize: ".95rem",
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              {entry.text}
            </p>
          </div>
        )})}
      </div>
    </div>
  )
}

export function generateStaticParams() {
  return CANONICAL_MOUNTAINS.map((mountain) => ({ name: mountain.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const mountain = findCanonicalMountainBySlug(name)
  if (!mountain) return {}

  const imageUrl = await fetchWikiThumbnail(mountain.name)
  const canonicalPath = `/mountain/${mountain.slug}/`

  return {
    title: mountain.name,
    description: mountain.description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: `${mountain.name}（${mountain.elevation.toLocaleString()}m）`,
      description: mountain.description,
      url: canonicalPath,
      locale: "ja_JP",
      type: "article",
      ...(imageUrl ? { images: [{ url: imageUrl, alt: mountain.name }] } : {}),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: `${mountain.name}（${mountain.elevation.toLocaleString()}m）`,
      description: mountain.description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  }
}

export default async function CanonicalMountainPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const mountain = findCanonicalMountainBySlug(name)
  if (!mountain) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: mountain.name,
    description: mountain.description,
    url: `/mountain/${mountain.slug}/`,
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
  }

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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

      {mountain.aliases.length > 1 && (
        <p style={{ color: "#777", fontSize: ".85rem", margin: "0 0 16px" }}>
          別名・表記: {mountain.aliases.join(" / ")}
        </p>
      )}

      <p
        style={{
          color: "#ccc",
          fontSize: ".95rem",
          lineHeight: 1.8,
          margin: "0 0 16px",
        }}
      >
        {mountain.description}
      </p>

      <CanonicalMountainDetailClient
        mountain={mountain}
        memberships={mountain.memberships}
      />

      <SourceSection
        title="アクセス"
        entries={mountain.accessSources}
        hideLabels={["日本百名山"]}
      />

      <SourceSection
        title="モデルコース"
        entries={mountain.courseSources}
        hideLabels={["日本百名山"]}
      />

      <div
        style={{
          background: "#2a2a2a",
          borderRadius: "8px",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginTop: "16px",
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
    </div>
  )
}
