"use client"

import Link from "next/link"
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import type { CanonicalMountainMembership } from "../../lib/mountainCatalog"
import {
  addPhoto,
  deletePhoto,
  MAX_PHOTOS_PER_MOUNTAIN,
  saveMountainNote,
  useMountainNote,
  useMountainPhotos,
} from "../../lib/recordStore"
import {
  formatSummitDate,
  isValidSummitDate,
  normalizeDateKey,
  readListState,
  setMountainChecked,
  setMountainDates,
  subscribeAll,
} from "../../lib/summitStore"
import {
  CameraIcon,
  CheckIcon,
  CloseIcon,
  ShareIcon,
  TrashIcon,
} from "../ui/Icons"
import styles from "./MountainRecordPanel.module.css"

type Props = {
  mountainId: number
  mountainName: string
  memberships: CanonicalMountainMembership[]
}

type MembershipState = {
  membership: CanonicalMountainMembership
  checked: boolean
  dates: string[]
}

function useMembershipStates(memberships: CanonicalMountainMembership[]) {
  const cacheRef = useRef<{ key: string; value: MembershipState[] } | null>(
    null
  )
  const getSnapshot = useCallback(() => {
    const states = memberships.map((membership) => {
      const state = readListState(membership.storageKey)
      return {
        membership,
        checked: state.checked.has(membership.id),
        dates: state.dates[membership.id] ?? [],
      }
    })
    const key = states
      .map((s) => `${s.checked ? 1 : 0}:${s.dates.join(",")}`)
      .join("|")
    if (cacheRef.current?.key === key) return cacheRef.current.value
    cacheRef.current = { key, value: states }
    return states
  }, [memberships])
  const serverSnapshot = useMemo(
    () =>
      memberships.map((membership) => ({
        membership,
        checked: false,
        dates: [] as string[],
      })),
    [memberships]
  )
  return useSyncExternalStore(subscribeAll, getSnapshot, () => serverSnapshot)
}

export default function MountainRecordPanel({
  mountainId,
  mountainName,
  memberships,
}: Props) {
  const states = useMembershipStates(memberships)
  const checkedCount = states.filter((s) => s.checked).length
  const allChecked = states.length > 0 && checkedCount === states.length
  const anyChecked = checkedCount > 0

  const dates = useMemo(() => {
    const set = new Set<string>()
    states.forEach((s) => s.dates.forEach((d) => set.add(d)))
    return [...set].sort((a, b) =>
      normalizeDateKey(a).localeCompare(normalizeDateKey(b))
    )
  }, [states])

  const setAll = (value: boolean) => {
    memberships.forEach((m) => setMountainChecked(m.storageKey, m.id, value))
  }

  const writeDates = (next: string[]) => {
    memberships.forEach((m) => setMountainDates(m.storageKey, m.id, next))
  }

  return (
    <section aria-labelledby="record-title" className={`card ${styles.panel}`}>
      <div className={styles.head}>
        <h2 className={styles.title} id="record-title">
          あなたの登頂記録
        </h2>
        <span className={`chip ${anyChecked ? "chip-climbed" : ""}`}>
          {allChecked
            ? "登頂済"
            : anyChecked
              ? `${checkedCount}/${states.length}リストで登頂済`
              : "未登頂"}
        </span>
      </div>

      <button
        aria-pressed={allChecked}
        className={`${styles.mainToggle} ${allChecked ? styles.mainToggleOn : ""}`}
        onClick={() => setAll(!allChecked)}
        type="button"
      >
        {allChecked ? <CheckIcon size={20} strokeWidth={3} /> : null}
        {allChecked
          ? "登頂済み"
          : anyChecked
            ? "すべてのリストに登頂済みを反映"
            : "登頂済みにする"}
      </button>
      {allChecked && (
        <p className={styles.hint}>もう一度押すと未登頂に戻せます</p>
      )}

      {memberships.length > 1 && (
        <div className={styles.memberships}>
          <p className={styles.label}>リストごとの状態</p>
          <ul>
            {states.map(({ membership, checked }) => (
              <li key={`${membership.storageKey}-${membership.id}`}>
                <button
                  aria-pressed={checked}
                  className={styles.membership}
                  onClick={() =>
                    setMountainChecked(
                      membership.storageKey,
                      membership.id,
                      !checked
                    )
                  }
                  type="button"
                >
                  {checked ? <CheckIcon size={14} strokeWidth={3} /> : null}
                  {membership.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.block}>
        <div className={styles.blockHead}>
          <p className={styles.label}>登頂日</p>
          {dates.length > 0 && (
            <span className={styles.count}>登頂回数 {dates.length}回</span>
          )}
        </div>
        <SummitDateEditor dates={dates} onChange={writeDates} />
      </div>

      <NoteEditor key={mountainId} mountainId={mountainId} />

      <PhotoEditor mountainId={mountainId} mountainName={mountainName} />

      <div className={styles.shareRow}>
        <Link
          className="btn btn-secondary btn-sm"
          href={`/share/?type=summit&mountain=${mountainId}`}
        >
          <ShareIcon size={16} />
          登頂記念画像を作る
        </Link>
        <Link className="btn btn-ghost btn-sm" href="/summary/">
          登頂記録一覧へ
        </Link>
      </div>
      <p className={styles.privacy}>
        記録はこの端末のブラウザ内にのみ保存されます。
      </p>
    </section>
  )
}

function SummitDateEditor({
  dates,
  onChange,
}: {
  dates: string[]
  onChange: (dates: string[]) => void
}) {
  const [precision, setPrecision] = useState<"day" | "month" | "year">("day")
  const [value, setValue] = useState("")

  const canAdd = precision === "year" ? /^\d{4}$/.test(value) : value.length > 0

  const addDate = () => {
    if (!canAdd || !isValidSummitDate(value) || dates.includes(value)) return
    onChange([...dates, value])
    setValue("")
  }

  return (
    <div className={styles.dates}>
      {dates.length > 0 ? (
        <ul className={styles.dateList}>
          {dates.map((d) => (
            <li key={d}>
              {formatSummitDate(d)}
              <button
                aria-label={`${formatSummitDate(d)}の記録を削除`}
                onClick={() => onChange(dates.filter((x) => x !== d))}
                type="button"
              >
                <CloseIcon size={14} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>
          登頂日はまだ記録されていません。日付だけ・年月だけでも記録できます。
        </p>
      )}
      <div className={styles.dateForm}>
        <label className="visually-hidden" htmlFor="summit-precision">
          日付の精度
        </label>
        <select
          id="summit-precision"
          onChange={(e) => {
            setPrecision(e.target.value as "day" | "month" | "year")
            setValue("")
          }}
          value={precision}
        >
          <option value="day">年月日</option>
          <option value="month">年月</option>
          <option value="year">年のみ</option>
        </select>
        <label className="visually-hidden" htmlFor="summit-date">
          登頂日
        </label>
        {precision === "day" && (
          <input
            id="summit-date"
            onChange={(e) => setValue(e.target.value)}
            type="date"
            value={value}
          />
        )}
        {precision === "month" && (
          <input
            id="summit-date"
            onChange={(e) => setValue(e.target.value)}
            type="month"
            value={value}
          />
        )}
        {precision === "year" && (
          <input
            id="summit-date"
            inputMode="numeric"
            onChange={(e) => setValue(e.target.value)}
            placeholder="例: 2024"
            type="text"
            value={value}
          />
        )}
        <button
          className="btn btn-primary btn-sm"
          disabled={!canAdd}
          onClick={addDate}
          type="button"
        >
          登頂日を追加
        </button>
      </div>
    </div>
  )
}

function NoteEditor({ mountainId }: { mountainId: number }) {
  const note = useMountainNote(mountainId)
  const [route, setRoute] = useState<string | null>(null)
  const [memo, setMemo] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const routeValue = route ?? note?.route ?? ""
  const memoValue = memo ?? note?.memo ?? ""
  const dirty = route !== null || memo !== null

  const save = () => {
    if (saveMountainNote(mountainId, { route: routeValue, memo: memoValue })) {
      setRoute(null)
      setMemo(null)
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className={styles.block}>
      <label className={styles.label} htmlFor="note-route">
        登山ルート
      </label>
      <input
        className={styles.input}
        id="note-route"
        maxLength={200}
        onChange={(e) => setRoute(e.target.value)}
        placeholder="例: 吉田口 → 山頂 → 須走口"
        type="text"
        value={routeValue}
      />
      <label className={styles.label} htmlFor="note-memo">
        登山メモ
      </label>
      <textarea
        className={styles.textarea}
        id="note-memo"
        maxLength={2000}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="天気、同行者、印象に残ったことなど"
        rows={4}
        value={memoValue}
      />
      <div className={styles.noteActions}>
        <button
          className="btn btn-primary btn-sm"
          disabled={!dirty}
          onClick={save}
          type="button"
        >
          メモを保存
        </button>
        <span aria-live="polite" className={styles.saved}>
          {saved ? "保存しました" : ""}
        </span>
      </div>
    </div>
  )
}

function PhotoEditor({
  mountainId,
  mountainName,
}: {
  mountainId: number
  mountainName: string
}) {
  const { photos, error, refresh } = useMountainPhotos(mountainId)
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setBusy(true)
    try {
      const room = MAX_PHOTOS_PER_MOUNTAIN - photos.length
      for (const file of Array.from(files).slice(0, room)) {
        if (file.type.startsWith("image/")) await addPhoto(mountainId, file)
      }
      refresh()
    } catch {
      window.alert("写真を保存できませんでした")
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className={styles.block}>
      <div className={styles.blockHead}>
        <p className={styles.label}>写真</p>
        <span className={styles.count}>
          {photos.length} / {MAX_PHOTOS_PER_MOUNTAIN}枚
        </span>
      </div>
      {error ? (
        <p className={styles.empty}>{error}</p>
      ) : (
        <>
          {photos.length > 0 && (
            <ul className={styles.photos}>
              {photos.map((photo, i) => (
                <li key={photo.id}>
                  <a href={photo.url} rel="noopener noreferrer" target="_blank">
                    {/* ユーザーが端末に保存した写真 */}
                    <img
                      alt={`${mountainName}の記録写真 ${i + 1}`}
                      loading="lazy"
                      src={photo.url}
                    />
                  </a>
                  <button
                    aria-label={`写真${i + 1}を削除`}
                    onClick={async () => {
                      if (!window.confirm("この写真を削除しますか？")) return
                      await deletePhoto(photo.id)
                      refresh()
                    }}
                    type="button"
                  >
                    <TrashIcon size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <input
            accept="image/*"
            className="visually-hidden"
            disabled={busy || photos.length >= MAX_PHOTOS_PER_MOUNTAIN}
            id="photo-input"
            multiple
            onChange={(e) => onFiles(e.target.files)}
            ref={inputRef}
            type="file"
          />
          <label
            aria-disabled={busy || photos.length >= MAX_PHOTOS_PER_MOUNTAIN}
            className={`btn btn-secondary btn-sm ${styles.photoButton}`}
            htmlFor="photo-input"
          >
            <CameraIcon size={16} />
            {busy ? "保存中…" : "写真を追加"}
          </label>
          <p className={styles.privacy}>
            写真は縮小してこの端末内に保存されます（バックアップ・共有の対象外）。
          </p>
        </>
      )}
    </div>
  )
}
