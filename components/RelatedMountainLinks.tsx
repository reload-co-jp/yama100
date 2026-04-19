import Link from "next/link"
import {
  findRelatedMountainLinks,
  MountainListKey,
  MountainRecord,
} from "../lib/mountainCatalog"

type Props = {
  currentList: MountainListKey
  mountain: Pick<MountainRecord, "id" | "name">
}

export default function RelatedMountainLinks({
  currentList,
  mountain,
}: Props) {
  const links = findRelatedMountainLinks(currentList, mountain)

  if (links.length === 0) return null

  return (
    <div
      style={{
        background: "#242424",
        borderRadius: "10px",
        marginTop: "16px",
        padding: "14px 16px",
      }}
    >
      <p
        style={{
          color: "#aaa",
          fontSize: ".8rem",
          fontWeight: 700,
          letterSpacing: ".04em",
          margin: "0 0 10px",
          textTransform: "uppercase",
        }}
      >
        この山を含む他のリスト
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {links.map((link) => (
          <Link
            key={link.key}
            href={link.href}
            style={{
              background: "#303030",
              borderRadius: "999px",
              color: "#7ecfb3",
              fontSize: ".85rem",
              padding: "6px 12px",
              textDecoration: "none",
            }}
          >
            {link.label} →
          </Link>
        ))}
      </div>
    </div>
  )
}
