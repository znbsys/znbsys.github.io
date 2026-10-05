# znbsys.github.io

[English](README.md) | [简体中文](README.zh-CN.md) | **日本語**

ZNBSYS のコーポレートサイト —— Web 開発サービスを紹介する多言語（简体中文 / English / 日本語）静的サイト。GitHub Pages で公開され、**`release` ブランチの push のみがデプロイをトリガーします**。

- 要件定義：[docs/PRD.md](docs/PRD.md)
- 技術構成：[docs/TECHSTACK.md](docs/TECHSTACK.md)
- 実装とリリースフロー：[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- **公開前に差し替えるべきプレースホルダー**：[docs/CONTENT-REPLACEMENT.md](docs/CONTENT-REPLACEMENT.md)

## 機能

- Next.js 14 App Router + TypeScript（strict）+ Tailwind CSS、`output: export` による完全静的出力
- 3 言語のコンテンツを `config/locales/*.json` に一元化。Zod バリデーションと 3 言語整合チェックで CI をゲート
- ダークスレート基調のデザインシステム、セマンティックなデザイントークン（CSS 変数）、主色・明暗モード切替可能
- マルチページ構成：ホーム / サービス / 実績一覧 + 実績詳細 / 会社概要 / お問い合わせ / プライバシー / 利用規約 / 404
- SEO：自己参照 canonical + hreflang + Open Graph + `sitemap.xml` / `robots.txt`
- アクセシビリティ：セマンティックなランドマーク、フォーカスリング、`prefers-reduced-motion`、スキップリンク

## クイックスタート

```bash
npm ci            # 依存関係のインストール
npm run dev       # http://localhost:3000
```

## 主なコマンド

| コマンド | 説明 |
| --- | --- |
| `npm run dev` | ローカル開発 |
| `npm run lint` / `npm run typecheck` / `npm run test` | 品質ゲート |
| `npm run validate -- 'config/locales/*.json' 'config/legal/*.json'` | コンテンツのスキーマ検証 |
| `npm run check:i18n` | 3 言語の構造 / slug / キー整合性 |
| `npm run export` | `out/` への静的エクスポート（`STATIC_EXPORT=1 npm run build` と同じ） |
| `npm run format` | Prettier によるフォーマット |
| `npm run test:e2e` | Playwright スモークテスト（`npx playwright install` が必要） |

## ディレクトリ概要

```
app/                  ルートとページ（[locale] = 言語セグメント、3 言語を静的生成）
components/           レイアウト（Navbar/Footer）、トップページのセクション、実績カード、UI プリミティブ
config/locales/       3 言語のサイトコンテンツ（サービス、実績、会社概要、連絡先…）
config/legal/         3 言語のプライバシーポリシーと利用規約
messages/             3 言語の UI 文言（キーは必ず揃えること）
schemas/              Zod スキーマ（コンテンツ契約）
lib/ i18n/            リンク解決、テーマトークン、言語設定
scripts/              validate-config / check-i18n-parity
.github/workflows/    pages.yml（release ブランチがデプロイをトリガー）
```

## コンテンツの変更（コード不要）

| やりたいこと | 場所 |
| --- | --- |
| 会社名 / 連絡先 / 主色の変更 | `config/locales/*.json` の `brand` / `contact` / `theme` |
| サービスの追加 | `services.items`（**3 言語で同一 `id`**、`iconName` は `lib/icons.ts` のホワイトリスト内） |
| 実績の追加 | `cases.items`（**3 言語で同一 `slug`**、`detail` と `cover` 画像を含む） |
| トップページのセクション順变更 | `order` 配列 |

変更後は `npm run validate` + `npm run check:i18n` を実行し、`main` 経由で `release` にマージすると公開されます。

## リリース

```bash
git checkout -b release main   # 初回のみ
git push -u origin release     # push で GitHub Pages デプロイが起動
```

リポジトリの初期設定：**Settings → Pages → Source = GitHub Actions**。
`main` / `dev` の push ではデプロイされません。詳細は [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) §5 を参照。
