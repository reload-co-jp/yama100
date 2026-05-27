import mountainsData from "../public/mountains.json"
import MountainListPage from "../components/MountainListPage"
import {
  buildMountainListJsonLd,
  MountainListPageConfig,
} from "../lib/mountainListPage"
import { MountainRecord } from "../lib/mountainCatalog"
import { SITE_URL } from "../lib/site"

const config: MountainListPageConfig = {
  listName: "日本百名山",
  jsonLdDescription: "深田久弥が選定した日本を代表する100の名峰の一覧",
  urlPath: "/",
  numberOfItems: 100,
  storageKey: "yama100",
  themeColor: "#4caf50",
  totalCount: 100,
  idOffset: 0,
}

const jsonLd = buildMountainListJsonLd(mountainsData as MountainRecord[], config)

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Yama100",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search/?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
      <MountainListPage
        config={config}
        mountains={mountainsData as MountainRecord[]}
        jsonLd={jsonLd}
      />
    </>
  )
}
