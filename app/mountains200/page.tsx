import MountainListPage, {
  buildListMetadata,
} from "../../components/MountainListPage"

export const metadata = buildListMetadata("mountains200")

export default function Page() {
  return <MountainListPage listKey="mountains200" />
}
