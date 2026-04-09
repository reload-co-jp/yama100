import { Title } from "components/elements/layout"
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
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body>
        <header
          style={{
            backgroundColor: "#333",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: ".5rem 1rem",
            position: "relative",
          }}
        >
          <Title>Yama100 - 日本百名山チェックリスト</Title>
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
