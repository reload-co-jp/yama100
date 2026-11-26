import MountainListPage, {
  buildListMetadata,
} from "../../components/MountainListPage"

export const metadata = buildListMetadata("mountains_new100")

export default function Page() {
  return <MountainListPage listKey="mountains_new100" />
}
