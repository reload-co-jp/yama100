import { FC } from "react"
import Link from "next/link"
import { Metadata } from "next"

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
        深田久弥（1903年 -
        1971年）は、石川県大聖寺町（現・加賀市）出身の小説家、随筆家、そして登山家です。彼の名前は、なんといっても名著
        <strong>『日本百名山』</strong>
        の著者として、日本の登山文化に燦然と輝いています。
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
        少年時代から白山をはじめとする山々に親しんだ彼は、東京帝国大学在学中から本格的な登山を開始しました。当時から文才に秀でていた彼は、登山の体験を単なる記録にとどめず、文学的な随筆として昇華させました。
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
        彼の代表作『日本百名山』は、単なる登山ガイドではなく、それぞれの山が持つ歴史、民俗、風土を深田の鋭い洞察と流麗な筆致で綴った文学作品です。この本が発表されたことで、多くの日本人が「山に登る」という行為を通じて、日本の自然と文化の豊かさを再発見するきっかけを得ました。
      </p>

      <p style={{ lineHeight: 1.8 }}>
        1971年、68歳の時に愛する茅ヶ岳で急逝しましたが、彼が残した「百名山」という概念は、今なお多くの登山者の心の拠り所となり、日本の山岳文化を支え続けています。
      </p>
    </div>
  )
}

export default Page
