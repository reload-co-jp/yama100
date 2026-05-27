export const dynamic = "force-static"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

import { generateListOgImage } from "../../lib/ogImage"

export default function Image() {
  return generateListOgImage(
    "New Japan's 100 Famous Mountains",
    "新日本百名山",
    "岩崎元郎が選んだ中高年にも登りやすい100座"
  )
}
