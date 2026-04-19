import { notFound } from "next/navigation"
import mountainsData from "../../../public/mountains.json"
import MountainDetailPage from "../../../components/MountainDetailPage"
import {
  buildMountainMetadata,
  buildMountainStaticParams,
  getMountainWithNeighbors,
  MountainDetailPageConfig,
} from "../../../lib/mountainDetailPage"

const mountains = mountainsData

const config: MountainDetailPageConfig = {
  activeBgColor: "#1b3a1c",
  backHref: "/",
  backLabel: "← 一覧に戻る",
  backLinkColor: "#7ecfb3",
  canonicalPrefix: "/mountains/",
  currentList: "mountains",
  listTitle: "日本百名山",
  overlayColor: "rgba(76,175,80,0.85)",
  storageKey: "yama100",
  themeColor: "#4caf50",
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
