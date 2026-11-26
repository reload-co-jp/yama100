import Link from "next/link"
import GuidePage from "components/guide/GuidePage"
import MountainTable from "components/guide/MountainTable"
import { GUIDE_NAV } from "components/layout/navigation"
import { GUIDE_ROWS } from "lib/hyakumeizan"
import { guideMetadata } from "lib/guideMeta"
import { formatElevation } from "lib/mountainMeta"
import { REGIONS } from "lib/regions"
import { itemListLd } from "lib/structuredData"

const PATH = "/hyakumeizan/"
const TITLE = "日本百名山一覧"
const DESCRIPTION =
  "深田久弥が選んだ日本百名山100座の一覧。標高・所在地（都道府県）・地域・難易度の目安を一覧表で確認でき、各山の詳細ページや登頂チェックリストに移動できます。"

export const metadata = guideMetadata(
  PATH,
  `${TITLE}（標高・所在地・地域）`,
  DESCRIPTION
)

export default function Page() {
  const highest = [...GUIDE_ROWS].sort((a, b) => b.elevation - a.elevation)[0]
  const lowest = [...GUIDE_ROWS].sort((a, b) => a.elevation - b.elevation)[0]
  const over3000 = GUIDE_ROWS.filter((r) => r.elevation >= 3000).length
  const prefectures = new Set(GUIDE_ROWS.flatMap((r) => r.prefectures)).size

  return (
    <GuidePage
      eyebrow="Japan's 100 Famous Mountains"
      jsonLd={[
        itemListLd({
          name: TITLE,
          description: DESCRIPTION,
          path: PATH,
          items: GUIDE_ROWS.map((r) => ({ name: r.name, path: r.href })),
        }),
      ]}
      lead={
        <p>
          深田久弥が随筆『日本百名山』で選んだ100の名峰を、北から順に一覧で紹介します。
        </p>
      }
      parent={null}
      path={PATH}
      title={TITLE}
    >
      <h2>データで見る日本百名山</h2>
      <dl className="stat-row">
        <div>
          <dt>山の数</dt>
          <dd>{GUIDE_ROWS.length}座</dd>
        </div>
        <div>
          <dt>最高峰</dt>
          <dd>
            {highest.name} {formatElevation(highest.elevation)}
          </dd>
        </div>
        <div>
          <dt>最も低い山</dt>
          <dd>
            {lowest.name} {formatElevation(lowest.elevation)}
          </dd>
        </div>
        <div>
          <dt>標高3,000m以上</dt>
          <dd>{over3000}座</dd>
        </div>
        <div>
          <dt>所在する都道府県</dt>
          <dd>{prefectures}都道府県</dd>
        </div>
      </dl>

      <h2>テーマ別に見る</h2>
      <ul className="toc">
        {GUIDE_NAV.filter((item) => item.href !== PATH).map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>

      <h2>地域ごとの山の数</h2>
      <ul className="toc">
        {REGIONS.map((region) => {
          const count = GUIDE_ROWS.filter(
            (r) => r.region?.key === region.key
          ).length
          return (
            <li key={region.key}>
              <Link href={`/hyakumeizan/region/#${region.key}`}>
                {region.label} {count}座
              </Link>
            </li>
          )
        })}
      </ul>

      <h2>日本百名山 全100座の一覧</h2>
      <p>
        番号は当サイトのチェックリストの番号（おおむね北から南の順）です。山名を押すと詳細ページに移動します。
      </p>
      <MountainTable
        caption="日本百名山の一覧"
        columns={["number", "elevation", "prefecture", "region", "difficulty"]}
        rows={GUIDE_ROWS}
      />
      <p className="callout">
        難易度目安は、標高とモデルコースの所要時間から簡易的に自動算出した値です。岩場・鎖場などの技術的な難しさは反映していないため、
        参考程度にご覧ください。
      </p>
    </GuidePage>
  )
}
