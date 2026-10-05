import { cn } from '@/lib/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 可点击卡片：加 hover 上浮与焦点环 */
  interactive?: boolean;
}

export function Card({ interactive, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-card border border-line bg-band/50 p-8',
        interactive &&
          'block transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
