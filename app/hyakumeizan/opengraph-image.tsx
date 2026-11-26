export const dynamic = "force-static"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "日本百名山ガイド｜Yama100"

import { generateListOgImage } from "../../lib/ogImage"

export default function Image() {
  return generateListOgImage(
    "Japan's 100 Famous Mountains Guide",
    "日本百名山ガイド",
    "一覧・標高ランキング・地域別・都道府県別・難易度別・日帰りの目安"
  )
}
