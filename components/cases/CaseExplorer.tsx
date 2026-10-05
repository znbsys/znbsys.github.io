'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { CaseItem } from '@/types/siteConfig';
import type { Locale } from '@/i18n/config';
import { cn } from '@/lib/cn';
import { CaseCard } from './CaseCard';
import { EmptyState } from '@/components/ui/EmptyState';

export interface CaseExplorerProps {
  locale: Locale;
  pathname: string;
  cases: CaseItem[];
  industries: string[];
  labels: {
    all: string;
    filterLabel: string;
    empty: string;
    emptyHint: string;
    viewDetail: string;
  };
  homeHref: string;
}

/** 案例列表：按行业客户端筛选，筛选状态同步到 URL query */
export function CaseExplorer({ locale, pathname, cases, industries, labels }: CaseExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get('industry') ?? '';

  const filtered = useMemo(
    () => (active ? cases.filter((c) => c.industry === active) : cases),
    [cases, active],
  );

  function selectIndustry(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('industry', value);
    else params.delete('industry');
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
  }

  return (
    <>
      <div
        role="group"
        aria-label={labels.filterLabel}
        className="mb-10 flex flex-wrap items-center gap-3"
      >
        <FilterChip
          label={labels.all}
          active={!active}
          onClick={() => selectIndustry('')}
        />
        {industries.map((industry) => (
          <FilterChip
            key={industry}
            label={industry}
            active={active === industry}
            onClick={() => selectIndustry(industry)}
          />
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {filtered.length}
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <CaseCard
            key={item.slug}
            item={item}
            locale={locale}
            pathname={pathname}
            actionLabel={labels.viewDetail}
          />
        ))}
        {filtered.length === 0 && (
          <EmptyState title={labels.empty} description={labels.emptyHint} />
        )}
      </div>
    </>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        active
          ? 'border-primary bg-primary text-white'
          : 'border-line bg-surface/40 text-soft hover:border-line-strong hover:text-title',
      )}
    >
      {label}
    </button>
  );
}
