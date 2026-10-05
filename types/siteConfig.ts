/** 主题配置：驱动全站配色与圆角 */
export interface ThemeConfig {
  /** 主色调，十六进制，如 "#2563eb" */
  primary: string;
  /** 次要色（渐变终点），可选 */
  secondary?: string;
  /** 卡片圆角档位 */
  radius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** 正文排版风格 */
  font: 'sans' | 'serif' | 'mono';
  /** Hero 背景形态 */
  background: 'gradient' | 'solid' | 'grid';
}

export interface MetaConfig {
  title: string;
  description: string;
  keywords: string[];
  favicon: string;
  ogImage?: string;
  locale: string;
}

export interface BrandConfig {
  name: string;
  /** 图片 Logo 地址，与 logoSvg 二选一 */
  logoUrl?: string;
  /** 内联 SVG Logo（纯字符串，便于无外链部署） */
  logoSvg?: string;
  tagline: string;
}

export interface NavItem {
  label: string;
  /** 站内路由（不带 locale，如 /services/）或锚点（#hero）或外链 */
  href: string;
}

export interface CtaButton {
  text: string;
  href: string;
  target?: '_self' | '_blank';
}

export type SocialPlatform =
  | 'github'
  | 'x'
  | 'wechat'
  | 'linkedin'
  | 'email'
  | 'website'
  | 'zhihu'
  | 'bilibili';

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

export interface NavbarConfig {
  links: NavItem[];
  ctaButton?: CtaButton;
  /** 是否吸顶，默认 true */
  sticky?: boolean;
}

export interface HeroConfig {
  badge?: string;
  headline: string;
  subheadline: string;
  primaryCta: CtaButton;
  secondaryCta?: CtaButton;
  backgroundImage?: string;
}

/** 一条服务线：服务页的列表项与锚点详情共用 */
export interface ServiceItem {
  /** 稳定 id，用于锚点 #service-{id}，三语必须一致 */
  id: string;
  /** 必须是 lib/icons.ts 白名单内的 Lucide 图标名 */
  iconName: string;
  title: string;
  summary: string;
  description: string;
  /** 能力点 */
  capabilities: string[];
  /** 交付物 */
  deliverables: string[];
  /** 适用场景 */
  scenarios: string[];
  /** 常用技术栈标签 */
  tech: string[];
}

export interface ServicesConfig {
  title: string;
  subtitle: string;
  /** 首页概览卡片区栅格列数，默认 3 */
  columns?: 2 | 3 | 4;
  items: ServiceItem[];
}

/** 一个成功案例（列表卡 + 详情页共用） */
export interface CaseItem {
  /** 稳定 slug，三语必须一致，用于 /cases/{slug}/ */
  slug: string;
  title: string;
  summary: string;
  /** 客户/项目方（占位名） */
  client: string;
  industry: string;
  year: string;
  /** 关联的服务 id（services.items[].id） */
  services: string[];
  /** 技术栈标签 */
  tech: string[];
  /** 量化结果，卡片与详情共用 */
  results: { label: string; value: string }[];
  /** 封面图路径（public 下） */
  cover: string;
  /** 是否进入首页精选 */
  featured?: boolean;
  detail: {
    /** 一句话概述，详情页导语 */
    overview: string;
    /** 项目背景段落 */
    background: string[];
    /** 解决方案段落 */
    approach: string[];
    /** 实施步骤 */
    steps: { title: string; text: string }[];
  };
}

export interface CasesConfig {
  title: string;
  subtitle: string;
  items: CaseItem[];
}

export interface ProcessConfig {
  title: string;
  subtitle: string;
  steps: { step: string; iconName: string; title: string; text: string }[];
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarUrl?: string;
  /** 1–5 星，可选 */
  rating?: 1 | 2 | 3 | 4 | 5;
}

export interface TestimonialsConfig {
  title: string;
  subtitle?: string;
  items: TestimonialItem[];
}

export interface StatItem {
  label: string;
  value: string;
  suffix?: string;
}

export interface AboutConfig {
  title: string;
  description: string[];
  imageUrl?: string;
  stats: StatItem[];
  milestones: { year: string; title: string; text: string }[];
  values: { iconName: string; title: string; text: string }[];
}

export interface ContactConfig {
  title: string;
  subtitle?: string;
  email: string;
  phone?: string;
  address?: string;
  socials: SocialLink[];
  faq: { q: string; a: string }[];
}

export interface CtaConfig {
  title: string;
  text: string;
  primaryCta: CtaButton;
  secondaryCta?: CtaButton;
}

export interface FooterLinkGroup {
  title: string;
  links: NavItem[];
}

export interface FooterConfig {
  description?: string;
  copyright: string;
  /** 简单模式：平铺链接 */
  links?: NavItem[];
  /** 分组模式：与 links 二选一，优先使用 */
  linkGroups?: FooterLinkGroup[];
}

/** 站点根契约 */
export interface SiteConfig {
  meta: MetaConfig;
  theme: ThemeConfig;
  brand: BrandConfig;
  navbar: NavbarConfig;
  hero: HeroConfig;
  services: ServicesConfig;
  cases: CasesConfig;
  process: ProcessConfig;
  testimonials?: TestimonialsConfig;
  about: AboutConfig;
  contact: ContactConfig;
  cta: CtaConfig;
  footer: FooterConfig;
  /** 首页 Section 渲染顺序；缺省时使用默认顺序 */
  order?: SectionKey[];
}

export type SectionKey = 'hero' | 'services' | 'featuredCases' | 'process' | 'testimonials' | 'cta';

/** 默认 Section 顺序，用于 order 缺省时的兜底 */
export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  'hero',
  'services',
  'featuredCases',
  'process',
  'testimonials',
  'cta',
];
