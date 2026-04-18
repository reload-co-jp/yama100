import { FC } from "react"
import Link from "next/link"
import { Metadata } from "next"
import ArticleSources from "components/articles/ArticleSources"

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

const sources = [
  {
    href: "https://www.shinchosha.co.jp/book/318405",
    label: "新潮社『日本百名山 新装版』",
    note: "作品紹介と著者プロフィール。「品格と歴史と個性」の説明と受賞情報を確認。",
  },
  {
    href: "https://ci.nii.ac.jp/ncid/BN0261320X",
    label: "CiNii Books『日本百名山』",
    note: "原著の書誌情報。新潮社、1964年7月刊を確認。",
  },
  {
    href: "https://yamanobunkakan.com/?page_id=87",
    label: "深田久弥山の文化館「深田久弥について」",
    note: "1959年の『山と高原』連載開始、1964年刊行、1965年受賞の年譜を参照。",
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
        『日本百名山』は、深田久弥が1959年に雑誌『山と高原』で連載を始め、1964年に新潮社から単行本として刊行した山岳随筆集です。今日「百名山」と呼ばれている100座は、この本に収められた山々を指すのが出発点でした。
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
        この本を説明する際によく引かれるキーワードが「品格・歴史・個性」です。深田は、標高や難易度だけで山を並べるのではなく、文学や信仰の蓄積、遠望したときの山容、その山でしか味わえない独自性を重ね合わせて一座ずつ描きました。
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
        1965年には『日本百名山』が第16回読売文学賞を受賞し、山の随筆でありながら広い読者を獲得しました。以後、百名山完登を目標にする登山者が増え、山岳ガイド、テレビ番組、派生リストへと影響が広がっていきます。
      </p>

      <p style={{ lineHeight: 1.8 }}>
        いまでは「百名山巡り」という言葉自体が、山に登る行為だけでなく、日本の地形・風土・歴史をたどる旅の名前として定着しています。百名山の成立は、一冊の本が日本の登山文化の共通語になった例として見ることができます。
      </p>

      <ArticleSources sources={sources} />
    </div>
  )
}

export default Page
