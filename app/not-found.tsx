import Link from "next/link"
import type { CSSProperties } from "react"

export const metadata = {
  robots: { index: false, follow: false },
}

const linkStyle = {
  background: "var(--color-forest-700)",
  borderRadius: "999px",
  color: "#fff",
  display: "inline-flex",
  fontSize: ".95rem",
  fontWeight: 700,
  padding: ".75rem 1rem",
  textDecoration: "none",
} satisfies CSSProperties

const secondaryLinkStyle = {
  color: "var(--color-forest-600)",
  fontSize: ".9rem",
  textDecoration: "none",
} satisfies CSSProperties

export default function NotFound() {
  return (
    <section
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        minHeight: "calc(100dvh - 12rem)",
        padding: "3rem 1rem",
      }}
    >
      <div
        style={{
          maxWidth: "640px",
          textAlign: "center",
          width: "100%",
        }}
      >
        <p
          style={{
            color: "var(--color-forest-600)",
            fontSize: ".875rem",
            fontWeight: 700,
            letterSpacing: "0",
            marginBottom: ".75rem",
          }}
        >
          404 Not Found
        </p>
        <h1
          style={{
            color: "var(--color-text)",
            fontSize: "clamp(2rem, 8vw, 3.5rem)",
            lineHeight: 1.1,
            marginBottom: "1rem",
          }}
        >
          山道が見つかりません
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "1rem",
            lineHeight: 1.8,
            margin: "0 auto 2rem",
            maxWidth: "34rem",
          }}
        >
          URLが変わったか、ページが削除された可能性があります。
          山リストや読み物から目的のページを探してください。
        </p>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <Link href="/" style={linkStyle}>
            トップページへ戻る
          </Link>
          <Link href="/articles/" style={secondaryLinkStyle}>
            読み物を見る
          </Link>
          <Link href="/search/" style={secondaryLinkStyle}>
            検索ページへ
          </Link>
        </div>
      </div>
    </section>
  )
}
