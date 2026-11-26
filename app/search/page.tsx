import { Suspense } from "react"
import CanonicalExplorer from "components/CanonicalExplorer"
import ListHero from "components/ListHero"
import { CANONICAL_MOUNTAINS } from "lib/mountainCatalog"

export const metadata = {
  title: "山を探す（山名検索・絞り込み）",
  description:
    "日本百名山・二百名山・三百名山・花の百名山・新日本百名山・関東百名山などに登録された山を横断して検索。地域・都道府県・標高・登頂状況で絞り込めます。",
  alternates: { canonical: "/search/" },
  robots: { index: false, follow: true },
}

export default function SearchPage() {
  return (
    <>
      <ListHero
        eyebrow="Search"
        lead={
          <p>
            登録されているすべてのリストを横断して、{CANONICAL_MOUNTAINS.length}
            の山から検索できます。
            地域・都道府県・標高・登頂状況で絞り込み、次に登る山を探しましょう。
          </p>
        }
        title="山を探す"
      />
      <div className="container" style={{ paddingTop: 24 }}>
        <Suspense fallback={null}>
          <CanonicalExplorer />
        </Suspense>
      </div>
    </>
  )
}
