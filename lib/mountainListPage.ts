import { SITE_URL } from "./site"
import { getMountainPagePath, MountainRecord } from "./mountainCatalog"

export type MountainListPageConfig = {
  listName: string
  jsonLdDescription: string
  urlPath: string
  numberOfItems: number
  storageKey: string
  themeColor: string
  totalCount: number
  idOffset: number
}

export function buildMountainListJsonLd(
  mountains: MountainRecord[],
  config: MountainListPageConfig
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: config.listName,
    description: config.jsonLdDescription,
    url: `${SITE_URL}${config.urlPath}`,
    numberOfItems: config.numberOfItems,
    itemListElement: [...mountains]
      .sort((a, b) => a.id - b.id)
      .map((m, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: m.name,
        url: `${SITE_URL}${getMountainPagePath(m.name)}`,
      })),
  }
}
