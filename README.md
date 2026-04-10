# Yama100

日本百名山・二百名山の登頂チェックリスト Web アプリ。

## 機能

- **百名山チェックリスト** (`/`) — 深田久弥選定の100峰
- **二百名山チェックリスト** (`/mountains200/`) — 山と渓谷社選定のうち百名山を除く100峰
- **各山の詳細ページ** — Wikipedia サムネイル・国土地理院地図・外部リンク
- **並び順切り替え** — 北から順 / 五十音順 / 標高順 / 都道府県別
- **地図表示** — Leaflet + 国土地理院地図（一覧と連動）
- **進捗表示** — 登頂数 / 100・進捗バー
- **URLシェア** — 登頂状態と並び順をビットエンコードしてURL化
- **localStorage 保存** — ログイン不要、ブラウザ内で状態を保持

## 技術構成

| 項目 | 内容 |
|------|------|
| フレームワーク | Next.js 16 (App Router) |
| UI | React 19 + TypeScript |
| 地図 | Leaflet |
| データ | 静的 JSON (`public/mountains.json`, `public/mountains200.json`) |
| 状態管理 | React state + localStorage |
| パッケージマネージャ | pnpm |

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
