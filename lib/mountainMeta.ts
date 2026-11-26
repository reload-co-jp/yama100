// 既存の山データから派生する表示用の情報
// ここで扱う値はすべて既存データ（JSON）に記載された内容のみから算出し、推測値は作らない。

import type { MountainRecord } from "./mountainCatalog"
import {
  getRegionForLocation,
  normalizePrefectures,
  type Region,
} from "./regions"

export const DIFFICULTY_LEVELS = ["初級", "中級", "上級"] as const
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number]

export function getDifficultyLevel(
  mountain: Pick<MountainRecord, "difficulty">
): DifficultyLevel | null {
  const level = mountain.difficulty?.level
  return (DIFFICULTY_LEVELS as readonly string[]).includes(level ?? "")
    ? (level as DifficultyLevel)
    : null
}

export function getPrefectures(
  mountain: Pick<MountainRecord, "location">
): string[] {
  return normalizePrefectures(mountain.location)
}

export function getRegion(
  mountain: Pick<MountainRecord, "location">
): Region | null {
  return getRegionForLocation(normalizePrefectures(mountain.location))
}

export type CourseInfo = {
  /** モデルコースに記載された所要時間（時間）。記載がなければ null */
  hours: number | null
  /** モデルコースに「1泊」「泊」などの宿泊行程が記載されているか */
  overnight: boolean
  /** ロープウェイ・リフト・ケーブルカー・ゴンドラの利用が記載されているか */
  usesLift: boolean
}

/**
 * 既存データの model_course 文字列から所要時間と行程の種類を読み取る。
 * 例: "… → 山頂（往復約8時間）" → hours: 8
 * 複数コースが併記されている場合は最初に記載された時間を採用する。
 */
export function parseCourse(
  modelCourse: string | undefined | null
): CourseInfo | null {
  if (!modelCourse) return null
  const match = modelCourse.match(/約\s*(\d+(?:\.\d+)?)\s*時間/)
  const hours = match ? Number(match[1]) : null
  const overnight = /1泊|一泊|泊推奨|\d泊\d日/.test(modelCourse)
  const usesLift = /ロープウェイ|リフト|ケーブル|ゴンドラ/.test(modelCourse)
  return { hours, overnight, usesLift }
}

export function formatElevation(elevation: number) {
  return `${elevation.toLocaleString("ja-JP")}m`
}

export function percent(count: number, total: number) {
  if (!total) return 0
  return Math.round((count / total) * 100)
}
