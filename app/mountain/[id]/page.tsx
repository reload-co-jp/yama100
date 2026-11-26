import Link from "next/link"
import { notFound } from "next/navigation"
import DetailHeroPhoto from "../../../components/detail/DetailHeroPhoto"
import DetailMap from "../../../components/detail/DetailMap"
import MountainRecordPanel from "../../../components/detail/MountainRecordPanel"
import JsonLd from "../../../components/JsonLd"
import {
  CANONICAL_MOUNTAINS,
  findCanonicalMountainById,
  MOUNTAIN_LISTS,
  type CanonicalMountain,
} from "../../../lib/mountainCatalog"
import {
  formatElevation,
  getPrefectures,
  getRegion,
  parseCourse,
} from "../../../lib/mountainMeta"
import { fetchWikiThumbnail } from "../../../lib/site"
import {
  absoluteUrl,
  breadcrumbLd,
  HOME_CRUMB,
} from "../../../lib/structuredData"
import styles from "./page.module.css"

export const dynamicParams = false

function truncate(text: string, maxLen = 120): string {
  return text.length > maxLen ? text.slice(0, maxLen - 1) + "…" : text
}

function primaryMembership(mountain: CanonicalMountain) {
  const order = MOUNTAIN_LISTS.map((list) => list.key)
  return [...mountain.memberships].sort(
    (a, b) => order.indexOf(a.listKey) - order.indexOf(b.listKey)
  )[0]
}

function sortedMemberships(mountain: CanonicalMountain) {
  const order = MOUNTAIN_LISTS.map((list) => list.key)
  return [...mountain.memberships].sort(
    (a, b) => order.indexOf(a.listKey) - order.indexOf(b.listKey)
  )
}

function nearbyMountains(mountain: CanonicalMountain, count = 6) {
  const dist = (m: CanonicalMountain) => {
    const lat = (m.latitude - mountain.latitude) * 111
    const lng = (m.longitude - mountain.longitude) * 91
    return Math.sqrt(lat * lat + lng * lng)
  }
  return CANONICAL_MOUNTAINS.filter((m) => m !== mountain)
    .map((m) => ({ mountain: m, km: dist(m) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, count)
}

function buildDescription(mountain: CanonicalMountain) {
  const prefs = getPrefectures(mountain).join("・")
  const lists = sortedMemberships(mountain)
    .map((m) => m.label)
    .join("・")
  return truncate(
    `${mountain.name}（${formatElevation(mountain.elevation)}）は${prefs}にある山。${lists}に選ばれています。${mountain.description}`,
    150
  )
}

export function generateStaticParams() {
  return CANONICAL_MOUNTAINS.map((mountain) => ({ id: String(mountain.id) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const mountain = findCanonicalMountainById(Number(id))
  if (!mountain) return {}

  const imageUrl = await fetchWikiThumbnail(mountain.name)
  const canonicalPath = `/mountain/${mountain.id}/`
  const description = buildDescription(mountain)
  const title = `${mountain.name}｜標高・所在地・登頂記録｜Yama100`
  const images = imageUrl
    ? [{ url: imageUrl, alt: `${mountain.name}の写真` }]
    : [{ url: "/opengraph-image", alt: "Yama100" }]

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: "Yama100",
      locale: "ja_JP",
      type: "article",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((image) => image.url),
    },
  }
}

function SourceLink({ href }: { href: string }) {
  return (
    <a
      className={styles.source}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      出典: Wikipedia
    </a>
  )
}

export default async function MountainPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const mountain = findCanonicalMountainById(Number(id))
  if (!mountain) notFound()

  const idx = CANONICAL_MOUNTAINS.findIndex((m) => m.id === mountain.id)
  const prevMountain = idx > 0 ? CANONICAL_MOUNTAINS[idx - 1] : null
  const nextMountain =
    idx < CANONICAL_MOUNTAINS.length - 1 ? CANONICAL_MOUNTAINS[idx + 1] : null

  const memberships = sortedMemberships(mountain)
  const primary = primaryMembership(mountain)
  const prefectures = getPrefectures(mountain)
  const region = getRegion(mountain)
  const otherNames = mountain.aliases.filter((alias) => alias !== mountain.name)
  const courses = mountain.courseSources.map((entry) => ({
    ...entry,
    info: parseCourse(entry.text),
  }))
  const hasClimbingInfo =
    mountain.accessSources.length > 0 ||
    mountain.courseSources.length > 0 ||
    Boolean(mountain.difficulty)
  const nearby = nearbyMountains(mountain)
  const path = `/mountain/${mountain.id}/`

  const crumbs = [
    HOME_CRUMB,
    ...(primary
      ? [
          {
            href: primary.listHref === "/" ? "/hyakumeizan/" : primary.listHref,
            label: primary.label,
          },
        ]
      : []),
    { href: path, label: mountain.name },
  ]

  const mountainLd = {
    "@context": "https://schema.org",
    "@type": "Mountain",
    name: mountain.name,
    ...(otherNames.length ? { alternateName: otherNames } : {}),
    description: mountain.description,
    url: absoluteUrl(path),
    geo: {
      "@type": "GeoCoordinates",
      latitude: mountain.latitude,
      longitude: mountain.longitude,
      elevation: mountain.elevation,
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: prefectures.join("・"),
      addressCountry: "JP",
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "標高",
        value: mountain.elevation,
        unitText: "m",
      },
      ...memberships.map((m) => ({
        "@type": "PropertyValue",
        name: "選定リスト",
        value: m.label,
      })),
    ],
  }

  return (
    <article className={styles.page}>
      <JsonLd data={[mountainLd, breadcrumbLd(crumbs)]} />

      <div className="container">
        <nav aria-label="パンくずリスト" className={styles.breadcrumbs}>
          <ol>
            {crumbs.map((crumb, i) => (
              <li key={crumb.href}>
                {i === crumbs.length - 1 ? (
                  <span aria-current="page">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href}>{crumb.label}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <header className={styles.header}>
          <div className={styles.photo}>
            <DetailHeroPhoto name={mountain.name} />
          </div>
          <div className={styles.titleBlock}>
            <div className={styles.memberships}>
              {memberships.map((m) => (
                <Link
                  className="chip chip-climbed"
                  href={m.listHref === "/" ? "/#list" : m.listHref}
                  key={`${m.listKey}-${m.id}`}
                >
                  {m.label}
                </Link>
              ))}
            </div>
            <h1 className={styles.title}>{mountain.name}</h1>
            {otherNames.length > 0 && (
              <p className={styles.aliases}>
                別名・表記: {otherNames.join(" / ")}
              </p>
            )}
            <p className={styles.elevation}>
              標高{" "}
              <strong className="tabular">
                {formatElevation(mountain.elevation)}
              </strong>
            </p>
          </div>
        </header>

        <div className={styles.layout}>
          <div className={styles.main}>
            <section
              aria-labelledby="facts-title"
              className={`card ${styles.section}`}
            >
              <h2 className={styles.h2} id="facts-title">
                基本情報
              </h2>
              <dl className={styles.facts}>
                <div>
                  <dt>山名</dt>
                  <dd>{mountain.name}</dd>
                </div>
                {otherNames.length > 0 && (
                  <div>
                    <dt>別名</dt>
                    <dd>{otherNames.join("、")}</dd>
                  </div>
                )}
                <div>
                  <dt>標高</dt>
                  <dd className="tabular">
                    {formatElevation(mountain.elevation)}
                  </dd>
                </div>
                <div>
                  <dt>所在地</dt>
                  <dd>{prefectures.join("・")}</dd>
                </div>
                {region && (
                  <div>
                    <dt>地域</dt>
                    <dd>{region.label}地方</dd>
                  </div>
                )}
                {mountain.nationalPark && (
                  <div>
                    <dt>国立公園等</dt>
                    <dd>
                      {mountain.nationalPark.text}{" "}
                      <SourceLink href={mountain.nationalPark.source} />
                    </dd>
                  </div>
                )}
                <div>
                  <dt>登録区分</dt>
                  <dd>{memberships.map((m) => m.label).join("、")}</dd>
                </div>
                <div>
                  <dt>緯度・経度</dt>
                  <dd className="tabular">
                    {mountain.latitude.toFixed(4)},{" "}
                    {mountain.longitude.toFixed(4)}
                  </dd>
                </div>
              </dl>
            </section>

            <section
              aria-labelledby="intro-title"
              className={`card ${styles.section}`}
            >
              <h2 className={styles.h2} id="intro-title">
                {mountain.name}について
              </h2>
              <div className={styles.prose}>
                {mountain.descriptionSources.length > 0 ? (
                  mountain.descriptionSources.map((entry) => (
                    <div key={entry.label + entry.text.slice(0, 16)}>
                      {mountain.descriptionSources.length > 1 && (
                        <p className={styles.sourceLabel}>{entry.label}より</p>
                      )}
                      <p>{entry.text}</p>
                    </div>
                  ))
                ) : (
                  <p>{mountain.description}</p>
                )}
              </div>
            </section>

            {hasClimbingInfo && (
              <section
                aria-labelledby="climb-title"
                className={`card ${styles.section}`}
              >
                <h2 className={styles.h2} id="climb-title">
                  登山情報
                </h2>
                {courses.length > 0 && (
                  <div className={styles.infoBlock}>
                    <h3 className={styles.h3}>
                      主な登山ルート（モデルコース）
                    </h3>
                    {courses.map((course) => (
                      <div
                        className={styles.course}
                        key={course.label + course.text.slice(0, 16)}
                      >
                        <p className={styles.courseText}>{course.text}</p>
                        <div className={styles.courseMeta}>
                          {course.info?.hours !== null &&
                            course.info?.hours !== undefined && (
                              <span className="chip chip-sky">
                                記載のコースタイム 約{course.info.hours}時間
                              </span>
                            )}
                          {course.info?.overnight && (
                            <span className="chip chip-sunrise">宿泊行程</span>
                          )}
                          {course.info?.usesLift && (
                            <span className="chip">
                              ロープウェイ・リフト等利用
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {mountain.accessSources.length > 0 && (
                  <div className={styles.infoBlock}>
                    <h3 className={styles.h3}>アクセス</h3>
                    {mountain.accessSources.map((entry) => (
                      <p
                        className={styles.infoText}
                        key={entry.label + entry.text.slice(0, 16)}
                      >
                        {entry.text}
                      </p>
                    ))}
                  </div>
                )}
                {mountain.difficulty && (
                  <div className={styles.infoBlock}>
                    <h3 className={styles.h3}>難易度の目安</h3>
                    <p className={styles.difficulty}>
                      <span className="chip chip-sky">
                        {mountain.difficulty.level}
                      </span>
                      <span>{mountain.difficulty.basis}</span>
                    </p>
                    <p className={styles.note}>
                      ※標高とモデルコースの所要時間から簡易的に自動算出した目安で、人手による確認前の値です。
                      岩場・鎖場などの技術的な難しさは反映していません。計画時は最新の山行記録や公式情報を必ずご確認ください。
                    </p>
                    <div className={styles.refLinks}>
                      <a
                        href={mountain.difficulty.referenceLinks.yamap}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        YAMAPで調べる →
                      </a>
                      <a
                        href={mountain.difficulty.referenceLinks.yamareco}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        ヤマレコで調べる →
                      </a>
                    </div>
                  </div>
                )}
                <p className={styles.note}>
                  登山口・登山適期・山小屋などの詳細は、自治体や山小屋の公式情報、最新の登山記録でご確認ください。
                </p>
              </section>
            )}

            {(mountain.history || mountain.vegetation) && (
              <section
                aria-labelledby="story-title"
                className={`card ${styles.section}`}
              >
                <h2 className={styles.h2} id="story-title">
                  歴史と自然
                </h2>
                {mountain.history && (
                  <div className={styles.infoBlock}>
                    <h3 className={styles.h3}>歴史</h3>
                    <p className={styles.infoText}>{mountain.history.text}</p>
                    <SourceLink href={mountain.history.source} />
                  </div>
                )}
                {mountain.vegetation && (
                  <div className={styles.infoBlock}>
                    <h3 className={styles.h3}>植生</h3>
                    <p className={styles.infoText}>
                      {mountain.vegetation.text}
                    </p>
                    <SourceLink href={mountain.vegetation.source} />
                  </div>
                )}
              </section>
            )}

            <section
              aria-labelledby="map-title"
              className={`card ${styles.section}`}
            >
              <h2 className={styles.h2} id="map-title">
                地図
              </h2>
              <div className={styles.map}>
                <DetailMap
                  memberships={memberships}
                  mountain={{
                    id: mountain.id,
                    name: mountain.name,
                    location: prefectures,
                    latitude: mountain.latitude,
                    longitude: mountain.longitude,
                    elevation: mountain.elevation,
                  }}
                />
              </div>
              <div className={styles.extLinks}>
                <a
                  className="btn btn-secondary btn-sm"
                  href={`https://maps.gsi.go.jp/#15/${mountain.latitude}/${mountain.longitude}/`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  国土地理院地図で見る
                </a>
                <a
                  className="btn btn-secondary btn-sm"
                  href={`https://ja.wikipedia.org/wiki/${encodeURIComponent(mountain.name)}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Wikipedia
                </a>
                <a
                  className="btn btn-secondary btn-sm"
                  href={`https://yamap.com/search/activities?keyword=${encodeURIComponent(mountain.name)}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  YAMAPの活動日記
                </a>
              </div>
            </section>
          </div>

          <aside className={styles.side}>
            <MountainRecordPanel
              memberships={memberships}
              mountainId={mountain.id}
              mountainName={mountain.name}
            />
          </aside>
        </div>

        <section aria-labelledby="nearby-title" className={styles.nearby}>
          <h2 className={styles.h2} id="nearby-title">
            {mountain.name}の近くにある山
          </h2>
          <ul>
            {nearby.map(({ mountain: m, km }) => (
              <li key={`${m.id}-${m.canonicalName}`}>
                <Link href={`/mountain/${m.id}/`}>
                  <span className={styles.nearbyName}>{m.name}</span>
                  <span className={styles.nearbyMeta}>
                    {formatElevation(m.elevation)} ・ 約{Math.round(km)}km
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {(prevMountain || nextMountain) && (
          <nav aria-label="前後の山" className={styles.pager}>
            {prevMountain ? (
              <Link href={`/mountain/${prevMountain.id}/`} rel="prev">
                <span>← 前の山</span>
                <strong>{prevMountain.name}</strong>
              </Link>
            ) : (
              <span />
            )}
            {nextMountain ? (
              <Link
                className={styles.next}
                href={`/mountain/${nextMountain.id}/`}
                rel="next"
              >
                <span>次の山 →</span>
                <strong>{nextMountain.name}</strong>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </div>
    </article>
  )
}
