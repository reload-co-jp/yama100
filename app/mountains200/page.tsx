import { FC } from "react"
import UnifiedMountainApp from "components/UnifiedMountainApp"
import mountainsData from "../../public/mountains200.json"
import { SITE_URL } from "../../lib/site"

type Mountain = {
  id: number
  name: string
  description: string
  location: string[]
  latitude: number
  longitude: number
  elevation: number
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "日本二百名山",
  description:
    "山と渓谷社が選定した日本を代表する200の名峰のうち、百名山以外の100峰の一覧",
  url: `${SITE_URL}/mountains200/`,
  numberOfItems: 100,
  itemListElement: (mountainsData as Mountain[]).map((m, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: m.name,
    url: `${SITE_URL}/mountains200/${m.id}/`,
  })),
}

export const metadata = {
  title: "日本二百名山チェックリスト",
  description:
    "山と渓谷社が選定した日本二百名山のうち、百名山以外の100峰。登頂記録をチェックできます。ログイン不要でURLで共有できます。",
  alternates: { canonical: "/mountains200/" },
}

const Page: FC = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UnifiedMountainApp
        mountains={mountainsData as Mountain[]}
        storageKey="yama200"
        themeColor="#4caf50"
        pathPrefix="/mountains200/"
        totalCount={100}
        idOffset={100}
      />
    </>
  )
}

export default Page
