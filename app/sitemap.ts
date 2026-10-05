import type { MetadataRoute } from 'next';
import { defaultLocale, localeMeta, locales } from '@/i18n/config';
import { getCases } from '@/lib/content';
import { siteOrigin } from '@/lib/seo';

const ORIGIN = siteOrigin();

/** 固定路径，每种语言各一份 */
const STATIC_PATHS = ['/', '/services/', '/cases/', '/about/', '/contact/', '/privacy/', '/terms/'];

function languageAlternates(path: string): Record<string, string> {
  return Object.fromEntries(
    locales.map((l) => [localeMeta[l].htmlLang, `${ORIGIN}/${l}${path}`]),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const caseSlugs = (await getCases(defaultLocale)).map((c) => c.slug);

  for (const locale of locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${ORIGIN}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '/' ? 'weekly' : 'monthly',
        priority: path === '/' ? 1 : 0.8,
        alternates: { languages: languageAlternates(path) },
      });
    }

    for (const slug of caseSlugs) {
      entries.push({
        url: `${ORIGIN}/${locale}/cases/${slug}/`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: { languages: languageAlternates(`/cases/${slug}/`) },
      });
    }
  }

  return entries;
}
