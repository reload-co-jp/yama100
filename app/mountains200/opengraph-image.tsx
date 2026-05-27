export const dynamic = "force-static"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

import { generateListOgImage } from "../../lib/ogImage"

export default function Image() {
  return generateListOgImage(
    "Japan's 200 Famous Mountains",
    "日本二百名山",
    "山と渓谷社が選定した200の名峰のうち百名山以外の100座"
  )
}
