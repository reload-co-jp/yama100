import { Suspense } from "react"
import JsonLd from "components/JsonLd"
import ListHero from "components/ListHero"
import MapPageClient from "components/MapPageClient"
import { breadcrumbLd, HOME_CRUMB } from "lib/structuredData"

const TITLE = "百名山マップ｜登頂済み・未登頂を地図で確認"
const DESCRIPTION =
  "日本百名山・二百名山・三百名山などの位置を日本地図上に表示。登頂済みと未登頂を色分けし、地域・都道府県・標高で絞り込めます。"

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/map/" },
  openGraph: {
    title: `${TITLE}｜Yama100`,
    description: DESCRIPTION,
    url: "/map/",
    siteName: "Yama100",
    locale: "ja_JP",
    type: "website",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: "Yama100" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE}｜Yama100`,
    description: DESCRIPTION,
  },
}

const crumbs = [HOME_CRUMB, { href: "/map/", label: "百名山マップ" }]

export default function MapPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <ListHero
        breadcrumbs={crumbs}
        eyebrow="Mountain Map"
        lead={
          <p>
            登頂済みの山は緑、未登頂の山は白のマーカーで表示します。マーカーを押すと山名・標高を確認でき、
            その場で登頂状態を切り替えられます。
          </p>
        }
        title="百名山マップ"
      />
      <div className="container" style={{ paddingTop: 24 }}>
        <Suspense fallback={null}>
          <MapPageClient />
        </Suspense>
      </div>
    </>
  )
}
