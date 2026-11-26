"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"

const URL_EVENT = "yama100:urlchange"

function subscribe(listener: () => void) {
  window.addEventListener("popstate", listener)
  window.addEventListener(URL_EVENT, listener)
  return () => {
    window.removeEventListener("popstate", listener)
    window.removeEventListener(URL_EVENT, listener)
  }
}

const getSearch = () => window.location.search
const getServerSearch = () => ""

/**
 * URL クエリパラメータを状態として扱うフック。
 * - push: true の変更は履歴に積まれ、ブラウザの戻る操作で元に戻せる
 * - 指定キー以外のパラメータ（共有URLの data など）は保持する
 */
export function useUrlState<K extends string>(keys: readonly K[]) {
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch)

  const params = useMemo(() => {
    const sp = new URLSearchParams(search)
    const result = {} as Record<K, string>
    for (const key of keys) result[key] = sp.get(key) ?? ""
    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, keys.join(",")])

  const setParams = useCallback(
    (
      patch: Partial<Record<K, string | null>>,
      options: { push?: boolean } = {}
    ) => {
      const url = new URL(window.location.href)
      for (const [key, value] of Object.entries(patch) as [
        K,
        string | null | undefined,
      ][]) {
        if (value === null || value === undefined || value === "")
          url.searchParams.delete(key)
        else url.searchParams.set(key, value)
      }
      const next = `${url.pathname}${url.search}${url.hash}`
      if (
        next ===
        `${window.location.pathname}${window.location.search}${window.location.hash}`
      )
        return
      if (options.push) window.history.pushState(window.history.state, "", next)
      else window.history.replaceState(window.history.state, "", next)
      window.dispatchEvent(new Event(URL_EVENT))
    },
    []
  )

  return [params, setParams] as const
}
