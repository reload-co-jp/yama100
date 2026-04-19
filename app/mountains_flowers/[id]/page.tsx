import { notFound } from "next/navigation"
import mountainsData from "../../../public/mountains_flowers.json"
import MountainDetailPage from "../../../components/MountainDetailPage"
import {
  buildMountainMetadata,
  buildMountainStaticParams,
  getMountainWithNeighbors,
  MountainDetailPageConfig,
} from "../../../lib/mountainDetailPage"

const mountains = mountainsData

const config: MountainDetailPageConfig = {
  activeBgColor: "#3a1c25",
  backHref: "/mountains_flowers/",
  backLabel: "← 花の百名山一覧に戻る",
  backLinkColor: "#e91e63",
  canonicalPrefix: "/mountains_flowers/",
  currentList: "mountains_flowers",
  listTitle: "花の百名山",
  overlayColor: "rgba(233,30,99,0.85)",
  storageKey: "yama_flowers",
  themeColor: "#e91e63",
}

export function generateStaticParams() {
  return buildMountainStaticParams(mountains)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = getMountainWithNeighbors(mountains, Number(id))
  const mountain = result?.mountain
  if (!mountain) return {}
  return buildMountainMetadata(mountain, config)
}

export default async function MountainPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = getMountainWithNeighbors(mountains, Number(id))
  if (!result) notFound()
  return <MountainDetailPage config={config} {...result} />
}
