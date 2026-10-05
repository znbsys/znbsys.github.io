export interface SectionHeadingProps {
  id: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: 'center' | 'left';
}

export function SectionHeading({ id, title, subtitle, eyebrow, align = 'center' }: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <div className={centered ? 'mx-auto mb-16 max-w-3xl text-center' : 'mb-12 max-w-3xl'}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">{eyebrow}</p>
      )}
      <h2 id={id} className="text-3xl font-bold tracking-tight text-title sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-lg text-muted">{subtitle}</p>}
    </div>
  );
}
