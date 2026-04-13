import { FC } from "react"
import Link from "next/link"

export const metadata = {
  title: "花の百名山について",
  description: "田中澄江が選定した「花の百名山」の歴史とコンセプトの解説",
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
        「花の百名山」は、登山家で作家の田中澄江が選定した、季節ごとに美しい花が楽しめる100の山々です。1980年に発表された同名の著書は、従来の「登頂」や「険しさ」を主眼とした登山から、
        <strong>「山に咲く花々を愛でる」</strong>
        という新たな山登りのスタイルを確立しました。
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
        田中澄江は、単に花の種類が多いだけでなく、その山と花の関わり、そして登る人が季節の中でどのように花々と出会うかを大切にしました。標高の高さに関わらず、その山を象徴する花が存在し、登山者の心を癒やす名峰が厳選されています。
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
        「花の百名山」の誕生は、登山愛好家、特に女性登山者層に大きな影響を与えました。山頂を目指すプロセスだけでなく、その過程で出会う小さな自然の営みに目を向け、ゆったりと山を楽しむ文化が広まる大きなきっかけとなりました。
      </p>

      <p style={{ lineHeight: 1.8 }}>
        百名山が「山そのものの風格」を称えるのに対し、花の百名山は「山の四季折々の繊細な息吹」を伝える存在として、今日でも多くの登山者の大切なガイドブックとして親しまれています。
      </p>
    </div>
  )
}

export default Page
