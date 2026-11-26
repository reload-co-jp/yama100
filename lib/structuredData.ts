import { SITE_URL } from "./site"

export type Crumb = { href: string; label: string }

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`
}

export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      item: absoluteUrl(crumb.href),
    })),
  }
}

export function articleLd({
  headline,
  description,
  path,
  datePublished,
  dateModified,
}: {
  headline: string
  description: string
  path: string
  datePublished: string
  dateModified: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    datePublished,
    dateModified,
    inLanguage: "ja",
    author: { "@type": "Organization", name: "Yama100", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Yama100", url: SITE_URL },
  }
}

export function itemListLd({
  name,
  description,
  path,
  items,
}: {
  name: string
  description: string
  path: string
  items: { name: string; path: string }[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    url: absoluteUrl(path),
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  }
}

export const HOME_CRUMB: Crumb = { href: "/", label: "ホーム" }
