import mountainsData from "../../public/mountains_flowers.json"
import MountainListPage from "../../components/MountainListPage"
import {
  buildMountainListJsonLd,
  MountainListPageConfig,
} from "../../lib/mountainListPage"
import { MountainRecord } from "../../lib/mountainCatalog"

const config: MountainListPageConfig = {
  listName: "花の百名山",
  jsonLdDescription: "田中澄江が選定した季節の花を楽しめる100の名峰の一覧",
  urlPath: "/mountains_flowers/",
  pathPrefix: "/mountains_flowers/",
  numberOfItems: 100,
  storageKey: "yama_flowers",
  themeColor: "#e91e63",
  totalCount: 100,
  idOffset: 0,
}

const jsonLd = buildMountainListJsonLd(mountainsData as MountainRecord[], config)

export default function Page() {
  return (
    <MountainListPage
      config={config}
      mountains={mountainsData as MountainRecord[]}
      jsonLd={jsonLd}
    />
  )
}
