# znbsys.github.io

[English](README.md) | **简体中文** | [日本語](README.ja.md)

ZNBSYS 公司官网 —— 承接各类 Web 开发业务的多语言（简体中文 / English / 日本語）静态站点，部署于 GitHub Pages，**仅 `release` 分支触发自动部署**。

- 需求：[docs/PRD.md](docs/PRD.md)
- 技术栈：[docs/TECHSTACK.md](docs/TECHSTACK.md)
- 开发实现与发布流程：[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- **上线前待替换的占位内容**：[docs/CONTENT-REPLACEMENT.md](docs/CONTENT-REPLACEMENT.md)

## 特性

- Next.js 14 App Router + TypeScript(strict) + Tailwind CSS，`output: export` 纯静态导出
- 三语内容集中于 `config/locales/*.json`，Zod 校验 + 三语一致性脚本做 CI 门禁
- 深色 slate 视觉体系、语义化设计令牌（CSS 变量），可切换主色与明暗模式
- 多页结构：首页 / 服务 / 案例列表 + 案例详情 / 关于 / 联系 / 隐私 / 条款 / 404
- SEO：自引用 canonical + hreflang + Open Graph + `sitemap.xml` / `robots.txt`
- 无障碍：语义化 landmark、焦点环、`prefers-reduced-motion`、跳转到主内容

## 快速开始

```bash
npm ci            # 安装依赖
npm run dev       # http://localhost:3000
```

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 本地开发 |
| `npm run lint` / `npm run typecheck` / `npm run test` | 质量门禁 |
| `npm run validate -- 'config/locales/*.json' 'config/legal/*.json'` | 内容 schema 校验 |
| `npm run check:i18n` | 三语结构 / slug / key 一致性 |
| `npm run export` | 静态导出到 `out/`（等价 `STATIC_EXPORT=1 npm run build`） |
| `npm run format` | Prettier 格式化 |
| `npm run test:e2e` | Playwright 冒烟（需 `npx playwright install`） |

## 目录速览

```
app/                  路由与页面（[locale] 为语言段，静态生成三语）
components/           布局（Navbar/Footer）、首页区块、案例卡片、UI 基元
config/locales/       三语站点内容（服务、案例、关于、联系…）
config/legal/         三语隐私政策与服务条款
messages/             三语 UI 短文案（键必须对齐）
schemas/              Zod schema（内容契约）
lib/ i18n/            链接解析、主题令牌、语言配置
scripts/              validate-config / check-i18n-parity
.github/workflows/    pages.yml（release 分支触发部署）
```

## 改内容（不改代码）

| 需求 | 位置 |
| --- | --- |
| 换公司名 / 联系方式 / 主色 | `config/locales/*.json` 的 `brand` / `contact` / `theme` |
| 新增服务 | `services.items`（**三语同 `id`**，`iconName` 需在 `lib/icons.ts` 白名单） |
| 新增案例 | `cases.items`（**三语同 `slug`**，含 `detail` 与 `cover` 图） |
| 调整首页区块顺序 | `order` 数组 |

改完运行 `npm run validate` + `npm run check:i18n`，提交到 `main` 后合入 `release` 即发布。

## 发布

```bash
git checkout -b release main   # 首次
git push -u origin release     # push 即触发 GitHub Pages 部署
```

仓库需一次性设置：**Settings → Pages → Source = GitHub Actions**。
`main` / `dev` 的 push 不会触发部署，详见 [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) §5。
