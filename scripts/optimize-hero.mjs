// public/images/hero.jpg から WebP / AVIF のレスポンシブ画像を生成する
// 使い方: node scripts/optimize-hero.mjs
import sharp from "sharp"
import path from "node:path"

const src = path.resolve("public/images/hero.jpg")
const widths = [768, 1280, 1920]

const meta = await sharp(src).metadata()
console.log(`source: ${meta.width}x${meta.height}`)

for (const width of widths) {
  if (meta.width && width > meta.width) continue
  const base = path.resolve(`public/images/hero-${width}`)
  await sharp(src)
    .resize({ width })
    .avif({ quality: 50 })
    .toFile(`${base}.avif`)
  await sharp(src)
    .resize({ width })
    .webp({ quality: 72 })
    .toFile(`${base}.webp`)
  await sharp(src)
    .resize({ width })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(`${base}.jpg`)
  console.log(`generated ${base}.{avif,webp,jpg}`)
}
