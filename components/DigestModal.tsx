"use client"

import { lazy, Suspense, useEffect, useRef } from "react"
import type { MountainListMeta, MountainRecord } from "../lib/mountainCatalog"
import { formatElevation, percent } from "../lib/mountainMeta"
import ProgressBar from "./ui/ProgressBar"
import { CloseIcon } from "./ui/Icons"
import styles from "./DigestModal.module.css"

const MountainMap = lazy(() => import("./MountainMap"))

type Props = {
  list: MountainListMeta
  mountains: MountainRecord[]
  onClose: () => void
}

export default function DigestModal({ list, mountains, onClose }: Props) {
  const allChecked = new Set(mountains.map((m) => m.id))
  const closeRef = useRef<HTMLButtonElement>(null)
  const total = list.mountains.length

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} role="presentation" />
      <div
        aria-labelledby="digest-title"
        aria-modal="true"
        className={styles.dialog}
        role="dialog"
      >
        <div className={styles.head}>
          <p className={styles.eyebrow}>共有された登頂記録</p>
          <h2 className={styles.title} id="digest-title">
            {list.label}
          </h2>
          <p className={styles.count}>
            <strong className="tabular">{mountains.length}</strong>
            <span>
              / {total}座 登頂（{percent(mountains.length, total)}%）
            </span>
          </p>
          <ProgressBar
            label="共有された達成率"
            max={total}
            onDark
            value={mountains.length}
          />
          <button
            aria-label="閉じる"
            className={styles.close}
            onClick={onClose}
            ref={closeRef}
            type="button"
          >
            <CloseIcon size={22} />
          </button>
        </div>

        <div className={styles.map}>
          {mountains.length > 0 ? (
            <Suspense
              fallback={
                <div className={styles.emptyMap}>地図を読み込み中…</div>
              }
            >
              <MountainMap
                checked={allChecked}
                label="共有された登頂済みの山の地図"
                mountains={mountains}
              />
            </Suspense>
          ) : (
            <div className={styles.emptyMap}>登頂した山がありません</div>
          )}
        </div>

        <ul className={styles.list}>
          {mountains.map((m) => (
            <li key={m.id}>
              <span className={styles.name}>✓ {m.name}</span>
              <span className={`${styles.sub} tabular`}>
                {formatElevation(m.elevation)}
              </span>
              <span className={styles.sub}>{m.location.join("・")}</span>
            </li>
          ))}
        </ul>

        <div className={styles.foot}>
          <button className="btn btn-primary" onClick={onClose} type="button">
            自分のチェックリストを見る
          </button>
        </div>
      </div>
    </>
  )
}
