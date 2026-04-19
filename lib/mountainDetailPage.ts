import { fetchWikiThumbnail } from "./site"
import { MountainListKey, MountainRecord } from "./mountainCatalog"

export type MountainDetailPageConfig = {
  activeBgColor: string
  backHref: string
  backLabel: string
  backLinkColor: string
  canonicalPrefix: string
  currentList: MountainListKey
  listTitle: string
  overlayColor: string
  storageKey: string
  themeColor: string
}

export function buildMountainStaticParams(mountains: MountainRecord[]) {
  return mountains.map((m) => ({ id: String(m.id) }))
}

export function getMountainWithNeighbors(
  mountains: MountainRecord[],
  id: number
) {
  const mountain = mountains.find((m) => m.id === id)
  if (!mountain) return null

  const idx = mountains.indexOf(mountain)
  return {
    mountain,
    prev: idx > 0 ? mountains[idx - 1] : null,
    next: idx < mountains.length - 1 ? mountains[idx + 1] : null,
  }
}

export async function buildMountainMetadata(
  mountain: MountainRecord,
  config: MountainDetailPageConfig
) {
  const imageUrl = await fetchWikiThumbnail(mountain.name)
  const canonicalPath = `${config.canonicalPrefix}${mountain.id}/`
  const ogTitle = `${mountain.name}（${mountain.elevation.toLocaleString()}m）- ${config.listTitle}`

  return {
    title: mountain.name,
    description: mountain.description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: ogTitle,
      description: mountain.description,
      url: canonicalPath,
      locale: "ja_JP",
      type: "article",
      ...(imageUrl ? { images: [{ url: imageUrl, alt: mountain.name }] } : {}),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: ogTitle,
      description: mountain.description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  }
}
