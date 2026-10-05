# znbsys.github.io

**English** | [简体中文](README.zh-CN.md) | [日本語](README.ja.md)

Corporate website for ZNBSYS — a multilingual (简体中文 / English / 日本語) static site showcasing our web development services, deployed on GitHub Pages. **Auto-deploy is triggered only by the `release` branch.**

- Requirements: [docs/PRD.md](docs/PRD.md)
- Tech stack: [docs/TECHSTACK.md](docs/TECHSTACK.md)
- Implementation & release process: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- **Placeholder content to replace before launch**: [docs/CONTENT-REPLACEMENT.md](docs/CONTENT-REPLACEMENT.md)

## Features

- Next.js 14 App Router + TypeScript (strict) + Tailwind CSS, fully static via `output: export`
- Trilingual content centralized in `config/locales/*.json`, guarded in CI by Zod validation + a trilingual consistency check
- Dark slate visual system with semantic design tokens (CSS variables); swappable primary color and light/dark modes
- Multi-page structure: Home / Services / Case list + Case detail / About / Contact / Privacy / Terms / 404
- SEO: self-referencing canonical + hreflang + Open Graph + `sitemap.xml` / `robots.txt`
- Accessibility: semantic landmarks, focus rings, `prefers-reduced-motion`, skip-to-content link

## Quick start

```bash
npm ci            # install dependencies
npm run dev       # http://localhost:3000
```

## Common commands

| Command | Description |
| --- | --- |
| `npm run dev` | Local development |
| `npm run lint` / `npm run typecheck` / `npm run test` | Quality gates |
| `npm run validate -- 'config/locales/*.json' 'config/legal/*.json'` | Content schema validation |
| `npm run check:i18n` | Trilingual structure / slug / key parity |
| `npm run export` | Static export to `out/` (same as `STATIC_EXPORT=1 npm run build`) |
| `npm run format` | Prettier formatting |
| `npm run test:e2e` | Playwright smoke tests (requires `npx playwright install`) |

## Directory overview

```
app/                  routes and pages ([locale] = language segment, statically generated in 3 languages)
components/           layout (Navbar/Footer), homepage sections, case cards, UI primitives
config/locales/       trilingual site content (services, cases, about, contact...)
config/legal/         trilingual privacy policy and terms of service
messages/             trilingual UI strings (keys must stay aligned)
schemas/              Zod schemas (content contract)
lib/ i18n/            link resolution, theme tokens, locale configuration
scripts/              validate-config / check-i18n-parity
.github/workflows/    pages.yml (deploy triggered by the release branch)
```

## Editing content (no code changes)

| Task | Where |
| --- | --- |
| Change company name / contact info / primary color | `brand` / `contact` / `theme` in `config/locales/*.json` |
| Add a service | `services.items` (**same `id` in all 3 languages**, `iconName` must be in the `lib/icons.ts` whitelist) |
| Add a case study | `cases.items` (**same `slug` in all 3 languages**, with `detail` and `cover` image) |
| Reorder homepage sections | the `order` array |

After editing, run `npm run validate` + `npm run check:i18n`, merge into `main`, then into `release` to publish.

## Release

```bash
git checkout -b release main   # first time
git push -u origin release     # pushing triggers the GitHub Pages deploy
```

One-time repository setup: **Settings → Pages → Source = GitHub Actions**.
Pushes to `main` / `dev` do not deploy — see [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) §5.
