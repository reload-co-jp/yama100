import BottomNav from "components/layout/BottomNav"
import SiteFooter from "components/layout/SiteFooter"
import SiteHeader from "components/layout/SiteHeader"
import PWAInstallBanner from "components/PWAInstallBanner"
import ServiceWorkerRegistration from "components/ServiceWorkerRegistration"
import type { Metadata, Viewport } from "next"
import "maplibre-gl/dist/maplibre-gl.css"
import "./globals.css"

import { SITE_URL } from "../lib/site"

const TITLE = "Yama100｜日本百名山の登頂記録・チェックリスト"
const DESCRIPTION =
  "日本百名山・二百名山・三百名山などの登頂記録を、ログイン不要で管理・可視化・共有できる登山記録サービス。達成率や地域別の進捗、地図表示、SNS用の登頂記録画像づくりに対応。"

export const metadata: Metadata = {
  title: {
    default: TITLE,
    template: "%s｜Yama100",
  },
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  applicationName: "Yama100",
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "Yama100",
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
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Yama100",
  },
}

export const viewport: Viewport = {
  themeColor: "#1e4d3a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
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
        <a className="skip-link" href="#main">
          本文へスキップ
        </a>
        <ServiceWorkerRegistration />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <BottomNav />
        <PWAInstallBanner />
      </body>
    </html>
  )
}
export default RootLayout
