import { notFound } from "next/navigation"
import mountainsData from "../../../public/mountains200.json"
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
  backHref: "/mountains200/",
  backLabel: "← 二百名山一覧に戻る",
  backLinkColor: "#7ecfb3",
  canonicalPrefix: "/mountains200/",
  currentList: "mountains200",
  listTitle: "日本二百名山",
  overlayColor: "rgba(76,175,80,0.85)",
  storageKey: "yama200",
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

export default async function Mountain200Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = getMountainWithNeighbors(mountains, Number(id))
  if (!result) notFound()
  return <MountainDetailPage config={config} {...result} />
}
