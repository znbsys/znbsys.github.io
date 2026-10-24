import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, localeMeta, type Locale } from '@/i18n/config';
import { getSiteConfig, getDictionary } from '@/i18n/request';
import { pageMetadata } from '@/lib/seo';
import { themeToCssVars } from '@/lib/theme';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ThemeColorApplicator } from '@/components/ThemeColorApplicator';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) return {};
  return pageMetadata(locale, { path: '/' });
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) {
    notFound();
  }

  const meta = localeMeta[locale];
  const config = await getSiteConfig(locale);
  const dict = await getDictionary(locale);
  const cssVars = themeToCssVars(config.theme);

  return (
    <html
      lang={meta.htmlLang}
      dir={meta.dir}
      className={meta.fontStack === 'cjk' ? 'font-cjk' : 'font-latin'}
    >
      <body
        className="min-h-screen bg-page font-sans text-ink antialiased selection:bg-primary selection:text-white"
        style={cssVars as React.CSSProperties}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <ThemeColorApplicator />
        <Navbar brand={config.brand} data={config.navbar} dict={dict} locale={locale} />
        <main id="main">{children}</main>
        <Footer
          brand={config.brand}
          data={config.footer}
          dict={dict}
          locale={locale}
        />
      </body>
    </html>
  );
}
