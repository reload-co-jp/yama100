import type { MetadataRoute } from "next"
import mountainsData from "../public/mountains.json"
import { SITE_URL } from "../lib/site"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const mountainPages = (mountainsData as { id: number }[]).map((m) => ({
    url: `${SITE_URL}/mountains/${m.id}/`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...mountainPages,
  ]
}
