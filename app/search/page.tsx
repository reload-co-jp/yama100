import SearchPageClient from "components/SearchPageClient"
import { Suspense } from "react"

export const metadata = {
  title: "山名検索",
  description:
    "百名山・二百名山・三百名山・花の百名山・マイナー12名山を横断して山名検索できます。",
  alternates: { canonical: "/search/" },
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageClient />
    </Suspense>
  )
}
