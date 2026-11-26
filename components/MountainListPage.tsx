import Link from "next/link"
import { Suspense } from "react"
import {
  MOUNTAIN_LISTS,
  getMountainList,
  getMountainPagePathForRecord,
  type MountainListKey,
} from "../lib/mountainCatalog"
import { breadcrumbLd, HOME_CRUMB, itemListLd } from "../lib/structuredData"
import JsonLd from "./JsonLd"
import ListExplorer from "./ListExplorer"
import ListHero from "./ListHero"
import styles from "./MountainListPage.module.css"

type Props = {
  listKey: MountainListKey
}

export function buildListMetadata(listKey: MountainListKey) {
  const list = getMountainList(listKey)
  const title = `${list.label}一覧・登頂チェックリスト`
  const description = `${list.description}全${list.mountains.length}座を写真付きで一覧表示。地域・都道府県・標高で絞り込み、登頂記録をログイン不要でチェック・共有できます。`
  return {
    title,
    description,
    alternates: { canonical: list.listHref },
    openGraph: {
      title: `${title}｜Yama100`,
      description,
      url: list.listHref,
      siteName: "Yama100",
      locale: "ja_JP",
      type: "website" as const,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${title}｜Yama100`,
      description,
    },
  }
}

export default function MountainListPage({ listKey }: Props) {
  const list = getMountainList(listKey)
  const crumbs = [HOME_CRUMB, { href: list.listHref, label: list.label }]
  const isExternalAbout = list.aboutHref.startsWith("http")

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd(crumbs),
          itemListLd({
            name: list.label,
            description: list.description,
            path: list.listHref,
            items: [...list.mountains]
              .sort((a, b) => a.id - b.id)
              .map((m) => ({
                name: m.name,
                path: getMountainPagePathForRecord(m),
              })),
          }),
        ]}
      />
      <ListHero
        breadcrumbs={crumbs}
        eyebrow={list.englishLabel}
        lead={
          <p>
            {list.description}あなたはいくつ登りましたか？
            カードの「登頂済みにする」で記録できます。
          </p>
        }
        title={`${list.label}一覧`}
      >
        {isExternalAbout ? (
          <a
            className="btn btn-outline-light btn-sm"
            href={list.aboutHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            {list.aboutLabel} →
          </a>
        ) : (
          <Link className="btn btn-outline-light btn-sm" href={list.aboutHref}>
            {list.aboutLabel} →
          </Link>
        )}
      </ListHero>

      <div className={`container ${styles.body}`}>
        <Suspense fallback={null}>
          <ListExplorer listKey={listKey} />
        </Suspense>

        <nav aria-labelledby="other-lists" className={styles.otherLists}>
          <h2 className={styles.otherTitle} id="other-lists">
            ほかの山のリスト
          </h2>
          <ul>
            {MOUNTAIN_LISTS.filter((l) => l.key !== listKey).map((l) => (
              <li key={l.key}>
                <Link href={l.listHref === "/" ? "/#list" : l.listHref}>
                  {l.label}
                  <span>{l.mountains.length}座</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}
