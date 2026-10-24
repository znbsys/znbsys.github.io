import type { Locale } from '@/i18n/config';
import { resolveSiteHref } from '@/lib/paths';

export interface Crumb {
  label: string;
  /** 站内路径（不带 locale），当前页传 null */
  href: string | null;
}

export interface PageHeaderProps {
  locale: Locale;
  /** 当前 pathname，用于链接解析 */
  pathname: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
}

/** 内页通用页头（band 底、面包屑 + 大标题 + 副标题） */
export function PageHeader({
  locale,
  pathname,
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <section className="border-b border-line bg-band pb-16 pt-32 text-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
              {breadcrumbs.map((crumb, i) => (
                <li key={`${crumb.label}-${i}`} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-line-strong">
                      /
                    </span>
                  )}
                  {crumb.href ? (
                    <a
                      href={resolveSiteHref(crumb.href, locale, pathname)}
                      className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span aria-current="page" className="text-soft">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && (
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
            {eyebrow}
          </p>
        )}

        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>

        {subtitle && <p className="mt-5 max-w-3xl text-lg leading-relaxed text-soft">{subtitle}</p>}
      </div>
    </section>
  );
}
