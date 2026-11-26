"use client"

import { useSearchParams } from "next/navigation"
import { SearchIcon } from "./ui/Icons"
import styles from "./HeaderSearch.module.css"

export default function HeaderSearch({
  id = "header-search",
}: {
  id?: string
}) {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") ?? ""

  return (
    <form action="/search/" className={styles.form} method="get" role="search">
      <label className="visually-hidden" htmlFor={id}>
        山の名前で検索
      </label>
      <SearchIcon className={styles.icon} size={18} />
      <input
        className={styles.input}
        defaultValue={query}
        enterKeyHint="search"
        id={id}
        key={query}
        name="q"
        placeholder="山の名前で検索"
        type="search"
      />
    </form>
  )
}
