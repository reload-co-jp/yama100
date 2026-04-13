import { FC } from "react"
import Link from "next/link"

export const metadata = {
  title: "読み物一覧",
  description: "日本百名山や登山に関する読み物・記事一覧",
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
            display: "block",
          }}
        >
          <div
            style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "8px" }}
          >
            百名山について
          </div>
          <div style={{ fontSize: ".875rem", color: "#aaa" }}>
            日本百名山の歴史と深田久弥による選定の背景
          </div>
        </Link>
        <Link
          href="/articles/criteria/"
          style={{
            background: "#2a2a2a",
            borderRadius: "8px",
            padding: "20px",
            color: "#fff",
            textDecoration: "none",
            display: "block",
          }}
        >
          <div
            style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "8px" }}
          >
            百名山の選考基準について
          </div>
          <div style={{ fontSize: ".875rem", color: "#aaa" }}>
            深田久弥が選定に用いた「品格・歴史・個性」の基準についての解説
          </div>
        </Link>
        <Link
          href="/articles/fukada/"
          style={{
            background: "#2a2a2a",
            borderRadius: "8px",
            padding: "20px",
            color: "#fff",
            textDecoration: "none",
            display: "block",
          }}
        >
          <div
            style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "8px" }}
          >
            深田久弥について
          </div>
          <div style={{ fontSize: ".875rem", color: "#aaa" }}>
            日本百名山の著者、深田久弥の生涯と功績についての解説
          </div>
        </Link>
        <Link
          href="/articles/mountains/"
          style={{
            background: "#2a2a2a",
            borderRadius: "8px",
            padding: "20px",
            color: "#fff",
            textDecoration: "none",
            display: "block",
          }}
        >
          <div
            style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "8px" }}
          >
            深田久弥が登った山々
          </div>
          <div style={{ fontSize: ".875rem", color: "#aaa" }}>
            深田久弥の山行の記録と日本百名山への道
          </div>
        </Link>
        <Link
          href="/articles/mountains200/"
          style={{
            background: "#2a2a2a",
            borderRadius: "8px",
            padding: "20px",
            color: "#fff",
            textDecoration: "none",
            display: "block",
          }}
        >
          <div
            style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "8px" }}
          >
            二百名山について
          </div>
          <div style={{ fontSize: ".875rem", color: "#aaa" }}>
            日本二百名山の歴史と百名山との違いについての解説
          </div>
        </Link>
        <Link
          href="/articles/mountains300/"
          style={{
            background: "#2a2a2a",
            borderRadius: "8px",
            padding: "20px",
            color: "#fff",
            textDecoration: "none",
            display: "block",
          }}
        >
          <div
            style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "8px" }}
          >
            三百名山について
          </div>
          <div style={{ fontSize: ".875rem", color: "#aaa" }}>
            日本三百名山の歴史と百名山・二百名山との違いについての解説
          </div>
        </Link>
        <Link
          href="/articles/flowers/"
          style={{
            background: "#2a2a2a",
            borderRadius: "8px",
            padding: "20px",
            color: "#fff",
            textDecoration: "none",
            display: "block",
          }}
        >
          <div
            style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "8px" }}
          >
            花の百名山について
          </div>
          <div style={{ fontSize: ".875rem", color: "#aaa" }}>
            田中澄江が選定した「花の百名山」の歴史とコンセプトの解説
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Page
