import HeaderNav from "components/HeaderNav"
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
const ADSENSE_CLIENT_ID = "ca-pub-6542845006087970"
const isProduction = process.env.NODE_ENV === "production"

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <head>
        {isProduction && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              async
              crossOrigin="anonymous"
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            />
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

          .drawer-toggle {
            align-items: center;
            background: transparent;
            border: 1px solid rgba(255,255,255,0.16);
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
            gap: 4px;
            height: 36px;
            justify-content: center;
            padding: 0;
            width: 36px;
          }

          .drawer-toggle span {
            background: #ededed;
            border-radius: 2px;
            display: block;
            height: 2px;
            width: 18px;
          }

          .drawer-overlay {
            background: rgba(0,0,0,0.5);
            bottom: 0;
            display: flex;
            justify-content: flex-end;
            left: 0;
            position: fixed;
            right: 0;
            top: 0;
            z-index: 100;
          }

          .drawer-panel {
            background: #171717;
            border-left: 1px solid rgba(255,255,255,0.08);
            display: flex;
            flex-direction: column;
            gap: 2px;
            height: 100%;
            max-width: 82vw;
            overflow-y: auto;
            padding: 8px;
            width: 280px;
          }

          .drawer-header {
            align-items: center;
            color: #888;
            display: flex;
            font-size: .8rem;
            justify-content: space-between;
            padding: 8px 10px 12px;
          }

          .drawer-close {
            background: transparent;
            border: none;
            color: #ededed;
            cursor: pointer;
            font-size: 1.25rem;
            line-height: 1;
            padding: 4px;
          }

          .drawer-panel a {
            border-radius: 8px;
            color: #ededed;
            font-size: .95rem;
            padding: 12px 10px;
            text-decoration: none;
          }

          .drawer-panel a:hover {
            background: rgba(255,255,255,0.06);
          }

          @media (min-width: 980px) {
            .site-header-tools {
              align-items: center;
              flex-direction: row;
              flex-wrap: wrap;
              justify-content: flex-end;
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
            <Title style={{ fontSize: "1rem", fontWeight: 600, letterSpacing: "-.01em", color: "#ededed" }}>
              Yama100
              <span style={{ fontSize: ".65rem", fontWeight: 400, color: "#888", marginLeft: "6px" }}>
                百名山チェックリストアプリ
              </span>
            </Title>
            <div className="site-header-tools">
              <Suspense fallback={<div style={{ maxWidth: "360px", width: "100%" }} />}>
                <HeaderSearch />
              </Suspense>
              <HeaderNav />
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
            <Link href="/summary/" style={{ color: "#444", textDecoration: "none" }}>登頂まとめ</Link>
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
