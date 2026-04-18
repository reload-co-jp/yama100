import { FC } from "react"
import Link from "next/link"
import { Metadata } from "next"
import ArticleSources from "components/articles/ArticleSources"

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

const sources = [
  {
    href: "https://books.jtbpublishing.co.jp/book/60001-202406421911-000/",
    label: "JTBパブリッシング『日本三百名山 山あるきガイド 下』",
    note: "日本三百名山を日本山岳会が1978年に選定したという説明を参照。",
  },
  {
    href: "https://www.yamareco.com/modules/yamainfo/ptlist.php?groupid=3",
    label: "ヤマレコ「日本三百名山」",
    note: "山上ヶ岳と荒沢岳の差し替え、および本サイトで採用している101座の項番整理を参照。",
  },
  {
    href: "https://www.yamakei.co.jp/products/2814530620.html",
    label: "山と溪谷社『新版 日本三百名山登山ガイド 上』",
    note: "日本山岳会著の実用ガイド。",
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
        三百名山の成立について
      </h1>

      <p style={{ lineHeight: 1.8, marginBottom: "24px" }}>
        「日本三百名山」は、日本山岳会によって1978年に選定された300座のリストです。以前の本文にあった「2002年選定」は原典系の説明と合わないため、この点を修正しました。
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
        三百名山は、深田久弥の百名山に新たな200座を加えた枠組みとして理解されています。その後、1984年に二百名山が別に整備されたため、現在は「百名山」「二百名山」「三百名山」の三つが並び立つ形で語られることが多くなりました。
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
        ヤマレコの解説では、三百名山に含まれる山上ヶ岳は二百名山から外れ、その代わりに荒沢岳が入るため、二百名山に未収録の側だけを見ると101座になると整理されています。本サイトの三百名山ページが101件ベースなのは、この現在流通している整理に合わせたためです。
      </p>

      <p style={{ lineHeight: 1.8 }}>
        つまり三百名山は、百名山の拡張版であると同時に、後年の二百名山や各種ガイドの基準にもなった土台です。成立史と現在の実用整理を切り分けて理解すると、三つのリストの関係がかなり見通しやすくなります。
      </p>

      <ArticleSources sources={sources} />
    </div>
  )
}

export default Page
