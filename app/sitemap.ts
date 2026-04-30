import type { MetadataRoute } from "next"
import { CANONICAL_MOUNTAINS } from "../lib/mountainCatalog"
import { SITE_URL } from "../lib/site"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const mountainPages = CANONICAL_MOUNTAINS.map((mountain) => ({
    url: `${SITE_URL}/mountain/${mountain.slug}/`,
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
    {
      url: `${SITE_URL}/mountains_minor12/`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/mountains_new100/`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/mountains_kanto100/`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...articlePages,
    ...mountainPages,
  ]
}
