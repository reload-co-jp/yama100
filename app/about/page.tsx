import { FC } from "react"
import Link from "next/link"
import { SITE_URL } from "lib/site"

export const metadata = {
  title: "日本百名山とは",
  description: "日本百名山についての説明と、このサイトの目的、運営会社について",
  alternates: { canonical: "/about/" },
  openGraph: {
    title: "日本百名山とは",
    description: "日本百名山についての説明と、このサイトの目的、運営会社について",
    url: "/about/",
    siteName: "Yama100",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "日本百名山とは",
    description: "日本百名山についての説明と、このサイトの目的、運営会社について",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "日本百名山とは",
  description: "日本百名山についての説明と、このサイトの目的、運営会社について",
  url: `${SITE_URL}/about/`,
  isPartOf: { "@type": "WebSite", name: "Yama100", url: SITE_URL },
}

const Page: FC = () => {
  return (
    <div style={{ maxWidth: "720px", margin: "40px auto", padding: "0 24px", color: "#ccc" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/" style={{ color: "#7ecfb3", textDecoration: "none" }}>
        ← 一覧に戻る
      </Link>
      
      <h1 style={{ color: "#fff", fontSize: "2rem", marginTop: "24px", marginBottom: "16px" }}>
        このサイトについて
      </h1>
      
      <p style={{ lineHeight: 1.8, marginBottom: "24px" }}>
        日本百名山は、登山家で随筆家の深田久弥が選定した日本を代表する100の名峰です。
        品格、歴史、個性を兼ね備えた山々が選ばれており、多くの登山家にとっての目標となっています。
      </p>

      <p style={{ lineHeight: 1.8, marginBottom: "24px" }}>
        <Link href="/articles/history/" style={{ color: "#7ecfb3" }}>
          → 百名山の成立について詳しく見る
        </Link>
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: "32px", marginBottom: "16px" }}>
        当サイトについて
      </h2>
      <p style={{ lineHeight: 1.8 }}>
        当サイトは、日本百名山、二百名山、三百名山、花の百名山、マイナー12名山、新日本百名山の登頂記録を管理・共有するためのチェックリストです。
        ログイン不要で、URLを通じて簡単に進捗状況をシェアできます。
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: "32px", marginBottom: "16px" }}>
        運営会社
      </h2>
      <p style={{ lineHeight: 1.8, marginBottom: "16px" }}>
        Yama100は、株式会社リロードが運営しています。
        株式会社リロードは、Webアプリケーション開発、スマートフォンアプリケーション開発、メディア運営、コンサルティングなどを行う会社です。
      </p>
      <dl style={{ display: "grid", gap: "12px", lineHeight: 1.8, marginBottom: "24px" }}>
        <div>
          <dt style={{ color: "#fff", fontWeight: 700 }}>社名</dt>
          <dd style={{ margin: 0 }}>株式会社リロード / Reload, Inc.</dd>
        </div>
        <div>
          <dt style={{ color: "#fff", fontWeight: 700 }}>所在地</dt>
          <dd style={{ margin: 0 }}>〒101-0046 東京都千代田区神田佐久間町 3-37-1 山茂登ビル 3F</dd>
        </div>
        <div>
          <dt style={{ color: "#fff", fontWeight: 700 }}>設立</dt>
          <dd style={{ margin: 0 }}>2014年8月22日</dd>
        </div>
        <div>
          <dt style={{ color: "#fff", fontWeight: 700 }}>事業内容</dt>
          <dd style={{ margin: 0 }}>インターネット関連事業</dd>
        </div>
      </dl>
      <p style={{ lineHeight: 1.8 }}>
        <a href="https://reload.co.jp/" style={{ color: "#7ecfb3" }}>
          → 株式会社リロード 公式サイト
        </a>
      </p>
    </div>
  )
}

export default Page
