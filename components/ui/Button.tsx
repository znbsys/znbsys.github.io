import { cn } from '@/lib/cn';

export interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg';
  target?: '_self' | '_blank';
}

const VARIANTS: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90 border border-transparent',
  secondary:
    'border border-line-strong bg-transparent text-soft hover:bg-surface',
  ghost: 'bg-surface/60 text-title hover:bg-surface border border-line',
};

const SIZES: Record<NonNullable<ButtonProps['size']>, string> = {
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-3.5 text-base',
};

export function Button({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-band',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
