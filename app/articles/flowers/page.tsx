import { FC } from "react"
import Link from "next/link"
import { Metadata } from "next"
import ArticleSources from "components/articles/ArticleSources"

export const metadata: Metadata = {
  title: "花の百名山について | Yama100",
  description: "田中澄江が選定した「花の百名山」の歴史とコンセプトの解説",
  openGraph: {
    title: "花の百名山について | Yama100",
    description: "田中澄江が選定した「花の百名山」の歴史とコンセプトの解説",
    url: "https://yama100.reload.co.jp/articles/flowers",
    siteName: "Yama100",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yama100.reload.co.jp" },
    { "@type": "ListItem", "position": 2, "name": "読み物一覧", "item": "https://yama100.reload.co.jp/articles" },
    { "@type": "ListItem", "position": 3, "name": "花の百名山について", "item": "https://yama100.reload.co.jp/articles/flowers" }
  ]
}

const sources = [
  {
    href: "https://www.yamakei-online.com/yama-ya/detail.php?id=2346",
    label: "山と溪谷オンライン「田中澄江の感性に触れる山旅。花の百名山を訪ねるコースガイド①」",
    note: "『山と溪谷』誌での1977-79年連載と、1980年の書籍化を参照。",
  },
  {
    href: "https://books.bunshun.jp/ud/book/num/9784167908751",
    label: "文藝春秋『花の百名山』",
    note: "1980年刊行以来のロングセラーであることと、第32回（1981年）読売文学賞受賞を確認。",
  },
  {
    href: "https://www.yamareco.com/modules/yamainfo/ptlist.php?groupid=4",
    label: "ヤマレコ「花の百名山」",
    note: "本サイトの花の百名山データ整理時の参照リスト。",
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
        花の百名山の成立について
      </h1>

      <p style={{ lineHeight: 1.8, marginBottom: "24px" }}>
        「花の百名山」は、作家・田中澄江が山と花の結びつきを100の随筆としてまとめたものです。1977年から1979年にかけて『山と溪谷』で連載され、1980年に書籍化されました。そこでは従来の「登頂」や「険しさ」だけではない、
        <strong>「山に咲く花々を愛でる」</strong>
        という山歩きの視点が前面に出されています。
      </p>

      <h2
        style={{
          color: "#fff",
          fontSize: "1.25rem",
          marginTop: "24px",
          marginBottom: "12px",
        }}
      >
        選定のコンセプト
      </h2>
      <p style={{ lineHeight: 1.8, marginBottom: "16px" }}>
        田中澄江が重視したのは、花の種類数そのものよりも、その山でどの花とどのように出会うかという体験です。高山植物の名所だけでなく、低山や湿原も含めて、「その山を象徴する花があるか」が大切にされています。
      </p>

      <h2
        style={{
          color: "#fff",
          fontSize: "1.25rem",
          marginTop: "24px",
          marginBottom: "12px",
        }}
      >
        登山文化への影響
      </h2>
      <p style={{ lineHeight: 1.8, marginBottom: "16px" }}>
        『花の百名山』は第32回（1981年）読売文学賞〈随筆・紀行賞〉を受賞し、以後、NHK番組や登山ガイドへと広がりました。山頂に着くことだけを目的にしない歩き方、季節の花をたずねる山旅という感覚を一般に広めた点で、登山文化への影響は大きかったと言えます。
      </p>

      <p style={{ lineHeight: 1.8 }}>
        百名山が山そのものの風格に光を当てる本だとすれば、花の百名山は山の季節感や気配を読む本です。本サイトでも、花の百名山ページは現在参照しやすいリスト整備のためヤマレコの一覧をもとに番号整理を行っています。
      </p>

      <ArticleSources sources={sources} />
    </div>
  )
}

export default Page
