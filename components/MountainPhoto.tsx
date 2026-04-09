'use client'

import { useEffect, useRef, useState } from 'react'

// Wikipedia 記事名が山データの名称と異なるものの対応表
const wikiTitleOverrides: Record<string, string> = {
  利尻岳: '利尻山',
  阿寒岳: '雄阿寒岳',
  大雪山: '大雪山_(北海道)',
  後方羊蹄山: '羊蹄山',
  朝日岳: '大朝日岳',
  吾妻山: '吾妻連峰',
  悪沢岳: '荒川岳',
  九重山: '九重連山',
}

// セッション中のキャッシュ（同じ山を複数回レンダリングしたときの再リクエスト防止）
const cache = new Map<string, string | null>()

type Props = {
  name: string
}

export default function MountainPhoto({ name }: Props) {
  const [src, setSrc] = useState<string | null | 'pending'>(
    cache.has(name) ? cache.get(name)! : 'pending'
  )
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (src !== 'pending') return
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const title = wikiTitleOverrides[name] ?? name
        fetch(
          `https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
        )
          .then((r) => r.json())
          .then((data) => {
            const url: string | null = data?.thumbnail?.source ?? null
            cache.set(name, url)
            setSrc(url)
          })
          .catch(() => {
            cache.set(name, null)
            setSrc(null)
          })
      },
      { rootMargin: '400px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [name, src])

  return (
    <div
      ref={containerRef}
      style={{
        background: '#3a3a3a',
        borderRadius: '6px',
        flexShrink: 0,
        height: '80px',
        overflow: 'hidden',
        width: '80px',
      }}
    >
      {src === 'pending' && (
        <div
          style={{
            animation: 'pulse 1.5s ease-in-out infinite',
            background: 'linear-gradient(90deg, #3a3a3a 25%, #484848 50%, #3a3a3a 75%)',
            backgroundSize: '200% 100%',
            height: '100%',
            width: '100%',
          }}
        />
      )}
      {src === null && (
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="none"
            stroke="#666"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 17 9 7 14 13 17 9 21 17" />
            <line x1="3" y1="20" x2="21" y2="20" />
          </svg>
        </div>
      )}
      {src && src !== 'pending' && (
        <img
          src={src}
          alt={name}
          style={{
            height: '100%',
            objectFit: 'cover',
            width: '100%',
          }}
        />
      )}
      <style>{`
        @keyframes pulse {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}
