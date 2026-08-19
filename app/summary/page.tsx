import { Metadata } from "next"
import SummaryClient from "components/SummaryClient"

export const metadata: Metadata = {
  title: "登頂まとめ",
  description:
    "自分の山行記録をもとに、時系列の登頂データと各リストの登頂達成度を1ページで確認できます。",
  alternates: { canonical: "/summary/" },
}

export default function Page() {
  return (
    <div style={{ maxWidth: "680px" }}>
      <h1
        style={{
          color: "#f0f0f0",
          fontSize: "1.25rem",
          fontWeight: "bold",
          marginBottom: "8px",
        }}
      >
        登頂まとめ
      </h1>
      <p style={{ color: "#aaa", fontSize: ".875rem", marginBottom: "24px" }}>
        登頂日を記録した山行記録から、時系列データと達成度をまとめて表示します。
      </p>
      <SummaryClient />
    </div>
  )
}
