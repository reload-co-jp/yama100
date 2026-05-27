import mountainsData from "../../public/mountains_new100.json"
import MountainListPage from "../../components/MountainListPage"
import {
  buildMountainListJsonLd,
  MountainListPageConfig,
} from "../../lib/mountainListPage"
import { MountainRecord } from "../../lib/mountainCatalog"
import { SITE_URL } from "../../lib/site"

const config: MountainListPageConfig = {
  listName: "新日本百名山",
  jsonLdDescription:
    "岩崎元郎が選定した新日本百名山の一覧。中高年にも登りやすい視点を加味した100座をチェックできます。",
  urlPath: "/mountains_new100/",
  numberOfItems: 100,
  storageKey: "yama_new100",
  themeColor: "#26a69a",
  totalCount: 100,
  idOffset: 301,
}

const jsonLd = buildMountainListJsonLd(mountainsData as MountainRecord[], config)

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "新日本百名山チェックリスト", item: `${SITE_URL}/mountains_new100/` },
  ],
}

export const metadata = {
  title: "新日本百名山チェックリスト",
  description:
    "岩崎元郎が選んだ新日本百名山100座のチェックリスト。ログイン不要で登頂記録をURL共有できます。",
  alternates: { canonical: "/mountains_new100/" },
  openGraph: {
    title: "新日本百名山チェックリスト",
    description:
      "岩崎元郎が選んだ新日本百名山100座のチェックリスト。ログイン不要で登頂記録をURL共有できます。",
    url: "/mountains_new100/",
    siteName: "Yama100",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "新日本百名山チェックリスト",
    description:
      "岩崎元郎が選んだ新日本百名山100座のチェックリスト。ログイン不要で登頂記録をURL共有できます。",
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
