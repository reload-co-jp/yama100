"use client"

import { Suspense, lazy } from "react"
import HeroSection from "./HeroSection"

const MountainMap = lazy(() => import("./MountainMap"))

type Mountain = {
  id: number
  name: string
  location: string[]
  latitude: number
  longitude: number
  elevation: number
}

type Props = {
  mountains: Mountain[]
  heroType: string
  totalCount: number
  onClose: () => void
}

const noop = () => {}

export default function DigestModal({
  mountains,
  heroType,
  totalCount,
  onClose,
}: Props) {
  const allChecked = new Set(mountains.map((m) => m.id))

  return (
    <>
      <div
        onClick={onClose}
        onKeyDown={onClose}
        role="button"
        tabIndex={-1}
        style={{
          background: "rgba(0,0,0,0.75)",
          bottom: 0,
          left: 0,
          position: "fixed",
          right: 0,
          top: 0,
          zIndex: 1000,
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        style={{
          background: "#1a1a1a",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          inset: 0,
          margin: "auto",
          maxHeight: "90dvh",
          maxWidth: "680px",
          overflow: "hidden",
          position: "fixed",
          width: "calc(100% - 32px)",
          zIndex: 1001,
        }}
      >
        {/* Hero — 1rem padding so negative margins in HeroSection cancel out */}
        <div style={{ flexShrink: 0, padding: "1rem", position: "relative" }}>
          <HeroSection
            type={heroType}
            mountainCount={mountains.length}
            totalCount={totalCount}
          />
          <button
            onClick={onClose}
            aria-label="閉じる"
            style={{
              background: "rgba(0,0,0,0.45)",
              border: "none",
              borderRadius: "50%",
              color: "#fff",
              cursor: "pointer",
              fontSize: "1.25rem",
              height: "36px",
              lineHeight: "36px",
              position: "absolute",
              right: "20px",
              textAlign: "center",
              top: "16px",
              width: "36px",
              zIndex: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Map */}
        <div style={{ flexShrink: 0, height: "220px", position: "relative" }}>
          {mountains.length > 0 ? (
            <Suspense
              fallback={
                <div
                  style={{
                    alignItems: "center",
                    background: "#2a2a2a",
                    color: "#aaa",
                    display: "flex",
                    height: "100%",
                    justifyContent: "center",
                  }}
                >
                  地図を読み込み中…
                </div>
              }
            >
              <MountainMap
                mountains={mountains}
                checked={allChecked}
                onToggle={noop}
              />
            </Suspense>
          ) : (
            <div
              style={{
                alignItems: "center",
                background: "#2a2a2a",
                color: "#666",
                display: "flex",
                height: "100%",
                justifyContent: "center",
              }}
            >
              登頂した山がありません
            </div>
          )}
        </div>

        {/* Mountain list */}
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            listStyle: "none",
            margin: 0,
            overflowY: "auto",
            padding: "8px 20px",
          }}
        >
          {mountains.map((m) => (
            <li
              key={m.id}
              style={{
                alignItems: "center",
                borderBottom: "1px solid #2a2a2a",
                display: "flex",
                gap: "8px",
                padding: "10px 0",
              }}
            >
              <span
                style={{ color: "#4caf50", flexShrink: 0, fontSize: ".75rem" }}
              >
                ✓
              </span>
              <span style={{ fontWeight: 600 }}>{m.name}</span>
              <span style={{ color: "#aaa", fontSize: ".8rem" }}>
                {m.elevation.toLocaleString()}m
              </span>
              <span
                style={{ color: "#666", fontSize: ".8rem", marginLeft: "auto" }}
              >
                {m.location.join("・")}
              </span>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div style={{ flexShrink: 0, padding: "12px 20px 20px" }}>
          <button
            onClick={onClose}
            style={{
              background: "#2a2a2a",
              border: "1px solid #444",
              borderRadius: "6px",
              color: "#ccc",
              cursor: "pointer",
              fontSize: ".875rem",
              padding: "10px 20px",
              width: "100%",
            }}
          >
            チェックリストを見る
          </button>
        </div>
      </div>
    </>
  )
}
