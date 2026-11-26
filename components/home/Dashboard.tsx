"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useAllListsState } from "../../hooks/useMountainState"
import { formatElevation, percent } from "../../lib/mountainMeta"
import {
  countUniqueClimbed,
  getListProgress,
  getRegionProgress,
  getTimeline,
} from "../../lib/progress"
import { formatSummitDate } from "../../lib/summitStore"
import MountainPhoto from "../MountainPhoto"
import { ArrowRightIcon, CalendarIcon } from "../ui/Icons"
import ProgressBar from "../ui/ProgressBar"
import styles from "./Dashboard.module.css"

function listHrefWith(listHref: string, query: string) {
  return listHref === "/" ? `/?${query}#list` : `${listHref}?${query}`
}

export default function Dashboard() {
  const snapshot = useAllListsState()
  const progress = useMemo(() => getListProgress(snapshot), [snapshot])
  const timeline = useMemo(() => getTimeline(snapshot), [snapshot])
  const uniqueClimbed = useMemo(() => countUniqueClimbed(snapshot), [snapshot])
  const [regionListKey, setRegionListKey] = useState(progress[0].list.key)

  const primary = progress[0]
  const regionTarget =
    snapshot.lists.find((entry) => entry.list.key === regionListKey) ??
    snapshot.lists[0]
  const regions = useMemo(
    () => getRegionProgress(regionTarget.list, regionTarget.checked),
    [regionTarget]
  )
  const recent = timeline.slice(0, 6)

  return (
    <>
      <section aria-labelledby="dashboard-title" className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-eyebrow">Dashboard</p>
              <h2 className="section-title" id="dashboard-title">
                あなたの登頂実績
              </h2>
            </div>
            <Link className="text-link" href="/summary/">
              登頂記録をすべて見る <ArrowRightIcon size={16} />
            </Link>
          </div>

          <dl className={styles.stats}>
            <div className={styles.stat}>
              <dt>登頂済み</dt>
              <dd>
                <strong className="tabular">{primary.climbed}</strong>座
              </dd>
              <span className={styles.statNote}>日本百名山</span>
            </div>
            <div className={styles.stat}>
              <dt>対象の山</dt>
              <dd>
                <strong className="tabular">{primary.total}</strong>座
              </dd>
              <span className={styles.statNote}>日本百名山</span>
            </div>
            <div className={`${styles.stat} ${styles.statAccent}`}>
              <dt>達成率</dt>
              <dd>
                <strong className="tabular">
                  {percent(primary.climbed, primary.total)}
                </strong>
                %
              </dd>
              <span className={styles.statNote}>日本百名山</span>
            </div>
            <div className={styles.stat}>
              <dt>未登頂</dt>
              <dd>
                <strong className="tabular">
                  {primary.total - primary.climbed}
                </strong>
                座
              </dd>
              <Link className={styles.statLink} href="/?status=unclimbed#list">
                未登頂の山を見る
              </Link>
            </div>
            <div className={styles.stat}>
              <dt>登頂した山（全リスト）</dt>
              <dd>
                <strong className="tabular">{uniqueClimbed}</strong>山
              </dd>
              <span className={styles.statNote}>リスト間の重複を除く</span>
            </div>
          </dl>

          <div className={styles.twoCol}>
            <div className={`card ${styles.panel}`}>
              <h3 className={styles.panelTitle}>最近の登頂</h3>
              {recent.length === 0 ? (
                <div className={styles.emptyRecent}>
                  <CalendarIcon size={28} />
                  <p>
                    山の詳細ページで登頂日を記録すると、ここに最近登った山が写真付きで表示されます。
                  </p>
                  <Link className="btn btn-secondary btn-sm" href="#list">
                    山を選んで記録する
                  </Link>
                </div>
              ) : (
                <ul className={styles.recentList}>
                  {recent.map((entry) => (
                    <li key={`${entry.pageId}-${entry.date}`}>
                      <Link
                        className={styles.recentItem}
                        href={`/mountain/${entry.pageId}/`}
                      >
                        <div className={styles.recentPhoto}>
                          <MountainPhoto name={entry.name} width={330} />
                        </div>
                        <div className={styles.recentBody}>
                          <span className={styles.recentDate}>
                            {formatSummitDate(entry.date)}
                          </span>
                          <span className={styles.recentName}>
                            {entry.name}
                          </span>
                          <span className={styles.recentMeta}>
                            {formatElevation(entry.elevation)} ・{" "}
                            {entry.location.join("・")}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={`card ${styles.panel}`}>
              <h3 className={styles.panelTitle}>リスト別の進捗</h3>
              <ul className={styles.listProgress}>
                {progress.map(({ list, climbed, total }) => (
                  <li key={list.key}>
                    <Link
                      className={styles.listRow}
                      href={list.listHref === "/" ? "/#list" : list.listHref}
                    >
                      <span className={styles.listName}>{list.label}</span>
                      <span className={`${styles.listCount} tabular`}>
                        {climbed} / {total}
                        <span>（{percent(climbed, total)}%）</span>
                      </span>
                      <ProgressBar
                        color={list.themeColor}
                        label={`${list.label}の達成率`}
                        max={total}
                        size="thin"
                        value={climbed}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="region-title"
        className={`section ${styles.regionSection}`}
      >
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-eyebrow">By Region</p>
              <h2 className="section-title" id="region-title">
                地域別の登頂状況
              </h2>
              <p className="section-lead">
                北海道から九州まで、地域ごとの達成度をチェック。
              </p>
            </div>
            <label className={styles.listSelect}>
              <span className="visually-hidden">集計するリスト</span>
              <select
                onChange={(event) =>
                  setRegionListKey(event.target.value as typeof regionListKey)
                }
                value={regionListKey}
              >
                {progress.map(({ list }) => (
                  <option key={list.key} value={list.key}>
                    {list.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <ul className={styles.regions}>
            {regions.map(({ region, climbed, total, mountains }) => (
              <li key={region.key}>
                <Link
                  className={`${styles.region} ${climbed === total ? styles.regionDone : ""}`}
                  href={listHrefWith(
                    regionTarget.list.listHref,
                    `region=${region.key}`
                  )}
                >
                  <span className={styles.regionName}>{region.label}</span>
                  <span className={`${styles.regionCount} tabular`}>
                    <strong>{climbed}</strong> / {total}
                  </span>
                  <ProgressBar
                    label={`${region.label}の達成率`}
                    max={total}
                    size="thin"
                    value={climbed}
                  />
                  <span className={styles.regionRate}>
                    {percent(climbed, total)}%
                  </span>
                  <span aria-hidden="true" className={styles.dots}>
                    {mountains.map(({ mountain, climbed: c }) => (
                      <i
                        className={c ? styles.dotOn : undefined}
                        key={mountain.id}
                        title={mountain.name}
                      />
                    ))}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
