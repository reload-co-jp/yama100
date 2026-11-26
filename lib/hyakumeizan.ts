// 日本百名山ガイドページ用のデータ（既存データのみから算出）

import {
  getMountainList,
  getMountainPagePathForRecord,
  type MountainRecord,
} from "./mountainCatalog"
import {
  getDifficultyLevel,
  getPrefectures,
  getRegion,
  parseCourse,
  type CourseInfo,
  type DifficultyLevel,
} from "./mountainMeta"
import type { Region } from "./regions"

export type GuideRow = {
  id: number
  number: number
  name: string
  href: string
  elevation: number
  prefectures: string[]
  region: Region | null
  difficulty: DifficultyLevel | null
  difficultyBasis: string | null
  course: CourseInfo | null
  modelCourse: string | null
  record: MountainRecord
}

export const HYAKUMEIZAN = getMountainList("mountains")

export const GUIDE_ROWS: GuideRow[] = [...HYAKUMEIZAN.mountains]
  .sort((a, b) => a.id - b.id)
  .map((m) => ({
    id: m.id,
    number: m.id,
    name: m.name,
    href: getMountainPagePathForRecord(m),
    elevation: m.elevation,
    prefectures: getPrefectures(m),
    region: getRegion(m),
    difficulty: getDifficultyLevel(m),
    difficultyBasis: m.difficulty?.basis ?? null,
    course: parseCourse(m.model_course),
    modelCourse: m.model_course ?? null,
    record: m,
  }))

export const GUIDE_UPDATED = "2026-11-26"
export const GUIDE_PUBLISHED = "2026-11-26"
