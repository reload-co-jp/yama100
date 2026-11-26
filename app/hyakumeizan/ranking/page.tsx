import GuidePage from "components/guide/GuidePage"
import MountainTable from "components/guide/MountainTable"
import { GUIDE_PUBLISHED, GUIDE_ROWS, GUIDE_UPDATED } from "lib/hyakumeizan"
import { guideMetadata } from "lib/guideMeta"
import { formatElevation } from "lib/mountainMeta"
import { articleLd, itemListLd } from "lib/structuredData"

const PATH = "/hyakumeizan/ranking/"
const TITLE = "日本百名山 標高ランキング"
const DESCRIPTION =
  "日本百名山100座を標高の高い順に並べたランキング。富士山をはじめとする3,000m峰から、標高の低い百名山まで一覧で確認できます。"

export const metadata = guideMetadata(PATH, TITLE, DESCRIPTION)

function ranksOf(rows: { elevation: number }[]) {
  const ranks: number[] = []
  rows.forEach((row, i) => {
    ranks.push(
      i > 0 && rows[i - 1].elevation === row.elevation ? ranks[i - 1] : i + 1
    )
  })
  return ranks
}

export default function Page() {
  const rows = [...GUIDE_ROWS].sort(
    (a, b) => b.elevation - a.elevation || a.number - b.number
  )
  const ranks = ranksOf(rows)
  const bands = [
    { label: "3,000m以上", test: (e: number) => e >= 3000 },
    { label: "2,500〜2,999m", test: (e: number) => e >= 2500 && e < 3000 },
    { label: "2,000〜2,499m", test: (e: number) => e >= 2000 && e < 2500 },
    { label: "1,500〜1,999m", test: (e: number) => e >= 1500 && e < 2000 },
    { label: "1,500m未満", test: (e: number) => e < 1500 },
  ]
  const lowest = [...rows].reverse().slice(0, 5)

  return (
    <GuidePage
      eyebrow="Elevation Ranking"
      jsonLd={[
        articleLd({
          headline: TITLE,
          description: DESCRIPTION,
          path: PATH,
          datePublished: GUIDE_PUBLISHED,
          dateModified: GUIDE_UPDATED,
        }),
        itemListLd({
          name: TITLE,
          description: DESCRIPTION,
          path: PATH,
          items: rows.map((r) => ({ name: r.name, path: r.href })),
        }),
      ]}
      lead={
        <p>
          日本百名山を標高の高い順に並べました。最高峰は{rows[0].name}（
          {formatElevation(rows[0].elevation)}）です。
        </p>
      }
      path={PATH}
      title={TITLE}
    >
      <h2>標高帯ごとの山の数</h2>
      <dl className="stat-row">
        {bands.map((band) => (
          <div key={band.label}>
            <dt>{band.label}</dt>
            <dd>{rows.filter((r) => band.test(r.elevation)).length}座</dd>
          </div>
        ))}
      </dl>

      <h2>標高ランキング（高い順）</h2>
      <MountainTable
        caption="日本百名山 標高ランキング"
        columns={["rank", "elevation", "prefecture", "region"]}
        ranks={ranks}
        rows={rows}
      />

      <h2>標高が低い日本百名山</h2>
      <p>
        日本百名山の中で標高が最も低いのは{lowest[0].name}（
        {formatElevation(lowest[0].elevation)}
        ）です。標高が低い順に5座を挙げます。
      </p>
      <MountainTable
        caption="標高が低い日本百名山"
        columns={["elevation", "prefecture"]}
        rows={lowest}
      />
      <p className="callout">
        標高は当サイトの山データに登録された値です。測量の改定などにより公式の値と異なる場合があります。
      </p>
    </GuidePage>
  )
}
