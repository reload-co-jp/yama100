import mountainsData from "../../public/mountains_new100.json"
import MountainListPage from "../../components/MountainListPage"
import {
  buildMountainListJsonLd,
  MountainListPageConfig,
} from "../../lib/mountainListPage"
import { MountainRecord } from "../../lib/mountainCatalog"

const config: MountainListPageConfig = {
  listName: "新日本百名山",
  jsonLdDescription:
    "岩崎元郎が選定した新日本百名山の一覧。中高年にも登りやすい視点を加味した100座をチェックできます。",
  urlPath: "/mountains_new100/",
  numberOfItems: 100,
  storageKey: "yama_new100",
  themeColor: "#26a69a",
  totalCount: 100,
  idOffset: 0,
}

const jsonLd = buildMountainListJsonLd(mountainsData as MountainRecord[], config)

export const metadata = {
  title: "新日本百名山チェックリスト",
  description:
    "岩崎元郎が選んだ新日本百名山100座のチェックリスト。ログイン不要で登頂記録をURL共有できます。",
  alternates: { canonical: "/mountains_new100/" },
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
