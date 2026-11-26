import Link from "next/link"
import HeroPicture from "../HeroPicture"
import { MountainIcon } from "../ui/Icons"
import HeroStats from "./HeroStats"
import styles from "./TopHero.module.css"

export default function TopHero() {
  return (
    <section aria-labelledby="hero-title" className={styles.hero}>
      <HeroPicture className={styles.image} priority />
      <div className={`container ${styles.inner}`}>
        <div>
          <p className={styles.brand}>
            <MountainIcon size={18} />
            <strong>Yama100</strong>
            <span className={styles.tagline}>
              日本の山を巡る、自分だけの登山コレクション
            </span>
          </p>
          <h1 className={styles.title} id="hero-title">
            <span>日本百名山、</span>
            <span>あなたはいくつ</span>
            <span>登りましたか？</span>
          </h1>
          <p className={styles.lead}>
            Yama100は、日本百名山をはじめとする山の登頂記録を管理・可視化・共有できる登山記録サービスです。
            ログイン不要、記録はお使いのブラウザに保存されます。
          </p>
          <div className={styles.ctas}>
            <Link className="btn btn-light" href="#list">
              百名山一覧を見る
            </Link>
            <Link className="btn btn-outline-light" href="/summary/">
              登頂記録を見る
            </Link>
          </div>
        </div>
        <HeroStats />
      </div>
    </section>
  )
}
