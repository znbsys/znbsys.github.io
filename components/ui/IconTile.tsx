import { DynamicIcon } from '@/components/DynamicIcon';
import { cn } from '@/lib/cn';

export interface IconTileProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: { box: 'h-10 w-10', icon: 'h-5 w-5' },
  md: { box: 'h-12 w-12', icon: 'h-6 w-6' },
  lg: { box: 'h-14 w-14', icon: 'h-7 w-7' },
} as const;

/** 统一的图标磁贴（圆角 + primary/10 底 + accent 图标） */
export function IconTile({ name, size = 'md', className }: IconTileProps) {
  const s = SIZES[size];
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent',
        s.box,
        className,
      )}
    >
      <DynamicIcon name={name} className={s.icon} />
    </div>
  );
}
