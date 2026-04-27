import { useMountainCountState } from "hooks/useMountainState"

type Props = {
  type: string
  storageKey?: string
  mountainCount?: number
  totalCount?: number
}

const STARS = [
  [4, 8],
  [12, 3],
  [19, 14],
  [27, 5],
  [34, 11],
  [41, 2],
  [48, 17],
  [55, 6],
  [63, 12],
  [70, 4],
  [77, 9],
  [84, 15],
  [91, 3],
  [96, 10],
  [8, 22],
  [17, 18],
  [24, 25],
  [31, 20],
  [38, 27],
  [45, 16],
  [52, 24],
  [59, 19],
  [66, 28],
  [73, 21],
  [80, 25],
  [88, 18],
  [93, 23],
  [3, 30],
  [14, 32],
  [22, 35],
  [29, 30],
  [36, 38],
  [43, 33],
  [50, 40],
  [57, 36],
  [64, 31],
  [71, 38],
  [78, 34],
  [85, 30],
  [92, 37],
] as const

const CONFIG = {
  yama100: {
    bg: "linear-gradient(180deg, #050c18 0%, #0a1628 35%, #0f2035 65%, #152530 100%)",
    subColor: "#7ecfb3",
    progressColor: "linear-gradient(90deg, #4caf50, #81c784)",
    progressLabelColor: "#81c784",
    title: "日本百名山",
    subtitle: "Japan's 100 Famous Mountains",
    desc: "深田久弥が選定した日本を代表する100の名峰。\nあなたはいくつ登頂しましたか？",
    stars: STARS,
    link: "/about/",
    linkLabel: "百名山とは →",
  },
  yama200: {
    bg: "linear-gradient(180deg, #050c18 0%, #0a1628 35%, #0f2035 65%, #152530 100%)",
    subColor: "#7ecfb3",
    progressColor: "linear-gradient(90deg, #4caf50, #81c784)",
    progressLabelColor: "#81c784",
    title: "日本二百名山",
    subtitle: "Japan's 200 Famous Mountains",
    desc: "山と渓谷社が選定した日本を代表する200の名峰のうち、\n百名山以外の100峰。あなたはいくつ登頂しましたか？",
    stars: STARS,
    link: "/articles/mountains200/",
    linkLabel: "二百名山とは →",
  },
  yama300: {
    bg: "linear-gradient(180deg, #080d1a 0%, #0d1a2e 35%, #122238 65%, #182a30 100%)",
    subColor: "#b3d9f0",
    progressColor: "linear-gradient(90deg, #2196f3, #64b5f6)",
    progressLabelColor: "#64b5f6",
    title: "日本三百名山",
    subtitle: "Japan's 300 Famous Mountains",
    desc: "山レコ準拠の日本三百名山一覧のうち、\n百名山・二百名山以外の101峰。あなたはいくつ登頂しましたか？",
    stars: STARS,
    link: "/articles/mountains300/",
    linkLabel: "三百名山とは →",
  },
  yama_flowers: {
    bg: "linear-gradient(180deg, #1a050a 0%, #2e0d18 35%, #441525 65%, #501b2a 100%)",
    subColor: "#f48fb1",
    progressColor: "linear-gradient(90deg, #e91e63, #f06292)",
    progressLabelColor: "#f06292",
    title: "花の百名山",
    subtitle: "Japan's 100 Famous Flower Mountains",
    desc: "田中澄江が選定した季節の花を楽しめる100の名峰。\nあなたはいくつ登頂しましたか？",
    stars: STARS,
    link: "/articles/flowers/",
    linkLabel: "花の百名山とは →",
  },
  yama_minor12: {
    bg: "linear-gradient(180deg, #1a1205 0%, #2a1b0c 35%, #3a2410 65%, #2e2218 100%)",
    subColor: "#ffcc80",
    progressColor: "linear-gradient(90deg, #ff9800, #ffb74d)",
    progressLabelColor: "#ffb74d",
    title: "マイナー12名山",
    subtitle: "Minor 12 Mountains",
    desc: "『岳人 2002年4月号』で紹介された、\n創造的登山を要する12の難峰。あなたはいくつ登頂しましたか？",
    stars: STARS,
    link: "https://www.yamareco.com/modules/yamainfo/ptlist.php?groupid=55",
    linkLabel: "ヤマレコの原典一覧 →",
  },
  yama_new100: {
    bg: "linear-gradient(180deg, #041616 0%, #0b2323 35%, #103333 65%, #17312f 100%)",
    subColor: "#80cbc4",
    progressColor: "linear-gradient(90deg, #26a69a, #4db6ac)",
    progressLabelColor: "#4db6ac",
    title: "新日本百名山",
    subtitle: "New 100 Famous Mountains of Japan",
    desc: "岩崎元郎が中高年にも登りやすい視点を加味して選んだ、\n新しい百名山の100座。あなたはいくつ登頂しましたか？",
    stars: STARS,
    link: "https://ja.wikipedia.org/wiki/%E6%96%B0%E6%97%A5%E6%9C%AC%E7%99%BE%E5%90%8D%E5%B1%B1",
    linkLabel: "Wikipedia の一覧 →",
  },
  yama_kanto100: {
    bg: "linear-gradient(180deg, #1a0505 0%, #2d0a0a 35%, #401010 65%, #4a1515 100%)",
    subColor: "#ff8a80",
    progressColor: "linear-gradient(90deg, #c62828, #ef5350)",
    progressLabelColor: "#ef5350",
    title: "関東百名山",
    subtitle: "100 Famous Mountains of Kanto",
    desc: "関東一都六県を中心に選定された100の名峰。\nあなたはいくつ登頂しましたか？",
    stars: STARS,
    link: "https://www.yamareco.com/modules/yamainfo/ptlist.php?groupid=19",
    linkLabel: "ヤマレコの原典一覧 →",
  },
} as const

export default function HeroSection({
  type,
  storageKey,
  mountainCount,
  totalCount = 100,
}: Props) {
  const c = CONFIG[type]

  return (
    <section
      style={{
        background: c.bg,
        margin: "-1rem -1rem 1.5rem -1rem",
        overflow: "hidden",
        padding: "52px 32px 0",
        position: "relative",
      }}
    >
      <svg
        aria-hidden="true"
        style={{
          height: "100%",
          left: 0,
          pointerEvents: "none",
          position: "absolute",
          top: 0,
          width: "100%",
        }}
        preserveAspectRatio="none"
        viewBox="0 0 100 55"
      >
        {c.stars.map(([x, y], i) => (
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

      <div style={{ position: "relative", textAlign: "center", zIndex: 1 }}>
        <p
          style={{
            color: c.subColor,
            fontSize: ".75rem",
            letterSpacing: ".2em",
            marginBottom: "12px",
            textTransform: "uppercase",
          }}
        >
          {c.subtitle}
        </p>
        <h1
          style={{
            color: "#ffffff",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            letterSpacing: ".05em",
            lineHeight: 1.1,
            marginBottom: "16px",
            textShadow: "0 2px 20px rgba(0,0,0,0.6)",
          }}
        >
          {c.title}
        </h1>
        <p
          style={{
            color: "#a8c4d4",
            fontSize: ".95rem",
            lineHeight: 1.7,
            margin: "0 auto 28px",
            maxWidth: "480px",
          }}
        >
          {c.desc.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
          <a
            href={c.link}
            style={{
              color: c.subColor,
              textDecoration: "none",
              marginLeft: "8px",
            }}
          >
            {c.linkLabel}
          </a>
        </p>
        {storageKey ? (
          <HeroProgress storageKey={storageKey} config={c} totalCount={totalCount} />
        ) : (
          mountainCount != undefined && (
            <HeroProgressCore
              count={mountainCount}
              config={c}
              totalCount={totalCount}
            />
          )
        )}
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        style={{ display: "block", marginBottom: "-2px", width: "100%" }}
      >
        <path
          d="M0,160 L0,130 L80,90 L160,115 L260,60 L360,95 L460,45 L560,80 L660,30 L760,70 L860,25 L960,65 L1060,35 L1160,75 L1260,50 L1360,80 L1440,60 L1440,160 Z"
          fill="rgba(255,255,255,0.03)"
        />
        <path
          d="M0,160 L0,140 L120,100 L220,130 L340,75 L460,110 L580,55 L700,100 L820,40 L940,85 L1060,50 L1180,90 L1300,65 L1440,95 L1440,160 Z"
          fill="rgba(255,255,255,0.05)"
        />
        <path
          d="M0,160 L0,155 L80,145 L200,120 L300,140 L420,100 L520,130 L620,105 L720,125 L840,95 L940,120 L1040,100 L1140,118 L1240,105 L1340,125 L1440,115 L1440,160 Z"
          fill="rgba(20,35,50,0.9)"
        />
        <path
          d="M0,155 L80,145 L200,120 L300,140 L420,100 L520,130 L620,105 L720,125 L840,95 L940,120 L1040,100 L1140,118 L1240,105 L1340,125 L1440,115"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.5"
        />
        <path d="M416,100 L424,108 L428,104 Z" fill="rgba(255,255,255,0.4)" />
        <path d="M618,105 L626,113 L630,109 Z" fill="rgba(255,255,255,0.35)" />
        <path d="M838,95 L847,104 L851,100 Z" fill="rgba(255,255,255,0.45)" />
        <path
          d="M1038,100 L1046,108 L1050,104 Z"
          fill="rgba(255,255,255,0.3)"
        />
        <path d="M0,150 L1440,150 L1440,160 L0,160 Z" fill="#222" />
      </svg>
    </section>
  )
}

function HeroProgress({
  storageKey,
  config,
  totalCount,
}: {
  storageKey: string
  config: (typeof CONFIG)[keyof typeof CONFIG]
  totalCount: number
}) {
  const { checked } = useMountainCountState(storageKey)
  return (
    <>
      <HeroProgressCore config={config} count={checked.size} totalCount={totalCount} />
    </>
  )
}

function HeroProgressCore({
  count,
  config,
  totalCount,
}: {
  count: number
  config: (typeof CONFIG)[keyof typeof CONFIG]
  totalCount: number
}) {
  const percent = Math.round((count / totalCount) * 100)
  return (
    <div
      style={{
        alignItems: "center",
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "999px",
        display: "inline-flex",
        gap: "12px",
        marginBottom: "48px",
        padding: "8px 20px",
      }}
    >
      <span style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 700 }}>
        {count}
        <span style={{ color: "#aaa", fontWeight: 400 }}> / {totalCount}</span>
      </span>
      <div
        style={{
          background: "rgba(255,255,255,0.15)",
          borderRadius: "999px",
          height: "6px",
          overflow: "hidden",
          width: "120px",
        }}
      >
        <div
          style={{
            background: config.progressColor,
            borderRadius: "999px",
            height: "100%",
            transition: "width .4s ease",
            width: `${percent}%`,
          }}
        />
      </div>
      <span
        style={{
          color: config.progressLabelColor,
          fontSize: ".875rem",
          fontWeight: 600,
        }}
      >
        {percent}%
      </span>
    </div>
  )
}
