"use client"

import { FC, useEffect, useMemo, useState } from "react"

type GearItem = {
  id: string
  label: string
  note?: string
}

type GearCategory = {
  id: string
  title: string
  items: GearItem[]
}

const STORAGE_KEY = "yama100-gear-checklist"

const categories: GearCategory[] = [
  {
    id: "core",
    title: "必携",
    items: [
      { id: "map", label: "地図・登山アプリ", note: "オフライン地図も保存" },
      { id: "compass", label: "コンパス" },
      { id: "headlamp", label: "ヘッドランプ", note: "予備電池も確認" },
      { id: "rainwear", label: "レインウェア上下" },
      { id: "firstaid", label: "救急セット" },
      { id: "phone", label: "スマートフォン" },
      { id: "battery", label: "モバイルバッテリー" },
      { id: "wallet", label: "財布・現金" },
      { id: "id", label: "保険証・身分証" },
      { id: "emergency", label: "緊急連絡先メモ" },
    ],
  },
  {
    id: "wear",
    title: "ウェア",
    items: [
      { id: "base", label: "ベースレイヤー" },
      { id: "mid", label: "保温着" },
      { id: "pants", label: "登山パンツ" },
      { id: "socks", label: "登山靴下" },
      { id: "hat", label: "帽子" },
      { id: "gloves", label: "手袋" },
      { id: "neck", label: "ネックゲイター" },
      { id: "change", label: "着替え" },
    ],
  },
  {
    id: "food",
    title: "水・食料",
    items: [
      { id: "water", label: "飲料水" },
      { id: "bottle", label: "ボトル・ハイドレーション" },
      { id: "lunch", label: "行動食・昼食" },
      { id: "emergency-food", label: "非常食" },
      { id: "trash", label: "ゴミ袋" },
      { id: "stove", label: "バーナー・燃料", note: "使う日だけ" },
      { id: "cup", label: "カップ・箸" },
    ],
  },
  {
    id: "pack",
    title: "ザック周り",
    items: [
      { id: "backpack", label: "ザック" },
      { id: "cover", label: "ザックカバー" },
      { id: "poles", label: "トレッキングポール" },
      { id: "towel", label: "タオル" },
      { id: "sunscreen", label: "日焼け止め" },
      { id: "sunglasses", label: "サングラス" },
      { id: "bug", label: "虫よけ" },
      { id: "toilet", label: "携帯トイレ・紙" },
    ],
  },
  {
    id: "season",
    title: "季節・山域",
    items: [
      { id: "gaiters", label: "ゲイター" },
      { id: "spikes", label: "チェーンスパイク・軽アイゼン" },
      { id: "winter-gloves", label: "防寒手袋" },
      { id: "warm-hat", label: "ニット帽" },
      { id: "bear-bell", label: "熊鈴" },
      { id: "helmet", label: "ヘルメット" },
      { id: "route-doc", label: "登山届" },
    ],
  },
  {
    id: "stay",
    title: "山小屋・テント泊",
    items: [
      { id: "reservation", label: "予約確認" },
      { id: "liner", label: "インナーシーツ" },
      { id: "earplugs", label: "耳栓" },
      { id: "tent", label: "テント一式" },
      { id: "sleeping-bag", label: "寝袋" },
      { id: "mat", label: "マット" },
      { id: "lamp", label: "ランタン" },
    ],
  },
]

const allItems = categories.flatMap((category) => category.items)

const GearChecklistClient: FC = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {}

    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return {}

    try {
      return JSON.parse(saved)
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
      return {}
    }
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checked))
  }, [checked])

  const checkedCount = useMemo(
    () => allItems.filter((item) => checked[item.id]).length,
    [checked],
  )
  const progress = Math.round((checkedCount / allItems.length) * 100)

  const toggleItem = (id: string) => {
    setChecked((current) => ({ ...current, [id]: !current[id] }))
  }

  const clearAll = () => {
    setChecked({})
  }

  return (
    <div className="gear-page">
      <style>{`
        .gear-page {
          color: #d4d8d1;
          margin: 32px auto;
          max-width: 980px;
          padding: 0 20px 48px;
        }

        .gear-hero {
          border-bottom: 1px solid #384139;
          display: grid;
          gap: 18px;
          grid-template-columns: minmax(0, 1fr);
          padding-bottom: 24px;
        }

        .gear-kicker {
          color: #7ecfb3;
          font-size: .82rem;
          font-weight: 700;
          letter-spacing: .08em;
        }

        .gear-title {
          color: #fff;
          font-size: clamp(2rem, 7vw, 4.25rem);
          line-height: 1.05;
          margin: 0;
        }

        .gear-lead {
          color: #b8c0b7;
          font-size: 1rem;
          line-height: 1.8;
          max-width: 680px;
        }

        .gear-panel {
          background: #29302c;
          border: 1px solid #3d4842;
          border-radius: 8px;
          padding: 16px;
        }

        .gear-progress-text {
          align-items: baseline;
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .gear-progress-number {
          color: #fff;
          font-size: 1.75rem;
          font-weight: 800;
        }

        .gear-progress-bar {
          background: #1d231f;
          border-radius: 999px;
          height: 10px;
          overflow: hidden;
        }

        .gear-progress-fill {
          background: linear-gradient(90deg, #7ecfb3, #d8e879);
          height: 100%;
          transition: width .2s ease;
        }

        .gear-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 16px;
        }

        .gear-button {
          background: #7ecfb3;
          border: 0;
          border-radius: 6px;
          color: #10221b;
          cursor: pointer;
          font: inherit;
          font-weight: 700;
          padding: 10px 14px;
        }

        .gear-button.secondary {
          background: #343d38;
          color: #d4d8d1;
        }

        .gear-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: 1fr;
          margin-top: 24px;
        }

        .gear-card {
          background: #2a2a2a;
          border: 1px solid #383838;
          border-radius: 8px;
          overflow: hidden;
        }

        .gear-card-header {
          align-items: center;
          border-bottom: 1px solid #383838;
          display: flex;
          justify-content: space-between;
          padding: 14px 16px;
        }

        .gear-card-title {
          color: #fff;
          font-size: 1.05rem;
          font-weight: 800;
          margin: 0;
        }

        .gear-card-count {
          color: #91a196;
          font-size: .82rem;
        }

        .gear-list {
          display: grid;
        }

        .gear-item {
          align-items: flex-start;
          border-bottom: 1px solid #353535;
          cursor: pointer;
          display: grid;
          gap: 12px;
          grid-template-columns: 22px 1fr;
          min-height: 54px;
          padding: 13px 16px;
        }

        .gear-item:last-child {
          border-bottom: 0;
        }

        .gear-checkbox {
          accent-color: #7ecfb3;
          height: 18px;
          margin-top: 2px;
          width: 18px;
        }

        .gear-label {
          color: #f3f5f1;
          display: block;
          font-weight: 700;
          line-height: 1.4;
        }

        .gear-label.checked {
          color: #8f9a92;
          text-decoration: line-through;
        }

        .gear-note {
          color: #9aa59c;
          display: block;
          font-size: .78rem;
          line-height: 1.5;
          margin-top: 3px;
        }

        @media (min-width: 760px) {
          .gear-hero {
            align-items: end;
            grid-template-columns: minmax(0, 1fr) 300px;
          }

          .gear-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>

      <section className="gear-hero">
        <div>
          <div className="gear-kicker">MOUNTAIN GEAR CHECKLIST</div>
          <h1 className="gear-title">山装備 忘れ物チェック</h1>
          <p className="gear-lead">
            出発前に装備を一つずつ確認。日帰り、季節装備、山小屋泊、テント泊までまとめてチェックできる。
          </p>
        </div>

        <div className="gear-panel" aria-label="チェック進捗">
          <div className="gear-progress-text">
            <span>準備済み</span>
            <span className="gear-progress-number">{progress}%</span>
          </div>
          <div className="gear-progress-bar">
            <div className="gear-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="gear-actions">
            <button className="gear-button secondary" type="button" onClick={clearAll}>
              リセット
            </button>
          </div>
        </div>
      </section>

      <div className="gear-grid">
        {categories.map((category) => {
          const categoryCheckedCount = category.items.filter((item) => checked[item.id]).length

          return (
            <section className="gear-card" key={category.id}>
              <div className="gear-card-header">
                <h2 className="gear-card-title">{category.title}</h2>
                <span className="gear-card-count">
                  {categoryCheckedCount}/{category.items.length}
                </span>
              </div>
              <div className="gear-list">
                {category.items.map((item) => {
                  const isChecked = Boolean(checked[item.id])

                  return (
                    <label className="gear-item" key={item.id}>
                      <input
                        checked={isChecked}
                        className="gear-checkbox"
                        onChange={() => toggleItem(item.id)}
                        type="checkbox"
                      />
                      <span>
                        <span className={`gear-label${isChecked ? " checked" : ""}`}>
                          {item.label}
                        </span>
                        {item.note && <span className="gear-note">{item.note}</span>}
                      </span>
                    </label>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

export default GearChecklistClient
