import type { SiteConfig } from '@/types/siteConfig';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/t';
import { t } from '@/i18n/t';
import { resolveSiteHref } from '@/lib/paths';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { IconTile } from '@/components/ui/IconTile';
import { ArrowRight } from 'lucide-react';

export interface ServicesPreviewProps {
  data: SiteConfig['services'];
  locale: Locale;
  dict: Dictionary;
}

const GRID_COLS: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
};

/** 首页服务概览：卡片点击进入服务页对应锚点 */
export function ServicesPreview({ data, locale, dict }: ServicesPreviewProps) {
  const cols = data.columns ?? 3;
  const home = `/${locale}/`;

  return (
    <section id="services" className="bg-page py-24 text-title" aria-labelledby="services-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="services-title" title={data.title} subtitle={data.subtitle} />

        <div className={`grid grid-cols-1 gap-8 ${GRID_COLS[cols]}`}>
          {data.items.map((item) => (
            <a
              key={item.id}
              href={resolveSiteHref(`/services/#service-${item.id}`, locale, home)}
              className="group rounded-card border border-line bg-band/50 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <IconTile name={item.iconName} />
              <h3 className="mb-3 mt-6 text-xl font-semibold">{item.title}</h3>
              <p className="leading-relaxed text-muted">{item.summary}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                {t(dict, 'common.learnMore')}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
