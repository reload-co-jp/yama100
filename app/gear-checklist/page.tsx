import { Metadata } from "next"
import GearChecklistClient from "components/GearChecklistClient"
import { SITE_URL } from "lib/site"

export const metadata: Metadata = {
  title: "山装備 忘れ物チェックリスト",
  description:
    "登山前に地図、ヘッドランプ、レインウェア、水、食料、季節装備、山小屋泊・テント泊装備を確認できるチェックリスト。",
  alternates: { canonical: "/gear-checklist/" },
  openGraph: {
    title: "山装備 忘れ物チェックリスト | Yama100",
    description:
      "登山前に地図、ヘッドランプ、レインウェア、水、食料、季節装備、山小屋泊・テント泊装備を確認できるチェックリスト。",
    url: `${SITE_URL}/gear-checklist/`,
    siteName: "Yama100",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "山装備 忘れ物チェックリスト",
  url: `${SITE_URL}/gear-checklist/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  description:
    "登山前に装備の忘れ物を確認できるブラウザ用チェックリスト。",
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GearChecklistClient />
    </>
  )
}
