import type { Metadata } from "next"

export function guideMetadata(
  path: string,
  title: string,
  description: string
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title}｜Yama100`,
      description,
      url: path,
      siteName: "Yama100",
      locale: "ja_JP",
      type: "article",
      images: [
        {
          url: "/hyakumeizan/opengraph-image",
          width: 1200,
          height: 630,
          alt: "日本百名山ガイド",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title}｜Yama100`,
      description,
    },
  }
}
