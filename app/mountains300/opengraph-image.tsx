export const dynamic = "force-static"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

import { generateListOgImage } from "../../lib/ogImage"

export default function Image() {
  return generateListOgImage(
    "Japan's 300 Famous Mountains",
    "日本三百名山",
    "日本山岳会が選定した300の名峰のうち百・二百名山以外の101座"
  )
}
