"use client"

import Link from "next/link"
import { useCallback, useMemo, useState } from "react"
import { encodeChecked, useMountainState } from "../hooks/useMountainState"
import { buildListItems } from "../lib/explorerItems"
import { getMountainList, type MountainListKey } from "../lib/mountainCatalog"
import { percent } from "../lib/mountainMeta"
import DigestModal from "./DigestModal"
import MountainExplorer from "./explorer/MountainExplorer"
import type { ExplorerItem } from "./explorer/types"
import ProgressBar from "./ui/ProgressBar"
import { LinkIcon, ShareIcon } from "./ui/Icons"
import styles from "./ListExplorer.module.css"

type Props = {
  listKey: MountainListKey
  headingId?: string
  defaultView?: "list" | "map"
}

export default function ListExplorer({
  listKey,
  headingId = "list-heading",
  defaultView = "list",
}: Props) {
  const list = getMountainList(listKey)
  const { checked, dates, digestChecked, toggle } = useMountainState(
    list.storageKey,
    list.totalCount,
    list.idOffset
  )
  const [copied, setCopied] = useState(false)
  const [isDigestDismissed, setIsDigestDismissed] = useState(false)

  const items = useMemo(() => buildListItems(list), [list])
  const getStatus = useCallback(
    (item: ExplorerItem) => ({
      climbed: checked.has(item.id),
      dates: dates[item.id] ?? [],
    }),
    [checked, dates]
  )
  const onToggle = useCallback(
    (item: ExplorerItem) => toggle(item.id),
    [toggle]
  )

  const count = list.mountains.filter((m) => checked.has(m.id)).length
  const total = list.mountains.length

  const handleShare = useCallback(async () => {
    const params = new URLSearchParams()
    params.set("data", encodeChecked(checked, list.totalCount, list.idOffset))
    const sort = new URLSearchParams(window.location.search).get("sort")
    if (sort) params.set("sort", sort)
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`
    const text = `${list.label} ${count}/${total}座 登頂しました！ #Yama100\n${url}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt("以下のテキストをコピーしてください", text)
    }
  }, [checked, list, count, total])

  const digestMountains = digestChecked
    ? list.mountains.filter((m) => digestChecked.has(m.id))
    : []
  const isDigestOpen = digestChecked !== null && !isDigestDismissed

  return (
    <>
      {isDigestOpen && (
        <DigestModal
          list={list}
          mountains={digestMountains}
          onClose={() => setIsDigestDismissed(true)}
        />
      )}
      <MountainExplorer
        defaultView={defaultView}
        getStatus={getStatus}
        headingId={headingId}
        items={items}
        onToggle={onToggle}
        summary={
          <div className={styles.summary}>
            <div className={styles.progress}>
              <p className={styles.count}>
                <span className="visually-hidden">{list.label}の登頂数 </span>
                <strong className="tabular">{count}</strong>
                <span className={styles.total}> / {total}座</span>
                <span className={styles.rate}>{percent(count, total)}%</span>
              </p>
              <ProgressBar
                label={`${list.label}の達成率`}
                max={total}
                value={count}
              />
            </div>
            <div className={styles.actions}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleShare}
                type="button"
              >
                <LinkIcon size={16} />
                {copied ? "コピーしました" : "共有URLをコピー"}
              </button>
              <Link
                className="btn btn-primary btn-sm"
                href={`/share/?list=${list.key}`}
              >
                <ShareIcon size={16} />
                シェア画像を作る
              </Link>
            </div>
          </div>
        }
        title={list.label}
      />
    </>
  )
}
