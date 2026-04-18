import { FC } from "react"
import Link from "next/link"
import { Metadata } from "next"
import ArticleSources from "components/articles/ArticleSources"

export const metadata: Metadata = {
  title: "深田久弥が登った山々 | Yama100",
  description: "深田久弥の山行の記録と日本百名山への道",
  openGraph: {
    title: "深田久弥が登った山々 | Yama100",
    description: "深田久弥の山行の記録と日本百名山への道",
    url: "https://yama100.reload.co.jp/articles/mountains",
    siteName: "Yama100",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yama100.reload.co.jp" },
    { "@type": "ListItem", "position": 2, "name": "読み物一覧", "item": "https://yama100.reload.co.jp/articles" },
    { "@type": "ListItem", "position": 3, "name": "深田久弥が登った山々", "item": "https://yama100.reload.co.jp/articles/mountains" }
  ]
}

const sources = [
  {
    href: "https://yamanobunkakan.com/?page_id=87",
    label: "深田久弥山の文化館「深田久弥について」",
    note: "初登山、白山登頂、『日本百名山』連載開始、茅ヶ岳での逝去を参照。",
  },
  {
    href: "https://www.shinchosha.co.jp/book/318405",
    label: "新潮社『日本百名山 新装版』",
    note: "著者プロフィールと受賞情報。",
  },
  {
    href: "https://jac1.or.jp/document/2021102912982.html",
    label: "日本山岳会「日本山岳会に描かれた深田久弥①」",
    note: "茅ヶ岳での最期に関する補足。",
  },
] as const

const Page: FC = () => {
  return (
    <div style={{ maxWidth: "720px", margin: "40px auto", padding: "0 24px", color: "#ccc" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/articles/" style={{ color: "#7ecfb3", textDecoration: "none" }}>
        ← 読み物一覧に戻る
      </Link>
      
      <h1 style={{ color: "#fff", fontSize: "2rem", marginTop: "24px", marginBottom: "16px" }}>
        深田久弥が登った山々
      </h1>
      
      <p style={{ lineHeight: 1.8, marginBottom: "24px" }}>
        深田久弥の山行は、加賀の山々に親しんだ少年時代から始まり、日本各地の名峰、さらにヒマラヤ踏査へと広がっていきました。『日本百名山』は、その積み重ねのうえに生まれた本です。
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.25rem", marginTop: "24px", marginBottom: "12px" }}>加賀の山々から始まった歩み</h2>
      <p style={{ lineHeight: 1.8, marginBottom: "16px" }}>
        深田の最初の登山は1914年の富士写ヶ岳、白山初登頂は1918年でした。ふるさとの山を見上げながら育った体験は、その後に全国の山を歩くようになっても消えず、文化館の解説でも白山を描く文章は彼の山の文学の白眉だと位置づけられています。
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.25rem", marginTop: "24px", marginBottom: "12px" }}>全国の山と、戦後の山岳随筆</h2>
      <p style={{ lineHeight: 1.8, marginBottom: "16px" }}>
        東京帝大入学後も山への関心は続き、戦後には小説よりも山の文章を多く書くようになります。1958年にはジュガール・ヒマール、ランタン・ヒマールの踏査隊長を務め、1959年には『山と高原』で「日本百名山」の連載を開始しました。山行の範囲は、国内名山の歩きから海外踏査までかなり広いものでした。
      </p>

      <p style={{ lineHeight: 1.8 }}>
        1971年、深田は茅ヶ岳山頂近くの尾根で倒れ、そのまま帰らぬ人となりました。けれども彼の山行の足跡は、単なる登頂記録としてではなく、山をどう読み、どう書くかという文化的な遺産として残っています。
      </p>

      <ArticleSources sources={sources} />
    </div>
  )
}

export default Page
