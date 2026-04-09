import { FC } from "react"
import MountainApp from "components/MountainApp"
import mountainsData from "../public/mountains.json"
import { SITE_URL } from "../lib/site"

type Mountain = { id: number; name: string; elevation: number }

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "日本百名山",
  description: "深田久弥が選定した日本を代表する100の名峰の一覧",
  url: `${SITE_URL}/`,
  numberOfItems: 100,
  itemListElement: (mountainsData as Mountain[]).map((m, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: m.name,
    url: `${SITE_URL}/mountains/${m.id}/`,
  })),
}

const Page: FC = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MountainApp />
    </>
  )
}

export default Page
