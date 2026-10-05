import type { SiteConfig } from '@/types/siteConfig';
import type { Locale } from '@/i18n/config';
import { resolveSiteHref } from '@/lib/paths';
import { Button } from '@/components/ui/Button';

export interface CtaBandProps {
  data: SiteConfig['cta'];
  locale: Locale;
}

/** 首页结尾 CTA：引导至联系页 / 案例页 */
export function CtaBand({ data, locale }: CtaBandProps) {
  const home = `/${locale}/`;
  return (
    <section id="cta" className="bg-band py-24 text-title" aria-labelledby="cta-title">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 id="cta-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <p className="mt-4 text-lg text-muted">{data.text}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button
            href={resolveSiteHref(data.primaryCta.href, locale, home)}
            target={data.primaryCta.target}
            size="lg"
          >
            {data.primaryCta.text}
          </Button>
          {data.secondaryCta && (
            <Button
              href={resolveSiteHref(data.secondaryCta.href, locale, home)}
              target={data.secondaryCta.target}
              variant="secondary"
              size="lg"
            >
              {data.secondaryCta.text}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
