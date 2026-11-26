import { Suspense } from "react"
import ListHero from "components/ListHero"
import ShareStudio from "components/ShareStudio"

export const metadata = {
  title: "登頂記録のシェア画像を作る",
  description:
    "日本百名山などの登頂数・達成率、登頂した山の一覧、年間実績、地域別の達成状況、登頂記念の画像をブラウザだけで作成し、SNSで共有できます。",
  alternates: { canonical: "/share/" },
}

export default function SharePage() {
  return (
    <>
      <ListHero
        eyebrow="Share"
        lead={
          <p>
            登頂実績をSNS向けの画像にして共有しましょう。画像はお使いのブラウザ内で作成され、記録がサーバーに送信されることはありません。
          </p>
        }
        title="シェア画像を作る"
      />
      <div className="container" style={{ paddingTop: 24 }}>
        <Suspense fallback={null}>
          <ShareStudio />
        </Suspense>
      </div>
    </>
  )
}
