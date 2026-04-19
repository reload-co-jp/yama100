import mountains100 from "../public/mountains.json"
import mountains200 from "../public/mountains200.json"
import mountains300 from "../public/mountains300.json"
import mountainsFlowers from "../public/mountains_flowers.json"
import mountainsMinor12 from "../public/mountains_minor12.json"
import mountainsNew100 from "../public/mountains_new100.json"

export type MountainRecord = {
  id: number
  name: string
  description: string
  location: string[]
  latitude: number
  longitude: number
  elevation: number
}

export type MountainListKey =
  | "mountains"
  | "mountains200"
  | "mountains300"
  | "mountains_flowers"
  | "mountains_minor12"
  | "mountains_new100"

type MountainListMeta = {
  key: MountainListKey
  label: string
  hrefPrefix: string
  mountains: MountainRecord[]
}

export const MOUNTAIN_LISTS: readonly MountainListMeta[] = [
  {
    key: "mountains",
    label: "日本百名山",
    hrefPrefix: "/mountains/",
    mountains: mountains100 as MountainRecord[],
  },
  {
    key: "mountains200",
    label: "日本二百名山",
    hrefPrefix: "/mountains200/",
    mountains: mountains200 as MountainRecord[],
  },
  {
    key: "mountains300",
    label: "日本三百名山",
    hrefPrefix: "/mountains300/",
    mountains: mountains300 as MountainRecord[],
  },
  {
    key: "mountains_flowers",
    label: "花の百名山",
    hrefPrefix: "/mountains_flowers/",
    mountains: mountainsFlowers as MountainRecord[],
  },
  {
    key: "mountains_minor12",
    label: "マイナー12名山",
    hrefPrefix: "/mountains_minor12/",
    mountains: mountainsMinor12 as MountainRecord[],
  },
  {
    key: "mountains_new100",
    label: "新日本百名山",
    hrefPrefix: "/mountains_new100/",
    mountains: mountainsNew100 as MountainRecord[],
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

function normalizeName(name: string) {
  const normalized = name.normalize("NFKC")
  return NAME_ALIASES[normalized] ?? normalized
}

export function findRelatedMountainLinks(
  currentList: MountainListKey,
  mountain: Pick<MountainRecord, "id" | "name">
) {
  const targetName = normalizeName(mountain.name)

  return MOUNTAIN_LISTS.flatMap((list) =>
    list.mountains
      .filter((candidate) => normalizeName(candidate.name) === targetName)
      .filter(
        (candidate) => !(list.key === currentList && candidate.id === mountain.id)
      )
      .map((candidate) => ({
        key: `${list.key}-${candidate.id}`,
        label: list.label,
        href: `${list.hrefPrefix}${candidate.id}/`,
      }))
  )
}
