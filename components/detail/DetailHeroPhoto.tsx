"use client"

import { useState } from "react"
import MountainPhoto, { getWikiTitle } from "../MountainPhoto"

export default function DetailHeroPhoto({ name }: { name: string }) {
  const [page, setPage] = useState<string | null>(null)
  const [hasPhoto, setHasPhoto] = useState(false)
  return (
    <>
      <MountainPhoto
        eager
        name={name}
        onLoaded={(info) => {
          setHasPhoto(Boolean(info))
          setPage(info?.page ?? null)
        }}
        width={1280}
      />
      {hasPhoto && (
        <a
          href={
            page ??
            `https://ja.wikipedia.org/wiki/${encodeURIComponent(getWikiTitle(name))}`
          }
          rel="noopener noreferrer"
          style={{
            background: "rgba(16,41,31,.6)",
            borderRadius: 999,
            bottom: 8,
            color: "#fff",
            fontSize: ".6875rem",
            padding: "2px 10px",
            position: "absolute",
            right: 8,
            textDecoration: "none",
          }}
          target="_blank"
        >
          写真: Wikipedia
        </a>
      )}
    </>
  )
}
