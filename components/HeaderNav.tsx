"use client"

import Link from "next/link"
import { useState } from "react"

const NAV_LINKS = [
  { href: "/", label: "百名山" },
  { href: "/mountains200/", label: "二百名山" },
  { href: "/mountains300/", label: "三百名山" },
  { href: "/mountains_flowers/", label: "花の百名山" },
  { href: "/mountains_minor12/", label: "マイナー12" },
  { href: "/mountains_new100/", label: "新百名山" },
  { href: "/mountains_kanto100/", label: "関東百名山" },
  { href: "/articles/", label: "読み物" },
  { href: "/gear-checklist/", label: "山装備" },
]

export default function HeaderNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        aria-controls="site-drawer"
        aria-expanded={open}
        aria-label="メニュー"
        className="drawer-toggle"
        onClick={() => setOpen(true)}
        type="button"
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <div className="drawer-overlay" onClick={() => setOpen(false)}>
          <nav
            aria-label="メニュー"
            className="drawer-panel"
            id="site-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-header">
              <span>メニュー</span>
              <button aria-label="閉じる" className="drawer-close" onClick={() => setOpen(false)} type="button">
                ×
              </button>
            </div>
            {NAV_LINKS.map((link) => (
              <Link href={link.href} key={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
