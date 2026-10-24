import type { Metadata } from 'next';
import { msg } from '@/i18n/t';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { getSiteConfig, getDictionary } from '@/i18n/request';
import { pageMetadata } from '@/lib/seo';
import { getAllCaseParams, getCase, getRelatedCases } from '@/lib/content';
import { resolveSiteHref, withBase } from '@/lib/paths';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { CaseCard } from '@/components/cases/CaseCard';
import { Building2, Calendar, Target } from 'lucide-react';

type Props = { params: { locale: string; slug: string } };

export function generateStaticParams() {
  return getAllCaseParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) return {};
  const item = await getCase(locale, params.slug);
  if (!item) return {};
  return pageMetadata(locale, {
    path: `/cases/${item.slug}/`,
    title: item.title,
    description: item.summary,
  });
}

export default async function CaseDetailPage({ params }: Props) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) notFound();

  const item = await getCase(locale, params.slug);
  if (!item) notFound();

  const config = await getSiteConfig(locale);
  const dict = await getDictionary(locale);
  const related = await getRelatedCases(locale, item);
  const pathname = `/${locale}/cases/${item.slug}/`;

  const meta = [
    { icon: Building2, label: msg(dict, 'cases.client'), value: item.client },
    { icon: Target, label: msg(dict, 'cases.industry'), value: item.industry },
    { icon: Calendar, label: msg(dict, 'cases.year'), value: item.year },
  ];

  return (
    <>
      <PageHeader
        locale={locale}
        pathname={pathname}
        eyebrow={item.industry}
        title={item.title}
        subtitle={item.detail.overview}
        breadcrumbs={[
          { label: config.navbar.links[0]?.label ?? 'Home', href: '/' },
          { label: config.cases.title, href: '/cases/' },
          { label: item.title, href: null },
        ]}
      />

      <div className="bg-page">
        {/* 封面 */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="overflow-hidden rounded-card border border-line bg-surface">
            <img
              src={withBase(item.cover)}
              alt={item.title}
              width={1280}
              height={720}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        </div>

        {/* 关键信息 */}
        <section className="py-16" aria-labelledby="case-meta-title">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="case-meta-title" className="sr-only">
              {msg(dict, 'cases.client')}
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {meta.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 rounded-card border border-line bg-band/50 p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <div className="text-sm text-muted">{label}</div>
                    <div className="font-semibold">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 量化结果 */}
            <div className="mt-8 grid grid-cols-1 gap-6 rounded-card border border-line bg-band/50 p-8 sm:grid-cols-3">
              {item.results.map((result) => (
                <div key={result.label}>
                  <div className="text-3xl font-bold text-primary">{result.value}</div>
                  <div className="mt-1 text-sm text-muted">{result.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 正文 */}
        <section className="pb-16" aria-labelledby="case-detail-title">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 id="case-detail-title" className="mb-4 text-2xl font-bold text-title">
                  {msg(dict, 'cases.background')}
                </h2>
                <div className="space-y-4 text-base leading-relaxed text-soft">
                  {item.detail.background.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold text-title">{msg(dict, 'cases.approach')}</h2>
                <div className="space-y-4 text-base leading-relaxed text-soft">
                  {item.detail.approach.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-6 text-2xl font-bold text-title">{msg(dict, 'cases.steps')}</h2>
                <ol className="space-y-4">
                  {item.detail.steps.map((step, index) => (
                    <li
                      key={step.title}
                      className="flex gap-4 rounded-card border border-line bg-band/50 p-6"
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary"
                        aria-hidden="true"
                      >
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold text-title">{step.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* 侧栏：技术栈 + CTA */}
            <aside className="space-y-6">
              <div className="rounded-card border border-line bg-band/50 p-6">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
                  {msg(dict, 'cases.tech')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {item.tech.map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>

                <h2 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wider text-muted">
                  {msg(dict, 'cases.services')}
                </h2>
                <ul className="space-y-2 text-sm text-soft">
                  {item.services.map((serviceId) => {
                    const service = config.services.items.find((s) => s.id === serviceId);
                    if (!service) return null;
                    return (
                      <li key={serviceId}>
                        <a
                          href={resolveSiteHref(`/services/#service-${serviceId}`, locale, pathname)}
                          className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                        >
                          {service.title}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="rounded-card border border-primary/30 bg-primary/10 p-6">
                <h2 className="text-lg font-bold text-title">{config.contact.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-soft">{config.contact.subtitle}</p>
                <Button
                  href={resolveSiteHref('/contact/', locale, pathname)}
                  className="mt-4 w-full"
                >
                  {config.navbar.ctaButton?.text ?? config.contact.title}
                </Button>
              </div>
            </aside>
          </div>
        </section>

        {/* 相关案例 */}
        {related.length > 0 && (
          <section className="border-t border-line bg-band py-16" aria-labelledby="related-title">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading id="related-title" title={msg(dict, 'cases.related')} />
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {related.map((rel) => (
                  <CaseCard
                    key={rel.slug}
                    item={rel}
                    locale={locale}
                    pathname={pathname}
                    actionLabel={msg(dict, 'common.viewDetail')}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
