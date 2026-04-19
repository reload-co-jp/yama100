import { notFound } from "next/navigation"
import mountainsData from "../../../public/mountains300.json"
import MountainDetailPage from "../../../components/MountainDetailPage"
import {
  buildMountainMetadata,
  buildMountainStaticParams,
  getMountainWithNeighbors,
  MountainDetailPageConfig,
} from "../../../lib/mountainDetailPage"

const mountains = mountainsData

const config: MountainDetailPageConfig = {
  activeBgColor: "#1a2d3a",
  backHref: "/mountains300/",
  backLabel: "← 三百名山一覧に戻る",
  backLinkColor: "#64b5f6",
  canonicalPrefix: "/mountains300/",
  currentList: "mountains300",
  listTitle: "日本三百名山",
  overlayColor: "rgba(33,150,243,0.85)",
  storageKey: "yama300",
  themeColor: "#2196f3",
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

export default async function Mountain300Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = getMountainWithNeighbors(mountains, Number(id))
  if (!result) notFound()
  return <MountainDetailPage config={config} {...result} />
}
