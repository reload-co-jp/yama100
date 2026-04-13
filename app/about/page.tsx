import { FC } from "react"
import Link from "next/link"

export const metadata = {
  title: "日本百名山とは",
  description: "日本百名山についての説明と、このサイトの目的について",
}

const Page: FC = () => {
  return (
    <div style={{ maxWidth: "720px", margin: "40px auto", padding: "0 24px", color: "#ccc" }}>
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
        当サイトは、日本百名山、二百名山、三百名山の登頂記録を管理・共有するためのチェックリストです。
        ログイン不要で、URLを通じて簡単に進捗状況をシェアできます。
      </p>
    </div>
  )
}

export default Page
