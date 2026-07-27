#!/usr/bin/env node
// enrich-mountains.mjs が生成した草案(scripts/output/mountain-enrichment-draft.json)を
// public/mountains*.json 本体へ反映する。
//
// デフォルトでは、本体側で既に値が入っているフィールド（文体統一済みの手直し済み
// テキストなど）は上書きせず、null のフィールドのみ草案の値で埋める。
// 草案側も null の場合はそのまま null を維持する。
// 既存の description/access/model_course は変更しない。
//
// 使い方:
//   node scripts/apply-enrichment.mjs --list mountains   # mountains.jsonのみ、欠損分を反映
//   node scripts/apply-enrichment.mjs                    # 全リストへ、欠損分を反映
//   node scripts/apply-enrichment.mjs --overwrite         # 既存値も含め草案で全て上書き

import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const PUBLIC_DIR = path.join(ROOT, "public")
const DEFAULT_DRAFT = path.join(__dirname, "output", "mountain-enrichment-draft.json")

const LIST_FILE_MAP = {
  mountains: "mountains.json",
  mountains200: "mountains200.json",
  mountains300: "mountains300.json",
  mountains_flowers: "mountains_flowers.json",
  mountains_minor12: "mountains_minor12.json",
  mountains_new100: "mountains_new100.json",
  mountains_kanto100: "mountains_kanto100.json",
}

function parseArgs(argv) {
  const opts = { list: null, draft: DEFAULT_DRAFT, overwrite: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--list") opts.list = argv[++i]
    else if (a === "--draft") opts.draft = path.resolve(argv[++i])
    else if (a === "--overwrite") opts.overwrite = true
  }
  return opts
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  const draft = JSON.parse(await readFile(opts.draft, "utf8"))
  const targets = opts.list ? [opts.list] : Object.keys(LIST_FILE_MAP)

  for (const listKey of targets) {
    const fileName = LIST_FILE_MAP[listKey]
    if (!fileName) {
      console.error(`未知のリストキー: ${listKey}`)
      continue
    }
    const filePath = path.join(PUBLIC_DIR, fileName)
    const mountains = JSON.parse(await readFile(filePath, "utf8"))
    const draftById = new Map(draft.filter((d) => d.list === listKey).map((d) => [d.id, d]))

    let updated = 0
    const merged = mountains.map((mountain) => {
      const d = draftById.get(mountain.id)
      if (!d) return mountain

      const next = { ...mountain }
      let changed = false
      for (const field of ["history", "vegetation", "nationalPark", "difficulty"]) {
        if (!opts.overwrite && mountain[field]) continue
        const value = d[field] ?? null
        if (value !== null) changed = true
        next[field] = value
      }
      if (changed) updated++
      return next
    })

    await writeFile(filePath, JSON.stringify(merged, null, 2), "utf8")
    console.log(`${listKey}: ${updated}/${mountains.length}件を反映 -> ${path.relative(ROOT, filePath)}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
