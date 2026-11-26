import Link from "next/link"
import type { ReactNode } from "react"
import { breadcrumbLd, HOME_CRUMB, type Crumb } from "../../lib/structuredData"
import JsonLd from "../JsonLd"
import { GUIDE_NAV } from "../layout/navigation"
import ListHero from "../ListHero"
import styles from "./GuidePage.module.css"

type Props = {
  path: string
  title: string
  eyebrow: string
  lead: ReactNode
  jsonLd?: object[]
  children: ReactNode
  /** 中間のパンくず（ハブページ以外は「日本百名山」を自動で挟む） */
  parent?: Crumb | null
}

export default function GuidePage({
  path,
  title,
  eyebrow,
  lead,
  jsonLd = [],
  children,
  parent,
}: Props) {
  const hub = { href: "/hyakumeizan/", label: "日本百名山" }
  const crumbs: Crumb[] = [
    HOME_CRUMB,
    ...(parent === null ? [] : [parent ?? hub]),
    ...(path === hub.href ? [] : [{ href: path, label: title }]),
  ]
  if (path === hub.href)
    crumbs.push({ href: hub.href, label: "日本百名山一覧" })

  return (
    <>
      <JsonLd data={[breadcrumbLd(crumbs), ...jsonLd]} />
      <ListHero
        breadcrumbs={crumbs}
        eyebrow={eyebrow}
        lead={lead}
        title={title}
      />
      <div className={`container ${styles.layout}`}>
        <div className={`prose ${styles.main}`}>{children}</div>
        <aside className={styles.side}>
          <nav aria-labelledby="guide-nav-title" className={styles.nav}>
            <p className={styles.navTitle} id="guide-nav-title">
              日本百名山ガイド
            </p>
            <ul>
              {GUIDE_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    aria-current={item.href === path ? "page" : undefined}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link className="btn btn-primary btn-sm" href="/#list">
              登頂チェックリストへ
            </Link>
          </nav>
        </aside>
      </div>
    </>
  )
}
