import { Metadata } from "next"
import DataTransferClient from "components/DataTransferClient"

export const metadata: Metadata = {
  title: "データ管理",
  description: "登頂記録のエクスポート・インポートで別デバイスとデータを共有できます。",
  alternates: { canonical: "/settings/" },
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
        データ管理
      </h1>
      <p style={{ color: "#aaa", fontSize: ".875rem", marginBottom: "24px" }}>
        登頂記録をJSONファイルでバックアップ・復元できます。別デバイスへの移行にも使えます。
      </p>
      <DataTransferClient />
    </div>
  )
}
