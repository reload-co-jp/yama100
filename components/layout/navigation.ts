import { MOUNTAIN_LISTS } from "../../lib/mountainCatalog"

export const PRIMARY_NAV = [
  { href: "/", label: "ホーム" },
  { href: "/search/", label: "山を探す" },
  { href: "/map/", label: "地図" },
  { href: "/summary/", label: "登頂記録" },
  { href: "/share/", label: "シェア画像" },
  { href: "/hyakumeizan/", label: "百名山ガイド" },
] as const

export const LIST_NAV = MOUNTAIN_LISTS.map((list) => ({
  href: list.listHref === "/" ? "/#list" : list.listHref,
  label: list.label,
}))

export const GUIDE_NAV = [
  { href: "/hyakumeizan/", label: "日本百名山一覧" },
  { href: "/hyakumeizan/ranking/", label: "標高ランキング" },
  { href: "/hyakumeizan/region/", label: "地域別一覧" },
  { href: "/hyakumeizan/prefecture/", label: "都道府県別一覧" },
  { href: "/hyakumeizan/difficulty/", label: "難易度別一覧" },
  { href: "/hyakumeizan/day-trip/", label: "日帰りの目安" },
  { href: "/hyakumeizan/beginner/", label: "初心者向けガイド" },
] as const

export const OTHER_NAV = [
  { href: "/articles/", label: "読み物" },
  { href: "/gear-checklist/", label: "山装備チェック" },
  { href: "/settings/", label: "データ管理" },
  { href: "/about/", label: "このサイトについて" },
] as const
