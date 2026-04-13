import type { MetadataRoute } from "next"
import mountainsData from "../public/mountains.json"
import mountains200Data from "../public/mountains200.json"
import mountains300Data from "../public/mountains300.json"
import { SITE_URL } from "../lib/site"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const mountainPages = (mountainsData as { id: number }[]).map((m) => ({
    url: `${SITE_URL}/mountains/${m.id}/`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const mountain200Pages = (mountains200Data as { id: number }[]).map((m) => ({
    url: `${SITE_URL}/mountains200/${m.id}/`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const mountain300Pages = (mountains300Data as { id: number }[]).map((m) => ({
    url: `${SITE_URL}/mountains300/${m.id}/`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const articlePages = [
    { url: `${SITE_URL}/articles/`, priority: 0.5 },
    { url: `${SITE_URL}/articles/history/`, priority: 0.5 },
    { url: `${SITE_URL}/articles/criteria/`, priority: 0.5 },
    { url: `${SITE_URL}/articles/fukada/`, priority: 0.5 },
    { url: `${SITE_URL}/articles/mountains/`, priority: 0.5 },
    { url: `${SITE_URL}/articles/mountains200/`, priority: 0.5 },
    { url: `${SITE_URL}/articles/mountains300/`, priority: 0.5 },
    { url: `${SITE_URL}/articles/flowers/`, priority: 0.5 },
  ].map((a) => ({
    ...a,
    changeFrequency: "monthly" as const,
  }))

  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about/`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...mountainPages,
    ...mountain200Pages,
    ...mountain300Pages,
    ...articlePages,
  ]
}
