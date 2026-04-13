import { FC } from "react"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "二百名山について | Yama100",
  description: "日本二百名山の歴史と百名山との違いについての解説",
  openGraph: {
    title: "二百名山について | Yama100",
    description: "日本二百名山の歴史と百名山との違いについての解説",
    url: "https://yama100.reload.co.jp/articles/mountains200",
    siteName: "Yama100",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yama100.reload.co.jp" },
    { "@type": "ListItem", "position": 2, "name": "読み物一覧", "item": "https://yama100.reload.co.jp/articles" },
    { "@type": "ListItem", "position": 3, "name": "二百名山について", "item": "https://yama100.reload.co.jp/articles/mountains200" }
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
        二百名山の成立について
      </h1>

      <p style={{ lineHeight: 1.8, marginBottom: "24px" }}>
        「日本二百名山」は、1984年に山と溪谷社が創立50周年を記念して選定した、日本を代表する山々のリストです。百名山が個人の選定であるのに対し、二百名山はより広い視点から日本の山岳の魅力を再発見するために企画されました。
      </p>

      <h2
        style={{
          color: "#fff",
          fontSize: "1.25rem",
          marginTop: "24px",
          marginBottom: "12px",
        }}
      >
        百名山との違い
      </h2>
      <p style={{ lineHeight: 1.8, marginBottom: "16px" }}>
        最大の大きな違いは、<strong>「選定者」</strong>
        です。百名山は深田久弥という一人の登山家による「個人的な感性」で選び抜かれたものですが、二百名山は山と溪谷社が公募や専門家の意見を取り入れ、
        <strong>「より多くの山への関心」</strong>
        を広げることを目指して選定されました。
      </p>

      <h2
        style={{
          color: "#fff",
          fontSize: "1.25rem",
          marginTop: "24px",
          marginBottom: "12px",
        }}
      >
        選定の目的
      </h2>
      <p style={{ lineHeight: 1.8, marginBottom: "16px" }}>
        百名山の人気が高まる一方で、登山者が特定の山に集中するという課題も生まれました。二百名山は、それらの名峰に並ぶ魅力的な山々を広く知らしめることで、
        <strong>「より深く、多様な日本の山登りを楽しむ」</strong>
        ことを目的としています。
      </p>

      <p style={{ lineHeight: 1.8 }}>
        百名山を登り終えた登山家が、次の挑戦の舞台として選ぶ場所として、二百名山は今や日本の登山文化において欠かせないリストとなっています。
      </p>
    </div>
  )
}

export default Page
