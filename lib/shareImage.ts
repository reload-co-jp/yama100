// SNS 共有用の登頂記録画像を Canvas で描画する（ブラウザ内で完結）

import type { MountainListMeta } from "./mountainCatalog"
import { formatElevation, percent } from "./mountainMeta"
import type { RegionProgress, TimelineEntry } from "./progress"
import { formatSummitDate } from "./summitStore"

export type ShareFormat = "landscape" | "square"

export const FORMAT_SIZE: Record<
  ShareFormat,
  { width: number; height: number }
> = {
  landscape: { width: 1200, height: 630 },
  square: { width: 1080, height: 1080 },
}

const FONT = `"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Yu Gothic UI", "Yu Gothic", Meiryo, system-ui, sans-serif`
const COLORS = {
  forest900: "#10291f",
  forest800: "#173a2c",
  forest700: "#1e4d3a",
  forest500: "#2f7a57",
  mint: "#b9e2c9",
  lime: "#d8f0c4",
  white: "#ffffff",
}

type Ctx = CanvasRenderingContext2D

export function loadImage(
  src: string,
  crossOrigin = true,
  timeoutMs = 8000
): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    if (crossOrigin) img.crossOrigin = "anonymous"
    const timer = window.setTimeout(() => resolve(null), timeoutMs)
    img.onload = () => {
      window.clearTimeout(timer)
      resolve(img)
    }
    img.onerror = () => {
      window.clearTimeout(timer)
      resolve(null)
    }
    img.src = src
  })
}

function font(size: number, weight = 700) {
  return `${weight} ${size}px ${FONT}`
}

/** 指定幅に収まるまでフォントサイズを下げる */
function fitFont(
  ctx: Ctx,
  text: string,
  maxWidth: number,
  size: number,
  weight = 800,
  min = 14
) {
  let s = size
  ctx.font = font(s, weight)
  while (s > min && ctx.measureText(text).width > maxWidth) {
    s -= 2
    ctx.font = font(s, weight)
  }
  return s
}

function roundRect(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawCover(ctx: Ctx, img: HTMLImageElement, w: number, h: number) {
  const scale = Math.max(w / img.width, h / img.height)
  const dw = img.width * scale
  const dh = img.height * scale
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
}

function drawBackground(
  ctx: Ctx,
  w: number,
  h: number,
  photo: HTMLImageElement | null,
  photoStrength = 0.35
) {
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, COLORS.forest900)
  g.addColorStop(1, COLORS.forest700)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  if (photo) {
    ctx.save()
    ctx.globalAlpha = photoStrength
    drawCover(ctx, photo, w, h)
    ctx.restore()
    const overlay = ctx.createLinearGradient(0, 0, 0, h)
    overlay.addColorStop(0, "rgba(16,41,31,0.35)")
    overlay.addColorStop(1, "rgba(16,41,31,0.85)")
    ctx.fillStyle = overlay
    ctx.fillRect(0, 0, w, h)
  }

  // 等高線モチーフ
  ctx.save()
  ctx.strokeStyle = "rgba(255,255,255,0.07)"
  ctx.lineWidth = 1.5
  const cx = w * 0.82
  const cy = h * 0.28
  for (let i = 1; i <= 16; i++) {
    ctx.beginPath()
    const r = i * Math.max(w, h) * 0.045
    for (let a = 0; a <= Math.PI * 2 + 0.01; a += Math.PI / 60) {
      const wobble =
        1 + 0.08 * Math.sin(a * 3 + i * 0.7) + 0.05 * Math.sin(a * 5 - i)
      const x = cx + Math.cos(a) * r * wobble * 1.25
      const y = cy + Math.sin(a) * r * wobble * 0.8
      if (a === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  ctx.restore()

  // 稜線シルエット
  const ridge = (base: number, amp: number, seed: number, color: string) => {
    ctx.beginPath()
    ctx.moveTo(0, h)
    for (let x = 0; x <= w; x += w / 40) {
      const t = x / w
      const y =
        h -
        base -
        amp *
          (0.55 * Math.abs(Math.sin(t * 5.2 + seed)) +
            0.45 * Math.abs(Math.sin(t * 11.7 + seed * 2)))
      ctx.lineTo(x, y)
    }
    ctx.lineTo(w, h)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
  }
  ridge(h * 0.1, h * 0.14, 0.4, "rgba(255,255,255,0.04)")
  ridge(h * 0.02, h * 0.1, 1.9, "rgba(255,255,255,0.06)")
}

function drawLogo(ctx: Ctx, x: number, y: number, size = 40) {
  ctx.save()
  roundRect(ctx, x, y, size, size, size * 0.26)
  ctx.fillStyle = COLORS.white
  ctx.fill()
  ctx.strokeStyle = COLORS.forest700
  ctx.lineWidth = size * 0.07
  ctx.lineJoin = "round"
  ctx.beginPath()
  ctx.moveTo(x + size * 0.14, y + size * 0.8)
  ctx.lineTo(x + size * 0.42, y + size * 0.32)
  ctx.lineTo(x + size * 0.57, y + size * 0.57)
  ctx.lineTo(x + size * 0.68, y + size * 0.42)
  ctx.lineTo(x + size * 0.88, y + size * 0.8)
  ctx.closePath()
  ctx.stroke()
  ctx.fillStyle = COLORS.white
  ctx.font = font(size * 0.62, 800)
  ctx.textBaseline = "middle"
  ctx.fillText("Yama100", x + size + size * 0.3, y + size / 2 + 1)
  ctx.restore()
}

function drawFooter(
  ctx: Ctx,
  w: number,
  h: number,
  pad: number,
  siteHost: string
) {
  ctx.save()
  ctx.font = font(Math.round(w * 0.019), 700)
  ctx.fillStyle = "rgba(255,255,255,0.8)"
  ctx.textAlign = "right"
  ctx.textBaseline = "alphabetic"
  ctx.fillText(siteHost, w - pad, h - pad * 0.7)
  ctx.textAlign = "left"
  ctx.fillStyle = "rgba(255,255,255,0.6)"
  ctx.fillText("#Yama100", pad, h - pad * 0.7)
  ctx.restore()
}

function drawBar(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  ratio: number,
  color = COLORS.lime
) {
  roundRect(ctx, x, y, w, h, h / 2)
  ctx.fillStyle = "rgba(255,255,255,0.18)"
  ctx.fill()
  if (ratio > 0) {
    roundRect(ctx, x, y, Math.max(h, w * Math.min(1, ratio)), h, h / 2)
    const g = ctx.createLinearGradient(x, 0, x + w, 0)
    g.addColorStop(0, "#8fd3ad")
    g.addColorStop(1, color)
    ctx.fillStyle = g
    ctx.fill()
  }
}

function eyebrow(ctx: Ctx, text: string, x: number, y: number, size: number) {
  ctx.font = font(size, 800)
  ctx.fillStyle = COLORS.mint
  ctx.textBaseline = "alphabetic"
  ctx.fillText(text, x, y)
}

// --- 各画像タイプ -----------------------------------------------------------

export type ProgressData = {
  list: MountainListMeta
  climbed: number
  total: number
  dots: boolean[]
}

export function drawProgress(
  ctx: Ctx,
  format: ShareFormat,
  data: ProgressData,
  siteHost: string,
  photo: HTMLImageElement | null
) {
  const { width: w, height: h } = FORMAT_SIZE[format]
  const pad = w * 0.06
  drawBackground(ctx, w, h, photo)
  drawLogo(ctx, pad, pad * 0.8, w * 0.036)

  const square = format === "square"
  const textW = square ? w - pad * 2 : w * 0.5
  const top = square ? h * 0.2 : h * 0.25

  eyebrow(ctx, data.list.englishLabel.toUpperCase(), pad, top, w * 0.018)
  ctx.fillStyle = COLORS.white
  fitFont(ctx, `${data.list.label} 登頂記録`, textW, w * 0.045, 800)
  ctx.fillText(`${data.list.label} 登頂記録`, pad, top + w * 0.055)

  const numSize = square ? w * 0.2 : w * 0.11
  ctx.font = font(numSize, 800)
  ctx.fillStyle = COLORS.white
  const numY = top + w * 0.055 + numSize * 1.02
  ctx.fillText(String(data.climbed), pad, numY)
  const numW = ctx.measureText(String(data.climbed)).width
  ctx.font = font(numSize * 0.3, 700)
  ctx.fillStyle = "rgba(255,255,255,0.85)"
  ctx.fillText(` / ${data.total}座`, pad + numW + 6, numY)

  const pct = percent(data.climbed, data.total)
  ctx.font = font(numSize * 0.26, 800)
  ctx.fillStyle = COLORS.lime
  ctx.fillText(`${pct}%`, pad, numY + numSize * 0.42)

  drawBar(
    ctx,
    pad,
    numY + numSize * 0.55,
    textW,
    Math.max(12, w * 0.014),
    data.climbed / data.total
  )

  const remain = data.total - data.climbed
  ctx.font = font(w * 0.02, 700)
  ctx.fillStyle = "rgba(255,255,255,0.85)"
  ctx.fillText(
    remain === 0 ? "完登おめでとうございます！" : `完登まであと ${remain}座`,
    pad,
    numY + numSize * 0.55 + w * 0.05
  )

  // ドットマトリクス
  const n = data.dots.length
  const cols = Math.ceil(Math.sqrt(n))
  const rows = Math.ceil(n / cols)
  const areaW = square ? w - pad * 2 : w * 0.34
  const areaH = square ? h * 0.3 : h * 0.62
  const cell = Math.min(areaW / cols, areaH / rows)
  const ox = square ? (w - cell * cols) / 2 : w - pad - cell * cols
  const oy = square ? h - pad * 1.6 - cell * rows : (h - cell * rows) / 2
  data.dots.forEach((on, i) => {
    const cx = ox + (i % cols) * cell + cell / 2
    const cy = oy + Math.floor(i / cols) * cell + cell / 2
    ctx.beginPath()
    ctx.arc(cx, cy, cell * 0.36, 0, Math.PI * 2)
    ctx.fillStyle = on ? COLORS.lime : "rgba(255,255,255,0.16)"
    ctx.fill()
  })

  drawFooter(ctx, w, h, pad, siteHost)
}

export type NamesData = {
  title: string
  subtitle: string
  names: string[]
}

export function drawNames(
  ctx: Ctx,
  format: ShareFormat,
  data: NamesData,
  siteHost: string,
  photo: HTMLImageElement | null
) {
  const { width: w, height: h } = FORMAT_SIZE[format]
  const pad = w * 0.06
  drawBackground(ctx, w, h, photo, 0.25)
  drawLogo(ctx, pad, pad * 0.8, w * 0.036)

  const top = pad * 0.8 + w * 0.036 + w * 0.06
  eyebrow(ctx, data.subtitle, pad, top, w * 0.02)
  ctx.fillStyle = COLORS.white
  fitFont(ctx, data.title, w - pad * 2, w * 0.05, 800)
  ctx.fillText(data.title, pad, top + w * 0.058)

  const areaTop = top + w * 0.1
  const areaBottom = h - pad * 1.4
  const areaH = areaBottom - areaTop
  const areaW = w - pad * 2

  if (data.names.length === 0) {
    ctx.font = font(w * 0.026, 700)
    ctx.fillStyle = "rgba(255,255,255,0.8)"
    ctx.fillText(
      "これから登頂記録を積み上げていきます",
      pad,
      areaTop + w * 0.05
    )
  } else {
    // 名前が収まる列数・フォントサイズを探す
    let fontSize = w * 0.03
    let cols = 2
    let rows = 0
    for (; fontSize >= 11; fontSize -= 1) {
      const lineH = fontSize * 1.55
      rows = Math.floor(areaH / lineH)
      ctx.font = font(fontSize, 700)
      const longest = Math.max(
        ...data.names.map((n) => ctx.measureText(`✓ ${n}`).width)
      )
      cols = Math.max(1, Math.floor(areaW / (longest + fontSize * 1.2)))
      if (rows * cols >= data.names.length) break
    }
    const capacity = rows * cols
    const shown =
      capacity >= data.names.length
        ? data.names
        : data.names.slice(0, capacity - 1)
    const colW = areaW / cols
    ctx.font = font(fontSize, 700)
    ctx.textBaseline = "top"
    shown.forEach((name, i) => {
      const col = Math.floor(i / rows)
      const row = i % rows
      const x = pad + col * colW
      const y = areaTop + row * fontSize * 1.55
      ctx.fillStyle = COLORS.lime
      ctx.fillText("✓", x, y)
      ctx.fillStyle = COLORS.white
      ctx.fillText(name, x + fontSize * 1.2, y)
    })
    if (shown.length < data.names.length) {
      const i = shown.length
      ctx.fillStyle = COLORS.mint
      ctx.fillText(
        `ほか${data.names.length - shown.length}座`,
        pad + Math.floor(i / rows) * colW + fontSize * 1.2,
        areaTop + (i % rows) * fontSize * 1.55
      )
    }
    ctx.textBaseline = "alphabetic"
  }

  drawFooter(ctx, w, h, pad, siteHost)
}

export type YearData = {
  year: string
  entries: TimelineEntry[]
}

export function drawYear(
  ctx: Ctx,
  format: ShareFormat,
  data: YearData,
  siteHost: string,
  photo: HTMLImageElement | null
) {
  const { width: w, height: h } = FORMAT_SIZE[format]
  const pad = w * 0.06
  drawBackground(ctx, w, h, photo, 0.3)
  drawLogo(ctx, pad, pad * 0.8, w * 0.036)
  const square = format === "square"

  const unique = new Set(data.entries.map((e) => `${e.name}|${e.pageId}`)).size
  const top = pad * 0.8 + w * 0.036 + w * 0.055
  eyebrow(ctx, "YEAR IN MOUNTAINS", pad, top, w * 0.018)
  ctx.fillStyle = COLORS.white
  ctx.font = font(w * 0.042, 800)
  ctx.fillText(`${data.year}年の登頂記録`, pad, top + w * 0.05)

  const numSize = square ? w * 0.12 : w * 0.08
  ctx.font = font(numSize, 800)
  const numY = top + w * 0.05 + numSize * 1.05
  ctx.fillText(String(data.entries.length), pad, numY)
  const nw = ctx.measureText(String(data.entries.length)).width
  ctx.font = font(numSize * 0.3, 700)
  ctx.fillStyle = "rgba(255,255,255,0.85)"
  ctx.fillText(` 回登頂 ・ ${unique}山`, pad + nw, numY)

  // 月別グラフ（月まで記録されたもののみ）
  const months = new Array(12).fill(0)
  data.entries.forEach((e) => {
    const m = e.date.split("-")[1]
    if (m) months[Number(m) - 1] += 1
  })
  const maxM = Math.max(1, ...months)
  const chartX = pad
  const chartW = square ? w - pad * 2 : w * 0.42
  const chartH = square ? h * 0.16 : h * 0.2
  const chartY = numY + w * 0.03
  const bw = chartW / 12
  months.forEach((count, i) => {
    const bh = (count / maxM) * chartH
    roundRect(
      ctx,
      chartX + i * bw + bw * 0.18,
      chartY + chartH - Math.max(3, bh),
      bw * 0.64,
      Math.max(3, bh),
      4
    )
    ctx.fillStyle = count ? COLORS.lime : "rgba(255,255,255,0.16)"
    ctx.fill()
    ctx.font = font(w * 0.013, 700)
    ctx.fillStyle = "rgba(255,255,255,0.7)"
    ctx.textAlign = "center"
    ctx.fillText(
      String(i + 1),
      chartX + i * bw + bw / 2,
      chartY + chartH + w * 0.02
    )
    ctx.textAlign = "left"
  })

  // 山の一覧
  const listX = square ? pad : w * 0.56
  const listY = square ? chartY + chartH + w * 0.07 : top - w * 0.015
  const listBottom = h - pad * 1.4
  const sorted = [...data.entries].sort((a, b) =>
    a.sortKey.localeCompare(b.sortKey)
  )
  const lineH = w * 0.034
  const capacity = Math.max(1, Math.floor((listBottom - listY) / lineH))
  const shown =
    sorted.length > capacity ? sorted.slice(0, capacity - 1) : sorted
  ctx.textBaseline = "top"
  shown.forEach((entry, i) => {
    const y = listY + i * lineH
    ctx.font = font(w * 0.016, 700)
    ctx.fillStyle = COLORS.mint
    const dateText =
      formatSummitDate(entry.date).replace(`${data.year}年`, "") || "日付なし"
    ctx.fillText(dateText, listX, y + 3)
    ctx.font = font(w * 0.022, 800)
    ctx.fillStyle = COLORS.white
    ctx.fillText(entry.name, listX + w * 0.11, y)
  })
  if (shown.length < sorted.length) {
    ctx.font = font(w * 0.018, 700)
    ctx.fillStyle = COLORS.mint
    ctx.fillText(
      `ほか${sorted.length - shown.length}件`,
      listX + w * 0.11,
      listY + shown.length * lineH
    )
  }
  ctx.textBaseline = "alphabetic"

  drawFooter(ctx, w, h, pad, siteHost)
}

export type RegionData = {
  list: MountainListMeta
  regions: RegionProgress[]
}

export function drawRegions(
  ctx: Ctx,
  format: ShareFormat,
  data: RegionData,
  siteHost: string,
  photo: HTMLImageElement | null
) {
  const { width: w, height: h } = FORMAT_SIZE[format]
  const pad = w * 0.06
  drawBackground(ctx, w, h, photo, 0.25)
  drawLogo(ctx, pad, pad * 0.8, w * 0.036)

  const total = data.regions.reduce((s, r) => s + r.total, 0)
  const climbed = data.regions.reduce((s, r) => s + r.climbed, 0)
  const top = pad * 0.8 + w * 0.036 + w * 0.055
  eyebrow(ctx, "BY REGION", pad, top, w * 0.018)
  ctx.fillStyle = COLORS.white
  fitFont(
    ctx,
    `${data.list.label} 地域別の達成状況`,
    w - pad * 2,
    w * 0.04,
    800
  )
  ctx.fillText(`${data.list.label} 地域別の達成状況`, pad, top + w * 0.048)
  ctx.font = font(w * 0.02, 700)
  ctx.fillStyle = "rgba(255,255,255,0.85)"
  ctx.fillText(
    `合計 ${climbed} / ${total}座（${percent(climbed, total)}%）`,
    pad,
    top + w * 0.085
  )

  const square = format === "square"
  const areaTop = top + w * 0.1
  const areaBottom = h - pad * 1.4
  const cols = square ? 1 : 2
  const perCol = Math.ceil(data.regions.length / cols)
  const rowH = (areaBottom - areaTop) / perCol
  const colW = (w - pad * 2 - (cols - 1) * pad * 0.6) / cols
  data.regions.forEach((r, i) => {
    const col = Math.floor(i / perCol)
    const row = i % perCol
    const x = pad + col * (colW + pad * 0.6)
    const y = areaTop + row * rowH
    ctx.font = font(Math.min(rowH * 0.4, w * 0.026), 800)
    ctx.fillStyle = COLORS.white
    ctx.fillText(r.region.label, x, y + rowH * 0.42)
    ctx.textAlign = "right"
    ctx.font = font(Math.min(rowH * 0.34, w * 0.022), 700)
    ctx.fillStyle =
      r.climbed === r.total ? COLORS.lime : "rgba(255,255,255,0.85)"
    ctx.fillText(
      `${r.climbed} / ${r.total}（${percent(r.climbed, r.total)}%）`,
      x + colW,
      y + rowH * 0.42
    )
    ctx.textAlign = "left"
    drawBar(
      ctx,
      x,
      y + rowH * 0.56,
      colW,
      Math.max(8, rowH * 0.16),
      r.climbed / r.total
    )
  })

  drawFooter(ctx, w, h, pad, siteHost)
}

export type SummitData = {
  name: string
  elevation: number
  prefectures: string[]
  date: string | null
  lists: { label: string; climbed: number; total: number }[]
}

export function drawSummit(
  ctx: Ctx,
  format: ShareFormat,
  data: SummitData,
  siteHost: string,
  photo: HTMLImageElement | null
) {
  const { width: w, height: h } = FORMAT_SIZE[format]
  const pad = w * 0.06

  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, COLORS.forest900)
  g.addColorStop(1, COLORS.forest700)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  if (photo) {
    drawCover(ctx, photo, w, h)
    const overlay = ctx.createLinearGradient(0, 0, 0, h)
    overlay.addColorStop(0, "rgba(16,41,31,0.15)")
    overlay.addColorStop(0.45, "rgba(16,41,31,0.35)")
    overlay.addColorStop(1, "rgba(16,41,31,0.92)")
    ctx.fillStyle = overlay
    ctx.fillRect(0, 0, w, h)
  } else {
    drawBackground(ctx, w, h, null)
  }
  drawLogo(ctx, pad, pad * 0.8, w * 0.036)

  // バッジ
  const badgeText = "SUMMIT ・ 登頂達成"
  ctx.font = font(w * 0.02, 800)
  const bw = ctx.measureText(badgeText).width + w * 0.04
  const bh = w * 0.042
  const by = h * (format === "square" ? 0.5 : 0.3)
  roundRect(ctx, pad, by, bw, bh, bh / 2)
  ctx.fillStyle = COLORS.lime
  ctx.fill()
  ctx.fillStyle = COLORS.forest900
  ctx.textBaseline = "middle"
  ctx.fillText(badgeText, pad + w * 0.02, by + bh / 2 + 1)
  ctx.textBaseline = "alphabetic"

  // 山名
  ctx.fillStyle = COLORS.white
  const nameSize = fitFont(ctx, data.name, w - pad * 2, w * 0.1, 800, 32)
  const nameY = by + bh + nameSize * 1.05
  ctx.shadowColor = "rgba(0,0,0,0.35)"
  ctx.shadowBlur = 24
  ctx.fillText(data.name, pad, nameY)
  ctx.shadowBlur = 0

  ctx.font = font(w * 0.03, 700)
  ctx.fillStyle = "rgba(255,255,255,0.92)"
  const sub = `${formatElevation(data.elevation)} ・ ${data.prefectures.join("・")}`
  ctx.fillText(sub, pad, nameY + w * 0.05)

  let y = nameY + w * 0.095
  if (data.date) {
    ctx.font = font(w * 0.024, 700)
    ctx.fillStyle = COLORS.mint
    ctx.fillText(`${formatSummitDate(data.date)} 登頂`, pad, y)
    y += w * 0.045
  }
  ctx.font = font(w * 0.02, 700)
  ctx.fillStyle = "rgba(255,255,255,0.85)"
  const listText = data.lists
    .map((l) => `${l.label} ${l.climbed}/${l.total}`)
    .join("　")
  fitFont(ctx, listText, w - pad * 2, w * 0.02, 700, 12)
  ctx.fillText(listText, pad, y)

  drawFooter(ctx, w, h, pad, siteHost)
}
