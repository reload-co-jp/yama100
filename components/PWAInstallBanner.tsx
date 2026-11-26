"use client"
import { useEffect, useState } from "react"
import styles from "./PWAInstallBanner.module.css"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function PWAInstallBanner() {
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null)

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
      className={styles.banner}
      role="region"
      aria-label="アプリのインストール"
    >
      <p className={styles.text}>
        ホーム画面に追加すると、オフラインでも使えます
      </p>
      <div className={styles.actions}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setPromptEvent(null)}
          type="button"
        >
          閉じる
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={handleInstall}
          type="button"
        >
          インストール
        </button>
      </div>
    </div>
  )
}
