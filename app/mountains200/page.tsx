import mountainsData from "../../public/mountains200.json"
import MountainListPage from "../../components/MountainListPage"
import {
  buildMountainListJsonLd,
  MountainListPageConfig,
} from "../../lib/mountainListPage"
import { MountainRecord } from "../../lib/mountainCatalog"

const config: MountainListPageConfig = {
  listName: "日本二百名山",
  jsonLdDescription:
    "山と渓谷社が選定した日本を代表する200の名峰のうち、百名山以外の100峰の一覧",
  urlPath: "/mountains200/",
  numberOfItems: 100,
  storageKey: "yama200",
  themeColor: "#4caf50",
  totalCount: 100,
  idOffset: 100,
}

const jsonLd = buildMountainListJsonLd(mountainsData as MountainRecord[], config)

export const metadata = {
  title: "日本二百名山チェックリスト",
  description:
    "山と渓谷社が選定した日本二百名山のうち、百名山以外の100峰。登頂記録をチェックできます。ログイン不要でURLで共有できます。",
  alternates: { canonical: "/mountains200/" },
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
