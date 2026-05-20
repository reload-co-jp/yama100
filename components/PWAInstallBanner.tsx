"use client"
import { useEffect, useState } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function PWAInstallBanner() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setPromptEvent(e as BeforeInstallPromptEvent)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  if (!promptEvent) return null

  const handleInstall = async () => {
    await promptEvent.prompt()
    const { outcome } = await promptEvent.userChoice
    if (outcome === "accepted") setPromptEvent(null)
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#333",
        borderTop: "1px solid #555",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        zIndex: 1000,
        gap: "12px",
      }}
    >
      <p style={{ margin: 0, color: "#ccc", fontSize: ".85rem" }}>
        アプリをインストールしてオフラインでも使えます
      </p>
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <button
          onClick={() => setPromptEvent(null)}
          style={{
            background: "transparent",
            border: "1px solid #666",
            borderRadius: "4px",
            color: "#aaa",
            cursor: "pointer",
            fontSize: ".8rem",
            padding: "6px 12px",
          }}
        >
          閉じる
        </button>
        <button
          onClick={handleInstall}
          style={{
            background: "#7ecfb3",
            border: "none",
            borderRadius: "4px",
            color: "#222",
            cursor: "pointer",
            fontSize: ".8rem",
            fontWeight: "bold",
            padding: "6px 14px",
          }}
        >
          インストール
        </button>
      </div>
    </div>
  )
}
