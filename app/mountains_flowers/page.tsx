import { FC } from "react"
import MountainApp from "../../components/MountainApp"
import mountainsData from "../../public/mountains_flowers.json"
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
  name: "花の百名山",
  description: "田中澄江が選定した季節の花を楽しめる100の名峰の一覧",
  url: `${SITE_URL}/mountains_flowers/`,
  numberOfItems: 100,
  itemListElement: (mountainsData as Mountain[]).map((m, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: m.name,
    url: `${SITE_URL}/mountains_flowers/${m.id}/`,
  })),
}

const Page: FC = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MountainApp
        mountains={mountainsData as Mountain[]}
        storageKey="yama_flowers"
        themeColor="#e91e63"
        pathPrefix="/mountains_flowers/"
        totalCount={100}
        idOffset={0}
      />
    </>
  )
}

export default Page
