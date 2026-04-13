import { ImageResponse } from "next/og"

export const dynamic = "force-static"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

async function fetchJapaneseFont(weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${weight}&display=swap`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    ).then((res) => res.text())
    const match = css.match(/src: url\((.+?)\) format\('woff2'\)/)
    if (!match) return null
    return fetch(match[1]).then((res) => res.arrayBuffer())
  } catch {
    return null
  }
}

const STARS = [
  [48, 8], [144, 36], [228, 168], [324, 60], [408, 132], [492, 24], [576, 204],
  [660, 72], [756, 144], [840, 48], [924, 108], [1008, 180], [1092, 36], [1152, 120],
  [96, 264], [204, 216], [288, 300], [372, 240], [456, 324], [540, 192], [624, 288],
  [708, 228], [792, 336], [876, 252], [960, 300], [1056, 216], [1116, 276], [36, 360],
  [168, 384], [264, 420], [348, 360], [432, 456], [516, 396], [600, 480], [684, 432],
  [768, 372], [852, 456], [936, 408], [1020, 360], [1104, 444],
]

const mountainSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 280" width="1200" height="280">
  <path d="M0,280 L0,228 L67,158 L133,202 L217,105 L300,167 L383,79 L467,140 L550,53 L633,123 L717,44 L800,114 L883,61 L967,131 L1050,88 L1133,140 L1200,105 L1200,280 Z" fill="rgba(255,255,255,0.03)"/>
  <path d="M0,280 L0,245 L100,175 L183,228 L283,131 L383,193 L483,96 L583,175 L683,70 L783,149 L883,88 L983,158 L1083,105 L1183,158 L1200,167 L1200,280 Z" fill="rgba(255,255,255,0.05)"/>
  <path d="M0,280 L0,272 L67,254 L167,211 L250,245 L350,175 L433,228 L517,184 L600,219 L700,166 L783,211 L867,175 L950,206 L1033,184 L1117,219 L1200,201 L1200,280 Z" fill="rgba(20,35,50,0.95)"/>
  <path d="M0,272 L67,254 L167,211 L250,245 L350,175 L433,228 L517,184 L600,219 L700,166 L783,211 L867,175 L950,206 L1033,184 L1117,219 L1200,201" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
  <path d="M347,175 L354,189 L358,183 Z" fill="rgba(255,255,255,0.4)"/>
  <path d="M515,184 L522,198 L526,192 Z" fill="rgba(255,255,255,0.35)"/>
  <path d="M698,166 L706,181 L710,175 Z" fill="rgba(255,255,255,0.45)"/>
  <path d="M865,175 L872,189 L876,183 Z" fill="rgba(255,255,255,0.3)"/>
</svg>`

const mountainDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(mountainSvg)}`

export default async function Image() {
  const fontData = await fetchJapaneseFont(700)

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(180deg, #050c18 0%, #0a1628 35%, #0f2035 65%, #152530 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 星 */}
        {STARS.map(([x, y], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: i % 5 === 0 ? 3 : 2,
              height: i % 5 === 0 ? 3 : 2,
              borderRadius: "50%",
              background: "white",
              opacity: 0.4 + (i % 4) * 0.15,
            }}
          />
        ))}

        {/* テキストコンテンツ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            marginBottom: "120px",
          }}
        >
          <p
            style={{
              color: "#7ecfb3",
              fontSize: "20px",
              letterSpacing: "0.2em",
              marginBottom: "16px",
              textTransform: "uppercase",
              fontFamily: fontData ? "NotoSansJP" : "sans-serif",
            }}
          >
            Japan&apos;s 100 Famous Mountains
          </p>
          <h1
            style={{
              color: "#ffffff",
              fontSize: "96px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              lineHeight: 1.1,
              marginBottom: "24px",
              textShadow: "0 2px 40px rgba(0,0,0,0.6)",
              fontFamily: fontData ? "NotoSansJP" : "sans-serif",
            }}
          >
            日本百名山
          </h1>
          <p
            style={{
              color: "#a8c4d4",
              fontSize: "24px",
              lineHeight: 1.7,
              fontFamily: fontData ? "NotoSansJP" : "sans-serif",
            }}
          >
            深田久弥が選定した日本を代表する100の名峰
          </p>
        </div>

        {/* 山シルエット（画像として埋め込み） */}
        { }
        <img
          src={mountainDataUrl}
          alt=""
          width={1200}
          height={280}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
          }}
        />

        {/* アプリ名 */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            right: "32px",
            color: "rgba(255,255,255,0.4)",
            fontSize: "18px",
            letterSpacing: "0.1em",
            fontFamily: fontData ? "NotoSansJP" : "sans-serif",
          }}
        >
          Yama100
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fontData
        ? {
            fonts: [
              {
                name: "NotoSansJP",
                data: fontData,
                weight: 700,
              },
            ],
          }
        : {}),
    }
  )
}
