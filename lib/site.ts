export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://yama100.reload.co.jp"

export const WIKI_TITLE_OVERRIDES: Record<string, string> = {
  利尻岳: "利尻山",
  阿寒岳: "雄阿寒岳",
  大雪山: "大雪山_(北海道)",
  後方羊蹄山: "羊蹄山",
  朝日岳: "大朝日岳",
  吾妻山: "吾妻連峰",
  悪沢岳: "荒川岳",
  九重山: "九重連山",
}

export async function fetchWikiThumbnail(name: string): Promise<string | null> {
  const title = WIKI_TITLE_OVERRIDES[name] ?? name
  try {
    const res = await fetch(
      `https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { next: { revalidate: 86400 } }
    )
    const data = await res.json()
    return (data?.originalimage?.source ?? data?.thumbnail?.source) || null
  } catch {
    return null
  }
}
