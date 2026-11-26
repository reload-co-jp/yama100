"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PRIMARY_NAV } from "./navigation"

export default function NavLinks({ className }: { className: string }) {
  const pathname = usePathname()
  return (
    <>
      {PRIMARY_NAV.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href)
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={className}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        )
      })}
    </>
  )
}
