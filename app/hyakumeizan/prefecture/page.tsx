import GuidePage from "components/guide/GuidePage"
import MountainTable from "components/guide/MountainTable"
import { GUIDE_PUBLISHED, GUIDE_ROWS, GUIDE_UPDATED } from "lib/hyakumeizan"
import { guideMetadata } from "lib/guideMeta"
import { PREFECTURE_ORDER } from "lib/regions"
import { articleLd } from "lib/structuredData"

const PATH = "/hyakumeizan/prefecture/"
const TITLE = "日本百名山 都道府県別一覧"
const DESCRIPTION =
  "日本百名山を都道府県別に一覧で紹介。長野県・山梨県など各都道府県にある百名山の数と、標高・難易度の目安を確認できます。"

export const metadata = guideMetadata(PATH, TITLE, DESCRIPTION)

export default function Page() {
  const groups = PREFECTURE_ORDER.map((pref, i) => ({
    pref,
    anchor: `pref-${i + 1}`,
    rows: GUIDE_ROWS.filter((r) => r.prefectures.includes(pref)),
  })).filter((g) => g.rows.length > 0)
  const ranking = [...groups]
    .sort((a, b) => b.rows.length - a.rows.length)
    .slice(0, 5)
  const none = PREFECTURE_ORDER.filter(
    (pref) => !groups.some((g) => g.pref === pref)
  )

  return (
    <GuidePage
      eyebrow="By Prefecture"
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
          日本百名山を都道府県ごとに整理しました。複数の都道府県にまたがる山は、それぞれの都道府県に掲載しています。
        </p>
      }
      path={PATH}
      title={TITLE}
    >
      <h2>日本百名山が多い都道府県</h2>
      <dl className="stat-row">
        {ranking.map((g) => (
          <div key={g.pref}>
            <dt>{g.pref}</dt>
            <dd>{g.rows.length}座</dd>
          </div>
        ))}
      </dl>
      <ul className="toc">
        {groups.map((g) => (
          <li key={g.pref}>
            <a href={`#${g.anchor}`}>
              {g.pref}（{g.rows.length}）
            </a>
          </li>
        ))}
      </ul>
      {groups.map((g) => (
        <section aria-labelledby={g.anchor} key={g.pref}>
          <h2 id={g.anchor}>
            {g.pref}の日本百名山（{g.rows.length}座）
          </h2>
          <MountainTable
            caption={`${g.pref}の日本百名山`}
            columns={["elevation", "prefecture", "difficulty"]}
            rows={g.rows}
          />
        </section>
      ))}
      {none.length > 0 && (
        <>
          <h2>日本百名山がない都道府県</h2>
          <p>
            当サイトの山データでは、次の都府県には日本百名山の所在地が登録されていません：
            {none.join("、")}。
          </p>
        </>
      )}
    </GuidePage>
  )
}
