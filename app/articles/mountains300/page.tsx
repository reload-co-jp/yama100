import { FC } from "react"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "三百名山について | Yama100",
  description: "日本三百名山の歴史と百名山・二百名山との違いについての解説",
  openGraph: {
    title: "三百名山について | Yama100",
    description: "日本三百名山の歴史と百名山・二百名山との違いについての解説",
    url: "https://yama100.reload.co.jp/articles/mountains300",
    siteName: "Yama100",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yama100.reload.co.jp" },
    { "@type": "ListItem", "position": 2, "name": "読み物一覧", "item": "https://yama100.reload.co.jp/articles" },
    { "@type": "ListItem", "position": 3, "name": "三百名山について", "item": "https://yama100.reload.co.jp/articles/mountains300" }
  ]
}

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
        三百名山の成立について
      </h1>

      <p style={{ lineHeight: 1.8, marginBottom: "24px" }}>
        「日本三百名山」は、二百名山選定からさらに約20年後の2002年、日本山岳会によって選定されました。百名山、二百名山に続く、日本の山岳のさらなる可能性を探求するリストとして誕生しました。
      </p>

      <h2
        style={{
          color: "#fff",
          fontSize: "1.25rem",
          marginTop: "24px",
          marginBottom: "12px",
        }}
      >
        他のリストとの違い
      </h2>
      <p style={{ lineHeight: 1.8, marginBottom: "16px" }}>
        百名山（深田久弥）、二百名山（山と溪谷社）に対し、三百名山は
        <strong>「日本山岳会」</strong>
        という学術的・専門的団体によって選定された点が大きな特徴です。単なる観光的な選定にとどまらず、山岳の地理的広がりや学術的な側面も考慮されています。
      </p>

      <h2
        style={{
          color: "#fff",
          fontSize: "1.25rem",
          marginTop: "24px",
          marginBottom: "12px",
        }}
      >
        選定の意義
      </h2>
      <p style={{ lineHeight: 1.8, marginBottom: "16px" }}>
        三百名山が加わったことで、日本の主要な山岳300座を制覇する「三百名山巡り」は、日本全国の地形、気候、文化の多様性を体験する究極の山岳巡礼とも言えるスケールとなりました。
      </p>

      <p style={{ lineHeight: 1.8 }}>
        百名山・二百名山で磨いた技術と経験を持ち寄り、さらなる未知の山々に挑む登山家たちの目標として、三百名山は今日の登山文化において重要な位置を占めています。
      </p>
    </div>
  )
}

export default Page
