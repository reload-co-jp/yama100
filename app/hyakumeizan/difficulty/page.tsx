import GuidePage from "components/guide/GuidePage"
import MountainTable from "components/guide/MountainTable"
import { GUIDE_PUBLISHED, GUIDE_ROWS, GUIDE_UPDATED } from "lib/hyakumeizan"
import { guideMetadata } from "lib/guideMeta"
import { DIFFICULTY_LEVELS } from "lib/mountainMeta"
import { articleLd } from "lib/structuredData"

const PATH = "/hyakumeizan/difficulty/"
const TITLE = "日本百名山 難易度別一覧"
const DESCRIPTION =
  "日本百名山を初級・中級・上級の難易度の目安別に一覧で紹介。標高とモデルコースの所要時間をもとにした目安と、その算出根拠を掲載しています。"

export const metadata = guideMetadata(PATH, TITLE, DESCRIPTION)

const LEVEL_ANCHOR = {
  初級: "beginner",
  中級: "intermediate",
  上級: "advanced",
} as const

export default function Page() {
  const groups = DIFFICULTY_LEVELS.map((level) => ({
    level,
    rows: GUIDE_ROWS.filter((r) => r.difficulty === level).sort(
      (a, b) =>
        (a.course?.hours ?? 99) - (b.course?.hours ?? 99) ||
        a.elevation - b.elevation
    ),
  }))

  return (
    <GuidePage
      eyebrow="By Difficulty"
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
          日本百名山を難易度の目安ごとに分類しました。各グループ内は、モデルコースの所要時間が短い順に並べています。
        </p>
      }
      path={PATH}
      title={TITLE}
    >
      <h2>この難易度の目安について</h2>
      <p className="callout">
        当サイトの難易度は、各山の標高とモデルコースに記載された所要時間から
        <strong>簡易的に自動算出した目安</strong>で、
        人手による確認前の値です。岩場・鎖場・渡渉などの技術的な難しさ、天候、季節、残雪、体力差は反映していません。
        実際の難易度は選ぶルートや条件によって大きく変わるため、計画の際は必ず最新の山行記録や自治体・山小屋などの公式情報をご確認ください。
      </p>
      <dl className="stat-row">
        {groups.map((g) => (
          <div key={g.level}>
            <dt>{g.level}</dt>
            <dd>{g.rows.length}座</dd>
          </div>
        ))}
      </dl>
      {groups.map((g) => (
        <section aria-labelledby={LEVEL_ANCHOR[g.level]} key={g.level}>
          <h2 id={LEVEL_ANCHOR[g.level]}>
            {g.level}の目安とされた山（{g.rows.length}座）
          </h2>
          <MountainTable
            caption={`難易度の目安が${g.level}の日本百名山`}
            columns={["elevation", "prefecture", "course"]}
            rows={g.rows}
          />
        </section>
      ))}
    </GuidePage>
  )
}
