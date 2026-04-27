import { notFound } from "next/navigation"
import mountainsData from "../../../public/mountains_kanto100.json"
import MountainDetailPage from "../../../components/MountainDetailPage"
import {
  buildMountainMetadata,
  buildMountainStaticParams,
  getMountainWithNeighbors,
  MountainDetailPageConfig,
} from "../../../lib/mountainDetailPage"

const mountains = mountainsData

const config: MountainDetailPageConfig = {
  activeBgColor: "#3b0a0a",
  backHref: "/mountains_kanto100/",
  backLabel: "← 関東百名山一覧に戻る",
  backLinkColor: "#ff8a80",
  canonicalPrefix: "/mountains_kanto100/",
  currentList: "mountains_kanto100",
  listTitle: "関東百名山",
  overlayColor: "rgba(198,40,40,0.85)",
  storageKey: "yama_kanto100",
  themeColor: "#c62828",
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

export default async function MountainKanto100Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = getMountainWithNeighbors(mountains, Number(id))
  if (!result) notFound()
  return <MountainDetailPage config={config} {...result} />
}
