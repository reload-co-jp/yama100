import { FC } from "react"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "百名山の選考基準について | Yama100",
  description: "深田久弥が選定に用いた「品格・歴史・個性」の基準についての解説",
  openGraph: {
    title: "百名山の選考基準について | Yama100",
    description: "深田久弥が選定に用いた「品格・歴史・個性」の基準についての解説",
    url: "https://yama100.reload.co.jp/articles/criteria",
    siteName: "Yama100",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yama100.reload.co.jp" },
    { "@type": "ListItem", "position": 2, "name": "読み物一覧", "item": "https://yama100.reload.co.jp/articles" },
    { "@type": "ListItem", "position": 3, "name": "百名山の選考基準について", "item": "https://yama100.reload.co.jp/articles/criteria" }
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
        百名山の選考基準について
      </h1>

      <p style={{ lineHeight: 1.8, marginBottom: "24px" }}>
        深田久弥が日本百名山を選定するにあたり、最も重要視したのが
        <strong>「品格」「歴史」「個性」</strong>
        という3つの基準です。これらは、単に標高の高さや険しさだけでは測れない、山の本質的な魅力を定義するものでした。
      </p>

      <h2
        style={{
          color: "#fff",
          fontSize: "1.25rem",
          marginTop: "24px",
          marginBottom: "12px",
        }}
      >
        1. 品格
      </h2>
      <p style={{ lineHeight: 1.8, marginBottom: "16px" }}>
        山が持つ「姿の美しさ」や「雰囲気の気高さ」を指します。遠くから眺めた時の山容が、人々に畏敬の念を抱かせるような風格を備えていることが重視されました。
      </p>

      <h2
        style={{
          color: "#fff",
          fontSize: "1.25rem",
          marginTop: "24px",
          marginBottom: "12px",
        }}
      >
        2. 歴史
      </h2>
      <p style={{ lineHeight: 1.8, marginBottom: "16px" }}>
        古くから山岳信仰の対象となっていたり、多くの登山家や文学者に愛され、語り継がれてきた山の物語性です。単なる自然物ではなく、人間との関わりの中で育まれてきた文化的な背景が尊重されました。
      </p>

      <h2
        style={{
          color: "#fff",
          fontSize: "1.25rem",
          marginTop: "24px",
          marginBottom: "12px",
        }}
      >
        3. 個性
      </h2>
      <p style={{ lineHeight: 1.8, marginBottom: "16px" }}>
        他の山にはない独自の特色です。特異な地形、固有の植生、季節ごとの変化など、その山でしか体験できない特別な価値が評価基準となりました。
      </p>

      <p style={{ lineHeight: 1.8 }}>
        これらの基準によって選ばれた100の山々は、日本の自然美を象徴するだけでなく、登山者が自分自身の心と向き合うための大切な場所として、今日まで大切にされています。
      </p>
    </div>
  )
}

export default Page
