import { notFound, redirect } from "next/navigation"
import mountainsData from "../../../public/mountains_kanto100.json"
import { buildMountainStaticParams } from "../../../lib/mountainDetailPage"
import { getMountainPagePath } from "../../../lib/mountainCatalog"

const mountains = mountainsData

export function generateStaticParams() {
  return buildMountainStaticParams(mountains)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await params
  return {}
}

export default async function MountainKanto100Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const mountain = mountains.find((item) => item.id === Number(id))
  if (!mountain) notFound()
  redirect(getMountainPagePath(mountain.name))
}
