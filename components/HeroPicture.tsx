// レスポンシブなヒーロー画像（AVIF / WebP / JPEG）
// 画像は scripts/optimize-hero.mjs で public/images/hero.jpg から生成する

type Props = {
  className?: string
  priority?: boolean
  sizes?: string
}

const WIDTHS = [768, 1280, 1920]

function srcSet(ext: string) {
  return WIDTHS.map((w) => `/images/hero-${w}.${ext} ${w}w`).join(", ")
}

export default function HeroPicture({
  className,
  priority = false,
  sizes = "100vw",
}: Props) {
  return (
    <picture>
      <source sizes={sizes} srcSet={srcSet("avif")} type="image/avif" />
      <source sizes={sizes} srcSet={srcSet("webp")} type="image/webp" />
      <img
        alt=""
        className={className}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        height={1280}
        loading={priority ? "eager" : "lazy"}
        sizes={sizes}
        src="/images/hero-1280.jpg"
        srcSet={srcSet("jpg")}
        width={1920}
      />
    </picture>
  )
}
