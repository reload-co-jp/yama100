"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Suspense, useEffect, useRef, useState } from "react"
import HeaderSearch from "./HeaderSearch"
import { CloseIcon, MenuIcon } from "./ui/Icons"
import {
  GUIDE_NAV,
  LIST_NAV,
  OTHER_NAV,
  PRIMARY_NAV,
} from "./layout/navigation"
import styles from "./HeaderNav.module.css"

const GROUPS = [
  { title: "メニュー", links: PRIMARY_NAV },
  { title: "山のリスト", links: LIST_NAV },
  { title: "百名山ガイド", links: GUIDE_NAV },
  { title: "その他", links: OTHER_NAV },
]

export default function HeaderNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const closeRef = useRef<HTMLButtonElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    const toggle = toggleRef.current
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKey)
      toggle?.focus()
    }
  }, [open])

  return (
    <>
      <button
        aria-controls="site-drawer"
        aria-expanded={open}
        className={styles.toggle}
        onClick={() => setOpen(true)}
        ref={toggleRef}
        type="button"
      >
        <MenuIcon size={20} />
        <span className={styles.toggleLabel}>メニュー</span>
      </button>

      {open && (
        <div
          className={styles.overlay}
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false)
          }}
          role="presentation"
        >
          <nav
            aria-label="サイトメニュー"
            className={styles.panel}
            id="site-drawer"
          >
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>Yama100</span>
              <button
                aria-label="メニューを閉じる"
                className={styles.close}
                onClick={() => setOpen(false)}
                ref={closeRef}
                type="button"
              >
                <CloseIcon size={22} />
              </button>
            </div>
            <div className={styles.search}>
              <Suspense fallback={null}>
                <HeaderSearch id="drawer-search" />
              </Suspense>
            </div>
            {GROUPS.map((group) => (
              <div className={styles.group} key={group.title}>
                <p className={styles.groupTitle}>{group.title}</p>
                {group.links.map((link) => (
                  <Link
                    aria-current={pathname === link.href ? "page" : undefined}
                    className={styles.link}
                    href={link.href}
                    key={link.href}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
