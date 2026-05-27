import type { MetadataRoute } from "next"
import { CANONICAL_MOUNTAINS } from "../lib/mountainCatalog"
import { SITE_URL } from "../lib/site"

export const dynamic = "force-static"

const LIST_UPDATED = new Date("2026-04-14")
const ARTICLE_UPDATED = new Date("2026-04-18")
const MOUNTAIN_UPDATED = new Date("2026-04-14")

const ARTICLE_DATES: Record<string, Date> = {
  "/articles/": ARTICLE_UPDATED,
  "/articles/history/": ARTICLE_UPDATED,
  "/articles/criteria/": ARTICLE_UPDATED,
  "/articles/fukada/": ARTICLE_UPDATED,
  "/articles/mountains/": ARTICLE_UPDATED,
  "/articles/mountains200/": ARTICLE_UPDATED,
  "/articles/mountains300/": ARTICLE_UPDATED,
  "/articles/flowers/": ARTICLE_UPDATED,
}

export default function sitemap(): MetadataRoute.Sitemap {
  const mountainPages = CANONICAL_MOUNTAINS.map((mountain) => ({
    url: `${SITE_URL}/mountain/${mountain.id}/`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    lastModified: MOUNTAIN_UPDATED,
  }))

  const articles = Object.keys(ARTICLE_DATES)

  const articlePages = articles.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
    lastModified: ARTICLE_DATES[path],
  }))

  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "weekly",
      priority: 1.0,
      lastModified: LIST_UPDATED,
    },
    {
      url: `${SITE_URL}/about/`,
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: LIST_UPDATED,
    },
    {
      url: `${SITE_URL}/gear-checklist/`,
      changeFrequency: "monthly",
      priority: 0.7,
      lastModified: LIST_UPDATED,
    },
    {
      url: `${SITE_URL}/mountains200/`,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: LIST_UPDATED,
    },
    {
      url: `${SITE_URL}/mountains300/`,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: LIST_UPDATED,
    },
    {
      url: `${SITE_URL}/mountains_flowers/`,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: LIST_UPDATED,
    },
    {
      url: `${SITE_URL}/mountains_minor12/`,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: LIST_UPDATED,
    },
    {
      url: `${SITE_URL}/mountains_new100/`,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: LIST_UPDATED,
    },
    {
      url: `${SITE_URL}/mountains_kanto100/`,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: LIST_UPDATED,
    },
    ...articlePages,
    ...mountainPages,
  ]
}
