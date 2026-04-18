import { FC } from "react"
import Link from "next/link"
import { Metadata } from "next"
import ArticleSources from "components/articles/ArticleSources"

export const metadata: Metadata = {
  title: "深田久弥について | Yama100",
  description: "日本百名山の著者、深田久弥の生涯と功績についての解説",
  openGraph: {
    title: "深田久弥について | Yama100",
    description: "日本百名山の著者、深田久弥の生涯と功績についての解説",
    url: "https://yama100.reload.co.jp/articles/fukada",
    siteName: "Yama100",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yama100.reload.co.jp" },
    { "@type": "ListItem", "position": 2, "name": "読み物一覧", "item": "https://yama100.reload.co.jp/articles" },
    { "@type": "ListItem", "position": 3, "name": "深田久弥について", "item": "https://yama100.reload.co.jp/articles/fukada" }
  ]
}

const sources = [
  {
    href: "https://yamanobunkakan.com/?page_id=87",
    label: "深田久弥山の文化館「深田久弥について」",
    note: "生年、初登山、白山登頂、東京帝大入学、1964年刊行、1971年逝去の年譜を参照。",
  },
  {
    href: "https://www.shinchosha.co.jp/book/318405",
    label: "新潮社『日本百名山 新装版』",
    note: "著者プロフィールと受賞情報。",
  },
  {
    href: "https://jac1.or.jp/document/2021102912982.html",
    label: "日本山岳会「日本山岳会に描かれた深田久弥①」",
    note: "茅ヶ岳での最期に関する記述。",
  },
] as const

const Page: FC = () => {
  return (
    <div
      style={{
        maxWidth: "720px",
        margin: "40px auto",
        padding: "0 24px",
        color: "#ccc",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/articles/"
        style={{ color: "#7ecfb3", textDecoration: "none" }}
      >
        ← 読み物一覧に戻る
      </Link>

      <h1
        style={{
          color: "#fff",
          fontSize: "2rem",
          marginTop: "24px",
          marginBottom: "16px",
        }}
      >
        深田久弥について
      </h1>

      <p style={{ lineHeight: 1.8, marginBottom: "24px" }}>
        深田久弥（1903-1971）は、石川県大聖寺町（現・加賀市）に生まれた小説家・随筆家・登山家です。彼の名は、やはり
        <strong>『日本百名山』</strong>
        の著者として広く知られています。
      </p>

      <h2
        style={{
          color: "#fff",
          fontSize: "1.25rem",
          marginTop: "24px",
          marginBottom: "12px",
        }}
      >
        生涯と登山への情熱
      </h2>
      <p style={{ lineHeight: 1.8, marginBottom: "16px" }}>
        深田は1914年に富士写ヶ岳へ登ったのを最初の登山とし、1918年には白山に登っています。1926年に東京帝国大学文学部哲学科へ入学しますが、在学中に改造社編集部員となり、のちに大学を中退しました。文学活動と並行して山を歩き続けたことが、後年の山岳随筆の厚みにつながります。
      </p>

      <h2
        style={{
          color: "#fff",
          fontSize: "1.25rem",
          marginTop: "24px",
          marginBottom: "12px",
        }}
      >
        百名山という遺産
      </h2>
      <p style={{ lineHeight: 1.8, marginBottom: "16px" }}>
        1959年に『山と高原』で「日本百名山」の連載を開始し、1964年に単行本として刊行、翌1965年には読売文学賞を受賞しました。深田の文章は、山を地形として説明するだけでなく、歴史や信仰、風土まで含めて描いた点に大きな特徴があります。
      </p>

      <p style={{ lineHeight: 1.8 }}>
        深田は1971年、茅ヶ岳の山頂近くの尾根で脳卒中のため急逝しました。しかし彼が残した百名山の視点は、いまなお登山者が山をどう見るか、その基準や憧れの置き方に大きな影響を与え続けています。
      </p>

      <ArticleSources sources={sources} />
    </div>
  )
}

export default Page
