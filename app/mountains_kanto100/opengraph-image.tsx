export const dynamic = "force-static"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

import { generateListOgImage } from "../../lib/ogImage"

export default function Image() {
  return generateListOgImage(
    "Kanto's 100 Famous Mountains",
    "関東百名山",
    "関東一都六県を中心に選定された100の名峰"
  )
}
