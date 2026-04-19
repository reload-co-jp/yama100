import { notFound } from "next/navigation"
import Link from "next/link"
import mountainsData from "../../../public/mountains_new100.json"
import MountainDetailClient from "../../../components/MountainDetailClient"
import DetailMap from "../../../components/DetailMap"
import RelatedMountainLinks from "../../../components/RelatedMountainLinks"
import { fetchWikiThumbnail } from "../../../lib/site"

type Mountain = {
  id: number
  name: string
  description: string
  location: string[]
  latitude: number
  longitude: number
  elevation: number
}

const mountains = mountainsData as Mountain[]

export function generateStaticParams() {
  return mountains.map((m) => ({ id: String(m.id) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const mountain = mountains.find((m) => m.id === Number(id))
  if (!mountain) return {}

  const imageUrl = await fetchWikiThumbnail(mountain.name)
  const canonicalPath = `/mountains_new100/${mountain.id}/`
  const ogTitle = `${mountain.name}（${mountain.elevation.toLocaleString()}m）- 新日本百名山`

  return {
    title: mountain.name,
    description: mountain.description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: ogTitle,
      description: mountain.description,
      url: canonicalPath,
      locale: "ja_JP",
      type: "article",
      ...(imageUrl ? { images: [{ url: imageUrl, alt: mountain.name }] } : {}),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: ogTitle,
      description: mountain.description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  }
}

export default async function MountainNew100Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const mountain = mountains.find((m) => m.id === Number(id))
  if (!mountain) notFound()

  const idx = mountains.indexOf(mountain)
  const prev = idx > 0 ? mountains[idx - 1] : null
  const next = idx < mountains.length - 1 ? mountains[idx + 1] : null

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: mountain.name,
    description: mountain.description,
    url: `/mountains_new100/${mountain.id}/`,
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

      <div style={{ marginBottom: "20px" }}>
        <Link
          href="/mountains_new100/"
          style={{
            color: "#26a69a",
            fontSize: ".875rem",
            textDecoration: "none",
          }}
        >
          ← 新日本百名山一覧に戻る
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
          storageKey="yama_new100"
          themeColor="#26a69a"
          overlayColor="rgba(38,166,154,0.85)"
          activeBgColor="#173431"
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
            currentList="mountains_new100"
            mountain={mountain}
          />

          <DetailMap mountain={mountain} storageKey="yama_new100" />
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
            href={`/mountains_new100/${prev.id}/`}
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
            href={`/mountains_new100/${next.id}/`}
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
