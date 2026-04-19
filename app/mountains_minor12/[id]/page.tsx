import { notFound } from "next/navigation"
import mountainsData from "../../../public/mountains_minor12.json"
import MountainDetailPage from "../../../components/MountainDetailPage"
import {
  buildMountainMetadata,
  buildMountainStaticParams,
  getMountainWithNeighbors,
  MountainDetailPageConfig,
} from "../../../lib/mountainDetailPage"

const mountains = mountainsData

const config: MountainDetailPageConfig = {
  activeBgColor: "#3a2a12",
  backHref: "/mountains_minor12/",
  backLabel: "← マイナー12名山一覧に戻る",
  backLinkColor: "#ff9800",
  canonicalPrefix: "/mountains_minor12/",
  currentList: "mountains_minor12",
  listTitle: "マイナー12名山",
  overlayColor: "rgba(255,152,0,0.85)",
  storageKey: "yama_minor12",
  themeColor: "#ff9800",
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

export default async function MountainMinor12Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = getMountainWithNeighbors(mountains, Number(id))
  if (!result) notFound()
  return <MountainDetailPage config={config} {...result} />
}
