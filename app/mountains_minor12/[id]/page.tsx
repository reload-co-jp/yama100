import { notFound, redirect } from "next/navigation"
import mountainsData from "../../../public/mountains_minor12.json"
import { buildMountainStaticParams } from "../../../lib/mountainDetailPage"
import { getMountainPagePath } from "../../../lib/mountainCatalog"

const mountains = mountainsData

export function generateStaticParams() {
  return buildMountainStaticParams(mountains)
}

export async function generateMetadata({
  params: _params,
}: {
  params: Promise<{ id: string }>
}) {
  return {}
}

export default async function MountainMinor12Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const mountain = mountains.find((m) => m.id === Number(id))
  if (!mountain) notFound()
  redirect(getMountainPagePath(mountain.name))
}
