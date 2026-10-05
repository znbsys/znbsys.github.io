import { z } from 'zod';
import { ICON_WHITELIST } from '@/lib/icons';

const iconRefine = (value: string) =>
  ICON_WHITELIST.includes(value as (typeof ICON_WHITELIST)[number]);

const IconNameSchema = z.string().refine(iconRefine, {
  message: 'iconName 不在 Lucide 图标白名单内（见 lib/icons.ts）',
});

const CtaSchema = z.object({
  text: z.string().min(1),
  href: z.string().min(1),
  target: z.enum(['_self', '_blank']).optional(),
});

const NavItemSchema = z.object({ label: z.string().min(1), href: z.string().min(1) });

const ServiceItemSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, '服务 id 只能包含小写字母、数字与连字符'),
  iconName: IconNameSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  capabilities: z.array(z.string().min(1)).min(1),
  deliverables: z.array(z.string().min(1)).min(1),
  scenarios: z.array(z.string().min(1)).min(1),
  tech: z.array(z.string().min(1)).min(1),
});

const CaseItemSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, '案例 slug 只能包含小写字母、数字与连字符'),
  title: z.string().min(1),
  summary: z.string().min(1),
  client: z.string().min(1),
  industry: z.string().min(1),
  year: z.string().min(1),
  services: z.array(z.string().min(1)).min(1),
  tech: z.array(z.string().min(1)).min(1),
  results: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })).min(1),
  cover: z.string().min(1),
  featured: z.boolean().optional(),
  detail: z.object({
    overview: z.string().min(1),
    background: z.array(z.string().min(1)).min(1),
    approach: z.array(z.string().min(1)).min(1),
    steps: z.array(z.object({ title: z.string().min(1), text: z.string().min(1) })).min(1),
  }),
});

const SECTION_KEYS = ['hero', 'services', 'featuredCases', 'process', 'testimonials', 'cta'] as const;

export const SiteConfigSchema = z.object({
  meta: z.object({
    title: z.string().min(1).max(120),
    description: z.string().min(1).max(320),
    keywords: z.array(z.string()).default([]),
    favicon: z.string().min(1),
    ogImage: z.string().optional(),
    locale: z.string().default('zh-CN'),
  }),
  theme: z.object({
    primary: z
      .string()
      .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'primary 必须是十六进制颜色'),
    secondary: z
      .string()
      .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
      .optional(),
    radius: z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl']).default('xl'),
    font: z.enum(['sans', 'serif', 'mono']).default('sans'),
    background: z.enum(['gradient', 'solid', 'grid']).default('gradient'),
  }),
  brand: z.object({
    name: z.string().min(1),
    logoUrl: z.string().optional(),
    logoSvg: z.string().optional(),
    tagline: z.string().min(1),
  }),
  navbar: z.object({
    links: z.array(NavItemSchema).min(1),
    ctaButton: CtaSchema.optional(),
    sticky: z.boolean().default(true),
  }),
  hero: z.object({
    badge: z.string().optional(),
    headline: z.string().min(1),
    subheadline: z.string().min(1),
    primaryCta: CtaSchema,
    secondaryCta: CtaSchema.optional(),
    backgroundImage: z.string().optional(),
  }),
  services: z.object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
    columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
    items: z.array(ServiceItemSchema).min(1),
  }),
  cases: z.object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
    items: z.array(CaseItemSchema).min(1),
  }),
  process: z.object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
    steps: z
      .array(
        z.object({
          step: z.string().min(1),
          iconName: IconNameSchema,
          title: z.string().min(1),
          text: z.string().min(1),
        }),
      )
      .min(1),
  }),
  testimonials: z
    .object({
      title: z.string().min(1),
      subtitle: z.string().optional(),
      items: z
        .array(
          z.object({
            quote: z.string().min(1),
            author: z.string().min(1),
            role: z.string().min(1),
            company: z.string().min(1),
            avatarUrl: z.string().optional(),
            rating: z
              .union([
                z.literal(1),
                z.literal(2),
                z.literal(3),
                z.literal(4),
                z.literal(5),
              ])
              .optional(),
          }),
        )
        .min(1),
    })
    .optional(),
  about: z.object({
    title: z.string().min(1),
    description: z.array(z.string().min(1)).min(1),
    imageUrl: z.string().optional(),
    stats: z.array(z.object({ label: z.string().min(1), value: z.string().min(1), suffix: z.string().optional() })).min(1),
    milestones: z
      .array(z.object({ year: z.string().min(1), title: z.string().min(1), text: z.string().min(1) }))
      .min(1),
    values: z
      .array(z.object({ iconName: IconNameSchema, title: z.string().min(1), text: z.string().min(1) }))
      .min(1),
  }),
  contact: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    address: z.string().optional(),
    socials: z
      .array(
        z.object({
          platform: z.enum([
            'github',
            'x',
            'wechat',
            'linkedin',
            'email',
            'website',
            'zhihu',
            'bilibili',
          ]),
          label: z.string().min(1),
          href: z.string().min(1),
        }),
      )
      .default([]),
    faq: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })).default([]),
  }),
  cta: z.object({
    title: z.string().min(1),
    text: z.string().min(1),
    primaryCta: CtaSchema,
    secondaryCta: CtaSchema.optional(),
  }),
  footer: z.object({
    description: z.string().optional(),
    copyright: z.string().min(1),
    links: z.array(NavItemSchema).optional(),
    linkGroups: z
      .array(z.object({ title: z.string().min(1), links: z.array(NavItemSchema).min(1) }))
      .optional(),
  }),
  order: z.array(z.enum([...SECTION_KEYS])).optional(),
});

export type SiteConfigInput = z.input<typeof SiteConfigSchema>;
