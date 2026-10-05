import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { getSiteConfig, getDictionary } from '@/i18n/request';
import { getFeaturedCases } from '@/lib/content';
import { DEFAULT_SECTION_ORDER, type SectionKey, type SiteConfig } from '@/types/siteConfig';
import { Hero } from '@/components/sections/Hero';
import { ServicesPreview } from '@/components/sections/ServicesPreview';
import { FeaturedCases } from '@/components/sections/FeaturedCases';
import { Process } from '@/components/sections/Process';
import { Testimonials } from '@/components/sections/Testimonials';
import { CtaBand } from '@/components/sections/CtaBand';

type Props = { params: { locale: string } };

export default async function HomePage({ params }: Props) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) {
    notFound();
  }

  const config = await getSiteConfig(locale);
  const dict = await getDictionary(locale);
  const featuredCases = await getFeaturedCases(locale);
  const sectionOrder = config.order ?? DEFAULT_SECTION_ORDER;

  const SECTION_MAP: Record<SectionKey, React.ReactNode> = {
    hero: <Hero data={config.hero} theme={config.theme} locale={locale} />,
    services: <ServicesPreview data={config.services} locale={locale} dict={dict} />,
    featuredCases: <FeaturedCases cases={featuredCases} locale={locale} dict={dict} />,
    process: <Process data={config.process} />,
    testimonials: config.testimonials ? (
      <Testimonials data={config.testimonials} dict={dict} />
    ) : null,
    cta: <CtaBand data={config.cta} locale={locale} />,
  };

  return (
    <div className="min-h-screen bg-page text-ink selection:bg-primary selection:text-white">
      {sectionOrder.map((key) => (
        <div key={key}>{SECTION_MAP[key]}</div>
      ))}
    </div>
  );
}
