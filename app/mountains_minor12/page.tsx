import mountainsData from "../../public/mountains_minor12.json"
import MountainListPage from "../../components/MountainListPage"
import {
  buildMountainListJsonLd,
  MountainListPageConfig,
} from "../../lib/mountainListPage"
import { MountainRecord } from "../../lib/mountainCatalog"

const config: MountainListPageConfig = {
  listName: "マイナー12名山",
  jsonLdDescription:
    "ヤマレコ準拠のマイナー12名山一覧。『岳人 2002年4月号』で紹介された創造的登山を要する12座をチェックできます。",
  urlPath: "/mountains_minor12/",
  pathPrefix: "/mountains_minor12/",
  numberOfItems: 12,
  storageKey: "yama_minor12",
  themeColor: "#ff9800",
  totalCount: 12,
  idOffset: 0,
}

const jsonLd = buildMountainListJsonLd(mountainsData as MountainRecord[], config)

export const metadata = {
  title: "マイナー12名山チェックリスト",
  description:
    "ヤマレコ準拠のマイナー12名山一覧。ログイン不要で登頂記録をチェックしてURLで共有できます。",
  alternates: { canonical: "/mountains_minor12/" },
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
