# 技术栈文档 — ZNBSYS 公司官网

| 项 | 内容 |
| --- | --- |
| 文档版本 | v1.0 |
| 关联文档 | [PRD.md](./PRD.md)、[DEVELOPMENT.md](./DEVELOPMENT.md) |
| 参考实现 | `/Users/znb/workspace/Front-end/web-ui-desing`（视觉与工程基线） |

---

## 1. 技术选型总览

| 层 | 选型 | 版本 | 作用 |
| --- | --- | --- | --- |
| 运行时 | Node.js | 20 LTS | 本地与 CI 统一 |
| 框架 | Next.js (App Router) | ^14.2.5 | 路由、SSG、元数据 |
| UI | React | ^18.3.1 | 组件化 |
| 样式 | Tailwind CSS | ^3.4.6 | 工具类 + 语义化令牌 |
| 图标 | lucide-react | ^0.400.0 | 统一线性图标（白名单） |
| 校验 | Zod | ^3.23.8 | 站点内容配置的 schema 校验 |
| 语言 | TypeScript | ^5.4.5（strict） | 类型安全 |
| 单测 | Vitest + Testing Library + jsdom | ^1.6.0 | 组件/工具函数测试 |
| E2E | Playwright（可选） | ^1.44.0 | 关键路径回归 |
| 格式/Lint | Prettier + ESLint(`next/core-web-vitals`) | ^3.3.2 / ^8.57.0 | 代码规范 |
| 托管 | GitHub Pages（Actions 部署） | — | 免费静态托管 |

**不引入**：状态管理库、CSS-in-JS、UI 组件库（shadcn/MUI 等）、动画库（framer-motion/GSAP）、`next/font` 网络字体。动效仅用 Tailwind `transition` + 少量 keyframes。

**选型理由**：与参考项目完全一致，最大化复用其设计系统与工程脚手架；纯静态输出契合 GitHub Pages（无服务器、无冷启动、零运维）；Zod + 脚本保证三语内容不漂移。

---

## 2. 输出模式与静态导出约束（关键）

`next.config.mjs` 双模式：

```js
const isStaticExport = process.env.STATIC_EXPORT === '1';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const nextConfig = {
  ...(isStaticExport
    ? { output: 'export', trailingSlash: true, images: { unoptimized: true } }
    : { output: 'standalone' }),
  basePath,
};
```

- **CI 部署**：`STATIC_EXPORT=1 npm run build` → 产物在 `out/` → 上传 Pages artifact。
- **本地开发**：`npm run dev`（默认 standalone 模式，不设 `STATIC_EXPORT`）。

**静态导出下的硬约束（开发必须遵守）**：

| 约束 | 应对 |
| --- | --- |
| 无 API 路由 / Route Handler 服务端能力 / Server Actions | 联系表单走 `mailto:`；无数据获取需求（内容为本地配置） |
| 无 ISR / 动态 `cookies()` / `headers()` 读取（服务端） | 全部 `generateStaticParams` + `generateMetadata` 静态生成 |
| `next/image` 优化不可用 | `images.unoptimized: true`；图片带 `width/height`，`loading="lazy"` |
| 语言协商中间件不生效 | 根路径 `/` 用客户端组件跳转（Cookie → `navigator.language` → 默认语）；`/zh-CN/` 等由 `generateStaticParams` 静态产出 |
| 动态路由必须可枚举 | 案例详情 `cases/[slug]` 通过 `generateStaticParams()` 从配置生成全部 slug |
| 404 | 导出 `out/404.html`（Next 自动），配合 `trailingSlash` |

> **T1 结论（已回写）**：不引入 `middleware.ts`（静态导出下不生效，且与 `output: export` 存在构建期冲突风险）。根路径 `/` 由 `app/page.tsx` 客户端组件跳转（Cookie → `navigator.language` → 默认语），locale 间切换由 `components/LanguageSwitcher` 基于 `resolveSiteHref` 计算链接完成。另验证：`app/layout.tsx` 与 `app/[locale]/layout.tsx` 各输出一个 `<html>`（后者带 `lang/dir/class`），HTML5 解析会将后者的属性合并到 `documentElement`（已用 jsdom 解析产物确认 `lang="zh-CN" dir="ltr" class="font-cjk"` 正确落地），与参考项目一致。

---

## 3. 目录结构

```
znbsys.github.io/
├── app/
│   ├── layout.tsx                 # 根壳（引入 globals.css）
│   ├── page.tsx                   # 客户端语言跳转
│   ├── globals.css                # CSS 变量令牌 + 基础样式
│   ├── not-found.tsx              # 全局 404
│   ├── sitemap.ts                 # 静态 sitemap（三语）
│   ├── robots.ts                  # robots.txt
│   └── [locale]/
│       ├── layout.tsx             # html/body、主题变量、Navbar/Footer、generateStaticParams
│       ├── page.tsx               # 首页（区块可配置排序）
│       ├── not-found.tsx          # 三语 404
│       ├── services/page.tsx      # 服务 + 锚点详情
│       ├── cases/
│       │   ├── page.tsx           # 案例列表（客户端筛选）
│       │   └── [slug]/page.tsx    # 案例详情（generateStaticParams）
│       ├── about/page.tsx
│       ├── contact/page.tsx
│       ├── privacy/page.tsx
│       └── terms/page.tsx
├── components/
│   ├── DynamicIcon.tsx            # 图标名 → lucide 组件（白名单）
│   ├── LanguageSwitcher.tsx       # 语言切换（保路径）
│   ├── ThemeColorApplicator.tsx   # hydration 后应用 localStorage 主题
│   ├── layout/{Navbar,MobileMenu,Footer}.tsx
│   ├── legal/LegalArticle.tsx
│   ├── ui/{Button,Card,SectionHeading,Badge,Tag,Stat,IconTile,EmptyState}.tsx
│   └── sections/                  # 首页区块
│       ├── Hero.tsx  Services.tsx  FeaturedCases.tsx
│       ├── Process.tsx  Testimonials.tsx  CtaBand.tsx
├── config/
│   ├── locales/{zh-CN,en,ja}.json  # 全站内容（三语，Zod 校验）
│   └── legal/{zh-CN,en,ja}.json    # 法务文案
├── messages/{zh-CN,en,ja}.json     # UI 短字符串（nav/footer/404…）
├── schemas/siteConfigSchema.ts     # Zod schema（含图标白名单、slug 约束）
├── i18n/{config.ts,t.ts,request.ts}
├── lib/{cn,icons,paths,palette,theme,themePresets,color,content}.ts
├── types/siteConfig.ts
├── scripts/{validate-config.ts,check-i18n-parity.mjs}
├── public/                         # favicon、og 占位图、案例封面占位
├── .github/workflows/pages.yml     # 仅 release 分支触发
├── docs/{PRD,TECHSTACK,DEVELOPMENT}.md
├── next.config.mjs  tailwind.config.ts  postcss.config.js
├── tsconfig.json  .eslintrc.json  .prettierrc  vitest.config.ts
└── package.json
```

路径别名：`@/* → ./*`（`tsconfig.json`，`moduleResolution: "bundler"`）。

---

## 4. 设计系统（令牌）

### 4.1 颜色：CSS 变量 → Tailwind 语义类

`app/globals.css` 的 `:root` 默认值（深色基线，与参考项目一致）：

```css
--color-primary: 37 99 235;       /* #2563EB 品牌蓝 */
--color-secondary: 124 58 237;    /* #7C3AED 渐变副色 */
--color-page: 2 6 23;             /* slate-950 页面底 */
--color-band: 15 23 42;           /* slate-900 交替分区 */
--color-surface: 30 41 59;        /* slate-800 卡片底 */
--color-line: 30 41 59;           /* 描边 */
--color-line-strong: 51 65 85;
--color-panel: 255 255 255;       /* 磨砂导航/浮层（白） */
--color-panel-line: 226 232 240;
--color-accent: 96 165 250;       /* blue-400 徽标/图标 */
--color-title: 255 255 255;
--color-ink: 241 245 249;
--color-soft: 203 213 225;
--color-muted: 148 163 184;
--radius-card: 1rem;
```

`tailwind.config.ts` 仅做 `theme.extend` 映射：

```ts
colors: {
  primary:  'rgb(var(--color-primary) / <alpha-value>)',
  secondary:'rgb(var(--color-secondary) / <alpha-value>)',
  page: 'rgb(var(--color-page) / <alpha-value>)',
  band: 'rgb(var(--color-band) / <alpha-value>)',
  surface: 'rgb(var(--color-surface) / <alpha-value>)',
  line: 'rgb(var(--color-line) / <alpha-value>)',
  'line-strong': 'rgb(var(--color-line-strong) / <alpha-value>)',
  panel: 'rgb(var(--color-panel) / <alpha-value>)',
  'panel-line': 'rgb(var(--color-panel-line) / <alpha-value>)',
  accent: 'rgb(var(--color-accent) / <alpha-value>)',
  title: 'rgb(var(--color-title) / <alpha-value>)',
  ink: 'rgb(var(--color-ink) / <alpha-value>)',
  soft: 'rgb(var(--color-soft) / <alpha-value>)',
  muted: 'rgb(var(--color-muted) / <alpha-value>)',
}
```

> 代码中**只允许**使用语义类（`bg-band`、`text-muted`…），禁止散落 `bg-slate-900` 等字面色，保证主题可整体切换。

### 4.2 主题模式

- 不使用 `class="dark"`；而是**由「主色 hex + mode(dark|light)」派生整套调色板**（`lib/palette.ts`），写入上述 CSS 变量。
- 主色 12 预设（`lib/themePresets.ts`：默认蓝 `#2563EB`、朱红、橙、琥珀、翠绿、青、天青、靛蓝、紫、品红、玫红、石板）+ 自定义取色器。
- 持久化：`localStorage` 的 `znbsys.theme-primary` / `znbsys.theme-mode`，由 `ThemeColorApplicator` 在 hydration 后应用，避免闪烁。

### 4.3 字体、圆角、动效

- 字体：系统栈，**不下载网络字体**。
  - CJK：`PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans CJK SC`
  - Latin：`Inter, Helvetica Neue, Arial` → Tailwind 类 `font-cjk` / `font-latin`
  - `html[lang^="zh"|"ja"] body { line-height: 1.8; letter-spacing: .01em }`
- 圆角：卡片 `rounded-card`(=1rem)、按钮/输入 `rounded-lg`、图标磁贴 `rounded-xl`、胶囊/头像 `rounded-full`。
- 动效：仅 Tailwind `transition-all duration-300`、卡片 `hover:-translate-y-1`、`fade-up` keyframe（`cubic-bezier(.16,1,.3,1)`）；全局 `prefers-reduced-motion` 降级；`scroll-behavior: smooth` + `scroll-padding-top: 5rem`。

### 4.4 版式与间距节奏

| 元素 | 类 |
| --- | --- |
| 分区 | `py-24`，交替 `bg-page` / `bg-band` |
| 容器 | `max-w-7xl px-4 sm:px-6 lg:px-8` |
| 分区标题 | `max-w-3xl mx-auto mb-16 text-center`，H2 `text-3xl sm:text-4xl font-bold tracking-tight` |
| Hero | `pt-32 pb-20`，标题 `text-4xl sm:text-6xl font-extrabold tracking-tight` |
| 卡片网格 | `grid gap-8 md:grid-cols-2|3|4` |
| 导航 | `h-16` 粘性；滚动后 `bg-panel/80 backdrop-blur-lg border-b border-panel-line/50` |
| 页脚 | `py-12` + 顶边框 |

按钮统一：主按钮 `rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-sm shadow-primary/25 hover:bg-primary/90`，次按钮 `border border-line-strong/60 bg-transparent hover:bg-surface`，全部带 `focus-visible:ring-2 focus-visible:ring-primary`。

---

## 5. 国际化（i18n）架构

### 5.1 分层

| 层 | 位置 | 内容 | 消费方式 |
| --- | --- | --- | --- |
| 路由/元信息 | `i18n/config.ts` | `locales`、`defaultLocale`、`htmlLang`、`ogLocale`、`dir`、字体栈 | 服务端 + 客户端 |
| 站点内容层 | `config/locales/{locale}.json` | meta、brand、nav、hero、services、cases、about、contact、footer、order | 服务端读取 → props |
| UI 字符串层 | `messages/{locale}.json` | `nav.openMenu`、`footer.backToTop`、`notFound.*` 等扁平键 | `t(dict, key, vars)` |
| 法务层 | `config/legal/{locale}.json` | 隐私/条款正文 | `LegalArticle` |

- 缺键行为：dev 抛错、prod 警告并回退默认语（`i18n/t.ts`）。
- UI 字符串以默认语为准做**回退合并**（`i18n/request.ts`，`server-only`）。

### 5.2 路由与语言协商

```
/  →  app/page.tsx（客户端）：cookie NEXT_LOCALE → navigator.language → zh-CN  →  302 到 /{locale}/
/{locale}/...  →  generateStaticParams({ locales }) 全量静态生成
```

- 切换语言：`LanguageSwitcher` 读取当前 pathname，把首段 locale 替换为目标语（保留子路径与 hash），写 `NEXT_LOCALE` cookie（1 年）。
- 静态导出不使用 middleware 做协商（见 §2 约束）。

### 5.3 内容对齐保证

`npm run check:i18n` 校验三语：

1. `config/locales/*.json` 顶层结构与各数组长度一致；
2. `services[].id`、`cases[].slug` 集合完全相同且顺序一致；
3. `messages/*.json` 键集合一致；
4. 导航 `href` 目标路由在三语中均存在。

任一不通过 → CI 失败。

---

## 6. 内容配置与 Schema

`schemas/siteConfigSchema.ts`（Zod）核心结构（节选）：

```ts
SiteConfigSchema = {
  meta: { title, description, keywords[], favicon, ogImage?, locale },
  theme: { primary(#hex), secondary?, radius, font, background(gradient|solid|grid) },
  brand: { name, logoSvg?, tagline },
  navbar: { links[{label, href}], ctaButton?, sticky },
  hero: { badge?, headline, subheadline, primaryCta, secondaryCta?, backgroundImage? },
  services: { title, subtitle, columns(2|3|4), items: [{ id, iconName, title, summary,
              description, capabilities[], deliverables[], scenarios[], tech[] }] },
  cases: { title, subtitle, items: [{ slug, title, summary, client, industry,
            year, services[], tech[], results[{label, value}], cover, featured, detail{...} }] },
  process: { title, steps[{ step, title, description, iconName }] },
  testimonials: { title, items[{ quote, author, role, company, avatarUrl?, rating? }] },
  about: { title, description[], stats[{label, value, suffix?}], milestones[{year, title, text}], values[] },
  contact: { title, subtitle?, email, phone?, address?, socials[{platform, label, href}], faq[] },
  footer: { description, linkGroups[{title, links[{label, href}]}], copyright },
  order: ['hero','services','featuredCases','process','testimonials','cta'],  // 首页区块顺序
}
```

- `iconName` 必须命中 `lib/icons.ts` 的白名单（Lucide 图标名），否则校验失败。
- 校验脚本：`npm run validate -- 'config/locales/*.json' 'config/legal/*.json'`（tsx + Zod，输出逐字段错误）。

---

## 7. 脚本与质量门禁

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 本地开发（standalone 模式） |
| `npm run build` | 静态构建（本地，未设 `STATIC_EXPORT` 时为 standalone） |
| `STATIC_EXPORT=1 npm run build` | 产出 `out/` 静态站 |
| `npm run lint` | ESLint（`next/core-web-vitals`） |
| `npm run typecheck` | `tsc --noEmit`（`strict` + `noUncheckedIndexedAccess`） |
| `npm run test` | Vitest 单测 |
| `npm run validate` | Zod 校验站点/内容/法务配置 |
| `npm run check:i18n` | 三语内容一致性 |
| `npm run format` | Prettier（semi、singleQuote、printWidth 100、trailingComma all） |
| `npm run test:e2e` | Playwright（可选，关键路径） |

**CI 质量门禁顺序**：`validate（locales + legal） → check:i18n → lint → typecheck → test → build`，任一失败即中止部署。

---

## 8. 部署架构

```
push 到 release 分支
   └─> .github/workflows/pages.yml
         ├─ job build: checkout → Node 20(npm cache) → npm ci → 质量门禁
         │        → 计算 NEXT_PUBLIC_SITE_URL / NEXT_PUBLIC_BASE_PATH
         │        → STATIC_EXPORT=1 npm run build → out/
         │        → actions/upload-pages-artifact@v3
         └─ job deploy: actions/deploy-pages@v4（environment: github-pages）
```

- 仓库为 `znbsys.github.io`（用户/组织站）→ `NEXT_PUBLIC_BASE_PATH` 为空、站点源为 `https://znbsys.github.io`；工作流仍按 `*.github.io` 判断动态计算，兼容改名/迁移为项目站。
- `concurrency: group: github-pages, cancel-in-progress: true` 避免并发部署互相覆盖。
- 权限：`contents: read`、`pages: write`、`id-token: write`。
- 一次性人工配置：Settings → Pages → Source = **GitHub Actions**。

详见 [DEVELOPMENT.md](./DEVELOPMENT.md) §5。

---

## 9. 依赖清单与用途

**dependencies**

| 包 | 用途 |
| --- | --- |
| `next` / `react` / `react-dom` | 框架与渲染 |
| `lucide-react` | 图标（经 `DynamicIcon` 白名单使用） |
| `zod` | 内容配置运行时校验 |
| `server-only` | 标记仅服务端模块（内容加载） |

**devDependencies**：`typescript`、`@types/*`、`tailwindcss`、`postcss`、`autoprefixer`、`eslint`+`eslint-config-next`、`prettier`、`vitest`+`@vitejs/plugin-react`+`jsdom`+`@testing-library/*`、`tsx`（跑 TS 校验脚本）、`@playwright/test`+`@axe-core/playwright`（可选 E2E/a11y）。

版本策略：锁定 minor（`^`），升级先在 `dev` 分支跑全量门禁；Next 大版本升级单独评估（静态导出行为变更风险）。

---

## 10. 技术风险与对策

| 风险 | 对策 |
| --- | --- |
| `output: export` 与 `middleware.ts` 冲突 | T1 实施时验证并回写 §2；不行则导出构建时跳过 |
| 三语内容漂移导致某语缺页 | `check:i18n` 进入 CI 门禁 |
| GitHub Pages 缓存导致旧版本 | `trailingSlash` + artifact 整包替换；必要时加 meta refresh 兜底 |
| 案例详情动态路由漏生成 | `generateStaticParams` 由配置派生，缺 slug 构建失败 |
| 字体在 CJK 环境行高不佳 | 全局 `lang` + 行高/字距变量，按语种切换字体栈 |
