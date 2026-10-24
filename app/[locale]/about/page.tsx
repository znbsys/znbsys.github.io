import type { Metadata } from 'next';
import { msg } from '@/i18n/t';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { getSiteConfig, getDictionary } from '@/i18n/request';
import { pageMetadata } from '@/lib/seo';
import { resolveSiteHref } from '@/lib/paths';
import { PageHeader } from '@/components/ui/PageHeader';
import { IconTile } from '@/components/ui/IconTile';
import { Button } from '@/components/ui/Button';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) return {};
  const config = await getSiteConfig(locale);
  return pageMetadata(locale, {
    path: '/about/',
    title: config.about.title,
    description: config.about.description[0],
  });
}

export default async function AboutPage({ params }: Props) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) notFound();

  const config = await getSiteConfig(locale);
  const dict = await getDictionary(locale);
  const about = config.about;
  const pathname = `/${locale}/about/`;

  return (
    <>
      <PageHeader
        locale={locale}
        pathname={pathname}
        eyebrow={config.brand.name}
        title={about.title}
        subtitle={config.brand.tagline}
        breadcrumbs={[
          { label: config.navbar.links[0]?.label ?? 'Home', href: '/' },
          { label: about.title, href: null },
        ]}
      />

      {/* 简介 + 数据 */}
      <section className="bg-page py-20" aria-labelledby="about-intro-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 id="about-intro-title" className="text-3xl font-bold tracking-tight text-title">
                {about.title}
              </h2>
              <div className="mt-6 space-y-4">
                {about.description.map((paragraph, index) => (
                  <p key={index} className="text-lg leading-relaxed text-soft">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:gap-8">
              {about.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-card border border-line bg-band/50 p-6 text-center sm:p-8"
                >
                  <div className="text-3xl font-bold text-primary sm:text-4xl">
                    {stat.value}
                    {stat.suffix && <span className="text-2xl">{stat.suffix}</span>}
                  </div>
                  <div className="mt-2 text-sm text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 发展里程碑 */}
      <section className="border-t border-line bg-band py-20" aria-labelledby="milestones-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2
            id="milestones-title"
            className="mb-12 text-3xl font-bold tracking-tight text-title"
          >
            {msg(dict, 'about.milestones')}
          </h2>
          <ol className="space-y-6">
            {about.milestones.map((milestone) => (
              <li
                key={milestone.year + milestone.title}
                className="grid grid-cols-1 gap-4 rounded-card border border-line bg-page/60 p-6 sm:grid-cols-[8rem_1fr] sm:gap-8"
              >
                <div className="text-2xl font-bold text-primary">{milestone.year}</div>
                <div>
                  <h3 className="text-lg font-semibold text-title">{milestone.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{milestone.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 价值观 */}
      <section className="border-t border-line bg-page py-20" aria-labelledby="values-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="values-title" className="mb-12 text-3xl font-bold tracking-tight text-title">
            {msg(dict, 'about.values')}
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {about.values.map((value) => (
              <div
                key={value.title}
                className="rounded-card border border-line bg-band/50 p-8 transition-all duration-300 hover:border-line-strong"
              >
                <IconTile name={value.iconName} />
                <h3 className="mb-3 mt-6 text-xl font-semibold text-title">{value.title}</h3>
                <p className="leading-relaxed text-muted">{value.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button href={resolveSiteHref('/contact/', locale, pathname)} size="lg">
              {config.cta.primaryCta.text}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
