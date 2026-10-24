import type { LegalPage, LegalContent } from '@/schemas/legalContentSchema';

export interface LegalArticleProps {
  content: LegalPage;
  labels: LegalContent['labels'];
}

export function LegalArticle({ content, labels }: LegalArticleProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <header className="mb-10">
        <p className="text-sm text-primary font-medium mb-2">
          {labels.updatedAt}：{content.updatedAt}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-title mb-4">{content.title}</h1>
        <p className="text-base leading-relaxed text-soft">{content.intro}</p>
      </header>

      <nav aria-label={labels.toc} className="mb-10 rounded-xl border border-line bg-surface p-4">
        <p className="text-sm font-semibold text-title mb-2">{labels.toc}</p>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted">
          {content.sections.map((section) => (
            <li key={section.heading}>
              <a
                href={`#${slugify(section.heading)}`}
                className="hover:text-primary transition-colors"
              >
                {section.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="space-y-10">
        {content.sections.map((section) => (
          <section key={section.heading} id={slugify(section.heading)} className="scroll-mt-24">
            <h2 className="text-xl font-semibold text-title mb-3">{section.heading}</h2>
            <div className="space-y-3 text-base leading-relaxed text-soft">
              {section.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {'items' in section && Array.isArray(section.items) && section.items.length > 0 && (
                <ul className="list-disc list-inside space-y-2 pl-1">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}
