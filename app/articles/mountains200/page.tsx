import { FC } from "react"
import Link from "next/link"
import { Metadata } from "next"
import ArticleSources from "components/articles/ArticleSources"

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

const sources = [
  {
    href: "https://www.yamareco.com/modules/yamainfo/ptlist.php?groupid=2",
    label: "ヤマレコ「日本二百名山」",
    note: "深田クラブ創立10周年（1984年）に作成されたリストであること、山上ヶ岳と荒沢岳の扱いを参照。",
  },
  {
    href: "https://www.yamakei.co.jp/products/2807530500%20.html",
    label: "山と溪谷社『決定版 日本二百名山登山ガイド 中』",
    note: "深田クラブ選定の100山という説明を参照。",
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
        二百名山の成立について
      </h1>

      <p style={{ lineHeight: 1.8, marginBottom: "24px" }}>
        「日本二百名山」は、1984年に深田久弥の愛好組織である深田クラブが、創立10周年を記念して作成したリストです。山と溪谷社が選定主体という説明は原典ベースでは確認できず、この点は本文を修正しました。
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
        二百名山は、深田の百名山100座をそのまま含みつつ、さらに100座を加えて200座にしたものです。現在よく参照される解説では、日本三百名山を母体にしながら、三百名山に含まれていた山上ヶ岳を外し、その代わりに荒沢岳を加えた構成だと説明されています。
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
        山と溪谷社のガイドでも、二百名山は「百名山を登り終えた次の目標」として紹介されています。つまり二百名山は、百名山の延長としてより多くの名峰に目を向けるためのリストであり、完登後の次の視野を開く役割を担ってきました。
      </p>

      <p style={{ lineHeight: 1.8 }}>
        本サイトの二百名山ページでも、番号付けは現在の利用実態に合わせてヤマレコの項番を参照しています。成立史そのものは深田クラブ由来、実用上の番号参照はヤマレコ、という二層で捉えるのが実態に近いと思います。
      </p>

      <ArticleSources sources={sources} />
    </div>
  )
}

export default Page
