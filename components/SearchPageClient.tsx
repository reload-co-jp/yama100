"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  CANONICAL_MOUNTAINS,
  getMountainPagePath,
} from "../lib/mountainCatalog"

function normalize(text: string) {
  return text.normalize("NFKC").toLowerCase()
}

export default function SearchPageClient() {
  const searchParams = useSearchParams()
  const query = (searchParams.get("q") ?? "").trim()
  const normalizedQuery = normalize(query)

  const results = query
    ? CANONICAL_MOUNTAINS.filter((mountain) =>
        normalize(mountain.name).includes(normalizedQuery)
      ).sort((a, b) => a.name.localeCompare(b.name, "ja"))
    : []

  return (
    <div style={{ margin: "0 auto", maxWidth: "880px" }}>
      <div
        style={{
          background: "#2a2a2a",
          borderRadius: "12px",
          marginBottom: "16px",
          padding: "20px",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            margin: "0 0 10px",
          }}
        >
          山名検索
        </h1>
        <p style={{ color: "#aaa", lineHeight: 1.7, margin: 0 }}>
          百名山・二百名山・三百名山・花の百名山・マイナー12名山・新日本百名山を横断して検索します。
        </p>
      </div>

      <div
        style={{
          background: "#2a2a2a",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        {query ? (
          <>
            <p style={{ color: "#ccc", margin: "0 0 16px" }}>
              「{query}」の検索結果 {results.length}件
            </p>
            {results.length > 0 ? (
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                }}
              >
                {results.map((mountain) => (
                  <li
                    key={mountain.canonicalName}
                    style={{
                      background: "#242424",
                      borderLeft: "4px solid #4caf50",
                      borderRadius: "8px",
                      padding: "14px 16px",
                    }}
                  >
                    <div
                      style={{
                        alignItems: "baseline",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginBottom: "6px",
                      }}
                    >
                      <Link
                        href={getMountainPagePath(mountain.name)}
                        style={{
                          color: "#fff",
                          fontSize: "1rem",
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        {mountain.name}
                      </Link>
                      <span style={{ color: "#aaa", fontSize: ".85rem" }}>
                        {mountain.elevation.toLocaleString()}m
                      </span>
                      <span style={{ color: "#777", fontSize: ".8rem" }}>
                        {mountain.location.join("・")}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        marginBottom: "8px",
                      }}
                    >
                      {mountain.memberships.map((membership) => (
                        <span
                          key={`${mountain.canonicalName}-${membership.listKey}`}
                          style={{
                            background: "#303030",
                            borderRadius: "999px",
                            color: "#7ecfb3",
                            fontSize: ".75rem",
                            padding: "4px 10px",
                          }}
                        >
                          {membership.label}
                        </span>
                      ))}
                    </div>
                    <p
                      style={{
                        color: "#aaa",
                        fontSize: ".9rem",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {mountain.description}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div
                style={{
                  background: "#242424",
                  borderRadius: "8px",
                  color: "#aaa",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                「{query}」に一致する山はありません
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              background: "#242424",
              borderRadius: "8px",
              color: "#aaa",
              padding: "20px",
              textAlign: "center",
            }}
          >
            ヘッダーの検索ボックスから山名を入力してください
          </div>
        )}
      </div>
    </div>
  )
}
