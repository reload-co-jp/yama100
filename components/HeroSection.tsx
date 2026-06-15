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
    bg: "linear-gradient(160deg, #0a0a0a 0%, #0d1a0f 60%, #0a0a0a 100%)",
    subColor: "#4ade80",
    accentGlow: "rgba(74,222,128,0.08)",
    progressColor: "#4ade80",
    progressLabelColor: "#4ade80",
    title: "日本百名山",
    subtitle: "Japan's 100 Famous Mountains",
    desc: "深田久弥が選定した日本を代表する100の名峰。\nあなたはいくつ登頂しましたか？",
    stars: STARS,
    link: "/about/",
    linkLabel: "百名山とは →",
  },
  yama200: {
    bg: "linear-gradient(160deg, #0a0a0a 0%, #0d1a0f 60%, #0a0a0a 100%)",
    subColor: "#4ade80",
    accentGlow: "rgba(74,222,128,0.08)",
    progressColor: "#4ade80",
    progressLabelColor: "#4ade80",
    title: "日本二百名山",
    subtitle: "Japan's 200 Famous Mountains",
    desc: "山と渓谷社が選定した日本を代表する200の名峰のうち、\n百名山以外の100峰。あなたはいくつ登頂しましたか？",
    stars: STARS,
    link: "/articles/mountains200/",
    linkLabel: "二百名山とは →",
  },
  yama300: {
    bg: "linear-gradient(160deg, #0a0a0a 0%, #0a0f1a 60%, #0a0a0a 100%)",
    subColor: "#60a5fa",
    accentGlow: "rgba(96,165,250,0.08)",
    progressColor: "#60a5fa",
    progressLabelColor: "#60a5fa",
    title: "日本三百名山",
    subtitle: "Japan's 300 Famous Mountains",
    desc: "山レコ準拠の日本三百名山一覧のうち、\n百名山・二百名山以外の101峰。あなたはいくつ登頂しましたか？",
    stars: STARS,
    link: "/articles/mountains300/",
    linkLabel: "三百名山とは →",
  },
  yama_flowers: {
    bg: "linear-gradient(160deg, #0a0a0a 0%, #1a0a10 60%, #0a0a0a 100%)",
    subColor: "#f472b6",
    accentGlow: "rgba(244,114,182,0.08)",
    progressColor: "#f472b6",
    progressLabelColor: "#f472b6",
    title: "花の百名山",
    subtitle: "Japan's 100 Famous Flower Mountains",
    desc: "田中澄江が選定した季節の花を楽しめる100の名峰。\nあなたはいくつ登頂しましたか？",
    stars: STARS,
    link: "/articles/flowers/",
    linkLabel: "花の百名山とは →",
  },
  yama_minor12: {
    bg: "linear-gradient(160deg, #0a0a0a 0%, #150f00 60%, #0a0a0a 100%)",
    subColor: "#fbbf24",
    accentGlow: "rgba(251,191,36,0.08)",
    progressColor: "#fbbf24",
    progressLabelColor: "#fbbf24",
    title: "マイナー12名山",
    subtitle: "Minor 12 Mountains",
    desc: "『岳人 2002年4月号』で紹介された、\n創造的登山を要する12の難峰。あなたはいくつ登頂しましたか？",
    stars: STARS,
    link: "https://www.yamareco.com/modules/yamainfo/ptlist.php?groupid=55",
    linkLabel: "ヤマレコの原典一覧 →",
  },
  yama_new100: {
    bg: "linear-gradient(160deg, #0a0a0a 0%, #001a17 60%, #0a0a0a 100%)",
    subColor: "#2dd4bf",
    accentGlow: "rgba(45,212,191,0.08)",
    progressColor: "#2dd4bf",
    progressLabelColor: "#2dd4bf",
    title: "新日本百名山",
    subtitle: "New 100 Famous Mountains of Japan",
    desc: "岩崎元郎が中高年にも登りやすい視点を加味して選んだ、\n新しい百名山の100座。あなたはいくつ登頂しましたか？",
    stars: STARS,
    link: "https://ja.wikipedia.org/wiki/%E6%96%B0%E6%97%A5%E6%9C%AC%E7%99%BE%E5%90%8D%E5%B1%B1",
    linkLabel: "Wikipedia の一覧 →",
  },
  yama_kanto100: {
    bg: "linear-gradient(160deg, #0a0a0a 0%, #1a0a0a 60%, #0a0a0a 100%)",
    subColor: "#f87171",
    accentGlow: "rgba(248,113,113,0.08)",
    progressColor: "#f87171",
    progressLabelColor: "#f87171",
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
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        margin: "-1.5rem -1rem 2rem -1rem",
        overflow: "hidden",
        padding: "56px 32px 48px",
        position: "relative",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          backgroundImage: "url(/images/hero.jpg)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          bottom: 0,
          left: 0,
          position: "absolute",
          right: 0,
          top: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.75) 100%)",
          bottom: 0,
          left: 0,
          position: "absolute",
          right: 0,
          top: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          background: c.accentGlow,
          borderRadius: "50%",
          filter: "blur(100px)",
          height: "400px",
          left: "50%",
          pointerEvents: "none",
          position: "absolute",
          top: "-80px",
          transform: "translateX(-50%)",
          width: "700px",
        }}
      />

      <div style={{ position: "relative", textAlign: "center", zIndex: 1 }}>
        <p
          style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: ".7rem",
            letterSpacing: ".15em",
            marginBottom: "16px",
            textTransform: "uppercase",
          }}
        >
          {c.subtitle}
        </p>
        <h1
          style={{
            color: "#ededed",
            fontSize: "clamp(1.75rem, 5vw, 3rem)",
            fontWeight: 700,
            letterSpacing: "-.03em",
            lineHeight: 1.1,
            marginBottom: "16px",
          }}
        >
          {c.title}
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: ".875rem",
            lineHeight: 1.8,
            margin: "0 auto 28px",
            maxWidth: "420px",
            textShadow: "0 1px 4px rgba(0,0,0,0.8)",
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
              marginLeft: "6px",
              fontSize: ".8125rem",
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
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        display: "inline-flex",
        flexDirection: "column",
        gap: "10px",
        padding: "16px 24px",
        minWidth: "200px",
      }}
    >
      <div style={{ alignItems: "baseline", display: "flex", gap: "6px" }}>
        <span style={{ color: "#ededed", fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-.03em" }}>
          {count}
        </span>
        <span style={{ color: "#333", fontSize: ".875rem" }}>/ {totalCount}</span>
        <span
          style={{
            color: config.progressLabelColor,
            fontSize: ".8rem",
            fontWeight: 600,
            marginLeft: "4px",
          }}
        >
          {percent}%
        </span>
      </div>
      <div
        style={{
          background: "rgba(255,255,255,0.06)",
          borderRadius: "2px",
          height: "3px",
          overflow: "hidden",
          width: "160px",
        }}
      >
        <div
          style={{
            background: config.progressColor,
            borderRadius: "2px",
            height: "100%",
            transition: "width .4s ease",
            width: `${percent}%`,
          }}
        />
      </div>
    </div>
  )
}
