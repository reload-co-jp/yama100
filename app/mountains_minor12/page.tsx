import MountainListPage, {
  buildListMetadata,
} from "../../components/MountainListPage"

export const metadata = buildListMetadata("mountains_minor12")

export default function Page() {
  return <MountainListPage listKey="mountains_minor12" />
}
