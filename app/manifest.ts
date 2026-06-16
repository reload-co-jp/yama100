import type { MetadataRoute } from "next"

export const dynamic = "force-static"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Yama100 - 日本百名山チェックリスト",
    short_name: "Yama100",
    description: "深田久弥が選んだ日本百名山の登頂記録をチェックできるアプリ。ログイン不要でURLで共有できます。",
    start_url: "/",
    display: "standalone",
    background_color: "#222222",
    theme_color: "#333333",
    orientation: "portrait-primary",
    lang: "ja",
    icons: [
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  }
}
