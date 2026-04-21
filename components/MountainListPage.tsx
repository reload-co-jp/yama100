import { FC, Suspense } from "react"
import MountainApp from "./MountainApp"
import { MountainRecord } from "../lib/mountainCatalog"
import { MountainListPageConfig } from "../lib/mountainListPage"

type Props = {
  config: MountainListPageConfig
  mountains: MountainRecord[]
  jsonLd: object
}

const MountainListPage: FC<Props> = ({ config, mountains, jsonLd }) => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={null}>
        <MountainApp
          mountains={mountains}
          storageKey={config.storageKey}
          themeColor={config.themeColor}
          pathPrefix={config.pathPrefix}
          totalCount={config.totalCount}
          idOffset={config.idOffset}
        />
      </Suspense>
    </>
  )
}

export default MountainListPage
