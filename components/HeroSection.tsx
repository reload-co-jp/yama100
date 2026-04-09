type Props = {
  count: number
}

// 固定の星座標（ハイドレーションミスマッチを避けるため乱数を使わない）
const STARS = [
  [4, 8], [12, 3], [19, 14], [27, 5], [34, 11], [41, 2], [48, 17],
  [55, 6], [63, 12], [70, 4], [77, 9], [84, 15], [91, 3], [96, 10],
  [8, 22], [17, 18], [24, 25], [31, 20], [38, 27], [45, 16], [52, 24],
  [59, 19], [66, 28], [73, 21], [80, 25], [88, 18], [93, 23], [3, 30],
  [14, 32], [22, 35], [29, 30], [36, 38], [43, 33], [50, 40], [57, 36],
  [64, 31], [71, 38], [78, 34], [85, 30], [92, 37],
] as const

export default function HeroSection({ count }: Props) {
  const percent = Math.round((count / 100) * 100)

  return (
    <section
      style={{
        background:
          'linear-gradient(180deg, #050c18 0%, #0a1628 35%, #0f2035 65%, #152530 100%)',
        margin: '-1rem -1rem 1.5rem -1rem',
        overflow: 'hidden',
        padding: '52px 32px 0',
        position: 'relative',
      }}
    >
      {/* 星 */}
      <svg
        aria-hidden="true"
        style={{
          height: '100%',
          left: 0,
          pointerEvents: 'none',
          position: 'absolute',
          top: 0,
          width: '100%',
        }}
        preserveAspectRatio="none"
        viewBox="0 0 100 55"
      >
        {STARS.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 5 === 0 ? 0.35 : 0.2}
            fill="white"
            opacity={0.4 + (i % 4) * 0.15}
          />
        ))}
      </svg>

      {/* テキストコンテンツ */}
      <div style={{ position: 'relative', textAlign: 'center', zIndex: 1 }}>
        <p
          style={{
            color: '#7ecfb3',
            fontSize: '.75rem',
            letterSpacing: '.2em',
            marginBottom: '12px',
            textTransform: 'uppercase',
          }}
        >
          Japan&apos;s 100 Famous Mountains
        </p>
        <h2
          style={{
            color: '#ffffff',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            letterSpacing: '.05em',
            lineHeight: 1.1,
            marginBottom: '16px',
            textShadow: '0 2px 20px rgba(0,0,0,0.6)',
          }}
        >
          日本百名山
        </h2>
        <p
          style={{
            color: '#a8c4d4',
            fontSize: '.95rem',
            lineHeight: 1.7,
            margin: '0 auto 28px',
            maxWidth: '480px',
          }}
        >
          深田久弥が選定した日本を代表する100の名峰。
          <br />
          あなたはいくつ登頂しましたか？
        </p>

        {/* 進捗バッジ */}
        <div
          style={{
            alignItems: 'center',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '999px',
            display: 'inline-flex',
            gap: '12px',
            marginBottom: '48px',
            padding: '8px 20px',
          }}
        >
          <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>
            {count}
            <span style={{ color: '#aaa', fontWeight: 400 }}> / 100</span>
          </span>
          <div
            style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '999px',
              height: '6px',
              overflow: 'hidden',
              width: '120px',
            }}
          >
            <div
              style={{
                background:
                  'linear-gradient(90deg, #4caf50, #81c784)',
                borderRadius: '999px',
                height: '100%',
                transition: 'width .4s ease',
                width: `${percent}%`,
              }}
            />
          </div>
          <span style={{ color: '#81c784', fontSize: '.875rem', fontWeight: 600 }}>
            {percent}%
          </span>
        </div>
      </div>

      {/* 山のシルエット */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        style={{ display: 'block', marginBottom: '-2px', width: '100%' }}
      >
        {/* 遠景の山（薄い） */}
        <path
          d="M0,160 L0,130 L80,90 L160,115 L260,60 L360,95 L460,45 L560,80 L660,30 L760,70 L860,25 L960,65 L1060,35 L1160,75 L1260,50 L1360,80 L1440,60 L1440,160 Z"
          fill="rgba(255,255,255,0.03)"
        />
        {/* 中景の山 */}
        <path
          d="M0,160 L0,140 L120,100 L220,130 L340,75 L460,110 L580,55 L700,100 L820,40 L940,85 L1060,50 L1180,90 L1300,65 L1440,95 L1440,160 Z"
          fill="rgba(255,255,255,0.05)"
        />
        {/* 前景の山（濃い、雪化粧あり） */}
        <path
          d="M0,160 L0,155 L80,145 L200,120 L300,140 L420,100 L520,130 L620,105 L720,125 L840,95 L940,120 L1040,100 L1140,118 L1240,105 L1340,125 L1440,115 L1440,160 Z"
          fill="rgba(20,35,50,0.9)"
        />
        {/* 前景山の稜線（白） */}
        <path
          d="M0,155 L80,145 L200,120 L300,140 L420,100 L520,130 L620,105 L720,125 L840,95 L940,120 L1040,100 L1140,118 L1240,105 L1340,125 L1440,115"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.5"
        />
        {/* 雪のハイライト（山頂付近） */}
        <path
          d="M416,100 L424,108 L428,104 Z"
          fill="rgba(255,255,255,0.4)"
        />
        <path
          d="M618,105 L626,113 L630,109 Z"
          fill="rgba(255,255,255,0.35)"
        />
        <path
          d="M838,95 L847,104 L851,100 Z"
          fill="rgba(255,255,255,0.45)"
        />
        <path
          d="M1038,100 L1046,108 L1050,104 Z"
          fill="rgba(255,255,255,0.3)"
        />
        {/* 地面（フェード） */}
        <path
          d="M0,150 L1440,150 L1440,160 L0,160 Z"
          fill="#222"
        />
      </svg>
    </section>
  )
}
