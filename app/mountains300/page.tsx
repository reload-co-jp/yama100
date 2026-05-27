import mountainsData from "../../public/mountains300.json"
import MountainListPage from "../../components/MountainListPage"
import {
  buildMountainListJsonLd,
  MountainListPageConfig,
} from "../../lib/mountainListPage"
import { MountainRecord } from "../../lib/mountainCatalog"
import { SITE_URL } from "../../lib/site"

const config: MountainListPageConfig = {
  listName: "日本三百名山",
  jsonLdDescription:
    "山レコ準拠の日本三百名山一覧のうち、百名山・二百名山以外の101峰の一覧",
  urlPath: "/mountains300/",
  numberOfItems: 101,
  storageKey: "yama300",
  themeColor: "#2196f3",
  totalCount: 101,
  idOffset: 200,
}

const jsonLd = buildMountainListJsonLd(mountainsData as MountainRecord[], config)

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "日本三百名山チェックリスト", item: `${SITE_URL}/mountains300/` },
  ],
}

export const metadata = {
  title: "日本三百名山チェックリスト",
  description:
    "山レコ準拠の日本三百名山一覧のうち、百名山・二百名山以外の101峰。登頂記録をチェックできます。ログイン不要でURLで共有できます。",
  alternates: { canonical: "/mountains300/" },
  openGraph: {
    title: "日本三百名山チェックリスト",
    description:
      "山レコ準拠の日本三百名山一覧のうち、百名山・二百名山以外の101峰。登頂記録をチェックできます。ログイン不要でURLで共有できます。",
    url: "/mountains300/",
    siteName: "Yama100",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "日本三百名山チェックリスト",
    description:
      "山レコ準拠の日本三百名山一覧のうち、百名山・二百名山以外の101峰。登頂記録をチェックできます。ログイン不要でURLで共有できます。",
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
