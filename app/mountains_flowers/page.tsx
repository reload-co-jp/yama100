import mountainsData from "../../public/mountains_flowers.json"
import MountainListPage from "../../components/MountainListPage"
import {
  buildMountainListJsonLd,
  MountainListPageConfig,
} from "../../lib/mountainListPage"
import { MountainRecord } from "../../lib/mountainCatalog"
import { SITE_URL } from "../../lib/site"

const config: MountainListPageConfig = {
  listName: "花の百名山",
  jsonLdDescription: "田中澄江が選定した季節の花を楽しめる100の名峰の一覧",
  urlPath: "/mountains_flowers/",
  numberOfItems: 100,
  storageKey: "yama_flowers",
  themeColor: "#e91e63",
  totalCount: 100,
  idOffset: 0,
}

const jsonLd = buildMountainListJsonLd(mountainsData as MountainRecord[], config)

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "花の百名山チェックリスト", item: `${SITE_URL}/mountains_flowers/` },
  ],
}

export const metadata = {
  title: "花の百名山チェックリスト",
  description:
    "田中澄江が選定した花の百名山100座のチェックリスト。季節の花を楽しめる名峰の登頂記録をログイン不要でURL共有できます。",
  alternates: { canonical: "/mountains_flowers/" },
  openGraph: {
    title: "花の百名山チェックリスト",
    description:
      "田中澄江が選定した花の百名山100座のチェックリスト。季節の花を楽しめる名峰の登頂記録をログイン不要でURL共有できます。",
    url: "/mountains_flowers/",
    siteName: "Yama100",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "花の百名山チェックリスト",
    description:
      "田中澄江が選定した花の百名山100座のチェックリスト。季節の花を楽しめる名峰の登頂記録をログイン不要でURL共有できます。",
  },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <MountainListPage
        config={config}
        mountains={mountainsData as MountainRecord[]}
        jsonLd={jsonLd}
      />
    </>
  )
}
