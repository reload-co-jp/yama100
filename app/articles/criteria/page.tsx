import { FC } from "react"
import Link from "next/link"
import { Metadata } from "next"
import ArticleSources from "components/articles/ArticleSources"

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

const sources = [
  {
    href: "https://www.shinchosha.co.jp/book/318405",
    label: "新潮社『日本百名山 新装版』",
    note: "作品紹介にある「品格と歴史と個性」の説明を参照。",
  },
  {
    href: "https://ci.nii.ac.jp/ncid/BN0261320X",
    label: "CiNii Books『日本百名山』",
    note: "原著の書誌情報。",
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
        百名山の選考基準について
      </h1>

      <p style={{ lineHeight: 1.8, marginBottom: "24px" }}>
        深田久弥の百名山を説明するとき、もっともよく使われる言葉が
        <strong>「品格」「歴史」「個性」</strong>
        です。これは厳密な採点表というより、深田が山を「名山」として語るときの視点を要約した言葉として受け止めるのが自然です。
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
        ここでいう品格は、単なる整った形ではなく、山容やたたずまいににじむ風格です。遠望したときに一目でそれとわかる存在感や、近づくほど深まる気配の豊かさが問われています。
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
        歴史は、山岳信仰や文学、地域の暮らしのなかで積み重なってきた文脈を指します。深田の百名山がガイドブック以上の広がりを持つのは、山そのものだけでなく、人と山との長い関係まで文章に織り込まれているからです。
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
        個性は、その山でしか味わえない固有の魅力です。火山、森林、岩稜、花、雪、地域の伝承など、他の山と置き換えのきかない特徴があるからこそ、百座は単なる順位表ではなく、それぞれ別の顔を持つ山々の集まりになります。
      </p>

      <p style={{ lineHeight: 1.8 }}>
        つまり百名山の選定基準は、「高い山を並べること」ではなく、「その山を日本の名峰として語る理由があるか」を見きわめる視点だと言えます。本サイトでもこの理解を前提に、各山のデータや読み物を整理しています。
      </p>

      <ArticleSources sources={sources} />
    </div>
  )
}

export default Page
