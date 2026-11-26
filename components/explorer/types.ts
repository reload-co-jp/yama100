import type { DifficultyLevel } from "../../lib/mountainMeta"

export type ExplorerItem = {
  /** React key / 一意な識別子 */
  key: string
  /** 登頂状態の保存に使う ID（リストのID または 正規化された山のID） */
  id: number
  /** リスト内の番号（表示用）。不明な場合は null */
  number: number | null
  name: string
  aliases: string[]
  elevation: number
  prefectures: string[]
  regionKey: string | null
  regionLabel: string | null
  latitude: number
  longitude: number
  difficulty: DifficultyLevel | null
  href: string
  memberships?: string[]
}

export type ItemStatus = {
  climbed: boolean
  dates: string[]
}
