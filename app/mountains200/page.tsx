import mountainsData from "../../public/mountains200.json"
import MountainListPage from "../../components/MountainListPage"
import {
  buildMountainListJsonLd,
  MountainListPageConfig,
} from "../../lib/mountainListPage"
import { MountainRecord } from "../../lib/mountainCatalog"
import { SITE_URL } from "../../lib/site"

const config: MountainListPageConfig = {
  listName: "日本二百名山",
  jsonLdDescription:
    "山と渓谷社が選定した日本を代表する200の名峰のうち、百名山以外の100峰の一覧",
  urlPath: "/mountains200/",
  numberOfItems: 100,
  storageKey: "yama200",
  themeColor: "#4caf50",
  totalCount: 100,
  idOffset: 100,
}

const jsonLd = buildMountainListJsonLd(mountainsData as MountainRecord[], config)

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "日本二百名山チェックリスト", item: `${SITE_URL}/mountains200/` },
  ],
}

export const metadata = {
  title: "日本二百名山チェックリスト",
  description:
    "山と渓谷社が選定した日本二百名山のうち、百名山以外の100峰。登頂記録をチェックできます。ログイン不要でURLで共有できます。",
  alternates: { canonical: "/mountains200/" },
  openGraph: {
    title: "日本二百名山チェックリスト",
    description:
      "山と渓谷社が選定した日本二百名山のうち、百名山以外の100峰。登頂記録をチェックできます。ログイン不要でURLで共有できます。",
    url: "/mountains200/",
    siteName: "Yama100",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "日本二百名山チェックリスト",
    description:
      "山と渓谷社が選定した日本二百名山のうち、百名山以外の100峰。登頂記録をチェックできます。ログイン不要でURLで共有できます。",
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
