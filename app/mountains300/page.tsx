import { FC } from "react"
import UnifiedMountainApp from "components/UnifiedMountainApp"
import HeroSection from "components/HeroSection"
import mountainsData from "../../public/mountains300.json"
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
  name: "日本三百名山",
  description: "山と渓谷社が選定した日本を代表する300の名峰のうち、百名山・二百名山以外の100峰の一覧",
  url: `${SITE_URL}/mountains300/`,
  numberOfItems: 100,
  itemListElement: (mountainsData as Mountain[]).map((m, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: m.name,
    url: `${SITE_URL}/mountains300/${m.id}/`,
  })),
}

export const metadata = {
  title: "日本三百名山チェックリスト",
  description: "山と渓谷社が選定した日本三百名山のうち、百名山・二百名山以外の100峰。登頂記録をチェックできます。ログイン不要でURLで共有できます。",
  alternates: { canonical: "/mountains300/" },
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
        storageKey="yama300"
        themeColor="#2196f3"
        pathPrefix="/mountains300/"
        heroSection={<HeroSection count={0} type="300" />}
        totalCount={100}
        idOffset={200}
      />
    </>
  )
}

export default Page
