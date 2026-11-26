import Link from "next/link"
import GuidePage from "components/guide/GuidePage"
import MountainTable from "components/guide/MountainTable"
import { GUIDE_PUBLISHED, GUIDE_ROWS, GUIDE_UPDATED } from "lib/hyakumeizan"
import { guideMetadata } from "lib/guideMeta"
import { REGIONS } from "lib/regions"
import { articleLd } from "lib/structuredData"

const PATH = "/hyakumeizan/region/"
const TITLE = "日本百名山 地域別一覧"
const DESCRIPTION =
  "日本百名山を北海道・東北・関東・中部・近畿・中国・四国・九州の地域別に一覧で紹介。地域ごとの山の数と標高・所在地がわかります。"

export const metadata = guideMetadata(PATH, TITLE, DESCRIPTION)

export default function Page() {
  const groups = REGIONS.map((region) => ({
    region,
    rows: GUIDE_ROWS.filter((r) => r.region?.key === region.key),
  })).filter((g) => g.rows.length > 0)

  return (
    <GuidePage
      eyebrow="By Region"
      jsonLd={[
        articleLd({
          headline: TITLE,
          description: DESCRIPTION,
          path: PATH,
          datePublished: GUIDE_PUBLISHED,
          dateModified: GUIDE_UPDATED,
        }),
      ]}
      lead={
        <p>
          日本百名山を地域ごとに分けて紹介します。遠征の計画や、地域ごとの完登を目指す際の参考にどうぞ。
        </p>
      }
      path={PATH}
      title={TITLE}
    >
      <ul className="toc">
        {groups.map(({ region, rows }) => (
          <li key={region.key}>
            <a href={`#${region.key}`}>
              {region.label}（{rows.length}座）
            </a>
          </li>
        ))}
      </ul>
      <p className="callout">
        複数の都道府県・地域にまたがる山は、データ上で最初に記載された都道府県の地域に分類しています。
      </p>
      {groups.map(({ region, rows }) => (
        <section aria-labelledby={region.key} key={region.key}>
          <h2 id={region.key}>
            {region.label}の日本百名山（{rows.length}座）
          </h2>
          <MountainTable
            caption={`${region.label}の日本百名山`}
            columns={["elevation", "prefecture", "difficulty"]}
            rows={rows}
          />
          <p>
            <Link className="text-link" href={`/?region=${region.key}#list`}>
              {region.label}の山を登頂チェックリストで見る →
            </Link>
          </p>
        </section>
      ))}
    </GuidePage>
  )
}
