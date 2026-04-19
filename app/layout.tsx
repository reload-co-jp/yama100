import HeaderSearch from "components/HeaderSearch"
import { Title } from "components/elements/layout"
import Link from "next/link"
import { Suspense } from "react"
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
        <style>{`
          .site-header-inner {
            align-items: center;
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            justify-content: space-between;
          }

          .site-header-tools {
            align-items: flex-end;
            display: flex;
            flex: 1 1 520px;
            flex-direction: column;
            gap: 10px;
          }

          .site-header-nav {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: flex-end;
          }

          @media (min-width: 980px) {
            .site-header-tools {
              align-items: center;
              flex-direction: row;
              flex-wrap: wrap;
              justify-content: flex-end;
            }

            .site-header-nav {
              align-items: center;
            }
          }
        `}</style>
        <header
          style={{
            backgroundColor: "#333",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: ".5rem 1rem",
            position: "relative",
          }}
        >
          <div className="site-header-inner">
            <Title>Yama100</Title>
            <div className="site-header-tools">
              <Suspense fallback={<div style={{ maxWidth: "360px", width: "100%" }} />}>
                <HeaderSearch />
              </Suspense>
              <nav className="site-header-nav">
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
                  href="/mountains_flowers/"
                  style={{
                    borderRadius: "4px",
                    color: "#ccc",
                    fontSize: ".8rem",
                    padding: "4px 10px",
                    textDecoration: "none",
                  }}
                >
                  花の百名山
                </Link>
                <Link
                  href="/mountains_minor12/"
                  style={{
                    borderRadius: "4px",
                    color: "#ccc",
                    fontSize: ".8rem",
                    padding: "4px 10px",
                    textDecoration: "none",
                  }}
                >
                  マイナー12
                </Link>
                <Link
                  href="/articles/"
                  style={{
                    borderRadius: "4px",
                    color: "#ccc",
                    fontSize: ".8rem",
                    padding: "4px 10px",
                    textDecoration: "none",
                  }}
                >
                  読み物
                </Link>
              </nav>
            </div>
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
            color: "#ccc",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0 }}>&copy; Yama100</p>
            <Link href="/about/" style={{ color: "#7ecfb3", textDecoration: "none" }}>このサイトについて</Link>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <Link href="/articles/" style={{ color: "#aaa", textDecoration: "none" }}>読み物一覧</Link>
            <Link href="/articles/history/" style={{ color: "#aaa", textDecoration: "none" }}>百名山の成立</Link>
            <Link href="/articles/criteria/" style={{ color: "#aaa", textDecoration: "none" }}>選考基準</Link>
            <Link href="/articles/fukada/" style={{ color: "#aaa", textDecoration: "none" }}>深田久弥</Link>
            <Link href="/articles/mountains/" style={{ color: "#aaa", textDecoration: "none" }}>登った山々</Link>
            <Link href="/articles/mountains200/" style={{ color: "#aaa", textDecoration: "none" }}>二百名山</Link>
            <Link href="/articles/mountains300/" style={{ color: "#aaa", textDecoration: "none" }}>三百名山</Link>
            <Link href="/articles/flowers/" style={{ color: "#aaa", textDecoration: "none" }}>花の百名山</Link>
            <Link href="/mountains_minor12/" style={{ color: "#aaa", textDecoration: "none" }}>マイナー12名山</Link>
          </div>
        </footer>
      </body>
    </html>
  )
}
export default RootLayout
