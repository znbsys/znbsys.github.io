import type { SiteConfig } from '@/types/siteConfig';
import type { Locale } from '@/i18n/config';
import { resolveSiteHref } from '@/lib/paths';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

export interface HeroProps {
  data: SiteConfig['hero'];
  theme: SiteConfig['theme'];
  locale: Locale;
}

const BG_CLASSES: Record<SiteConfig['theme']['background'], string> = {
  gradient:
    'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/25 via-band to-band',
  solid: 'bg-band',
  grid: 'bg-band bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:4rem_4rem]',
};

export function Hero({ data, theme, locale }: HeroProps) {
  const home = `/${locale}/`;
  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-32 pb-20 text-title"
      aria-labelledby="hero-headline"
    >
      <div className={cn('absolute inset-0', BG_CLASSES[theme.background])} />

      {data.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-band/70" />
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {data.badge && (
          <span className="mb-8 inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            {data.badge}
          </span>
        )}

        <h1
          id="hero-headline"
          className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl"
        >
          {data.headline}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-xl text-soft">{data.subheadline}</p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
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
