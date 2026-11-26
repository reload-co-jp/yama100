"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useAllListsState } from "../hooks/useMountainState"
import { formatElevation, percent } from "../lib/mountainMeta"
import {
  countUniqueClimbed,
  getListProgress,
  getTimeline,
  getYearlyCounts,
} from "../lib/progress"
import { formatSummitDate } from "../lib/summitStore"
import ProgressBar from "./ui/ProgressBar"
import { ShareIcon } from "./ui/Icons"
import styles from "./SummaryClient.module.css"

export default function SummaryClient() {
  const snapshot = useAllListsState()
  const progress = useMemo(() => getListProgress(snapshot), [snapshot])
  const timeline = useMemo(() => getTimeline(snapshot), [snapshot])
  const years = useMemo(() => getYearlyCounts(timeline), [timeline])
  const unique = useMemo(() => countUniqueClimbed(snapshot), [snapshot])
  const maxYear = Math.max(1, ...years.map((y) => y.entries.length))
  const highest = timeline.reduce<(typeof timeline)[number] | null>(
    (max, entry) => (!max || entry.elevation > max.elevation ? entry : max),
    null
  )

  return (
    <div className={styles.wrap}>
      <section
        aria-labelledby="overview-title"
        className={`card ${styles.panel}`}
      >
        <h2 className={styles.h2} id="overview-title">
          概要
        </h2>
        <dl className={styles.stats}>
          <div>
            <dt>登頂した山</dt>
            <dd>
              <strong className="tabular">{unique}</strong>山
            </dd>
          </div>
          <div>
            <dt>記録した登頂</dt>
            <dd>
              <strong className="tabular">{timeline.length}</strong>回
            </dd>
          </div>
          <div>
            <dt>記録した年数</dt>
            <dd>
              <strong className="tabular">{years.length}</strong>年
            </dd>
          </div>
          <div>
            <dt>最高到達点（記録あり）</dt>
            <dd>
              {highest
                ? `${highest.name} ${formatElevation(highest.elevation)}`
                : "—"}
            </dd>
          </div>
        </dl>
        <div className={styles.actions}>
          <Link className="btn btn-primary btn-sm" href="/share/">
            <ShareIcon size={16} />
            シェア画像を作る
          </Link>
          <Link className="btn btn-secondary btn-sm" href="/settings/">
            バックアップ・復元
          </Link>
        </div>
      </section>

      <section aria-labelledby="lists-title" className={`card ${styles.panel}`}>
        <h2 className={styles.h2} id="lists-title">
          リスト別の達成度
        </h2>
        <ul className={styles.lists}>
          {progress.map(({ list, climbed, total }) => (
            <li key={list.key}>
              <div className={styles.listHead}>
                <Link href={list.listHref === "/" ? "/#list" : list.listHref}>
                  {list.label}
                </Link>
                <span className="tabular">
                  {climbed} / {total}（{percent(climbed, total)}%）
                </span>
              </div>
              <ProgressBar
                color={list.themeColor}
                label={`${list.label}の達成率`}
                max={total}
                value={climbed}
              />
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="yearly-title"
        className={`card ${styles.panel}`}
      >
        <h2 className={styles.h2} id="yearly-title">
          年間の登頂数
        </h2>
        {years.length === 0 ? (
          <p className={styles.empty}>
            登頂日を記録すると、年ごとの登頂数がグラフで表示されます。
          </p>
        ) : (
          <ul className={styles.yearBars}>
            {years.map(({ year, entries, uniqueMountains }) => (
              <li key={year}>
                <span className={styles.yearLabel}>{year}年</span>
                <span className={styles.yearBarTrack}>
                  <span
                    className={styles.yearBar}
                    style={{ width: `${(entries.length / maxYear) * 100}%` }}
                  />
                </span>
                <span className={`${styles.yearCount} tabular`}>
                  {entries.length}回<small>（{uniqueMountains}山）</small>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        aria-labelledby="timeline-title"
        className={`card ${styles.panel}`}
      >
        <h2 className={styles.h2} id="timeline-title">
          登頂の記録
        </h2>
        {timeline.length === 0 ? (
          <p className={styles.empty}>
            山の詳細ページで登頂日を記録すると、ここに時系列で表示されます。
            <Link href="/#list">百名山一覧から山を選ぶ →</Link>
          </p>
        ) : (
          <div className={styles.timeline}>
            {years.map(({ year, entries }) => (
              <div key={year}>
                <h3 className={styles.yearHead}>
                  {year}年<span>（{entries.length}回）</span>
                </h3>
                <ol className={styles.entries}>
                  {entries.map((entry) => (
                    <li key={`${entry.pageId}-${entry.date}`}>
                      <span className={styles.date}>
                        {formatSummitDate(entry.date)}
                      </span>
                      <Link
                        className={styles.name}
                        href={`/mountain/${entry.pageId}/`}
                      >
                        {entry.name}
                      </Link>
                      <span className={styles.meta}>
                        {formatElevation(entry.elevation)} ・{" "}
                        {entry.lists.map((l) => l.shortLabel).join("・")}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
