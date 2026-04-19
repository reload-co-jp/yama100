import { FC, Suspense } from "react"
import MountainApp from "../../components/MountainApp"
import mountainsData from "../../public/mountains_new100.json"
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
  name: "新日本百名山",
  description:
    "岩崎元郎が選定した新日本百名山の一覧。中高年にも登りやすい視点を加味した100座をチェックできます。",
  url: `${SITE_URL}/mountains_new100/`,
  numberOfItems: 100,
  itemListElement: [...(mountainsData as Mountain[])]
    .sort((a, b) => a.id - b.id)
    .map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.name,
      url: `${SITE_URL}/mountains_new100/${m.id}/`,
    })),
}

export const metadata = {
  title: "新日本百名山チェックリスト",
  description:
    "岩崎元郎が選んだ新日本百名山100座のチェックリスト。ログイン不要で登頂記録をURL共有できます。",
  alternates: { canonical: "/mountains_new100/" },
}

const Page: FC = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={null}>
        <MountainApp
          mountains={mountainsData as Mountain[]}
          storageKey="yama_new100"
          themeColor="#26a69a"
          pathPrefix="/mountains_new100/"
          totalCount={100}
          idOffset={0}
        />
      </Suspense>
    </>
  )
}

export default Page
