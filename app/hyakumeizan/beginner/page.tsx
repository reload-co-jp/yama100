import Link from "next/link"
import GuidePage from "components/guide/GuidePage"
import MountainTable from "components/guide/MountainTable"
import { GUIDE_PUBLISHED, GUIDE_ROWS, GUIDE_UPDATED } from "lib/hyakumeizan"
import { guideMetadata } from "lib/guideMeta"
import { articleLd } from "lib/structuredData"

const PATH = "/hyakumeizan/beginner/"
const TITLE = "日本百名山 初心者向けガイド"
const DESCRIPTION =
  "はじめての日本百名山の選び方を、当サイトのモデルコースの所要時間やロープウェイ・リフトの利用有無などのデータをもとに紹介。準備のポイントとよくある質問もまとめました。"

export const metadata = guideMetadata(
  PATH,
  `${TITLE}｜はじめての百名山の選び方`,
  DESCRIPTION
)

const FAQ = [
  {
    q: "日本百名山は全部で何座ありますか？",
    a: "100座です。登山家で随筆家の深田久弥が、1964年に刊行した随筆『日本百名山』で選んだ100の山を指します。",
  },
  {
    q: "このページで紹介している山は、初心者なら誰でも登れますか？",
    a: "いいえ。紹介している山は、当サイトのモデルコースの所要時間が比較的短い、または乗り物を使って標高を稼げるコースがあるという条件で抽出したものです。天候や季節、体力、選ぶルートによって難しさは大きく変わるため、必ず事前に最新の情報を確認し、経験者と一緒に計画することをおすすめします。",
  },
  {
    q: "難易度やコースタイムはどのように決めていますか？",
    a: "各山のモデルコースに記載された所要時間と標高から簡易的に算出した目安で、人手による確認前の値です。岩場や鎖場などの技術的な難しさは反映していません。",
  },
  {
    q: "登頂記録はどこに保存されますか？",
    a: "お使いのブラウザ（端末）内に保存され、サーバーには送信されません。ログインは不要です。別の端末に移すときは「データ管理」ページからエクスポート・インポートしてください。",
  },
]

export default function Page() {
  const shortCourses = GUIDE_ROWS.filter(
    (r) =>
      r.course &&
      !r.course.overnight &&
      r.course.hours !== null &&
      r.course.hours <= 4
  ).sort((a, b) => a.course!.hours! - b.course!.hours! || a.number - b.number)
  const liftCourses = GUIDE_ROWS.filter(
    (r) => r.course?.usesLift && !r.course.overnight
  ).sort((a, b) => (a.course?.hours ?? 99) - (b.course?.hours ?? 99))

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }

  return (
    <GuidePage
      eyebrow="Beginner's Guide"
      jsonLd={[
        articleLd({
          headline: TITLE,
          description: DESCRIPTION,
          path: PATH,
          datePublished: GUIDE_PUBLISHED,
          dateModified: GUIDE_UPDATED,
        }),
        faqLd,
      ]}
      lead={
        <p>
          はじめての日本百名山を選ぶときに役立つ考え方と、当サイトのデータから抽出した候補の山を紹介します。
        </p>
      }
      path={PATH}
      title={TITLE}
    >
      <h2>はじめての百名山を選ぶポイント</h2>
      <ol>
        <li>
          <strong>行動時間が短いコースから選ぶ</strong>
          ：休憩を含めても明るいうちに余裕をもって下山できる行程を選びましょう。
        </li>
        <li>
          <strong>乗り物で標高を稼げるコースを活用する</strong>
          ：ロープウェイやリフトを使えるコースは、歩く距離や標高差を抑えられます。運行期間・時間は事前に確認が必要です。
        </li>
        <li>
          <strong>天候と季節を確認する</strong>
          ：同じ山でも、残雪期や悪天候時は難易度が大きく上がります。
        </li>
        <li>
          <strong>装備と計画を整える</strong>
          ：地図・ヘッドランプ・雨具などの基本装備をそろえ、登山計画書を提出しましょう。
          <Link href="/gear-checklist/">山装備チェックリスト</Link>
          も活用してください。
        </li>
      </ol>
      <p className="callout">
        以下の候補は、当サイトの山データ（モデルコースの記載）から機械的に抽出したものです。「簡単に登れる」ことを保証するものではありません。
      </p>

      <h2>
        モデルコースの所要時間が約4時間以内の山（{shortCourses.length}座）
      </h2>
      <p>
        当サイト掲載のモデルコースで、記載された所要時間が約4時間以内の山です。
      </p>
      <MountainTable
        caption="モデルコースの所要時間が約4時間以内の日本百名山"
        columns={["course", "elevation", "prefecture"]}
        rows={shortCourses}
      />

      <h2>
        ロープウェイ・リフトなどを利用するモデルコースがある山（
        {liftCourses.length}座）
      </h2>
      <p>
        モデルコースにロープウェイ・リフト・ケーブルカーなどの利用が含まれている山です。
      </p>
      <MountainTable
        caption="乗り物を利用するモデルコースがある日本百名山"
        columns={["course", "elevation", "prefecture"]}
        rows={liftCourses}
      />

      <h2>次のステップ</h2>
      <ul>
        <li>
          <Link href="/hyakumeizan/day-trip/">
            日帰りの目安になる日本百名山
          </Link>
          で、コースタイム別に候補を広げる
        </li>
        <li>
          <Link href="/hyakumeizan/region/">地域別一覧</Link>
          で、住んでいる地域から近い山を探す
        </li>
        <li>
          登った山は<Link href="/#list">登頂チェックリスト</Link>
          に記録して、達成率を確認する
        </li>
      </ul>

      <h2>よくある質問</h2>
      <dl className="faq">
        {FAQ.map((item) => (
          <div key={item.q}>
            <dt>Q. {item.q}</dt>
            <dd>A. {item.a}</dd>
          </div>
        ))}
      </dl>
    </GuidePage>
  )
}
