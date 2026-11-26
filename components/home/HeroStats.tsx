"use client"

import { useListState } from "../../hooks/useMountainState"
import { getMountainList } from "../../lib/mountainCatalog"
import { percent } from "../../lib/mountainMeta"
import ProgressBar from "../ui/ProgressBar"
import styles from "./TopHero.module.css"

export default function HeroStats() {
  const list = getMountainList("mountains")
  const { checked } = useListState(list.storageKey)
  const count = list.mountains.filter((m) => checked.has(m.id)).length
  const total = list.mountains.length
  const remaining = total - count

  return (
    <div
      aria-label="日本百名山の登頂状況"
      className={styles.stats}
      role="group"
    >
      <p className={styles.statsLabel}>日本百名山の登頂数</p>
      <p className={styles.count}>
        <strong className="tabular">{count}</strong>
        <span className={styles.countTotal}>/ {total}座</span>
        <span className={styles.rate}>{percent(count, total)}%</span>
      </p>
      <ProgressBar
        label="日本百名山の達成率"
        max={total}
        onDark
        size="thick"
        value={count}
      />
      <p className={styles.statsNote}>
        {count === 0
          ? "登った山にチェックを入れて、記録を始めましょう。"
          : remaining === 0
            ? "百名山すべてに登頂しました！おめでとうございます。"
            : `完登まであと ${remaining}座`}
      </p>
    </div>
  )
}
