import MountainListPage, {
  buildListMetadata,
} from "../../components/MountainListPage"

export const metadata = buildListMetadata("mountains_kanto100")

export default function Page() {
  return <MountainListPage listKey="mountains_kanto100" />
}
