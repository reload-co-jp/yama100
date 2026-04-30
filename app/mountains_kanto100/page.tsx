import mountainsData from "../../public/mountains_kanto100.json"
import MountainListPage from "../../components/MountainListPage"
import {
  buildMountainListJsonLd,
  MountainListPageConfig,
} from "../../lib/mountainListPage"
import { MountainRecord } from "../../lib/mountainCatalog"

const config: MountainListPageConfig = {
  listName: "関東百名山",
  jsonLdDescription:
    "関東一都六県（東京・神奈川・埼玉・千葉・茨城・栃木・群馬）を中心に選定された100の名峰の一覧",
  urlPath: "/mountains_kanto100/",
  numberOfItems: 100,
  storageKey: "yama_kanto100",
  themeColor: "#c62828",
  totalCount: 100,
  idOffset: 0,
}

const jsonLd = buildMountainListJsonLd(mountainsData as MountainRecord[], config)

export const metadata = {
  title: "関東百名山チェックリスト",
  description:
    "関東一都六県を中心に選定された関東百名山の100座。登頂記録をチェックできます。ログイン不要でURLで共有できます。",
  alternates: { canonical: "/mountains_kanto100/" },
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
