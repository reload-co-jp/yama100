import { Suspense } from "react"
import Dashboard from "../components/home/Dashboard"
import ExploreLists from "../components/home/ExploreLists"
import TopHero from "../components/home/TopHero"
import JsonLd from "../components/JsonLd"
import ListExplorer from "../components/ListExplorer"
import {
  getMountainList,
  getMountainPagePathForRecord,
} from "../lib/mountainCatalog"
import { itemListLd } from "../lib/structuredData"
import { SITE_URL } from "../lib/site"
import styles from "./page.module.css"

const list = getMountainList("mountains")

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Yama100",
  alternateName: "日本百名山の登頂記録・チェックリスト",
  url: `${SITE_URL}/`,
  inLanguage: "ja",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/search/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

const listLd = itemListLd({
  name: "日本百名山",
  description: "深田久弥が選定した日本を代表する100の名峰の一覧",
  path: "/",
  items: [...list.mountains]
    .sort((a, b) => a.id - b.id)
    .map((m) => ({ name: m.name, path: getMountainPagePathForRecord(m) })),
})

export default function Page() {
  return (
    <>
      <JsonLd data={[websiteLd, listLd]} />
      <TopHero />
      <Dashboard />
      <ExploreLists />
      <section
        aria-labelledby="list-title"
        className={styles.listSection}
        id="list"
      >
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-eyebrow">
                Japan&apos;s 100 Famous Mountains
              </p>
              <h2 className="section-title" id="list-title">
                日本百名山 一覧
              </h2>
              <p className="section-lead">
                深田久弥が選んだ100の名峰。登った山の「登頂済みにする」を押して記録しましょう。
              </p>
            </div>
          </div>
          <Suspense fallback={null}>
            <ListExplorer headingId="hyakumeizan-list" listKey="mountains" />
          </Suspense>
        </div>
      </section>
    </>
  )
}
