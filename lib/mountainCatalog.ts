import mountains100 from "../public/mountains.json"
import mountains200 from "../public/mountains200.json"
import mountains300 from "../public/mountains300.json"
import mountainsFlowers from "../public/mountains_flowers.json"
import mountainsMinor12 from "../public/mountains_minor12.json"
import mountainsNew100 from "../public/mountains_new100.json"
import mountainsKanto100 from "../public/mountains_kanto100.json"

export type MountainSourcedText = {
  text: string
  source: string
}

export type MountainDifficulty = {
  level: string
  basis: string
  source: string
  referenceLinks: {
    yamap: string
    yamareco: string
  }
}

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
  history?: MountainSourcedText | null
  vegetation?: MountainSourcedText | null
  nationalPark?: MountainSourcedText | null
  difficulty?: MountainDifficulty | null
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
  shortLabel: string
  englishLabel: string
  listHref: string
  storageKey: string
  themeColor: string
  /** 共有URL（?data=）のビット列の長さ。既存の共有URLとの互換性のため変更しないこと */
  totalCount: number
  /** 共有URL（?data=）のビット位置のオフセット。既存の共有URLとの互換性のため変更しないこと */
  idOffset: number
  description: string
  aboutHref: string
  aboutLabel: string
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
    shortLabel: "百名山",
    englishLabel: "Japan's 100 Famous Mountains",
    listHref: "/",
    storageKey: "yama100",
    themeColor: "#2f7a57",
    totalCount: 100,
    idOffset: 0,
    description: "深田久弥が選定した日本を代表する100の名峰。",
    aboutHref: "/about/",
    aboutLabel: "日本百名山とは",
    mountains: mountains100 as MountainRecord[],
  },
  {
    key: "mountains200",
    label: "日本二百名山",
    shortLabel: "二百名山",
    englishLabel: "Japan's 200 Famous Mountains",
    listHref: "/mountains200/",
    storageKey: "yama200",
    themeColor: "#3b7d6e",
    totalCount: 100,
    idOffset: 100,
    description: "山と渓谷社が選定した日本二百名山のうち、百名山以外の100峰。",
    aboutHref: "/articles/mountains200/",
    aboutLabel: "二百名山とは",
    mountains: mountains200 as MountainRecord[],
  },
  {
    key: "mountains300",
    label: "日本三百名山",
    shortLabel: "三百名山",
    englishLabel: "Japan's 300 Famous Mountains",
    listHref: "/mountains300/",
    storageKey: "yama300",
    themeColor: "#2569a3",
    totalCount: 101,
    idOffset: 200,
    description:
      "山レコ準拠の日本三百名山一覧のうち、百名山・二百名山以外の101峰。",
    aboutHref: "/articles/mountains300/",
    aboutLabel: "三百名山とは",
    mountains: mountains300 as MountainRecord[],
  },
  {
    key: "mountains_flowers",
    label: "花の百名山",
    shortLabel: "花の百名山",
    englishLabel: "100 Famous Flower Mountains",
    listHref: "/mountains_flowers/",
    storageKey: "yama_flowers",
    themeColor: "#b0466a",
    totalCount: 100,
    idOffset: 401,
    description: "田中澄江が選定した、季節の花を楽しめる100の名峰。",
    aboutHref: "/articles/flowers/",
    aboutLabel: "花の百名山とは",
    mountains: mountainsFlowers as MountainRecord[],
  },
  {
    key: "mountains_minor12",
    label: "マイナー12名山",
    shortLabel: "マイナー12",
    englishLabel: "Minor 12 Mountains",
    listHref: "/mountains_minor12/",
    storageKey: "yama_minor12",
    themeColor: "#b45f1d",
    totalCount: 12,
    idOffset: 601,
    description:
      "『岳人』2002年4月号で紹介された、創造的登山を要する12の難峰。",
    aboutHref:
      "https://www.yamareco.com/modules/yamainfo/ptlist.php?groupid=55",
    aboutLabel: "ヤマレコの原典一覧",
    mountains: mountainsMinor12 as MountainRecord[],
  },
  {
    key: "mountains_new100",
    label: "新日本百名山",
    shortLabel: "新百名山",
    englishLabel: "New 100 Famous Mountains of Japan",
    listHref: "/mountains_new100/",
    storageKey: "yama_new100",
    themeColor: "#23797a",
    totalCount: 100,
    idOffset: 301,
    description: "岩崎元郎が中高年にも登りやすい視点を加味して選んだ100座。",
    aboutHref:
      "https://ja.wikipedia.org/wiki/%E6%96%B0%E6%97%A5%E6%9C%AC%E7%99%BE%E5%90%8D%E5%B1%B1",
    aboutLabel: "Wikipedia の一覧",
    mountains: mountainsNew100 as MountainRecord[],
  },
  {
    key: "mountains_kanto100",
    label: "関東百名山",
    shortLabel: "関東百名山",
    englishLabel: "100 Famous Mountains of Kanto",
    listHref: "/mountains_kanto100/",
    storageKey: "yama_kanto100",
    themeColor: "#a33a3a",
    totalCount: 100,
    idOffset: 501,
    description: "関東一都六県を中心に選定された100の名峰。",
    aboutHref:
      "https://www.yamareco.com/modules/yamainfo/ptlist.php?groupid=19",
    aboutLabel: "ヤマレコの原典一覧",
    mountains: mountainsKanto100 as MountainRecord[],
  },
] as const

export function getMountainList(key: MountainListKey): MountainListMeta {
  return MOUNTAIN_LISTS.find((list) => list.key === key)!
}

export function getMountainListByStorageKey(
  storageKey: string
): MountainListMeta | null {
  return MOUNTAIN_LISTS.find((list) => list.storageKey === storageKey) ?? null
}

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
  大和葛城山: "大和葛城山",
  葛城山: "大和葛城山",
  穂高岳: "奥穂高岳",
  奥穂高岳: "奥穂高岳",
  八ヶ岳: "赤岳",
  赤岳: "赤岳",
  雲仙岳: "普賢岳",
  普賢岳: "普賢岳",
  蒜山: "上蒜山",
  上蒜山: "上蒜山",
  赤城山: "黒檜山",
  黒檜山: "黒檜山",
}

export function normalizeMountainName(name: string) {
  const normalized = name.normalize("NFKC")
  return NAME_ALIASES[normalized] ?? normalized
}

export function getMountainSlug(name: string) {
  return encodeURIComponent(normalizeMountainName(name))
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

function getMountainRecordKey(
  mountain: Pick<
    MountainRecord,
    "name" | "latitude" | "longitude" | "elevation"
  >
) {
  return [
    normalizeMountainName(mountain.name),
    mountain.latitude.toFixed(6),
    mountain.longitude.toFixed(6),
    mountain.elevation,
  ].join("|")
}

function distanceKm(
  a: Pick<MountainRecord, "latitude" | "longitude">,
  b: Pick<MountainRecord, "latitude" | "longitude">
) {
  const latKm = (a.latitude - b.latitude) * 111
  const lngKm = (a.longitude - b.longitude) * 91
  return Math.sqrt(latKm * latKm + lngKm * lngKm)
}

type CanonicalGroup = {
  records: { list: MountainListMeta; mountain: MountainRecord }[]
  memberships: CanonicalMountainMembership[]
}

const canonicalMap = new Map<string, CanonicalGroup[]>()

const CLUSTER_DISTANCE_KM = 30

for (const list of MOUNTAIN_LISTS) {
  for (const mountain of list.mountains) {
    const canonicalName = normalizeMountainName(mountain.name)
    if (!canonicalMap.has(canonicalName)) {
      canonicalMap.set(canonicalName, [])
    }
    const groups = canonicalMap.get(canonicalName)!
    let group = groups.find((candidate) =>
      candidate.records.some(
        (record) => distanceKm(record.mountain, mountain) <= CLUSTER_DISTANCE_KM
      )
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

export const CANONICAL_MOUNTAINS: readonly CanonicalMountain[] = Array.from(
  canonicalMap.entries()
)
  .flatMap(([canonicalName, groups]) =>
    groups.map((group) => {
      const representative = chooseRepresentative(
        group.records.map((entry) => entry.mountain)
      )
      const descriptionSources = getSourceTextEntries(
        group.records,
        "description"
      )
      const accessSources = getSourceTextEntries(group.records, "access")
      const courseSources = getSourceTextEntries(group.records, "model_course")
      return {
        ...representative,
        description:
          mergeSourceTexts(descriptionSources) || representative.description,
        canonicalName,
        aliases: [
          ...new Set(group.records.map((entry) => entry.mountain.name)),
        ].sort((a, b) => a.localeCompare(b, "ja")),
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
const canonicalById = new Map(
  CANONICAL_MOUNTAINS.map((mountain) => [mountain.id, mountain])
)

export function findCanonicalMountainByName(name: string) {
  return canonicalByName.get(normalizeMountainName(name)) ?? null
}

export function findCanonicalMountainById(id: number) {
  return canonicalById.get(id) ?? null
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
  mountain: Pick<
    MountainRecord,
    "name" | "latitude" | "longitude" | "elevation"
  >
) {
  return canonicalByRecordKey.get(getMountainRecordKey(mountain)) ?? null
}

export function getMountainPagePathForRecord(
  mountain: Pick<
    MountainRecord,
    "name" | "latitude" | "longitude" | "elevation" | "id"
  >
) {
  const canonical = findCanonicalMountainByRecord(mountain)
  return canonical ? `/mountain/${canonical.id}/` : `/mountain/${mountain.id}/`
}
