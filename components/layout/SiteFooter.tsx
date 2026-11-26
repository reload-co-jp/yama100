import Link from "next/link"
import { GUIDE_NAV, LIST_NAV, OTHER_NAV } from "./navigation"
import styles from "./SiteFooter.module.css"

const ARTICLE_LINKS = [
  { href: "/articles/history/", label: "百名山の成立" },
  { href: "/articles/criteria/", label: "選考基準" },
  { href: "/articles/fukada/", label: "深田久弥" },
  { href: "/articles/mountains/", label: "深田久弥が登った山々" },
  { href: "/articles/flowers/", label: "花の百名山とは" },
]

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div>
            <p className={styles.brand}>Yama100</p>
            <p className={styles.tagline}>
              日本百名山をはじめとする山の登頂記録を、ログイン不要で管理・共有できる登山記録サービス。
              記録はお使いのブラウザ内に保存されます。
            </p>
          </div>
          <div>
            <p className={styles.heading}>山のリスト</p>
            <ul className={styles.list}>
              {LIST_NAV.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className={styles.heading}>百名山ガイド</p>
            <ul className={styles.list}>
              {GUIDE_NAV.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className={styles.heading}>読み物・ツール</p>
            <ul className={styles.list}>
              {[
                ...ARTICLE_LINKS,
                ...OTHER_NAV,
                { href: "/map/", label: "百名山マップ" },
                { href: "/summary/", label: "登頂記録" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>&copy; Yama100</p>
          <a href="https://reload.co.jp/">運営会社</a>
        </div>
      </div>
    </footer>
  )
}
