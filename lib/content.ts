import 'server-only';

import type { Locale } from '@/i18n/config';
import { defaultLocale, locales } from '@/i18n/config';
import { getSiteConfig } from '@/i18n/request';
import type { CaseItem, ServiceItem } from '@/types/siteConfig';

/** 全部案例（按配置顺序） */
export async function getCases(locale: Locale): Promise<CaseItem[]> {
  const config = await getSiteConfig(locale);
  return config.cases.items;
}

/** 首页精选案例（featured 标记，不足时回退前 3 个） */
export async function getFeaturedCases(locale: Locale): Promise<CaseItem[]> {
  const cases = await getCases(locale);
  const featured = cases.filter((c) => c.featured);
  return featured.length > 0 ? featured : cases.slice(0, 3);
}

/** 按 slug 取案例 */
export async function getCase(locale: Locale, slug: string): Promise<CaseItem | undefined> {
  const cases = await getCases(locale);
  return cases.find((c) => c.slug === slug);
}

/** 全部案例 slug × 全部 locale，供 cases/[slug]/generateStaticParams 使用 */
export async function getAllCaseParams(): Promise<{ locale: string; slug: string }[]> {
  const slugs = (await getCases(defaultLocale)).map((c) => c.slug);
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

/** 全部服务 */
export async function getServices(locale: Locale): Promise<ServiceItem[]> {
  const config = await getSiteConfig(locale);
  return config.services.items;
}

/** 按 id 取服务 */
export async function getService(locale: Locale, id: string): Promise<ServiceItem | undefined> {
  const services = await getServices(locale);
  return services.find((s) => s.id === id);
}

/** 相关案例：同行业或共享服务线，最多 3 个，去重自身 */
export async function getRelatedCases(locale: Locale, current: CaseItem): Promise<CaseItem[]> {
  const cases = await getCases(locale);
  const score = (c: CaseItem) =>
    (c.industry === current.industry ? 2 : 0) +
    c.services.filter((s) => current.services.includes(s)).length;
  return cases
    .filter((c) => c.slug !== current.slug)
    .map((c) => ({ c, s: score(c) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)
    .map((x) => x.c);
}

/** 案例列表可筛选的行业标签（保持出现顺序、去重） */
export async function getIndustries(locale: Locale): Promise<string[]> {
  const cases = await getCases(locale);
  return [...new Set(cases.map((c) => c.industry))];
}
