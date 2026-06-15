import HeaderSearch from "components/HeaderSearch"
import PWAInstallBanner from "components/PWAInstallBanner"
import ServiceWorkerRegistration from "components/ServiceWorkerRegistration"
import { Title } from "components/elements/layout"
import Link from "next/link"
import { Suspense } from "react"
import "maplibre-gl/dist/maplibre-gl.css"
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
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Yama100",
  },
}

export const viewport = {
  themeColor: "#0a0a0a",
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
        <ServiceWorkerRegistration />
        <PWAInstallBanner />
        <style>{`
          .site-header-inner {
            align-items: center;
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            justify-content: space-between;
            max-width: 1400px;
            margin: 0 auto;
            width: 100%;
          }

          .site-header-tools {
            align-items: flex-end;
            display: flex;
            flex: 1 1 520px;
            flex-direction: column;
            gap: 8px;
          }

          .site-header-nav {
            display: flex;
            flex-wrap: wrap;
            gap: 2px;
            justify-content: flex-end;
          }

          .site-header-nav a {
            border-radius: 6px;
            color: #888;
            font-size: .8rem;
            letter-spacing: .01em;
            padding: 5px 10px;
            text-decoration: none;
            transition: color .15s, background .15s;
          }

          .site-header-nav a:hover {
            background: rgba(255,255,255,0.06);
            color: #ededed;
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
            backgroundColor: "#0a0a0a",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: ".625rem 1rem",
            position: "relative",
          }}
        >
          <div className="site-header-inner">
            <Title style={{ fontSize: "1rem", fontWeight: 600, letterSpacing: "-.01em", color: "#ededed" }}>Yama100</Title>
            <div className="site-header-tools">
              <Suspense fallback={<div style={{ maxWidth: "360px", width: "100%" }} />}>
                <HeaderSearch />
              </Suspense>
              <nav className="site-header-nav">
                <Link href="/">百名山</Link>
                <Link href="/mountains200/">二百名山</Link>
                <Link href="/mountains300/">三百名山</Link>
                <Link href="/mountains_flowers/">花の百名山</Link>
                <Link href="/mountains_minor12/">マイナー12</Link>
                <Link href="/mountains_new100/">新百名山</Link>
                <Link href="/mountains_kanto100/">関東百名山</Link>
                <Link href="/articles/">読み物</Link>
                <Link href="/gear-checklist/">山装備</Link>
              </nav>
            </div>
          </div>
        </header>
        <main
          style={{
            background: "#0a0a0a",
            minHeight: "calc(100dvh - 5.625rem)",
            padding: "1.5rem 1rem",
          }}
        >
          {children}
        </main>
        <footer
          style={{
            backgroundColor: "#0a0a0a",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            fontSize: ".75rem",
            padding: "1.5rem 1rem",
            color: "#555",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0, color: "#444" }}>&copy; Yama100</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "flex-end" }}>
              <Link href="/about/" style={{ color: "#666", textDecoration: "none" }}>このサイトについて</Link>
              <a href="https://reload.co.jp/" style={{ color: "#666", textDecoration: "none" }}>運営会社</a>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <Link href="/articles/" style={{ color: "#444", textDecoration: "none" }}>読み物一覧</Link>
            <Link href="/articles/history/" style={{ color: "#444", textDecoration: "none" }}>百名山の成立</Link>
            <Link href="/articles/criteria/" style={{ color: "#444", textDecoration: "none" }}>選考基準</Link>
            <Link href="/articles/fukada/" style={{ color: "#444", textDecoration: "none" }}>深田久弥</Link>
            <Link href="/articles/mountains/" style={{ color: "#444", textDecoration: "none" }}>登った山々</Link>
            <Link href="/articles/mountains200/" style={{ color: "#444", textDecoration: "none" }}>二百名山</Link>
            <Link href="/articles/mountains300/" style={{ color: "#444", textDecoration: "none" }}>三百名山</Link>
            <Link href="/articles/flowers/" style={{ color: "#444", textDecoration: "none" }}>花の百名山</Link>
            <Link href="/gear-checklist/" style={{ color: "#444", textDecoration: "none" }}>山装備チェック</Link>
            <Link href="/settings/" style={{ color: "#444", textDecoration: "none" }}>データ管理</Link>
            <Link href="/mountains_minor12/" style={{ color: "#444", textDecoration: "none" }}>マイナー12名山</Link>
            <Link href="/mountains_new100/" style={{ color: "#444", textDecoration: "none" }}>新日本百名山</Link>
            <Link href="/mountains_kanto100/" style={{ color: "#444", textDecoration: "none" }}>関東百名山</Link>
          </div>
        </footer>
      </body>
    </html>
  )
}
export default RootLayout
