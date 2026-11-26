import Link from "next/link"
import type { ReactNode } from "react"
import HeroPicture from "./HeroPicture"
import styles from "./ListHero.module.css"

type Crumb = { href: string; label: string }

type Props = {
  eyebrow: string
  title: string
  lead: ReactNode
  breadcrumbs?: Crumb[]
  children?: ReactNode
}

export default function ListHero({
  eyebrow,
  title,
  lead,
  breadcrumbs,
  children,
}: Props) {
  return (
    <section className={styles.hero}>
      <HeroPicture className={styles.image} priority />
      <div className={`container ${styles.inner}`}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="パンくずリスト" className={styles.breadcrumbs}>
            <ol>
              {breadcrumbs.map((crumb, i) => (
                <li key={crumb.href}>
                  {i === breadcrumbs.length - 1 ? (
                    <span aria-current="page">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href}>{crumb.label}</Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.lead}>{lead}</div>
        {children && <div className={styles.links}>{children}</div>}
      </div>
    </section>
  )
}
