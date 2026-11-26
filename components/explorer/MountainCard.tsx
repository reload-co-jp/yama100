"use client"

import Link from "next/link"
import { memo } from "react"
import { formatElevation } from "../../lib/mountainMeta"
import { formatSummitDate, latestDate } from "../../lib/summitStore"
import MountainPhoto from "../MountainPhoto"
import { CheckIcon, FlagIcon } from "../ui/Icons"
import type { ExplorerItem, ItemStatus } from "./types"
import styles from "./MountainCard.module.css"

type Props = {
  item: ExplorerItem
  status: ItemStatus
  onToggle?: (item: ExplorerItem) => void
  headingLevel?: "h2" | "h3"
}

function MountainCard({ item, status, onToggle, headingLevel = "h3" }: Props) {
  const Heading = headingLevel
  const last = latestDate(status.dates)
  const count = status.dates.length

  return (
    <article
      className={`${styles.card} ${status.climbed ? styles.climbed : ""}`}
    >
      <div className={styles.media}>
        <MountainPhoto name={item.name} width={500} />
        <span
          className={`${styles.badge} ${status.climbed ? styles.badgeClimbed : styles.badgeUnclimbed}`}
        >
          {status.climbed ? (
            <CheckIcon size={12} strokeWidth={3} />
          ) : (
            <FlagIcon size={12} />
          )}
          {status.climbed ? "登頂済" : "未登頂"}
        </span>
        {item.number !== null && (
          <span className={styles.number}>No.{item.number}</span>
        )}
      </div>
      <div className={styles.body}>
        <Heading className={styles.name}>
          <Link className={styles.link} href={item.href}>
            {item.name}
          </Link>
        </Heading>
        <p className={styles.meta}>
          <span className={`${styles.elevation} tabular`}>
            {formatElevation(item.elevation)}
          </span>
          {" ・ "}
          {item.prefectures.join("・")}
        </p>
        <div className={styles.chips}>
          {item.regionLabel && !item.prefectures.includes(item.regionLabel) && (
            <span className="chip">{item.regionLabel}</span>
          )}
          {item.difficulty && (
            <span className="chip chip-sky">難易度目安 {item.difficulty}</span>
          )}
        </div>
        {(last || count > 0) && (
          <p className={styles.record}>
            {last && <span>登頂日 {formatSummitDate(last)}</span>}
            {count > 0 && <span>登頂 {count}回</span>}
          </p>
        )}
        {onToggle && (
          <div className={styles.footer}>
            <button
              aria-label={`${item.name} 登頂済み`}
              aria-pressed={status.climbed}
              className={styles.toggle}
              onClick={() => onToggle(item)}
              type="button"
            >
              {status.climbed ? <CheckIcon size={16} strokeWidth={3} /> : null}
              {status.climbed ? "登頂済み" : "登頂済みにする"}
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

export default memo(MountainCard)
