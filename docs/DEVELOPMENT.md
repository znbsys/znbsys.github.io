# 开发实现文档 — ZNBSYS 公司官网

| 项 | 内容 |
| --- | --- |
| 文档版本 | v1.0 |
| 关联文档 | [PRD.md](./PRD.md)、[TECHSTACK.md](./TECHSTACK.md) |
| 基线参考 | `/Users/znb/workspace/Front-end/web-ui-desing`（可直接拷贝脚手架文件后改造） |

本文档是**施工图**：分支策略、任务拆解（T1–T22）、CI 工作流、验收与运维操作。

---

## 1. 分支与发布策略

| 分支 | 职责 | 触发部署 |
| --- | --- | --- |
| `dev` | 日常开发、集成，随时可构建通过 | 否 |
| `main` | 稳定版、评审通过后合入 | 否 |
| `release` | **唯一发布分支**，从 `main` 合入 | **是（push 即部署）** |

流程：

```
dev ──(PR/merge)──> main ──(合入或快进)──> release ──push──> GitHub Actions ──> GitHub Pages
```

规则：

1. 禁止直接向 `release` 提交代码，只允许 `main → release` 合并（保证发布内容可追溯）。
2. 回滚 = `git revert` 后再合入 `release`，或在 Actions 手动重跑上一次成功构建（`workflow_dispatch`）。
3. 当前仓库已有 `dev`、`main`，`release` 需新建：`git branch release main && git push -u origin release`。

---

## 2. 实施阶段与任务清单

> 状态标记：`[ ]` 未开始 / `[x]` 完成。每个任务含「产出文件」与「验收」。

### M1 基建（脚手架 + 设计系统 + i18n 骨架）

- [ ] **T1 脚手架与双模式构建**
  - 产出：`package.json`、`next.config.mjs`、`tsconfig.json`、`.eslintrc.json`、`.prettierrc`、`postcss.config.js`、`vitest.config.ts`、`.gitignore`
  - 动作：初始化 Next 14 + TS + Tailwind；实现 `STATIC_EXPORT=1` 切换；`NEXT_PUBLIC_BASE_PATH` 注入。
  - 验收：`npm run dev` 可访问；`STATIC_EXPORT=1 npm run build` 产出 `out/`（✅ 已通过）。不引入 `middleware.ts`（导出模式不生效），根路径跳转用 `app/page.tsx` 客户端组件 —— 结论已回写 TECHSTACK §2。
- [ ] **T2 设计令牌与全局样式**
  - 产出：`app/globals.css`（CSS 变量 + CJK 行高 + `prefers-reduced-motion` + `scroll-padding-top`）、`tailwind.config.ts`（语义色/圆角/字体/`fade-up` 动画）
  - 验收：`bg-page`、`text-muted`、`rounded-card` 等类在 purge 后存在（写一条单测断言生成的 CSS 含 `.bg-page`）。
- [ ] **T3 主题系统**
  - 产出：`lib/color.ts`、`lib/palette.ts`、`lib/theme.ts`、`lib/themePresets.ts`、`components/ThemeColorApplicator.tsx`、`components/admin/ThemeColorSwitcher.tsx`（如保留管理面板）
  - 验收：切换主色/明暗后全站变量更新且刷新不闪烁（localStorage key：`znbsys.theme-primary` / `znbsys.theme-mode`）。
- [ ] **T4 i18n 骨架**
  - 产出：`i18n/config.ts`、`i18n/t.ts`、`i18n/request.ts`、`messages/{zh-CN,en,ja}.json`、`app/page.tsx`（客户端语言跳转）、`app/[locale]/layout.tsx`（`generateStaticParams` + 元数据 + hreflang）
  - 验收：访问 `/` 落到 `/{locale}/`；三语下 `lang` 属性正确；切换语言保留路径。
- [ ] **T5 布局组件**
  - 产出：`components/layout/Navbar.tsx`、`MobileMenu.tsx`、`Footer.tsx`、`LanguageSwitcher.tsx`、`DynamicIcon.tsx` + `lib/icons.ts`（白名单 ≥ 30 个）
  - 验收：滚动磨砂导航、汉堡菜单 ESC/焦点管理、页脚多列链接、返回顶部；`aria-expanded/controls` 齐全。
- [ ] **T6 UI 基元**
  - 产出：`components/ui/{Button,Card,SectionHeading,Badge,Tag,Stat,IconTile,EmptyState}.tsx`、`lib/cn.ts`
  - 验收：视觉与 TECHSTACK §4 一致；`focus-visible` 焦点环。
- [ ] **T7 配置与校验脚本**
  - 产出：`schemas/siteConfigSchema.ts`、`types/siteConfig.ts`、`config/locales/*.json`（骨架）、`scripts/validate-config.ts`、`scripts/check-i18n-parity.mjs`
  - 验收：`npm run validate`、`npm run check:i18n` 对故意破坏的配置报错。

### M2 页面（全路由）

- [ ] **T8 首页**：`components/sections/{Hero,Services,FeaturedCases,Process,Testimonials,CtaBand}.tsx` + `app/[locale]/page.tsx`（按 `config.order` 渲染区块）
- [ ] **T9 服务页**：`app/[locale]/services/page.tsx`，列表 + `id="service-{id}"` 锚点详情（能力/交付物/场景/技术栈），首页服务卡 `href=/services/#service-{id}`
- [ ] **T10 案例列表**：`app/[locale]/cases/page.tsx`，卡片网格 + 客户端行业/服务筛选（无后端）
- [ ] **T11 案例详情**：`app/[locale]/cases/[slug]/page.tsx` + `generateStaticParams`（slug 来自配置）+ `generateMetadata`；章节：背景/方案/实施/技术栈/成果/相关案例
- [ ] **T12 关于页**：`app/[locale]/about/page.tsx`（简介、stats、里程碑时间线、价值观）
- [ ] **T13 联系页**：`app/[locale]/contact/page.tsx`（表单组装 `mailto:`、联系方式磁贴、FAQ `<details>`）
- [ ] **T14 法务页**：`app/[locale]/{privacy,terms}/page.tsx` + `components/legal/LegalArticle.tsx` + `config/legal/*.json`
- [ ] **T15 404**：`app/not-found.tsx`、`app/[locale]/not-found.tsx`

### M3 内容（三语占位）

- [ ] **T16 内容填充**：`config/locales/{zh-CN,en,ja}.json` 写入
  - 服务 6 条：企业官网与营销站 / Web 应用 / 后台管理系统 / 电商与小程序 / H5 与跨端 / 运维与技术支持
  - 案例 6 篇（含 `detail` 长文与 2–4 个量化结果）：制造企业官网改版、SaaS 控制台、跨境电商、教育平台、内部中台、数据看板
  - 关于/评价/联系/页脚三语齐全
- [ ] **T17 内容一致性**：`check:i18n` 全绿；占位图片放 `public/covers/*.svg`

### M4 质量（SEO / a11y / 性能 / 测试）

- [ ] **T18 SEO**：`app/sitemap.ts`、`app/robots.ts`、favicon、OG 占位图、结构化数据（Organization / Breadcrumb / Article）、全页 `hreflang` + canonical
- [ ] **T19 测试**：`tests/unit`（tokens 存在、`t()` 插值、slug 生成、locale href 解析，vitest）；`tests/e2e`（Playwright 冒烟：三语首页、案例详情、404 + 语言切换，`playwright.config.ts`）。E2E 本地 `npm run test:e2e`，**不进 CI**（CI 只跑 unit，避免浏览器下载拖慢 Pages 部署）；axe a11y 扫描未纳入（后续可加 `@axe-core/playwright`）。
- [ ] **T20 性能与无障碍自查**：Lighthouse 移动端 P≥90 / A≥95；375px 无横向溢出

### M5 部署

- [ ] **T21 CI 工作流**：`.github/workflows/pages.yml`（见 §5）+ 新建 `release` 分支
- [ ] **T22 文档与 README**：`README.md` 写入快速开始、命令、目录、发布流程；`docs/` 三份文档链接

**预估工作量**：T1–T7 约 1.5 天，T8–T15 约 3 天，T16–T17 约 1 天，T18–T20 约 1 天，T21–T22 约 0.5 天（单人）。

---

## 3. 关键实现要点

### 3.1 locale 布局（`app/[locale]/layout.tsx`）

```tsx
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }): Promise<Metadata> {
  // title/description 取 config/locales/{locale}.json 的 meta
  // alternates: { canonical, languages: { 'zh-CN': …, en: …, ja: …, 'x-default': … } }
}

export default function LocaleLayout({ children, params }) {
  const cfg = getSiteConfig(params.locale);        // 服务端读配置 + Zod
  const cssVars = themeToCssVars(cfg.theme);       // 主色/明暗 → CSS 变量
  return (
    <html lang={localeMeta[params.locale].htmlLang}>
      <body className={fontClass} style={cssVars}>
        <ThemeColorApplicator />
        <Navbar config={cfg} locale={params.locale} />
        <main id="main">{children}</main>
        <Footer config={cfg} locale={params.locale} />
      </body>
    </html>
  );
}
```

### 3.2 案例详情静态生成

```tsx
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getCases(locale).map((c) => ({ locale, slug: c.slug })),
  );
}
// 未命中 slug → not-found（导出为 404.html / [locale] 下的 not-found）
```

### 3.3 链接解析（`lib/paths.ts`）

统一 `resolveSiteHref(locale, href)`：

- 输入相对路由 `/cases/xxx` 或锚点 `#features`
- 输出带 `NEXT_PUBLIC_BASE_PATH` 前缀、目标 locale 前缀的 href
- 所有导航/卡片/页脚一律经它输出，禁止手写字符串拼接

### 3.4 联系表单（mailto）

```ts
const body = [name, email, company, budget, message]
  .map((v, i) => `${label[i]}: ${v}`).join('\n');
location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
```

- 表单为受控组件，客户端校验必填项；提交前展示「将打开邮件客户端」提示。
- 二期可替换为 Formspree / 自建函数，仅改 `ContactForm` 内部实现。

### 3.5 案例筛选（纯客户端）

`cases/page.tsx` 为 client 组件（或内嵌 client 子组件）：`useState industry/service` → 过滤配置数组 → `EmptyState` 兜底；筛选状态同步到 URL query（`useSearchParams` + `router.replace`，导出模式下需 `Suspense` 包裹）。

---

## 4. 本地开发流程

```bash
npm ci
npm run dev                 # http://localhost:3000

# 提交前必跑
npm run validate -- 'config/locales/*.json' 'config/legal/*.json'
npm run check:i18n
npm run lint && npm run typecheck && npm run test

# 本地验证静态产物
STATIC_EXPORT=1 npm run build
npx serve out                # 或 python3 -m http.server -d out
```

提交约定：`type(scope): summary`（`feat(pages): add case detail page`、`fix(i18n): ja nav parity`）。

---

## 5. CI/CD：`.github/workflows/pages.yml`

```yaml
name: Deploy to GitHub Pages

# 只有 release 分支的 push 触发部署；main / dev 不触发。
# 仓库须在 Settings → Pages 将 Source 设为 GitHub Actions。
on:
  push:
    branches: [release]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: github-pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Quality gates
        run: |
          npm run validate -- 'config/locales/*.json' 'config/legal/*.json'
          npm run check:i18n
          npm run lint
          npm run typecheck
          npm run test

      - name: Determine basePath and site origin
        run: |
          REPO="${{ github.event.repository.name }}"
          OWNER="${{ github.repository_owner }}"
          # NEXT_PUBLIC_SITE_URL 只放源（协议+主机），路径前缀由 NEXT_PUBLIC_BASE_PATH 负责
          echo "NEXT_PUBLIC_SITE_URL=https://${OWNER}.github.io" >> "$GITHUB_ENV"
          if [[ "$REPO" == *.github.io ]]; then
            echo "NEXT_PUBLIC_BASE_PATH=" >> "$GITHUB_ENV"
          else
            echo "NEXT_PUBLIC_BASE_PATH=/${REPO}" >> "$GITHUB_ENV"
          fi

      - name: Build static export
        env:
          STATIC_EXPORT: '1'
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

要点：

- **触发面收窄到 `release`**：`main`/`dev` push 不会进入本工作流。
- 质量门禁在 `build` job 内，失败则不会产生 artifact，线上保持上一版本。
- 首次启用需：Settings → Pages → Build and deployment → Source = **GitHub Actions**；并确认 `main`/`release` 与默认分支关系不影响 Pages（Actions 模式不读分支内容，只消费 artifact）。

---

## 6. 上线步骤（一次性）

1. 完成 T1–T22，本地门禁全绿。
2. 推送代码到 `origin/dev` → 合入 `main`。
3. 新建并推送 `release`：
   ```bash
   git checkout -b release main
   git push -u origin release
   ```
4. GitHub 仓库 Settings → Pages → Source 选 **GitHub Actions**。
5. 观察 Actions `Deploy to GitHub Pages` 运行结果，访问 `https://znbsys.github.io/`。
6. 验证：根路径语言跳转、三语切换、案例详情、404、`/sitemap.xml`、`/robots.txt`。

后续发布：`main` 合入 `release` → push → 自动部署。

---

## 7. 运维操作手册（配置变更，不改代码）

| 需求 | 改动位置 |
| --- | --- |
| 换公司名/Slogan/联系方式 | `config/locales/*.json` → `brand` / `contact`（三语各一份） |
| 换品牌主色 | 同上 `theme.primary`（或 UI 主题面板） |
| 新增一条服务 | `services.items` 追加（**三语同 `id`**，`iconName` 需在白名单）→ 跑 `check:i18n` |
| 新增一个案例 | `cases.items` 追加（**三语同 `slug`**，含 `detail`）→ `public/covers/` 放封面 → 跑 `validate` + `check:i18n` |
| 调整首页区块顺序 | `order` 数组 |
| 修改导航/页脚链接 | `navbar.links` / `footer.linkGroups` |
| 新增一种语言 | `i18n/config.ts` 加 locale → 复制 `config/locales/xx.json`、`messages/xx.json`、`config/legal/xx.json` → `generateStaticParams` 自动覆盖 → 跑 `check:i18n` |
| 加图标 | `lib/icons.ts` 白名单 + `DynamicIcon` 已按名解析 |

改完内容后提交到 `main` 并合入 `release` 即发布。

---

## 8. 验收清单（对应 PRD §8）

- [ ] `npm run validate` / `check:i18n` / `lint` / `typecheck` / `test` 全绿
- [ ] `STATIC_EXPORT=1 npm run build` 成功，`out/` 含三语全路由 + `404.html` + `sitemap.xml` + `robots.txt`
- [ ] 仅 `release` push 触发部署；`main`/`dev` push 不触发（Actions 页面确认）
- [ ] 三语切换保持当前页面语义；根路径自动跳转
- [ ] 375px / 768px / 1440px 无横向溢出；移动菜单可用
- [ ] Lighthouse P ≥ 90、A ≥ 95；键盘可遍历、焦点环可见
- [ ] 案例筛选、联系表单 mailto、404 返回路径可用
- [ ] README 与 docs 三份文档与实现一致

---

## 9. 风险与对策

| 风险 | 等级 | 对策 |
| --- | --- | --- |
| `middleware.ts` 与静态导出冲突 | 中 | 已解决：不引入 `middleware.ts`，根路径跳转由 `app/page.tsx` 客户端组件完成（见 TECHSTACK §2 结论） |
| 三语内容工作量被低估 | 中 | 内容先行于 M2 结构定稿；`check:i18n` 早接入 CI |
| Pages 首次部署 404/权限错误 | 低 | §6 步骤 3–5 明确 Source=Actions 与 `pages: write` 权限 |
| 案例详情页视觉过载导致性能下降 | 低 | 封面用 SVG 占位、懒加载；详情正文纯文本/标签 |
| 占位内容误上线 | 中 | 占位内容集中在配置，替换清单见 [CONTENT-REPLACEMENT.md](./CONTENT-REPLACEMENT.md)；上线前 `grep -rnE "example\.com|0000-0000" config/` 自查 |
