import type { Metadata } from 'next';
import { msg } from '@/i18n/t';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { getSiteConfig, getDictionary } from '@/i18n/request';
import { pageMetadata } from '@/lib/seo';
import { resolveSiteHref } from '@/lib/paths';
import { getIndustries } from '@/lib/content';
import { PageHeader } from '@/components/ui/PageHeader';
import { CaseExplorer } from '@/components/cases/CaseExplorer';
import { Suspense } from 'react';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) return {};
  const config = await getSiteConfig(locale);
  return pageMetadata(locale, {
    path: '/cases/',
    title: config.cases.title,
    description: config.cases.subtitle,
  });
}

export default async function CasesPage({ params }: Props) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) notFound();

  const config = await getSiteConfig(locale);
  const dict = await getDictionary(locale);
  const industries = await getIndustries(locale);
  const pathname = `/${locale}/cases/`;

  return (
    <>
      <PageHeader
        locale={locale}
        pathname={pathname}
        eyebrow={config.brand.name}
        title={config.cases.title}
        subtitle={config.cases.subtitle}
        breadcrumbs={[
          { label: config.navbar.links[0]?.label ?? 'Home', href: '/' },
          { label: config.cases.title, href: null },
        ]}
      />

      <section className="bg-page py-16" aria-labelledby="cases-grid-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="cases-grid-title" className="sr-only">
            {config.cases.title}
          </h2>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {config.cases.items.map((c) => (
                  <div key={c.slug} className="h-96 animate-pulse rounded-card bg-surface/50" />
                ))}
              </div>
            }
          >
            <CaseExplorer
              locale={locale}
              pathname={pathname}
              cases={config.cases.items}
              industries={industries}
              labels={{
                all: msg(dict, 'cases.filterAll'),
                filterLabel: msg(dict, 'cases.filterLabel'),
                empty: msg(dict, 'cases.empty'),
                emptyHint: msg(dict, 'cases.emptyHint'),
                viewDetail: msg(dict, 'common.viewDetail'),
              }}
              homeHref={resolveSiteHref('/', locale, pathname)}
            />
          </Suspense>
        </div>
      </section>
    </>
  );
}
