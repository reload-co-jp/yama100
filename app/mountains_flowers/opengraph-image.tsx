export const dynamic = "force-static"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

import { generateListOgImage } from "../../lib/ogImage"

export default function Image() {
  return generateListOgImage(
    "Flowers of the 100 Famous Mountains",
    "花の百名山",
    "田中澄江が選定した季節の花を楽しめる100の名峰"
  )
}
