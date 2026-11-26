import Link from "next/link"
import GuidePage from "components/guide/GuidePage"
import MountainTable from "components/guide/MountainTable"
import { GUIDE_PUBLISHED, GUIDE_ROWS, GUIDE_UPDATED } from "lib/hyakumeizan"
import { guideMetadata } from "lib/guideMeta"
import { articleLd } from "lib/structuredData"

const PATH = "/hyakumeizan/day-trip/"
const TITLE = "日帰りの目安になる日本百名山"
const DESCRIPTION =
  "日本百名山のうち、当サイト掲載のモデルコースが宿泊を前提としていない山を、記載されたコースタイム別に整理しました。日帰り登山の計画づくりの参考にどうぞ。"

export const metadata = guideMetadata(
  PATH,
  `${TITLE}（コースタイム別）`,
  DESCRIPTION
)

const BANDS = [
  { id: "under4", label: "約4時間以内", test: (h: number) => h <= 4 },
  { id: "5to6", label: "約5〜6時間", test: (h: number) => h > 4 && h <= 6 },
  { id: "7to8", label: "約7〜8時間", test: (h: number) => h > 6 && h <= 8 },
  { id: "over9", label: "約9時間以上", test: (h: number) => h > 8 },
]

export default function Page() {
  const dayRows = GUIDE_ROWS.filter(
    (r) => r.course && !r.course.overnight && r.course.hours !== null
  ).sort(
    (a, b) =>
      (a.course!.hours ?? 0) - (b.course!.hours ?? 0) || a.number - b.number
  )
  const overnight = GUIDE_ROWS.filter((r) => r.course?.overnight)
  const unknown = GUIDE_ROWS.filter(
    (r) => !r.course || (!r.course.overnight && r.course.hours === null)
  )

  return (
    <GuidePage
      eyebrow="Day Hikes"
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
          当サイトに掲載しているモデルコースのうち、宿泊を前提としていない
          {dayRows.length}座を、記載された所要時間別に紹介します。
        </p>
      }
      path={PATH}
      title={TITLE}
    >
      <p className="callout">
        ここでの分類は、当サイトの山データに記載されたモデルコースの所要時間のみにもとづく
        <strong>目安</strong>です。
        登山口までのアクセス、ロープウェイ・リフトの運行期間、日照時間、天候、体力によって日帰りできるかどうかは変わります。
        長時間の行程では山小屋泊を選ぶ人も多いため、計画時は公式情報や最新の山行記録をご確認ください。
      </p>
      <ul className="toc">
        {BANDS.map((band) => (
          <li key={band.id}>
            <a href={`#${band.id}`}>{band.label}</a>
          </li>
        ))}
        <li>
          <a href="#overnight">宿泊行程のモデルコース</a>
        </li>
      </ul>

      {BANDS.map((band) => {
        const rows = dayRows.filter((r) => band.test(r.course!.hours!))
        if (rows.length === 0) return null
        return (
          <section aria-labelledby={band.id} key={band.id}>
            <h2 id={band.id}>
              モデルコースの所要時間が{band.label}の山（{rows.length}座）
            </h2>
            <MountainTable
              caption={`所要時間${band.label}の日本百名山`}
              columns={["course", "elevation", "prefecture"]}
              rows={rows}
            />
          </section>
        )
      })}

      <h2 id="overnight">モデルコースが宿泊行程の山（{overnight.length}座）</h2>
      <p>
        次の山は、当サイト掲載のモデルコースが1泊2日などの宿泊を前提としています。
      </p>
      <MountainTable
        caption="モデルコースが宿泊行程の日本百名山"
        columns={["course", "elevation", "prefecture"]}
        rows={overnight}
      />

      {unknown.length > 0 && (
        <>
          <h2>所要時間の記載がない山</h2>
          <p>
            {unknown.map((r) => r.name).join("、")}
            は、モデルコースに所要時間の記載がないため分類していません。
          </p>
        </>
      )}

      <p>
        <Link className="text-link" href="/gear-checklist/">
          日帰り登山の装備を確認する（山装備チェックリスト） →
        </Link>
      </p>
    </GuidePage>
  )
}
