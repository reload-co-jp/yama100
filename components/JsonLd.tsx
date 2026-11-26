// 構造化データ（JSON-LD）の出力
export default function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data]
  return (
    <>
      {items.map((item, i) => (
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
          key={i}
          type="application/ld+json"
        />
      ))}
    </>
  )
}
