import { FC } from "react"
import Link from "next/link"

export const metadata = {
  title: "読み物一覧",
  description: "日本百名山や登山に関する読み物・記事一覧",
}

const Page: FC = () => {
  return (
    <div style={{ maxWidth: "720px", margin: "40px auto", padding: "0 24px", color: "#ccc" }}>
      <h1 style={{ color: "#fff", fontSize: "2rem", marginBottom: "32px" }}>
        読み物
      </h1>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Link 
          href="/articles/history/" 
          style={{ 
            background: "#2a2a2a", 
            borderRadius: "8px", 
            padding: "20px", 
            color: "#fff", 
            textDecoration: "none",
            display: "block"
          }}
        >
          <div style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "8px" }}>百名山の成立について</div>
          <div style={{ fontSize: ".875rem", color: "#aaa" }}>日本百名山の歴史と深田久弥による選定の背景</div>
        </Link>
      </div>
    </div>
  )
}

export default Page
