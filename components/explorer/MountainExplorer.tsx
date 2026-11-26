"use client"

import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { DIFFICULTY_LEVELS, type DifficultyLevel } from "../../lib/mountainMeta"
import { PREFECTURE_ORDER, prefectureIndex, REGIONS } from "../../lib/regions"
import { normalizeDateKey } from "../../lib/summitStore"
import {
  CloseIcon,
  FilterIcon,
  ListIcon,
  MapIcon,
  SearchIcon,
} from "../ui/Icons"
import MountainCard from "./MountainCard"
import type { ExplorerItem, ItemStatus } from "./types"
import { useUrlState } from "./useUrlState"
import styles from "./MountainExplorer.module.css"

const MountainMap = lazy(() => import("../MountainMap"))

export const SORT_OPTIONS = [
  { value: "number", label: "番号順" },
  { value: "latitude", label: "北から順" },
  { value: "elevation", label: "標高が高い順" },
  { value: "elevation_asc", label: "標高が低い順" },
  { value: "name", label: "名前順" },
  { value: "status", label: "未登頂を先に" },
  { value: "status_climbed", label: "登頂済みを先に" },
  { value: "recent", label: "最近登った順" },
  { value: "prefecture", label: "都道府県別" },
] as const
export type SortValue = (typeof SORT_OPTIONS)[number]["value"]

const ELEVATION_BANDS = [
  { value: "lt1500", label: "1,500m未満", test: (e: number) => e < 1500 },
  {
    value: "1500-2000",
    label: "1,500〜1,999m",
    test: (e: number) => e >= 1500 && e < 2000,
  },
  {
    value: "2000-2500",
    label: "2,000〜2,499m",
    test: (e: number) => e >= 2000 && e < 2500,
  },
  {
    value: "2500-3000",
    label: "2,500〜2,999m",
    test: (e: number) => e >= 2500 && e < 3000,
  },
  { value: "gte3000", label: "3,000m以上", test: (e: number) => e >= 3000 },
] as const

const DIFFICULTY_PARAM: Record<string, DifficultyLevel> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
}
const DIFFICULTY_TO_PARAM: Record<DifficultyLevel, string> = {
  初級: "beginner",
  中級: "intermediate",
  上級: "advanced",
}

const URL_KEYS = [
  "q",
  "region",
  "pref",
  "status",
  "elev",
  "diff",
  "sort",
  "view",
] as const
const PAGE_SIZE = 60

function normalizeText(text: string) {
  return text.normalize("NFKC").toLowerCase().replace(/\s+/g, "")
}

type Props = {
  items: ExplorerItem[]
  getStatus: (item: ExplorerItem) => ItemStatus
  onToggle?: (item: ExplorerItem) => void
  /** 例: 「日本百名山」 */
  title: string
  headingId?: string
  defaultSort?: SortValue
  /** ツールバーの上に表示する要素（進捗やシェアボタンなど） */
  summary?: ReactNode
  showNumberSort?: boolean
  showDifficulty?: boolean
  defaultView?: "list" | "map"
}

export default function MountainExplorer({
  items,
  getStatus,
  onToggle,
  title,
  headingId = "explorer-heading",
  defaultSort = "number",
  summary,
  showNumberSort = true,
  showDifficulty = true,
  defaultView = "list",
}: Props) {
  const [params, setParams] = useUrlState(URL_KEYS)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [queryDraft, setQueryDraft] = useState<string | null>(null)

  const sortOptions = SORT_OPTIONS.filter(
    (option) => showNumberSort || option.value !== "number"
  )
  const sort: SortValue = (
    sortOptions.some((o) => o.value === params.sort) ? params.sort : defaultSort
  ) as SortValue
  const view =
    params.view === "map" || params.view === "list" ? params.view : defaultView
  const status =
    params.status === "climbed" || params.status === "unclimbed"
      ? params.status
      : ""
  const difficulty = DIFFICULTY_PARAM[params.diff] ?? null
  const elevationBand =
    ELEVATION_BANDS.find((band) => band.value === params.elev) ?? null
  const region = REGIONS.find((r) => r.key === params.region) ?? null
  const prefecture =
    params.pref && PREFECTURE_ORDER.includes(params.pref) ? params.pref : ""
  const query = queryDraft ?? params.q

  // キーワード入力は少し待ってから URL に反映する
  useEffect(() => {
    if (queryDraft === null) return
    const timer = window.setTimeout(() => {
      setParams({ q: queryDraft.trim() || null })
      setQueryDraft(null)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [queryDraft, setParams])

  const statuses = useMemo(() => {
    const map = new Map<string, ItemStatus>()
    for (const item of items) map.set(item.key, getStatus(item))
    return map
  }, [items, getStatus])

  const availableRegions = useMemo(
    () => REGIONS.filter((r) => items.some((item) => item.regionKey === r.key)),
    [items]
  )
  const availablePrefectures = useMemo(() => {
    const set = new Set<string>()
    for (const item of items) {
      if (region && item.regionKey !== region.key) continue
      item.prefectures.forEach((p) => {
        if (!region || region.prefectures.includes(p)) set.add(p)
      })
    }
    return [...set].sort((a, b) => prefectureIndex(a) - prefectureIndex(b))
  }, [items, region])
  const hasDifficulty = showDifficulty && items.some((item) => item.difficulty)

  const filtered = useMemo(() => {
    const q = normalizeText(params.q)
    return items.filter((item) => {
      if (q) {
        const haystack = normalizeText(
          [item.name, ...item.aliases, ...item.prefectures].join(" ")
        )
        if (!haystack.includes(q)) return false
      }
      if (region && item.regionKey !== region.key) return false
      if (prefecture && !item.prefectures.includes(prefecture)) return false
      const st = statuses.get(item.key)
      if (status === "climbed" && !st?.climbed) return false
      if (status === "unclimbed" && st?.climbed) return false
      if (elevationBand && !elevationBand.test(item.elevation)) return false
      if (difficulty && item.difficulty !== difficulty) return false
      return true
    })
  }, [
    items,
    params.q,
    region,
    prefecture,
    status,
    statuses,
    elevationBand,
    difficulty,
  ])

  const sorted = useMemo(() => {
    const list = [...filtered]
    const byName = (a: ExplorerItem, b: ExplorerItem) =>
      a.name.localeCompare(b.name, "ja")
    const byNumber = (a: ExplorerItem, b: ExplorerItem) =>
      (a.number ?? a.id) - (b.number ?? b.id) || byName(a, b)
    const climbedOf = (item: ExplorerItem) =>
      statuses.get(item.key)?.climbed ? 1 : 0
    const latestOf = (item: ExplorerItem) => {
      const dates = statuses.get(item.key)?.dates ?? []
      return dates.reduce((max, d) => {
        const key = normalizeDateKey(d)
        return key > max ? key : max
      }, "")
    }
    switch (sort) {
      case "number":
        return list.sort(byNumber)
      case "latitude":
      case "prefecture":
        return list.sort((a, b) => b.latitude - a.latitude)
      case "name":
        return list.sort(byName)
      case "elevation":
        return list.sort((a, b) => b.elevation - a.elevation)
      case "elevation_asc":
        return list.sort((a, b) => a.elevation - b.elevation)
      case "status":
        return list.sort(
          (a, b) => climbedOf(a) - climbedOf(b) || byNumber(a, b)
        )
      case "status_climbed":
        return list.sort(
          (a, b) => climbedOf(b) - climbedOf(a) || byNumber(a, b)
        )
      case "recent":
        return list.sort(
          (a, b) =>
            latestOf(b).localeCompare(latestOf(a)) ||
            climbedOf(b) - climbedOf(a) ||
            byNumber(a, b)
        )
    }
  }, [filtered, sort, statuses])

  const groups = useMemo(() => {
    if (sort !== "prefecture") return null
    const map = new Map<string, ExplorerItem[]>()
    for (const item of sorted) {
      const pref = item.prefectures[0] ?? "その他"
      if (!map.has(pref)) map.set(pref, [])
      map.get(pref)!.push(item)
    }
    return [...map.entries()].sort(
      (a, b) => prefectureIndex(a[0]) - prefectureIndex(b[0])
    )
  }, [sorted, sort])

  // 条件が変わったら表示件数をリセット
  const filterSignature = `${params.q}|${params.region}|${params.pref}|${params.status}|${params.elev}|${params.diff}|${sort}`
  const [lastSignature, setLastSignature] = useState(filterSignature)
  if (lastSignature !== filterSignature) {
    setLastSignature(filterSignature)
    setLimit(PAGE_SIZE)
  }

  const climbedInView = filtered.filter(
    (item) => statuses.get(item.key)?.climbed
  ).length
  const activeFilterCount = [
    params.q,
    region,
    prefecture,
    status,
    elevationBand,
    difficulty,
  ].filter(Boolean).length

  const mapMountains = useMemo(
    () =>
      filtered.map((item) => ({
        id: item.id,
        name: item.name,
        location: item.prefectures,
        latitude: item.latitude,
        longitude: item.longitude,
        elevation: item.elevation,
        href: item.href,
      })),
    [filtered]
  )
  const mapChecked = useMemo(
    () =>
      new Set(
        filtered
          .filter((item) => statuses.get(item.key)?.climbed)
          .map((item) => item.id)
      ),
    [filtered, statuses]
  )
  const itemById = useMemo(
    () => new Map(items.map((item) => [item.id, item])),
    [items]
  )

  const clearAll = () => {
    setQueryDraft(null)
    setParams(
      {
        q: null,
        region: null,
        pref: null,
        status: null,
        elev: null,
        diff: null,
      },
      { push: true }
    )
  }

  const renderCards = (list: ExplorerItem[]) => (
    <ul className={styles.grid}>
      {list.map((item) => (
        <li key={item.key}>
          <MountainCard
            item={item}
            onToggle={onToggle}
            status={statuses.get(item.key)!}
          />
        </li>
      ))}
    </ul>
  )

  const visible = sorted.slice(0, limit)

  return (
    <section aria-labelledby={headingId} className={styles.explorer}>
      {summary}

      <div className={styles.toolbar}>
        <div className={styles.searchRow}>
          <div className={styles.search}>
            <SearchIcon className={styles.searchIcon} size={18} />
            <label className="visually-hidden" htmlFor={`${headingId}-q`}>
              山名・都道府県で絞り込む
            </label>
            <input
              className={styles.searchInput}
              enterKeyHint="search"
              id={`${headingId}-q`}
              onChange={(event) => setQueryDraft(event.target.value)}
              placeholder="山名・都道府県で絞り込む"
              type="search"
              value={query}
            />
          </div>
          <button
            aria-controls={`${headingId}-filters`}
            aria-expanded={filtersOpen}
            className={`${styles.filterToggle} ${activeFilterCount ? styles.filterToggleActive : ""}`}
            onClick={() => setFiltersOpen((open) => !open)}
            type="button"
          >
            <FilterIcon size={18} />
            絞り込み
            {activeFilterCount > 0 && (
              <span className={styles.badge}>{activeFilterCount}</span>
            )}
          </button>
        </div>

        <div className={styles.segmented} role="group" aria-label="登頂状況">
          {[
            { value: "", label: "すべて" },
            { value: "unclimbed", label: "未登頂" },
            { value: "climbed", label: "登頂済" },
          ].map((option) => (
            <button
              aria-pressed={status === option.value}
              className={styles.segment}
              key={option.value || "all"}
              onClick={() =>
                setParams({ status: option.value || null }, { push: true })
              }
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>

        {availableRegions.length > 1 && (
          <div className={styles.chipRow} role="group" aria-label="地域">
            <button
              aria-pressed={!region}
              className={styles.regionChip}
              onClick={() =>
                setParams({ region: null, pref: null }, { push: true })
              }
              type="button"
            >
              全国
            </button>
            {availableRegions.map((r) => (
              <button
                aria-pressed={region?.key === r.key}
                className={styles.regionChip}
                key={r.key}
                onClick={() =>
                  setParams(
                    {
                      region: region?.key === r.key ? null : r.key,
                      pref: null,
                    },
                    { push: true }
                  )
                }
                type="button"
              >
                {r.label}
              </button>
            ))}
          </div>
        )}

        <div
          className={`${styles.filters} ${filtersOpen ? styles.filtersOpen : ""}`}
          id={`${headingId}-filters`}
        >
          <div className={styles.field}>
            <label htmlFor={`${headingId}-pref`}>都道府県</label>
            <select
              id={`${headingId}-pref`}
              onChange={(event) =>
                setParams({ pref: event.target.value || null }, { push: true })
              }
              value={prefecture}
            >
              <option value="">すべて</option>
              {availablePrefectures.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor={`${headingId}-elev`}>標高</label>
            <select
              id={`${headingId}-elev`}
              onChange={(event) =>
                setParams({ elev: event.target.value || null }, { push: true })
              }
              value={elevationBand?.value ?? ""}
            >
              <option value="">すべて</option>
              {ELEVATION_BANDS.map((band) => (
                <option key={band.value} value={band.value}>
                  {band.label}
                </option>
              ))}
            </select>
          </div>
          {hasDifficulty && (
            <div className={styles.field}>
              <label htmlFor={`${headingId}-diff`}>難易度目安</label>
              <select
                id={`${headingId}-diff`}
                onChange={(event) =>
                  setParams(
                    { diff: event.target.value || null },
                    { push: true }
                  )
                }
                value={difficulty ? DIFFICULTY_TO_PARAM[difficulty] : ""}
              >
                <option value="">すべて</option>
                {DIFFICULTY_LEVELS.map((level) => (
                  <option key={level} value={DIFFICULTY_TO_PARAM[level]}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className={styles.field}>
            <label htmlFor={`${headingId}-sort`}>並び順</label>
            <select
              id={`${headingId}-sort`}
              onChange={(event) =>
                setParams(
                  {
                    sort:
                      event.target.value === defaultSort
                        ? null
                        : event.target.value,
                  },
                  { push: true }
                )
              }
              value={sort}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.resultBar}>
          <p aria-live="polite" className={styles.resultCount}>
            <strong className="tabular">{filtered.length}</strong>座を表示
            <span className={styles.resultSub}>
              （うち登頂済 <span className="tabular">{climbedInView}</span>座）
            </span>
          </p>
          <div className={styles.resultActions}>
            {activeFilterCount > 0 && (
              <button className={styles.clear} onClick={clearAll} type="button">
                <CloseIcon size={14} />
                条件をクリア
              </button>
            )}
            <div
              className={styles.viewToggle}
              role="group"
              aria-label="表示切替"
            >
              <button
                aria-pressed={view === "list"}
                onClick={() =>
                  setParams(
                    { view: defaultView === "list" ? null : "list" },
                    { push: true }
                  )
                }
                type="button"
              >
                <ListIcon size={16} />
                カード
              </button>
              <button
                aria-pressed={view === "map"}
                onClick={() =>
                  setParams(
                    { view: defaultView === "map" ? null : "map" },
                    { push: true }
                  )
                }
                type="button"
              >
                <MapIcon size={16} />
                地図
              </button>
            </div>
          </div>
        </div>
      </div>

      <h2 className="visually-hidden" id={headingId}>
        {title}の一覧
      </h2>

      {view === "map" ? (
        <div className={styles.mapWrap}>
          <Suspense
            fallback={
              <div className={styles.mapLoading}>地図を読み込み中…</div>
            }
          >
            <MountainMap
              checked={mapChecked}
              fitToMountains
              label={`${title}の地図`}
              mountains={mapMountains}
              onToggle={
                onToggle
                  ? (id) => {
                      const item = itemById.get(id)
                      if (item) onToggle(item)
                    }
                  : undefined
              }
            />
          </Suspense>
          <ul className={styles.legend} aria-label="凡例">
            <li>
              <span className={`${styles.dot} ${styles.dotClimbed}`} />
              登頂済
            </li>
            <li>
              <span className={`${styles.dot} ${styles.dotUnclimbed}`} />
              未登頂
            </li>
          </ul>
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>条件に一致する山はありません。</p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={clearAll}
            type="button"
          >
            条件をクリア
          </button>
        </div>
      ) : groups ? (
        <div className={styles.groups}>
          {groups.map(([pref, list]) => (
            <section aria-label={pref} className={styles.group} key={pref}>
              <h3 className={styles.groupTitle}>
                {pref}
                <span className="tabular">
                  {
                    list.filter((item) => statuses.get(item.key)?.climbed)
                      .length
                  }{" "}
                  / {list.length}
                </span>
              </h3>
              {renderCards(list)}
            </section>
          ))}
        </div>
      ) : (
        <>
          {renderCards(visible)}
          {sorted.length > limit && (
            <div className={styles.more}>
              <button
                className="btn btn-secondary"
                onClick={() => setLimit((n) => n + PAGE_SIZE)}
                type="button"
              >
                さらに表示（残り {sorted.length - limit}座）
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
