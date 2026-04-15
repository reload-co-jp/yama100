"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

function getSearchTarget(pathname: string) {
  if (pathname.startsWith("/mountains200")) return "/mountains200/"
  if (pathname.startsWith("/mountains300")) return "/mountains300/"
  if (pathname.startsWith("/mountains_flowers")) return "/mountains_flowers/"
  if (pathname.startsWith("/mountains")) return "/"
  return "/"
}

export default function HeaderSearch() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const target = useMemo(() => getSearchTarget(pathname), [pathname])
  const [query, setQuery] = useState(searchParams.get("q") ?? "")

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "")
  }, [searchParams])

  return (
    <form
      action={target}
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
