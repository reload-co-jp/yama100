import mountainsData from "../../public/mountains300.json"
import MountainListPage from "../../components/MountainListPage"
import {
  buildMountainListJsonLd,
  MountainListPageConfig,
} from "../../lib/mountainListPage"
import { MountainRecord } from "../../lib/mountainCatalog"

const config: MountainListPageConfig = {
  listName: "日本三百名山",
  jsonLdDescription:
    "山レコ準拠の日本三百名山一覧のうち、百名山・二百名山以外の101峰の一覧",
  urlPath: "/mountains300/",
  pathPrefix: "/mountains300/",
  numberOfItems: 101,
  storageKey: "yama300",
  themeColor: "#2196f3",
  totalCount: 101,
  idOffset: 200,
}

const jsonLd = buildMountainListJsonLd(mountainsData as MountainRecord[], config)

export const metadata = {
  title: "日本三百名山チェックリスト",
  description:
    "山レコ準拠の日本三百名山一覧のうち、百名山・二百名山以外の101峰。登頂記録をチェックできます。ログイン不要でURLで共有できます。",
  alternates: { canonical: "/mountains300/" },
}

export default function Page() {
  return (
    <MountainListPage
      config={config}
      mountains={mountainsData as MountainRecord[]}
      jsonLd={jsonLd}
    />
  )
}
