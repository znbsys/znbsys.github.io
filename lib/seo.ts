import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { buildAlternates, buildOgLocale, getSiteConfig } from '@/i18n/request';
import { withBase } from '@/lib/paths';

/** 站点源（协议 + 主机），路径前缀由 NEXT_PUBLIC_BASE_PATH 负责 */
export function siteOrigin(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://znbsys.github.io';
}

export interface PageMetadataOptions {
  /** 页面标题片段；缺省时使用站点默认 title */
  title?: string;
  /** 页面描述；缺省时使用站点默认 description */
  description?: string;
  /** 相对站点根的路径，如 /services/（不带 locale） */
  path: string;
}

/** 统一的页面 Metadata：title/description/canonical/hreflang/OG */
export async function pageMetadata(
  locale: Locale,
  { title, description, path }: PageMetadataOptions,
): Promise<Metadata> {
  const config = await getSiteConfig(locale);
  const origin = siteOrigin();
  const alternates = buildAlternates(locale, path, origin);
  const ogLocale = buildOgLocale(locale);

  const pageTitle = title ? `${title} · ${config.brand.name}` : config.meta.title;
  const pageDescription = description ?? config.meta.description;

  return {
    metadataBase: new URL(origin),
    title: pageTitle,
    description: pageDescription,
    keywords: config.meta.keywords,
    icons: { icon: withBase(config.meta.favicon) },
    alternates,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `${origin}${withBase(`/${locale}${path}`)}`,
      siteName: config.brand.name,
      locale: ogLocale.locale,
      alternateLocale: ogLocale.alternate,
      type: 'website',
      ...(config.meta.ogImage ? { images: [withBase(config.meta.ogImage)] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      ...(config.meta.ogImage ? { images: [withBase(config.meta.ogImage)] } : {}),
    },
  };
}
