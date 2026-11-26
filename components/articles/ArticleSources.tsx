type Source = {
  href: string
  label: string
  note?: string
}

export default function ArticleSources({
  sources,
}: {
  sources: readonly Source[]
}) {
  return (
    <section style={{ marginTop: "32px" }}>
      <h2
        style={{
          color: "var(--color-text)",
          fontSize: "1.1rem",
          marginBottom: "12px",
        }}
      >
        出典・参考
      </h2>
      <ul
        style={{
          color: "var(--color-text-muted)",
          lineHeight: 1.8,
          margin: 0,
          paddingLeft: "20px",
        }}
      >
        {sources.map((source) => (
          <li key={source.href}>
            <a
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--color-forest-600)",
                textDecoration: "none",
              }}
            >
              {source.label}
            </a>
            {source.note ? ` — ${source.note}` : ""}
          </li>
        ))}
      </ul>
    </section>
  )
}
