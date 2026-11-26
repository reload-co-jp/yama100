import { Metadata } from "next"
import ListHero from "components/ListHero"
import SummaryClient from "components/SummaryClient"

export const metadata: Metadata = {
  title: "登頂記録",
  description:
    "登頂日を記録した山行の時系列データ、年間の登頂数、各リストの達成度を1ページで確認できます。",
  alternates: { canonical: "/summary/" },
}

export default function Page() {
  return (
    <>
      <ListHero
        eyebrow="My Records"
        lead={
          <p>あなたの登頂記録を、年ごと・リストごとにまとめて振り返れます。</p>
        }
        title="登頂記録"
      />
      <div className="container" style={{ paddingTop: 24 }}>
        <SummaryClient />
      </div>
    </>
  )
}
