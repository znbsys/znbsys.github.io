import { cn } from '@/lib/cn';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string;
}

/** 技术栈 / 行业小标签 */
export function Tag({ className, children, ...rest }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-line bg-page/60 px-3 py-1 text-xs font-medium text-soft',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
