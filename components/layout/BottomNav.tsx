"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChartIcon,
  HomeIcon,
  MapIcon,
  SearchIcon,
  ShareIcon,
} from "../ui/Icons"
import styles from "./BottomNav.module.css"

const ITEMS = [
  { href: "/", label: "ホーム", Icon: HomeIcon },
  { href: "/search/", label: "探す", Icon: SearchIcon },
  { href: "/map/", label: "地図", Icon: MapIcon },
  { href: "/summary/", label: "記録", Icon: ChartIcon },
  { href: "/share/", label: "シェア", Icon: ShareIcon },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="クイックメニュー" className={styles.nav}>
      {ITEMS.map(({ href, label, Icon }) => {
        const active =
          href === "/" ? pathname === "/" : pathname?.startsWith(href)
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={styles.item}
            href={href}
            key={href}
          >
            <Icon size={22} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
