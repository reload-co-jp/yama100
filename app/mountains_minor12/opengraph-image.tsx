export const dynamic = "force-static"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

import { generateListOgImage } from "../../lib/ogImage"

export default function Image() {
  return generateListOgImage(
    "Minor 12 Mountains",
    "マイナー12名山",
    "創造的登山を要する12の秘境名山"
  )
}
