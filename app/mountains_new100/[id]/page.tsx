import { notFound } from "next/navigation"
import mountainsData from "../../../public/mountains_new100.json"
import MountainDetailPage from "../../../components/MountainDetailPage"
import {
  buildMountainMetadata,
  buildMountainStaticParams,
  getMountainWithNeighbors,
  MountainDetailPageConfig,
} from "../../../lib/mountainDetailPage"

const mountains = mountainsData

const config: MountainDetailPageConfig = {
  activeBgColor: "#173431",
  backHref: "/mountains_new100/",
  backLabel: "← 新日本百名山一覧に戻る",
  backLinkColor: "#26a69a",
  canonicalPrefix: "/mountains_new100/",
  currentList: "mountains_new100",
  listTitle: "新日本百名山",
  overlayColor: "rgba(38,166,154,0.85)",
  storageKey: "yama_new100",
  themeColor: "#26a69a",
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

export default async function MountainNew100Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = getMountainWithNeighbors(mountains, Number(id))
  if (!result) notFound()
  return <MountainDetailPage config={config} {...result} />
}
