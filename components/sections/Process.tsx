import type { SiteConfig } from '@/types/siteConfig';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { IconTile } from '@/components/ui/IconTile';

export interface ProcessProps {
  data: SiteConfig['process'];
}

/** 合作流程：四步时间线 */
export function Process({ data }: ProcessProps) {
  return (
    <section id="process" className="bg-page py-24 text-title" aria-labelledby="process-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="process-title" title={data.title} subtitle={data.subtitle} />

        <ol className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {data.steps.map((step) => (
            <li key={step.step} className="relative rounded-card border border-line bg-band/50 p-8">
              <div className="mb-6 flex items-center justify-between">
                <IconTile name={step.iconName} />
                <span className="text-4xl font-extrabold text-line-strong" aria-hidden="true">
                  {step.step}
                </span>
              </div>
              <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
              <p className="leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
