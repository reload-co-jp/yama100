import { notFound } from "next/navigation"
import Link from "next/link"
import mountainsData from "../../../public/mountains.json"
import MountainDetailClient from "../../../components/MountainDetailClient"

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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const mountain = mountains.find((m) => m.id === Number(id))
  if (!mountain) return {}
  return {
    title: `${mountain.name} - 日本百名山`,
    description: mountain.description,
  }
}

export default async function MountainPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const mountain = mountains.find((m) => m.id === Number(id))
  if (!mountain) notFound()

  const prev = mountains.find((m) => m.id === mountain.id - 1) ?? null
  const next = mountains.find((m) => m.id === mountain.id + 1) ?? null

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      {/* Back link */}
      <div style={{ marginBottom: "20px" }}>
        <Link
          href="/"
          style={{
            color: "#7ecfb3",
            fontSize: ".875rem",
            textDecoration: "none",
          }}
        >
          ← 一覧に戻る
        </Link>
      </div>

      {/* Header */}
      <div
        style={{
          background: "#2a2a2a",
          borderRadius: "12px",
          marginBottom: "16px",
          overflow: "hidden",
        }}
      >
        {/* Photo */}
        <MountainDetailClient mountain={mountain} />

        {/* Info */}
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
        </div>
      </div>

      {/* External links */}
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
      </div>

      {/* Prev / Next navigation */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "space-between",
        }}
      >
        {prev ? (
          <Link
            href={`/mountains/${prev.id}/`}
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
            href={`/mountains/${next.id}/`}
            style={{
              background: "#2a2a2a",
              borderRadius: "8px",
              color: "#ccc",
              fontSize: ".875rem",
              padding: "12px 16px",
              textDecoration: "none",
              flex: 1,
              textAlign: "right",
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
