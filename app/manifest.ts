import type { MetadataRoute } from "next"

export const dynamic = "force-static"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Yama100 - 日本百名山の登頂記録",
    short_name: "Yama100",
    description:
      "日本百名山などの登頂記録を管理・可視化・共有できる登山記録サービス。ログイン不要。",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f5f0",
    theme_color: "#1e4d3a",
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
