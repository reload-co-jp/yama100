import MountainListPage, {
  buildListMetadata,
} from "../../components/MountainListPage"

export const metadata = buildListMetadata("mountains300")

export default function Page() {
  return <MountainListPage listKey="mountains300" />
}
