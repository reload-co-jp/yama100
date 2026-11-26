# Yama100

日本百名山・二百名山の登頂チェックリスト Web アプリ。

## 機能

- **トップページ / ダッシュボード** (`/`) — 日本百名山の登頂数・達成率、リスト別・地域別の進捗、最近の登頂、百名山一覧
- **山リスト** — 百名山・二百名山・三百名山・花の百名山・マイナー12名山・新日本百名山・関東百名山
  - 写真付きカード一覧、キーワード / 地域 / 都道府県 / 登頂状況 / 標高 / 難易度目安での絞り込み、並べ替え
  - 絞り込み状態は URL クエリ（`q`, `region`, `pref`, `status`, `elev`, `diff`, `sort`, `view`）に反映
  - カード表示と地図表示の切り替え
- **山を探す** (`/search/`) — 全リスト横断検索
- **地図** (`/map/`) — MapLibre GL JS + 国土地理院地図（淡色）。登頂済み / 未登頂を色分け
- **山の詳細** (`/mountain/[id]/`) — 基本情報・紹介・登山情報（データがあるもののみ）・歴史と植生・地図・近くの山
  - 登頂記録：全所属リストへの登頂反映、登頂日（複数・年 / 年月 / 年月日）、登頂回数、ルート、メモ、写真
- **登頂記録** (`/summary/`) — 年間の登頂数、時系列の登頂記録、リスト別の達成度
- **シェア画像** (`/share/`) — 達成状況 / 登頂した山 / 年間実績 / 地域別 / 登頂記念 の5種類を Canvas で生成（横長・正方形）
- **日本百名山ガイド** (`/hyakumeizan/`) — 一覧・標高ランキング・地域別・都道府県別・難易度別・日帰りの目安・初心者向けガイド
- **URLシェア** — 登頂状態をビットエンコードして URL 化（`?data=`）。形式は従来から変更なし
- **データ管理** (`/settings/`) — JSON でエクスポート / インポート（旧形式 v1 の読み込みにも対応）

## データの保存

すべてブラウザ内に保存し、サーバーには送信しない。

| 保存先 | キー | 内容 |
|------|------|------|
| localStorage | `yama100`, `yama200`, `yama300`, `yama_flowers`, `yama_minor12`, `yama_new100`, `yama_kanto100` | `{ checked: number[], dates: { [id]: string[] } }`（従来形式のまま） |
| localStorage | `yama100_records` | 山ごとのルート・メモ（山詳細ページの ID 単位） |
| IndexedDB | `yama100` / `photos` | 記録写真（長辺 1600px に縮小して保存。バックアップ対象外） |

## 技術構成

| 項目 | 内容 |
|------|------|
| フレームワーク | Next.js 16 (App Router, 静的エクスポート) |
| UI | React 19 + TypeScript |
| スタイル | CSS Modules + `app/globals.css` のデザイントークン |
| 地図 | MapLibre GL JS + 国土地理院タイル |
| データ | 静的 JSON (`public/mountains*.json`) |
| 状態管理 | `lib/summitStore.ts`（localStorage）+ `useSyncExternalStore` |
| パッケージマネージャ | pnpm |

### 主なディレクトリ

```text
app/                    ページ（App Router）
components/explorer/    一覧のカード・絞り込み・URL 同期
components/home/        トップページ（ヒーロー・ダッシュボード）
components/detail/      山詳細の登頂記録パネル・地図
components/guide/       百名山ガイドページの共通部品
lib/summitStore.ts      登頂状態の読み書き（既存形式と互換）
lib/recordStore.ts      ルート・メモ・写真の保存
lib/regions.ts          都道府県と地方区分
lib/shareImage.ts       シェア画像の描画
```

### 画像

ヒーロー画像は `public/images/hero.jpg` から AVIF / WebP / JPEG（768・1280・1920px）を生成している。

```bash
node scripts/optimize-hero.mjs
```

## 開発

```bash
pnpm install
pnpm dev
```

## ビルド

```bash
pnpm build
pnpm start
```

## Android アプリ

Capacitor で静的エクスポート済み Next.js を Android WebView アプリ化。

```bash
pnpm android:sync
pnpm android:open
```

debug APK 作成:

```bash
pnpm android:build
```

release APK/AAB 作成:

```bash
pnpm android:release
```

出力先:

```text
android/app/build/outputs/apk/debug/app-debug.apk
android/app/build/outputs/apk/release/app-release-unsigned.apk
android/app/build/outputs/bundle/release/app-release.aab
```

## データ形式

```json
{
  "id": 1,
  "name": "富士山",
  "description": "説明文",
  "location": ["山梨県", "静岡県"],
  "latitude": 35.3606,
  "longitude": 138.7274,
  "elevation": 3776
}
```
