import { Title } from "components/elements/layout"
import "./reset.css"

export const metadata = {
  title: "Yama100 - 日本百名山チェックリスト",
  description: "日本百名山の登頂状況を管理できるチェックリスト。ログイン不要でURLで共有できます。",
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
