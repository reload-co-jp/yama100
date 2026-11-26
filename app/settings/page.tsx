import { Metadata } from "next"
import Link from "next/link"
import DataTransferClient from "components/DataTransferClient"

export const metadata: Metadata = {
  title: "データ管理（バックアップ・復元）",
  description:
    "登頂記録のエクスポート・インポートで、別の端末とデータを移行・バックアップできます。",
  alternates: { canonical: "/settings/" },
}

export default function Page() {
  return (
    <div className="container-narrow" style={{ paddingBlock: "32px 0" }}>
      <h1 style={{ fontSize: "1.6rem", marginBottom: 8 }}>データ管理</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: 24 }}>
        登頂記録はお使いのブラウザ内に保存されています。JSONファイルでバックアップ・復元でき、別の端末への移行にも使えます。
      </p>
      <DataTransferClient />
      <p style={{ marginTop: 24 }}>
        <Link className="text-link" href="/summary/">
          登頂記録ページを見る →
        </Link>
      </p>
    </div>
  )
}
