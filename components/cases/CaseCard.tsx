import type { CaseItem } from '@/types/siteConfig';
import type { Locale } from '@/i18n/config';
import { resolveSiteHref, withBase } from '@/lib/paths';
import { Badge } from '@/components/ui/Badge';
import { Tag } from '@/components/ui/Tag';
import { ArrowUpRight } from 'lucide-react';

export interface CaseCardProps {
  item: CaseItem;
  locale: Locale;
  pathname: string;
  /** 卡片下方动作文案（如 "查看详情"） */
  actionLabel: string;
}

/** 成功案例卡片：封面 + 行业徽标 + 标题摘要 + 首个量化结果 */
export function CaseCard({ item, locale, pathname, actionLabel }: CaseCardProps) {
  return (
    <a
      href={resolveSiteHref(`/cases/${item.slug}/`, locale, pathname)}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-band/50 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted">
          <span>{item.client}</span>
          <span aria-hidden="true">·</span>
          <span>{item.year}</span>
        </div>

        <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{item.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {item.tech.slice(0, 4).map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>

        {item.results[0] && (
          <div className="mt-auto flex items-baseline gap-2 pt-5">
            <span className="text-2xl font-bold text-primary">{item.results[0].value}</span>
            <span className="text-xs text-muted">{item.results[0].label}</span>
          </div>
        )}

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
          {actionLabel}
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </a>
  );
}
