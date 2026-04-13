import { Title } from "components/elements/layout"
import Link from "next/link"
import "./reset.css"

import { SITE_URL } from "../lib/site"

const TITLE = "Yama100 - 日本百名山チェックリスト"
const DESCRIPTION =
  "深田久弥が選んだ日本百名山の登頂記録をチェックできるアプリ。ログイン不要でURLで共有できます。"

export const metadata = {
  title: {
    default: TITLE,
    template: "%s | Yama100",
  },
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: TITLE,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
}

const GA_ID = "G-KY5MNFQJMW"
const isProduction = process.env.NODE_ENV === "production"

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <head>
        {isProduction && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body>
        <header
          style={{
            backgroundColor: "#333",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: ".5rem 1rem",
            position: "relative",
          }}
        >
          <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "space-between" }}>
            <Title>Yama100</Title>
            <nav style={{ display: "flex", gap: "8px" }}>
              <Link
                href="/"
                style={{
                  borderRadius: "4px",
                  color: "#ccc",
                  fontSize: ".8rem",
                  padding: "4px 10px",
                  textDecoration: "none",
                }}
              >
                百名山
              </Link>
              <Link
                href="/mountains200/"
                style={{
                  borderRadius: "4px",
                  color: "#ccc",
                  fontSize: ".8rem",
                  padding: "4px 10px",
                  textDecoration: "none",
                }}
              >
                二百名山
              </Link>
              <Link
                href="/mountains300/"
                style={{
                  borderRadius: "4px",
                  color: "#ccc",
                  fontSize: ".8rem",
                  padding: "4px 10px",
                  textDecoration: "none",
                }}
              >
                三百名山
              </Link>
              <Link
                href="/about/"
                style={{
                  borderRadius: "4px",
                  color: "#ccc",
                  fontSize: ".8rem",
                  padding: "4px 10px",
                  textDecoration: "none",
                }}
              >
                このサイトについて
              </Link>
            </nav>
          </div>
        </header>
        <main
          style={{
            background: "#222",
            minHeight: "calc(100dvh - 5.625rem)",
            padding: "1rem",
          }}
        >
          {children}
        </main>
        <footer
          style={{
            backgroundColor: "#333",
            boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.1)",
            fontSize: ".75rem",
            padding: "1rem",
          }}
        >
          <p>&copy; Yama100</p>
        </footer>
      </body>
    </html>
  )
}
export default RootLayout
