import { cn } from '@/lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'accent' | 'primary' | 'muted';
}

const VARIANTS: Record<NonNullable<BadgeProps['variant']>, string> = {
  accent: 'border border-accent/20 bg-accent/10 text-accent',
  primary: 'border border-primary/20 bg-primary/10 text-primary',
  muted: 'border border-line bg-surface text-muted',
};

export function Badge({ variant = 'accent', className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        VARIANTS[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
