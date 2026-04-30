import mountains100 from "../public/mountains.json"
import mountains200 from "../public/mountains200.json"
import mountains300 from "../public/mountains300.json"
import mountainsFlowers from "../public/mountains_flowers.json"
import mountainsMinor12 from "../public/mountains_minor12.json"
import mountainsNew100 from "../public/mountains_new100.json"
import mountainsKanto100 from "../public/mountains_kanto100.json"

export type MountainRecord = {
  id: number
  name: string
  description: string
  location: string[]
  latitude: number
  longitude: number
  elevation: number
  access?: string
  model_course?: string
}

export type MountainListKey =
  | "mountains"
  | "mountains200"
  | "mountains300"
  | "mountains_flowers"
  | "mountains_minor12"
  | "mountains_new100"
  | "mountains_kanto100"

export type MountainListMeta = {
  key: MountainListKey
  label: string
  listHref: string
  storageKey: string
  themeColor: string
  mountains: MountainRecord[]
}

export type CanonicalMountainMembership = {
  id: number
  label: string
  listHref: string
  listKey: MountainListKey
  storageKey: string
  themeColor: string
}

export type CanonicalMountainSourceText = {
  label: string
  text: string
}

export type CanonicalMountain = MountainRecord & {
  canonicalName: string
  slug: string
  aliases: string[]
  descriptionSources: CanonicalMountainSourceText[]
  accessSources: CanonicalMountainSourceText[]
  courseSources: CanonicalMountainSourceText[]
  memberships: CanonicalMountainMembership[]
}

export const MOUNTAIN_LISTS: readonly MountainListMeta[] = [
  {
    key: "mountains",
    label: "日本百名山",
    listHref: "/",
    storageKey: "yama100",
    themeColor: "#4caf50",
    mountains: mountains100 as MountainRecord[],
  },
  {
    key: "mountains200",
    label: "日本二百名山",
    listHref: "/mountains200/",
    storageKey: "yama200",
    themeColor: "#4caf50",
    mountains: mountains200 as MountainRecord[],
  },
  {
    key: "mountains300",
    label: "日本三百名山",
    listHref: "/mountains300/",
    storageKey: "yama300",
    themeColor: "#2196f3",
    mountains: mountains300 as MountainRecord[],
  },
  {
    key: "mountains_flowers",
    label: "花の百名山",
    listHref: "/mountains_flowers/",
    storageKey: "yama_flowers",
    themeColor: "#e91e63",
    mountains: mountainsFlowers as MountainRecord[],
  },
  {
    key: "mountains_minor12",
    label: "マイナー12名山",
    listHref: "/mountains_minor12/",
    storageKey: "yama_minor12",
    themeColor: "#ff9800",
    mountains: mountainsMinor12 as MountainRecord[],
  },
  {
    key: "mountains_new100",
    label: "新日本百名山",
    listHref: "/mountains_new100/",
    storageKey: "yama_new100",
    themeColor: "#26a69a",
    mountains: mountainsNew100 as MountainRecord[],
  },
  {
    key: "mountains_kanto100",
    label: "関東百名山",
    listHref: "/mountains_kanto100/",
    storageKey: "yama_kanto100",
    themeColor: "#c62828",
    mountains: mountainsKanto100 as MountainRecord[],
  },
] as const

const NAME_ALIASES: Record<string, string> = {
  利尻岳: "利尻山",
  利尻山: "利尻山",
  後方羊蹄山: "羊蹄山",
  羊蹄山: "羊蹄山",
  吾妻山: "西吾妻山",
  西吾妻山: "西吾妻山",
  蔵王連峰: "蔵王山",
  蔵王山: "蔵王山",
  九重連山: "九重山",
  九重山: "九重山",
}

export function normalizeMountainName(name: string) {
  const normalized = name.normalize("NFKC")
  return NAME_ALIASES[normalized] ?? normalized
}

export function getMountainSlug(name: string) {
  return encodeURIComponent(normalizeMountainName(name))
}

export function getMountainPagePath(name: string) {
  return `/mountain/${getMountainSlug(name)}/`
}

function getSourceTextEntries(
  records: { list: MountainListMeta; mountain: MountainRecord }[],
  field: "description" | "access" | "model_course"
) {
  const byText = new Map<string, CanonicalMountainSourceText>()
  const entries: CanonicalMountainSourceText[] = []
  for (const { list, mountain } of records) {
    const text = mountain[field]?.trim()
    if (!text) continue
    const existing = byText.get(text)
    if (existing) {
      existing.label = `${existing.label} / ${list.label}`
      continue
    }
    const entry = { label: list.label, text }
    byText.set(text, entry)
    entries.push(entry)
  }
  return entries
}

function mergeSourceTexts(entries: CanonicalMountainSourceText[]) {
  return entries.map((entry) => entry.text).join(" ")
}

function chooseRepresentative(records: MountainRecord[]) {
  return [...records].sort((a, b) => {
    const accessScore = (b.access ? 1 : 0) - (a.access ? 1 : 0)
    if (accessScore !== 0) return accessScore
    return b.description.length - a.description.length
  })[0]
}

function getMountainRecordKey(mountain: Pick<MountainRecord, "name" | "latitude" | "longitude" | "elevation">) {
  return [
    normalizeMountainName(mountain.name),
    mountain.latitude.toFixed(6),
    mountain.longitude.toFixed(6),
    mountain.elevation,
  ].join("|")
}

function distanceKm(a: Pick<MountainRecord, "latitude" | "longitude">, b: Pick<MountainRecord, "latitude" | "longitude">) {
  const latKm = (a.latitude - b.latitude) * 111
  const lngKm = (a.longitude - b.longitude) * 91
  return Math.sqrt(latKm * latKm + lngKm * lngKm)
}

function buildCanonicalSlug(
  canonicalName: string,
  representative: MountainRecord,
  needsDisambiguation: boolean
) {
  const raw = needsDisambiguation
    ? `${canonicalName}-${representative.location.join("-")}`
    : canonicalName
  return encodeURIComponent(raw)
}

type CanonicalGroup = {
  records: { list: MountainListMeta; mountain: MountainRecord }[]
  memberships: CanonicalMountainMembership[]
}

const canonicalMap = new Map<
  string,
  CanonicalGroup[]
>()

const CLUSTER_DISTANCE_KM = 30

for (const list of MOUNTAIN_LISTS) {
  for (const mountain of list.mountains) {
    const canonicalName = normalizeMountainName(mountain.name)
    if (!canonicalMap.has(canonicalName)) {
      canonicalMap.set(canonicalName, [])
    }
    const groups = canonicalMap.get(canonicalName)!
    let group = groups.find((candidate) =>
      candidate.records.some((record) => distanceKm(record.mountain, mountain) <= CLUSTER_DISTANCE_KM)
    )
    if (!group) {
      group = { records: [], memberships: [] }
      groups.push(group)
    }
    group.records.push({ list, mountain })
    group.memberships.push({
      id: mountain.id,
      label: list.label,
      listHref: list.listHref,
      listKey: list.key,
      storageKey: list.storageKey,
      themeColor: list.themeColor,
    })
  }
}

export const CANONICAL_MOUNTAINS: readonly CanonicalMountain[] = Array.from(canonicalMap.entries())
  .flatMap(([canonicalName, groups]) =>
    groups.map((group) => {
      const representative = chooseRepresentative(group.records.map((entry) => entry.mountain))
      const descriptionSources = getSourceTextEntries(group.records, "description")
      const accessSources = getSourceTextEntries(group.records, "access")
      const courseSources = getSourceTextEntries(group.records, "model_course")
      return {
        ...representative,
        description: mergeSourceTexts(descriptionSources) || representative.description,
        canonicalName,
        slug: buildCanonicalSlug(canonicalName, representative, groups.length > 1),
        aliases: [...new Set(group.records.map((entry) => entry.mountain.name))].sort((a, b) =>
          a.localeCompare(b, "ja")
        ),
        descriptionSources,
        accessSources,
        courseSources,
        memberships: group.memberships.sort((a, b) =>
          a.label.localeCompare(b.label, "ja")
        ),
      }
    })
  )
  .sort((a, b) => a.canonicalName.localeCompare(b.canonicalName, "ja"))

const canonicalByName = new Map(
  CANONICAL_MOUNTAINS.map((mountain) => [mountain.canonicalName, mountain])
)
const canonicalBySlug = new Map(
  CANONICAL_MOUNTAINS.map((mountain) => [mountain.slug, mountain])
)

export function findCanonicalMountainByName(name: string) {
  return canonicalByName.get(normalizeMountainName(name)) ?? null
}

export function findCanonicalMountainBySlug(slug: string) {
  return canonicalBySlug.get(slug) ?? null
}

const canonicalByRecordKey = new Map<string, CanonicalMountain>()

for (const mountain of CANONICAL_MOUNTAINS) {
  canonicalByRecordKey.set(getMountainRecordKey(mountain), mountain)
}

for (const list of MOUNTAIN_LISTS) {
  for (const mountain of list.mountains) {
    const recordKey = getMountainRecordKey(mountain)
    if (canonicalByRecordKey.has(recordKey)) continue
    const canonical = CANONICAL_MOUNTAINS.find(
      (candidate) =>
        candidate.canonicalName === normalizeMountainName(mountain.name) &&
        distanceKm(candidate, mountain) <= CLUSTER_DISTANCE_KM
    )
    if (canonical) canonicalByRecordKey.set(recordKey, canonical)
  }
}

export function findCanonicalMountainByRecord(
  mountain: Pick<MountainRecord, "name" | "latitude" | "longitude" | "elevation">
) {
  return canonicalByRecordKey.get(getMountainRecordKey(mountain)) ?? null
}

export function getMountainPagePathForRecord(
  mountain: Pick<MountainRecord, "name" | "latitude" | "longitude" | "elevation">
) {
  const canonical = findCanonicalMountainByRecord(mountain)
  return canonical ? `/mountain/${canonical.slug}/` : getMountainPagePath(mountain.name)
}
