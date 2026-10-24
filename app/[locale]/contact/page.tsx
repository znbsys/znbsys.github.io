import type { Metadata } from 'next';
import { msg } from '@/i18n/t';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { getSiteConfig, getDictionary } from '@/i18n/request';
import { pageMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/ui/PageHeader';
import { ContactForm } from '@/components/contact/ContactForm';
import { Mail, Phone, MapPin, Github, Twitter, Globe, ChevronDown } from 'lucide-react';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) return {};
  const config = await getSiteConfig(locale);
  return pageMetadata(locale, {
    path: '/contact/',
    title: config.contact.title,
    description: config.contact.subtitle ?? config.contact.title,
  });
}

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  x: Twitter,
  email: Mail,
  linkedin: Globe,
  wechat: Globe,
  website: Globe,
  zhihu: Globe,
  bilibili: Globe,
};

export default async function ContactPage({ params }: Props) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) notFound();

  const config = await getSiteConfig(locale);
  const dict = await getDictionary(locale);
  const contact = config.contact;
  const pathname = `/${locale}/contact/`;

  const channels = [
    { icon: Mail, label: msg(dict, 'contact.email'), value: contact.email, href: `mailto:${contact.email}` },
    contact.phone && {
      icon: Phone,
      label: msg(dict, 'contact.phone'),
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, '')}`,
    },
    contact.address && {
      icon: MapPin,
      label: msg(dict, 'contact.address'),
      value: contact.address,
      href: null,
    },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href: string | null }[];

  return (
    <>
      <PageHeader
        locale={locale}
        pathname={pathname}
        eyebrow={config.brand.name}
        title={contact.title}
        subtitle={contact.subtitle}
        breadcrumbs={[
          { label: config.navbar.links[0]?.label ?? 'Home', href: '/' },
          { label: contact.title, href: null },
        ]}
      />

      {/* 表单 + 联系方式 */}
      <section className="bg-page py-16" aria-labelledby="contact-form-title">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
            <h2 id="contact-form-title" className="mb-6 text-2xl font-bold text-title">
              {msg(dict, 'contact.form.title')}
            </h2>
            <div className="rounded-card border border-line bg-band/50 p-6 sm:p-8">
              <ContactForm
                contact={{ email: contact.email }}
                labels={{
                  name: msg(dict, 'contact.form.name'),
                  email: msg(dict, 'contact.form.email'),
                  company: msg(dict, 'contact.form.company'),
                  budget: msg(dict, 'contact.form.budget'),
                  message: msg(dict, 'contact.form.message'),
                  submit: msg(dict, 'contact.form.submit'),
                  hint: msg(dict, 'contact.form.hint'),
                  subject: msg(dict, 'contact.form.subject'),
                  required: msg(dict, 'contact.form.required'),
                }}
              />
            </div>
          </div>

          <aside className="space-y-4">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">
              {msg(dict, 'contact.channels')}
            </h2>
            {channels.map((channel) => {
              const inner = (
                <>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <channel.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm text-muted">{channel.label}</span>
                    <span className="block font-medium text-title">{channel.value}</span>
                  </span>
                </>
              );

              return channel.href ? (
                <a
                  key={channel.label}
                  href={channel.href}
                  className="flex items-center gap-4 rounded-card border border-line bg-band/50 p-5 transition hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {inner}
                </a>
              ) : (
                <div key={channel.label} className="flex items-center gap-4 rounded-card border border-line bg-band/50 p-5">
                  {inner}
                </div>
              );
            })}

            {contact.socials.length > 0 && (
              <div className="pt-4">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
                  {msg(dict, 'contact.followUs')}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {contact.socials.map((social) => {
                    const Icon = SOCIAL_ICONS[social.platform] ?? Globe;
                    return (
                      <a
                        key={social.platform}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-line bg-band/50 px-4 py-2 text-sm text-soft transition hover:border-line-strong hover:text-title focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {social.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* FAQ */}
      {contact.faq.length > 0 && (
        <section className="border-t border-line bg-band py-16" aria-labelledby="faq-title">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 id="faq-title" className="mb-8 text-3xl font-bold tracking-tight text-title">
              {msg(dict, 'contact.faq')}
            </h2>
            <div className="space-y-3">
              {contact.faq.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-card border border-line bg-page/60 p-5 open:border-line-strong"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-title focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                    {item.q}
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-muted transition-transform duration-300 group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
