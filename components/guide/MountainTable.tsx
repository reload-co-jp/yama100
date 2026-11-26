import Link from "next/link"
import type { GuideRow } from "../../lib/hyakumeizan"
import { formatElevation } from "../../lib/mountainMeta"
import styles from "./MountainTable.module.css"

export type Column =
  | "rank"
  | "number"
  | "elevation"
  | "prefecture"
  | "region"
  | "difficulty"
  | "course"

const LABELS: Record<Column, string> = {
  rank: "順位",
  number: "No.",
  elevation: "標高",
  prefecture: "所在地",
  region: "地域",
  difficulty: "難易度目安",
  course: "モデルコース記載の所要時間",
}

type Props = {
  rows: GuideRow[]
  columns: Column[]
  caption: string
  /** rank 列の値（未指定なら行番号） */
  ranks?: number[]
}

export default function MountainTable({
  rows,
  columns,
  caption,
  ranks,
}: Props) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            {columns.includes("rank") && <th scope="col">{LABELS.rank}</th>}
            {columns.includes("number") && <th scope="col">{LABELS.number}</th>}
            <th scope="col">山名</th>
            {columns
              .filter((c) => c !== "rank" && c !== "number")
              .map((c) => (
                <th key={c} scope="col">
                  {LABELS[c]}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id}>
              {columns.includes("rank") && (
                <td className={styles.num}>{ranks?.[i] ?? i + 1}</td>
              )}
              {columns.includes("number") && (
                <td className={styles.num}>{row.number}</td>
              )}
              <th scope="row">
                <Link href={row.href}>{row.name}</Link>
              </th>
              {columns.map((c) => {
                switch (c) {
                  case "elevation":
                    return (
                      <td className={styles.num} key={c}>
                        {formatElevation(row.elevation)}
                      </td>
                    )
                  case "prefecture":
                    return <td key={c}>{row.prefectures.join("・")}</td>
                  case "region":
                    return <td key={c}>{row.region?.label ?? "—"}</td>
                  case "difficulty":
                    return <td key={c}>{row.difficulty ?? "—"}</td>
                  case "course":
                    return (
                      <td key={c}>
                        {row.course?.hours != null
                          ? `約${row.course.hours}時間`
                          : "記載なし"}
                        {row.course?.overnight ? "（宿泊行程）" : ""}
                      </td>
                    )
                  default:
                    return null
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
