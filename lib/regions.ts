// 都道府県と地方区分の対応表（八地方区分）
// 山が複数の都道府県にまたがる場合は、データの先頭に記載された都道府県で地方を判定する。

export type RegionKey =
  | "hokkaido"
  | "tohoku"
  | "kanto"
  | "chubu"
  | "kinki"
  | "chugoku"
  | "shikoku"
  | "kyushu"

export type Region = {
  key: RegionKey
  label: string
  prefectures: readonly string[]
}

export const REGIONS: readonly Region[] = [
  { key: "hokkaido", label: "北海道", prefectures: ["北海道"] },
  {
    key: "tohoku",
    label: "東北",
    prefectures: ["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
  },
  {
    key: "kanto",
    label: "関東",
    prefectures: [
      "茨城県",
      "栃木県",
      "群馬県",
      "埼玉県",
      "千葉県",
      "東京都",
      "神奈川県",
    ],
  },
  {
    key: "chubu",
    label: "中部",
    prefectures: [
      "新潟県",
      "富山県",
      "石川県",
      "福井県",
      "山梨県",
      "長野県",
      "岐阜県",
      "静岡県",
      "愛知県",
    ],
  },
  {
    key: "kinki",
    label: "近畿",
    prefectures: [
      "三重県",
      "滋賀県",
      "京都府",
      "大阪府",
      "兵庫県",
      "奈良県",
      "和歌山県",
    ],
  },
  {
    key: "chugoku",
    label: "中国",
    prefectures: ["鳥取県", "島根県", "岡山県", "広島県", "山口県"],
  },
  {
    key: "shikoku",
    label: "四国",
    prefectures: ["徳島県", "香川県", "愛媛県", "高知県"],
  },
  {
    key: "kyushu",
    label: "九州・沖縄",
    prefectures: [
      "福岡県",
      "佐賀県",
      "長崎県",
      "熊本県",
      "大分県",
      "宮崎県",
      "鹿児島県",
      "沖縄県",
    ],
  },
] as const

/** 北から南への都道府県の並び（JIS X 0401 順） */
export const PREFECTURE_ORDER: readonly string[] = REGIONS.flatMap(
  (region) => region.prefectures
)

const PREFECTURE_TO_REGION = new Map<string, Region>()
for (const region of REGIONS) {
  for (const pref of region.prefectures) PREFECTURE_TO_REGION.set(pref, region)
}

const SHORT_TO_FULL = new Map<string, string>()
for (const pref of PREFECTURE_ORDER) {
  const short = pref === "北海道" ? pref : pref.replace(/[都府県]$/, "")
  SHORT_TO_FULL.set(short, pref)
  SHORT_TO_FULL.set(pref, pref)
}

/** 「群馬」「群馬県」などの表記ゆれを正式名称にそろえる */
export function normalizePrefecture(name: string): string {
  const trimmed = name.normalize("NFKC").trim()
  return SHORT_TO_FULL.get(trimmed) ?? trimmed
}

export function normalizePrefectures(location: readonly string[]): string[] {
  return [...new Set(location.map(normalizePrefecture))]
}

export function getRegionByPrefecture(prefecture: string): Region | null {
  return PREFECTURE_TO_REGION.get(normalizePrefecture(prefecture)) ?? null
}

export function getRegionForLocation(
  location: readonly string[]
): Region | null {
  for (const pref of location) {
    const region = getRegionByPrefecture(pref)
    if (region) return region
  }
  return null
}

export function getRegionByKey(key: string): Region | null {
  return REGIONS.find((region) => region.key === key) ?? null
}

export function prefectureIndex(prefecture: string): number {
  const index = PREFECTURE_ORDER.indexOf(normalizePrefecture(prefecture))
  return index === -1 ? PREFECTURE_ORDER.length : index
}
