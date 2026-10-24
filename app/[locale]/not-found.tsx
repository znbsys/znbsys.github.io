'use client';

import { usePathname } from 'next/navigation';
import { stripLocale } from '@/i18n/config';
import zh from '@/messages/zh-CN.json';
import en from '@/messages/en.json';
import ja from '@/messages/ja.json';
import { t, type Dictionary } from '@/i18n/t';
import { resolveSiteHref, withBase } from '@/lib/paths';

const DICTS: Record<string, Dictionary> = {
  'zh-CN': zh as Dictionary,
  en: en as Dictionary,
  ja: ja as Dictionary,
};

/** 语言内 404：按当前路径推断 locale，回退默认语言 */
export default function LocaleNotFound() {
  const pathname = usePathname() ?? '/';
  const { locale } = stripLocale(pathname);
  const resolved = locale ?? 'zh-CN';
  const dict = DICTS[resolved] ?? (zh as Dictionary);

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 text-ink">
      <div className="w-full max-w-md text-center">
        <p className="text-7xl font-extrabold tracking-tight text-primary">404</p>
        <h1 className="mt-4 text-2xl font-bold text-title">{t(dict, 'notFound.title')}</h1>
        <p className="mt-3 leading-relaxed text-muted">{t(dict, 'notFound.description')}</p>

        <a
          href={resolveSiteHref('/', resolved, pathname)}
          className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {t(dict, 'notFound.backHome')}
        </a>

        <div className="mt-6">
          <a
            href={withBase('/')}
            className="text-sm text-muted transition-colors hover:text-primary"
          >
            {t(dict, 'language.switch')}
          </a>
        </div>
      </div>
    </div>
  );
}
