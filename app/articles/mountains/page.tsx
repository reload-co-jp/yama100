import { FC } from "react"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "深田久弥が登った山々 | Yama100",
  description: "深田久弥の山行の記録と日本百名山への道",
  openGraph: {
    title: "深田久弥が登った山々 | Yama100",
    description: "深田久弥の山行の記録と日本百名山への道",
    url: "https://yama100.reload.co.jp/articles/mountains",
    siteName: "Yama100",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yama100.reload.co.jp" },
    { "@type": "ListItem", "position": 2, "name": "読み物一覧", "item": "https://yama100.reload.co.jp/articles" },
    { "@type": "ListItem", "position": 3, "name": "深田久弥が登った山々", "item": "https://yama100.reload.co.jp/articles/mountains" }
  ]
}

const Page: FC = () => {
  return (
    <div style={{ maxWidth: "720px", margin: "40px auto", padding: "0 24px", color: "#ccc" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/articles/" style={{ color: "#7ecfb3", textDecoration: "none" }}>
        ← 読み物一覧に戻る
      </Link>
      
      <h1 style={{ color: "#fff", fontSize: "2rem", marginTop: "24px", marginBottom: "16px" }}>
        深田久弥が登った山々
      </h1>
      
      <p style={{ lineHeight: 1.8, marginBottom: "24px" }}>
        深田久弥の山行は、若き日の白山登頂から始まり、生涯を通じて日本各地の峻険な山々へと向けられました。彼が実際にその足で踏みしめ、肌で感じた山々の記録が、後の『日本百名山』という結晶を生み出す源泉となりました。
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.25rem", marginTop: "24px", marginBottom: "12px" }}>原点としての白山</h2>
      <p style={{ lineHeight: 1.8, marginBottom: "16px" }}>
        幼少期から仰ぎ見た霊峰・白山は、彼にとって登山家としての原点です。峻厳でありながら、四季折々の豊かな表情を見せるその山容に、彼は生涯を通じて強い愛着を抱き続けました。
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.25rem", marginTop: "24px", marginBottom: "12px" }}>山行の足跡</h2>
      <p style={{ lineHeight: 1.8, marginBottom: "16px" }}>
        深田久弥が登った山々は非常に多岐にわたります。その生涯にわたる記録の中から、主要な山行を年代順に列挙します。
      </p>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px", fontSize: ".875rem" }}>
        <div style={{ background: "#2a2a2a", padding: "12px", borderRadius: "8px" }}>
          <div style={{ fontWeight: 600, color: "#7ecfb3", marginBottom: "8px" }}>少年・学生時代</div>
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            <li>錦城山 (1910年代)</li>
            <li>富士写ヶ岳 (1915)</li>
            <li>白山 (1918)</li>
            <li>槍ヶ岳 (1922)</li>
            <li>浅間山 (1922)</li>
            <li>金峰山 (1922)</li>
            <li>白馬岳 (1923)</li>
            <li>苗場山 (1925)</li>
            <li>朝日岳、薬師岳、赤城山、至仏山 (1926)</li>
          </ul>
        </div>
        <div style={{ background: "#2a2a2a", padding: "12px", borderRadius: "8px" }}>
          <div style={{ fontWeight: 600, color: "#7ecfb3", marginBottom: "8px" }}>戦前・戦中</div>
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            <li>鳳凰山 (1932)</li>
            <li>谷川岳 (1933)</li>
            <li>鹿島槍ヶ岳 (1934)</li>
            <li>巻機山 (1936)</li>
            <li>会津駒ヶ岳 (1936)</li>
            <li>霧島山 (1939)</li>
            <li>宮之浦岳 (1939)</li>
            <li>八ヶ岳 (1942)</li>
            <li>男体山 (1942)</li>
            <li>石鎚山 (1942)</li>
          </ul>
        </div>
        <div style={{ background: "#2a2a2a", padding: "12px", borderRadius: "8px" }}>
          <div style={{ fontWeight: 600, color: "#7ecfb3", marginBottom: "8px" }}>戦後〜晩年</div>
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            <li>岩木山 (1947)</li>
            <li>五竜岳、光岳、蓼科山 (1952)</li>
            <li>雨飾山 (1957)</li>
            <li>ジュガールヒマール、ランタンヒマール (1958)</li>
            <li>斜里岳、雄阿寒岳 (1959)</li>
            <li>恵那山、富士見台高原 (1960)</li>
            <li>茅ヶ岳 (1971)</li>
          </ul>
        </div>
      </div>

      <p style={{ lineHeight: 1.8 }}>
        彼が登った数々の山々は、単なる場所としての「山」ではなく、深田久弥という一人の人間の精神が、日本の風土と対話し続けた道のりそのものであると言えるでしょう。
      </p>
    </div>
  )
}

export default Page
