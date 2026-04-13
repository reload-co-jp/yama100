import { FC } from "react"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "百名山の成立について | Yama100",
  description: "日本百名山の歴史と深田久弥による選定の背景",
  openGraph: {
    title: "百名山の成立について | Yama100",
    description: "日本百名山の歴史と深田久弥による選定の背景",
    url: "https://yama100.reload.co.jp/articles/history",
    siteName: "Yama100",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yama100.reload.co.jp" },
    { "@type": "ListItem", "position": 2, "name": "読み物一覧", "item": "https://yama100.reload.co.jp/articles" },
    { "@type": "ListItem", "position": 3, "name": "百名山の成立について", "item": "https://yama100.reload.co.jp/articles/history" }
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
      <Link href="/about/" style={{ color: "#7ecfb3", textDecoration: "none" }}>
        ← このサイトについてに戻る
      </Link>

      <h1
        style={{
          color: "#fff",
          fontSize: "2rem",
          marginTop: "24px",
          marginBottom: "16px",
        }}
      >
        百名山の成立について
      </h1>

      <p style={{ lineHeight: 1.8, marginBottom: "16px" }}>
        「日本百名山」の概念は、登山家・随筆家の深田久弥が、自身の長年にわたる山行経験と、独自の選定基準に基づき選び抜いた100の山々を、1964年に著書として発表したことで世に広まりました。
      </p>

      <h2
        style={{
          color: "#fff",
          fontSize: "1.25rem",
          marginTop: "24px",
          marginBottom: "12px",
        }}
      >
        選定の背景と理念
      </h2>
      <p style={{ lineHeight: 1.8, marginBottom: "16px" }}>
        深田久弥が山を選ぶにあたって重要視したのは、単なる標高や知名度ではなく、その山が持つ「品格・歴史・個性」の三要素でした。日本列島という地形の中で、自然が創り出した独特の風景と、そこに関わる人間との歴史を調和させた名峰を厳選しています。
      </p>

      <h2
        style={{
          color: "#fff",
          fontSize: "1.25rem",
          marginTop: "24px",
          marginBottom: "12px",
        }}
      >
        構想と時代を超えた影響
      </h2>
      <p style={{ lineHeight: 1.8, marginBottom: "16px" }}>
        このリストには、北は北海道から南は九州まで、日本の山岳景観の多様性を網羅するという構想が込められていました。発表から半世紀以上が経過した現在においても、この選定は多くの登山愛好家にとっての目標であり、「バイブル」として愛され続けています。
      </p>

      <p style={{ lineHeight: 1.8 }}>
        百名山すべてを登り切ることを目指す「百名山巡り」は、単なる登山という枠を超え、日本の山岳文化を体験し、四季折々の自然の美しさに触れる、日本を知るための旅の象徴となりました。
      </p>
    </div>
  )
}

export default Page
