import styles from "./ProgressBar.module.css"

type Props = {
  value: number
  max: number
  label: string
  size?: "thin" | "default" | "thick"
  color?: string
  onDark?: boolean
}

export default function ProgressBar({
  value,
  max,
  label,
  size = "default",
  color,
  onDark,
}: Props) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div
      aria-label={label}
      aria-valuemax={max}
      aria-valuemin={0}
      aria-valuenow={value}
      aria-valuetext={`${value} / ${max}（${Math.round(pct)}%）`}
      className={`${styles.track} ${size === "thin" ? styles.thin : ""} ${size === "thick" ? styles.thick : ""} ${onDark ? styles.onDark : ""}`}
      role="progressbar"
    >
      <div
        className={styles.bar}
        style={{ width: `${pct}%`, ...(color ? { background: color } : {}) }}
      />
    </div>
  )
}
