import type { Metadata } from 'next';
import { msg } from '@/i18n/t';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { getSiteConfig, getDictionary } from '@/i18n/request';
import { pageMetadata } from '@/lib/seo';
import { resolveSiteHref } from '@/lib/paths';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { IconTile } from '@/components/ui/IconTile';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) return {};
  const config = await getSiteConfig(locale);
  return pageMetadata(locale, {
    path: '/services/',
    title: config.services.title,
    description: config.services.subtitle,
  });
}

export default async function ServicesPage({ params }: Props) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) notFound();

  const config = await getSiteConfig(locale);
  const dict = await getDictionary(locale);
  const pathname = `/${locale}/services/`;

  return (
    <>
      <PageHeader
        locale={locale}
        pathname={pathname}
        eyebrow={config.brand.name}
        title={config.services.title}
        subtitle={config.services.subtitle}
        breadcrumbs={[
          { label: config.navbar.links[0]?.label ?? 'Home', href: '/' },
          { label: config.services.title, href: null },
        ]}
      />

      {/* 服务索引 */}
      <section className="bg-page py-16" aria-labelledby="services-index-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="services-index-title" className="sr-only">
            {config.services.title}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {config.services.items.map((item) => (
              <a
                key={item.id}
                href={`#service-${item.id}`}
                className="group flex items-start gap-4 rounded-card border border-line bg-band/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <IconTile name={item.iconName} size="sm" />
                <span>
                  <span className="block font-semibold text-title">{item.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">
                    {item.summary}
                  </span>
                </span>
                <ArrowRight
                  className="ml-auto mt-1 h-4 w-4 shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 服务详情（锚点直达） */}
      {config.services.items.map((item, index) => (
        <section
          key={item.id}
          id={`service-${item.id}`}
          className={`scroll-mt-20 border-t border-line py-20 text-title ${
            index % 2 === 0 ? 'bg-band' : 'bg-page'
          }`}
          aria-labelledby={`service-${item.id}-title`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <IconTile name={item.iconName} size="lg" />
                <h2
                  id={`service-${item.id}-title`}
                  className="mt-6 text-3xl font-bold tracking-tight"
                >
                  {item.title}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-soft">{item.description}</p>

                <div className="mt-8">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
                    {msg(dict, 'services.scenarios')}
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {item.scenarios.map((scenario) => (
                      <Tag key={scenario}>{scenario}</Tag>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
                    {msg(dict, 'cases.tech')}
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {item.tech.map((tech) => (
                      <Tag key={tech}>{tech}</Tag>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-8">
                <div className="rounded-card border border-line bg-page/60 p-8">
                  <h3 className="mb-4 text-lg font-semibold">{msg(dict, 'services.capabilities')}</h3>
                  <ul className="space-y-3">
                    {item.capabilities.map((capability) => (
                      <li key={capability} className="flex items-start gap-3 text-soft">
                        <CheckCircle2
                          className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                          aria-hidden="true"
                        />
                        <span className="leading-relaxed">{capability}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-card border border-line bg-page/60 p-8">
                  <h3 className="mb-4 text-lg font-semibold">{msg(dict, 'services.deliverables')}</h3>
                  <ul className="space-y-3">
                    {item.deliverables.map((deliverable) => (
                      <li key={deliverable} className="flex items-start gap-3 text-soft">
                        <CheckCircle2
                          className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                          aria-hidden="true"
                        />
                        <span className="leading-relaxed">{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* 结尾 CTA */}
      <section className="border-t border-line bg-page py-20" aria-labelledby="services-cta-title">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionHeading
            id="services-cta-title"
            title={config.cta.title}
            subtitle={config.cta.text}
          />
          <div className="flex flex-wrap justify-center gap-4">
            <Button href={resolveSiteHref('/contact/', locale, pathname)} size="lg">
              {config.cta.primaryCta.text}
            </Button>
            <Button
              href={resolveSiteHref('/cases/', locale, pathname)}
              variant="secondary"
              size="lg"
            >
              {msg(dict, 'common.viewAllCases')}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
