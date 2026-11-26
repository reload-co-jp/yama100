import Link from "next/link"
import { Suspense } from "react"
import HeaderNav from "../HeaderNav"
import HeaderSearch from "../HeaderSearch"
import { MountainIcon } from "../ui/Icons"
import NavLinks from "./NavLinks"
import styles from "./SiteHeader.module.css"

export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link className={styles.brand} href="/" aria-label="Yama100 ホーム">
          <span className={styles.logoMark}>
            <MountainIcon size={20} />
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>Yama100</span>
            <span className={styles.brandSub}>日本百名山の登山記録</span>
          </span>
        </Link>

        <nav aria-label="メインメニュー" className={styles.nav}>
          <NavLinks className={styles.navLink} />
        </nav>

        <div className={styles.tools}>
          <div className={styles.search}>
            <Suspense fallback={null}>
              <HeaderSearch />
            </Suspense>
          </div>
          <HeaderNav />
        </div>
      </div>
    </header>
  )
}
