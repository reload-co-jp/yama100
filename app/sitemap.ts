import type { MetadataRoute } from "next"
import mountainsData from "../public/mountains.json"
import mountains200Data from "../public/mountains200.json"
import mountains300Data from "../public/mountains300.json"
import mountainsFlowersData from "../public/mountains_flowers.json"
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

  const flowerPages = (mountainsFlowersData as { id: number }[]).map((m) => ({
    url: `${SITE_URL}/mountains_flowers/${m.id}/`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const articles = [
    "/articles/",
    "/articles/history/",
    "/articles/criteria/",
    "/articles/fukada/",
    "/articles/mountains/",
    "/articles/mountains200/",
    "/articles/mountains300/",
    "/articles/flowers/",
  ]

  const articlePages = articles.map((url) => ({
    url: `${SITE_URL}${url}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
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
    {
      url: `${SITE_URL}/search/`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/mountains_flowers/`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...articlePages,
    ...mountainPages,
    ...mountain200Pages,
    ...mountain300Pages,
    ...flowerPages,
  ]
}
