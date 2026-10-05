import { Search } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description?: string;
}

/** 列表筛选无结果时的空状态 */
export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="col-span-full rounded-card border border-dashed border-line bg-band/40 p-12 text-center">
      <Search className="mx-auto mb-4 h-8 w-8 text-muted" aria-hidden="true" />
      <p className="text-lg font-semibold text-title">{title}</p>
      {description && <p className="mt-2 text-sm text-muted">{description}</p>}
    </div>
  );
}
