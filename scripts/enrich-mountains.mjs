#!/usr/bin/env node
// 山情報充実 草案生成スクリプト
//
// public/mountains*.json の各山について、Wikipedia日本語版から
// 「歴史（登山史）」「植生」「所在国立公園」を収集し、標高・モデルコースの
// 所要時間から難易度目安を自動推定して、出典URL付きの草案JSONを
// scripts/output/ に書き出す。本体の mountains*.json は書き換えない
// （レビュー後に手動反映する運用）。
//
// 使い方:
//   node scripts/enrich-mountains.mjs                # 全リスト・全山
//   node scripts/enrich-mountains.mjs --list mountains --limit 10
//   node scripts/enrich-mountains.mjs --id 1
//   node scripts/enrich-mountains.mjs --delay 1000    # 外部リクエスト間隔(ms)
//
// 注意:
// - Wikipediaの記事本文は CC BY-SA。ここでは節本文をそのまま抽出するため、
//   実際にサイトへ載せる際は要約・言い換えるか、ライセンス表記を行うこと。
// - YAMAPの山検索ページはクライアントサイドレンダリングのため、静的取得では
//   山名からページURLを自動特定できない。難易度はYAMAP/ヤマレコの検索リンクを
//   参考情報として添えるに留め、数値の自動抽出は行わない。

import { readFile, writeFile, mkdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const PUBLIC_DIR = path.join(ROOT, "public")
const OUTPUT_DIR = path.join(__dirname, "output")

const USER_AGENT =
  "yama100-enrichment-script/1.0 (https://github.com/; contact: yamamoto@reload.co.jp)"

const LIST_FILES = [
  { key: "mountains", label: "日本百名山", file: "mountains.json" },
  { key: "mountains200", label: "日本二百名山", file: "mountains200.json" },
  { key: "mountains300", label: "日本三百名山", file: "mountains300.json" },
  { key: "mountains_flowers", label: "花の百名山", file: "mountains_flowers.json" },
  { key: "mountains_minor12", label: "マイナー12名山", file: "mountains_minor12.json" },
  { key: "mountains_new100", label: "新日本百名山", file: "mountains_new100.json" },
  { key: "mountains_kanto100", label: "関東百名山", file: "mountains_kanto100.json" },
]

// lib/mountainCatalog.ts の表記ゆれ吸収と揃える（同一山の重複取得を避けるため）
const NAME_ALIASES = {
  利尻岳: "利尻山",
  利尻山: "利尻山",
  後方羊蹄山: "羊蹄山",
  羊蹄山: "羊蹄山",
  吾妻山: "西吾妻山",
  西吾妻山: "西吾妻山",
  蔵王連峰: "蔵王山",
  蔵王山: "蔵王山",
  九重連山: "九重山",
  九重山: "九重山",
  大和葛城山: "大和葛城山",
  葛城山: "大和葛城山",
  穂高岳: "奥穂高岳",
  奥穂高岳: "奥穂高岳",
  八ヶ岳: "赤岳",
  赤岳: "赤岳",
  雲仙岳: "普賢岳",
  普賢岳: "普賢岳",
  蒜山: "上蒜山",
  上蒜山: "上蒜山",
  赤城山: "黒檜山",
  黒檜山: "黒檜山",
}

function normalizeName(name) {
  const n = name.normalize("NFKC")
  return NAME_ALIASES[n] ?? n
}

function parseArgs(argv) {
  const opts = { limit: null, list: null, id: null, delayMs: 700 }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--limit") opts.limit = Number(argv[++i])
    else if (a === "--list") opts.list = argv[++i]
    else if (a === "--id") opts.id = Number(argv[++i])
    else if (a === "--delay") opts.delayMs = Number(argv[++i])
  }
  return opts
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function loadMountains(opts) {
  const all = []
  for (const list of LIST_FILES) {
    if (opts.list && opts.list !== list.key) continue
    const raw = JSON.parse(await readFile(path.join(PUBLIC_DIR, list.file), "utf8"))
    for (const m of raw) {
      if (opts.id != null && m.id !== opts.id) continue
      all.push({ ...m, listKey: list.key, listLabel: list.label })
    }
  }
  return all
}

async function fetchWithUA(url) {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res
}

async function fetchJson(url) {
  const res = await fetchWithUA(url)
  return res.json()
}

// --- Wikipedia ---

async function resolveWikipediaTitle(name) {
  const url = `https://ja.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
    name
  )}&format=json&srlimit=5`
  const data = await fetchJson(url)
  const results = data?.query?.search ?? []
  if (results.length === 0) return null
  const preferred = results.find((r) => /山|峰|岳|標高|三角点/.test(r.snippet))
  return (preferred ?? results[0]).title
}

async function fetchWikipediaExtract(title) {
  const url = `https://ja.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&redirects=1&titles=${encodeURIComponent(
    title
  )}&format=json`
  const data = await fetchJson(url)
  const pages = data?.query?.pages ?? {}
  const page = Object.values(pages)[0]
  return page?.extract ?? null
}

function splitSections(extract) {
  const lines = extract.split("\n")
  const sections = [{ heading: "__lead__", body: [] }]
  for (const line of lines) {
    const m = line.match(/^(=+)\s*(.+?)\s*=+$/)
    if (m) {
      sections.push({ heading: m[2].trim(), body: [] })
    } else {
      sections[sections.length - 1].body.push(line)
    }
  }
  return sections.map((s) => ({ heading: s.heading, text: s.body.join("\n").trim() })).filter((s) => s.text)
}

const HISTORY_HEADING_RE = /登山史|沿革|歴史|由来/
const VEGETATION_HEADING_RE = /植生|動植物|自然|高山植物|生態/

function pickSectionText(sections, re) {
  const matched = sections.filter((s) => re.test(s.heading))
  if (matched.length === 0) return null
  return matched.map((s) => s.text).join("\n\n")
}

// 環境省が指定する国立公園（2026年時点 全34件）。本文中に含まれる名称と突き合わせる
// （曖昧な正規表現だと「〜された日に知床国立公園」のように前方の助詞を巻き込むため、既知名称との一致に限定する）。
const NATIONAL_PARKS = [
  "利尻礼文サロベツ国立公園",
  "知床国立公園",
  "阿寒摩周国立公園",
  "釧路湿原国立公園",
  "大雪山国立公園",
  "支笏洞爺国立公園",
  "十和田八幡平国立公園",
  "三陸復興国立公園",
  "磐梯朝日国立公園",
  "日光国立公園",
  "尾瀬国立公園",
  "上信越高原国立公園",
  "秩父多摩甲斐国立公園",
  "小笠原国立公園",
  "富士箱根伊豆国立公園",
  "中部山岳国立公園",
  "妙高戸隠連山国立公園",
  "白山国立公園",
  "南アルプス国立公園",
  "伊勢志摩国立公園",
  "吉野熊野国立公園",
  "山陰海岸国立公園",
  "瀬戸内海国立公園",
  "大山隠岐国立公園",
  "足摺宇和海国立公園",
  "西海国立公園",
  "雲仙天草国立公園",
  "阿蘇くじゅう国立公園",
  "霧島錦江湾国立公園",
  "屋久島国立公園",
  "奄美群島国立公園",
  "やんばる国立公園",
  "慶良間諸島国立公園",
  "西表石垣国立公園",
]

function extractNationalPark(fullText) {
  return NATIONAL_PARKS.find((park) => fullText.includes(park)) ?? null
}

async function collectWikipedia(name) {
  const title = await resolveWikipediaTitle(`${name} 山`)
  if (!title) return { title: null, history: null, vegetation: null, nationalPark: null, source: null }

  const extract = await fetchWikipediaExtract(title)
  if (!extract) return { title, history: null, vegetation: null, nationalPark: null, source: null }

  const sections = splitSections(extract)
  const source = `https://ja.wikipedia.org/wiki/${encodeURIComponent(title)}`

  return {
    title,
    history: pickSectionText(sections, HISTORY_HEADING_RE),
    vegetation: pickSectionText(sections, VEGETATION_HEADING_RE),
    nationalPark: extractNationalPark(extract),
    source,
  }
}

// --- 難易度（コースタイム・標高からの自動推定） ---
//
// YAMAPの山検索ページはクライアントサイドレンダリングのため、静的取得では
// 山名からページURLを特定できない（山ページ自体が分かれば体力度・コース定数の
// 数値は埋め込まれているが、検索の自動化は行わない）。そのため難易度は
// 標高・モデルコースの所要時間からの簡易推定のみとし、YAMAP/ヤマレコは
// 検索リンクとして添えるに留める。

function estimateDifficultyFromCourse(mountain) {
  const text = `${mountain.model_course ?? ""} ${mountain.access ?? ""}`
  const hoursMatch = text.match(/往復\s*約?\s*(\d+(?:\.\d+)?)\s*時間/)
  const hours = hoursMatch ? Number(hoursMatch[1]) : null

  let level = "不明"
  const reasons = []
  if (hours != null) {
    reasons.push(`コースタイム約${hours}時間`)
    if (hours <= 4) level = "初級"
    else if (hours <= 8) level = "中級"
    else level = "上級"
  }
  if (mountain.elevation >= 2500) {
    reasons.push(`標高${mountain.elevation}m`)
    if (level === "初級") level = "中級"
  }
  if (level === "不明") return null

  return {
    level,
    basis: reasons.join("、"),
    source: "自動推定（標高・モデルコースの所要時間からの簡易算出、要人手確認）",
    referenceLinks: {
      yamap: `https://yamap.com/search/mountains?q=${encodeURIComponent(mountain.name)}`,
      yamareco: `https://www.yamareco.com/modules/yamainfo/ptinfo.php?mode=name&word=${encodeURIComponent(
        mountain.name
      )}`,
    },
  }
}

// --- メイン処理 ---

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  const mountains = await loadMountains(opts)
  const limited = opts.limit != null ? mountains.slice(0, opts.limit) : mountains

  await mkdir(OUTPUT_DIR, { recursive: true })

  const cache = new Map()
  const results = []

  for (let i = 0; i < limited.length; i++) {
    const mountain = limited[i]
    const canonicalName = normalizeName(mountain.name)
    process.stderr.write(
      `[${i + 1}/${limited.length}] ${mountain.listLabel} #${mountain.id} ${mountain.name} (${canonicalName})\n`
    )

    let entry = cache.get(canonicalName)
    if (!entry) {
      entry = { canonicalName, wikipedia: null, error: null }
      try {
        entry.wikipedia = await collectWikipedia(canonicalName)
        await sleep(opts.delayMs)
      } catch (err) {
        entry.error = String(err?.message ?? err)
        process.stderr.write(`  ! 取得失敗: ${entry.error}\n`)
      }
      cache.set(canonicalName, entry)
    }

    results.push({
      id: mountain.id,
      name: mountain.name,
      canonicalName,
      list: mountain.listKey,
      listLabel: mountain.listLabel,
      elevation: mountain.elevation,
      history: entry.wikipedia?.history
        ? { text: entry.wikipedia.history, source: entry.wikipedia.source }
        : null,
      vegetation: entry.wikipedia?.vegetation
        ? { text: entry.wikipedia.vegetation, source: entry.wikipedia.source }
        : null,
      nationalPark: entry.wikipedia?.nationalPark
        ? { text: entry.wikipedia.nationalPark, source: entry.wikipedia.source }
        : null,
      difficulty: estimateDifficultyFromCourse(mountain),
      fetchError: entry.error,
      fetchedAt: new Date().toISOString(),
    })
  }

  const outFile = path.join(OUTPUT_DIR, "mountain-enrichment-draft.json")
  await writeFile(outFile, JSON.stringify(results, null, 2), "utf8")
  process.stderr.write(`\n完了: ${results.length}件 -> ${path.relative(ROOT, outFile)}\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
