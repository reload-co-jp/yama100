"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function HeaderSearch() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") ?? "")

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "")
  }, [searchParams])

  return (
    <form
      action="/search"
      method="get"
      style={{
        display: "flex",
        gap: "8px",
        maxWidth: "360px",
        width: "100%",
      }}
    >
      <input
        aria-label="山の名前で検索"
        name="q"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="山の名前で検索"
        style={{
          background: "#262626",
          border: "1px solid #4a4a4a",
          borderRadius: "999px",
          color: "#f5f5f5",
          flex: 1,
          fontSize: ".875rem",
          minWidth: 0,
          padding: "8px 14px",
        }}
        value={query}
      />
      <button
        style={{
          background: "#4caf50",
          border: "none",
          borderRadius: "999px",
          color: "#fff",
          cursor: "pointer",
          flexShrink: 0,
          fontSize: ".8rem",
          fontWeight: 700,
          padding: "8px 14px",
        }}
        type="submit"
      >
        検索
      </button>
    </form>
  )
}
