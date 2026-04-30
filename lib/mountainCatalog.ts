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

export type CanonicalMountain = MountainRecord & {
  canonicalName: string
  slug: string
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

function chooseRepresentative(records: MountainRecord[]) {
  return [...records].sort((a, b) => {
    const accessScore = (b.access ? 1 : 0) - (a.access ? 1 : 0)
    if (accessScore !== 0) return accessScore
    return b.description.length - a.description.length
  })[0]
}

const canonicalMap = new Map<
  string,
  {
    memberships: CanonicalMountainMembership[]
    records: MountainRecord[]
  }
>()

for (const list of MOUNTAIN_LISTS) {
  for (const mountain of list.mountains) {
    const canonicalName = normalizeMountainName(mountain.name)
    if (!canonicalMap.has(canonicalName)) {
      canonicalMap.set(canonicalName, { memberships: [], records: [] })
    }
    const group = canonicalMap.get(canonicalName)!
    group.records.push(mountain)
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

export const CANONICAL_MOUNTAINS: readonly CanonicalMountain[] = Array.from(
  canonicalMap.entries()
)
  .map(([canonicalName, group]) => {
    const representative = chooseRepresentative(group.records)
    return {
      ...representative,
      canonicalName,
      slug: getMountainSlug(canonicalName),
      memberships: group.memberships.sort((a, b) =>
        a.label.localeCompare(b.label, "ja")
      ),
    }
  })
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
