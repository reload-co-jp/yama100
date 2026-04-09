import { FC } from "react"
import Mountain200App from "components/Mountain200App"
import mountainsData from "../../public/mountains200.json"
import { SITE_URL } from "../../lib/site"

type Mountain = { id: number; name: string; elevation: number }

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "日本二百名山",
  description: "山と渓谷社が選定した日本を代表する200の名峰のうち、百名山以外の100峰の一覧",
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
  description: "山と渓谷社が選定した日本二百名山のうち、百名山以外の100峰。登頂記録をチェックできます。ログイン不要でURLで共有できます。",
  alternates: { canonical: "/mountains200/" },
}

const Page: FC = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Mountain200App />
    </>
  )
}

export default Page
