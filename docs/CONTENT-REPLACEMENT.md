# 待替换内容清单（上线前必读）

站点当前使用**占位内容**：示例联系方式、虚构客户与数据、通用品牌信息。对外发布前，按下表逐项替换。
改完一律执行质量门禁（见文末），三语必须同时改。

约定：三份内容文件 `config/locales/zh-CN.json` / `en.json` / `ja.json` 结构完全相同；
法务文件 `config/legal/{zh-CN,en,ja}.json` 亦然。**同一处改动要在三份里各改一次**。

---

## 1. 必改 —— 暴露即错误的信息（P0）

| 信息 | 当前占位值 | 文件与字段 | 备注 |
| --- | --- | --- | --- |
| 联系电话 | `+81 000-0000-0000` | `config/locales/*.json` → `contact.phone` | 仍是占位（号码本体待替换，国家码已为日本 +81） |
| 社交链接 | `github.com/znbsys`、`x.com/znbsys` | `config/locales/*.json` → `contact.socials[].href` | 没有的平台直接删掉该项 |
| 站点域名 | `https://znbsys.github.io` | ① `lib/seo.ts` 的 `siteOrigin()` 兜底值 ② CI 环境变量 `NEXT_PUBLIC_SITE_URL`（`pages.yml` 按仓库自动生成，通常不用动） | 换域名/自定义域时改 ① 并确认 ② |
| 根页 metadata | `title: 'ZNBSYS'`、`description: ''` | `app/layout.tsx` | 仅影响 `/`（立即跳转）与 404，建议补齐 |
| 版权行 | `© 2026 ZNBSYS. 保留所有权利。` | `config/locales/*.json` → `footer.copyright` | 三语各一份 |

**已替换（无需再动）**：

| 信息 | 当前值 | 位置 |
| --- | --- | --- |
| 联系邮箱 | `znbsys@outlook.com` | `config/locales/*.json` → `contact.email` + `contact.socials`（email 项 `mailto:`） |
| 公司地址 | `大阪市天王寺区玉造元町` | `config/locales/*.json` → `contact.address`（en：`Tamatsukuri Motomachi, Tennoji-ku, Osaka, Japan`） |
| 法务联系邮箱 | `znbsys@outlook.com` | `config/legal/*.json` → `privacy` 最后一段正文 |

## 2. 品牌与视觉（P0）

| 信息 | 当前占位值 | 文件与字段 |
| --- | --- | --- |
| 公司/品牌名 | `ZNBSYS` | `config/locales/*.json` → `brand.name`；同时检查 `meta.title`、`footer.copyright`、`about.description` 中的明文 |
| Logo | 玩具 SVG（播放三角形） | `brand.logoSvg`（内联 SVG 字符串），或配置 `brand.logoSvg` 为空改用文字标 |
| 一句话定位 | `全栈 Web 开发与数字化解决方案` | `brand.tagline`、`footer.description` |
| SEO 标题/描述/关键词 | 含 `ZNBSYS` 的示例文案 | `config/locales/*.json` → `meta.title`、`meta.description`、`meta.keywords` |
| Favicon | 通用占位 | 替换 `public/favicon.svg`（`meta.favicon` 引用它） |
| OG 分享图 | 通用占位 | 替换 `public/og.svg`（`meta.ogImage` 引用它） |
| 主色 | `#2563eb`（蓝） | `config/locales/*.json` → `theme.primary` / `theme.secondary`；也可上线后在 `/admin/` 切换（存 `localStorage`，不落库） |

## 3. 案例（P0 —— 目前全部为虚构）

6 个案例的客户名、行业、年份、量化结果均为示例，**对外展示前必须换成真实项目或明确标注为示意**。

- 文件：`config/locales/*.json` → `cases.items[]`
- 客户名占位：`恒达智造`、`云策科技`、`蓝湾生活`、`启程学堂`、`瑞成集团`、`星野零售`（en/ja 为音译）
- slug：`manufacturing-website-rebuild`、`saas-console`、`cross-border-store`、`edtech-learning-platform`、`ops-portal`、`analytics-dashboard`
- 每条必改：`title` / `summary` / `client` / `industry` / `year` / `results[].value`（如 `+180%`、`1.4s`）/ `detail.*`（背景、方案、四步实施）
- 封面图：`cover` 指向 `public/covers/*.svg`（占位渐变图，见 §5）
- `featured` 控制首页精选位，`services` 填服务 `id`（必须存在于 `services.items`）

> ⚠️ 换 `slug` 会影响 URL（`/{locale}/cases/{slug}/`）与 `sitemap.xml`；旧链接需要重定向，但纯 GitHub Pages 无法做 301，请尽量保留旧 slug。

## 4. 服务、数据与评价（P0/P1）

| 内容 | 位置 | 说明 |
| --- | --- | --- |
| 6 条服务线 | `services.items[]`（三语同 `id`） | `title/summary/description/capabilities/deliverables/scenarios/tech` 均为示例文案；`iconName` 必须在 `lib/icons.ts` 白名单内 |
| 服务锚点引用 | `footer.linkGroups[]` 里 4 条 `/services/#service-<id>` | **改 `id` 时三语 footer 同步改**，否则锚点 404 |
| 关于页数据 | `about.stats[]` | `120+`、`98%`、`<2h`、`20+` 为占位数字 |
| 关于页简介/里程碑 | `about.description`、`about.milestones[]` | 2019→2025 里程碑为虚构 |
| 客户评价 | `testimonials.items[]` | 副标题已自带『占位评价内容』字样，上线前替换为真实反馈或删除该区块（`order` 数组去掉 `testimonials`） |
| 合作流程 | `process.steps[]` | 文案可按实际流程调整 |
| FAQ | `contact.faq[]` | 周期/计费等承诺性回答需与实际一致 |
| 首页文案 | `hero.*`、`cta.*`、`services.title`、`cases.title` 等 | 无硬错误，可按品牌语调润色 |

## 5. 静态资产（P1）

| 文件 | 用途 |
| --- | --- |
| `public/favicon.svg` | 浏览器标签页图标 |
| `public/og.svg` | 社交分享图（建议改 1200×630 PNG/JPG，`meta.ogImage` 换路径） |
| `public/covers/case-*.svg`（6 个） | 案例封面，建议替换为真实项目截图（4:3 或 16:9，压缩后放回同路径或改 `cover` 字段） |

## 6. 法务文案（P1）

- `config/legal/*.json`：`privacy` 与 `terms` 为通用模板，`updatedAt` 当前为 `2026-10-05`，发布前按实际修改日期更新。
- 涉及主体名称、注册地、第三方统计工具（当前写明『不使用第三方追踪脚本』——如接入统计需同步修改）。

## 7. 一般不用改

| 位置 | 说明 |
| --- | --- |
| `messages/*.json` | UI 短文案（按钮、标签、表单提示），需要改交互文案时才动，**键必须三语对齐** |
| `lib/icons.ts` | lucide 图标白名单，新增图标才加 |
| `tests/**` | 不依赖具体业务内容（slug 用通用值、案例链接取第一个），改内容不会弄挂测试 |
| `docs/**` | 项目文档，非站点内容 |

---

## 改动后的校验（必须全绿）

```bash
npm run validate -- 'config/locales/*.json' 'config/legal/*.json'  # schema + 必填
npm run check:i18n                                                  # 三语键/slug/id 对齐、无 TODO/空串
npm run lint && npm run typecheck && npm run test                   # 静态检查与单测
STATIC_EXPORT=1 npm run export && npx serve out                     # 本地预览静态产物
```

`check:i18n` 会拦截：三语键路径不一致、`services.id` / `cases.slug` 三语不匹配、残留 `TODO`/`FIXME`/`undefined`、空字符串。
