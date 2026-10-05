import type { CaseItem } from '@/types/siteConfig';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/t';
import { t } from '@/i18n/t';
import { resolveSiteHref, withBase } from '@/lib/paths';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { ArrowUpRight } from 'lucide-react';

export interface FeaturedCasesProps {
  cases: CaseItem[];
  locale: Locale;
  dict: Dictionary;
}

/** 首页精选案例：卡片进入案例详情 */
export function FeaturedCases({ cases, locale, dict }: FeaturedCasesProps) {
  const home = `/${locale}/`;

  return (
    <section
      id="featured-cases"
      className="bg-band py-24 text-title"
      aria-labelledby="featured-cases-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="featured-cases-title"
          title={t(dict, 'featuredCases.title')}
          subtitle={t(dict, 'featuredCases.subtitle')}
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((item) => (
            <a
              key={item.slug}
              href={resolveSiteHref(`/cases/${item.slug}/`, locale, home)}
              className="group overflow-hidden rounded-card border border-line bg-page/60 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-surface">
                <img
                  src={withBase(item.cover)}
                  alt=""
                  width={640}
                  height={360}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3">
                  <Badge variant="muted" className="bg-page/80 backdrop-blur">
                    {item.industry}
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted">
                  <span>{item.client}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.year}</span>
                </div>
                <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                  {item.summary}
                </p>

                {item.results[0] && (
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">{item.results[0].value}</span>
                    <span className="text-xs text-muted">{item.results[0].label}</span>
                  </div>
                )}

                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  {t(dict, 'common.viewDetail')}
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={resolveSiteHref('/cases/', locale, home)}
            className="inline-flex items-center gap-2 rounded-lg border border-line-strong px-6 py-3 font-semibold text-soft transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t(dict, 'common.viewAllCases')}
          </a>
        </div>
      </div>
    </section>
  );
}
