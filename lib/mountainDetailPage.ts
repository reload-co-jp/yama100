import { MountainRecord } from "./mountainCatalog"

export function buildMountainStaticParams(mountains: MountainRecord[]) {
  return mountains.map((m) => ({ id: String(m.id) }))
}
