import MountainListPage, {
  buildListMetadata,
} from "../../components/MountainListPage"

export const metadata = buildListMetadata("mountains_flowers")

export default function Page() {
  return <MountainListPage listKey="mountains_flowers" />
}
