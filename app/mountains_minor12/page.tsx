import { FC, Suspense } from "react"
import MountainApp from "../../components/MountainApp"
import mountainsData from "../../public/mountains_minor12.json"
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
  name: "マイナー12名山",
  description:
    "ヤマレコ準拠のマイナー12名山一覧。『岳人 2002年4月号』で紹介された創造的登山を要する12座をチェックできます。",
  url: `${SITE_URL}/mountains_minor12/`,
  numberOfItems: 12,
  itemListElement: [...(mountainsData as Mountain[])]
    .sort((a, b) => a.id - b.id)
    .map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.name,
      url: `${SITE_URL}/mountains_minor12/${m.id}/`,
    })),
}

export const metadata = {
  title: "マイナー12名山チェックリスト",
  description:
    "ヤマレコ準拠のマイナー12名山一覧。ログイン不要で登頂記録をチェックしてURLで共有できます。",
  alternates: { canonical: "/mountains_minor12/" },
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
          storageKey="yama_minor12"
          themeColor="#ff9800"
          pathPrefix="/mountains_minor12/"
          totalCount={12}
          idOffset={0}
        />
      </Suspense>
    </>
  )
}

export default Page
