import Link from "next/link"
import { MOUNTAIN_LISTS } from "../../lib/mountainCatalog"
import { GUIDE_NAV } from "../layout/navigation"
import { ArrowRightIcon, MapIcon } from "../ui/Icons"
import styles from "./ExploreLists.module.css"

export default function ExploreLists() {
  return (
    <section aria-labelledby="explore-title" className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="section-eyebrow">Explore</p>
            <h2 className="section-title" id="explore-title">
              山を探す
            </h2>
            <p className="section-lead">
              名山リストから、次に登る山を見つけましょう。
            </p>
          </div>
          <Link className="text-link" href="/map/">
            <MapIcon size={16} /> 地図で探す
          </Link>
        </div>
        <ul className={styles.grid}>
          {MOUNTAIN_LISTS.map((list) => (
            <li key={list.key}>
              <Link
                className={styles.card}
                href={list.listHref === "/" ? "/#list" : list.listHref}
              >
                <span
                  aria-hidden="true"
                  className={styles.accent}
                  style={{ background: list.themeColor }}
                />
                <span className={styles.en}>{list.englishLabel}</span>
                <span className={styles.name}>{list.label}</span>
                <span className={styles.desc}>{list.description}</span>
                <span className={styles.foot}>
                  <span className="tabular">{list.mountains.length}座</span>
                  <ArrowRightIcon size={18} />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.guides}>
          <h3 className={styles.guidesTitle}>日本百名山ガイド</h3>
          <ul>
            {GUIDE_NAV.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
