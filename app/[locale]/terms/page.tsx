import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { getLegalContent, getLegalPage } from '@/i18n/request';
import { pageMetadata } from '@/lib/seo';
import { LegalArticle } from '@/components/legal/LegalArticle';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) return {};
  const page = await getLegalPage(locale, 'terms');
  return pageMetadata(locale, {
    path: '/terms/',
    title: page.title,
    description: page.description,
  });
}

export default async function TermsPage({ params }: Props) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) notFound();

  const legal = await getLegalContent(locale);
  return <LegalArticle content={legal.terms} labels={legal.labels} />;
}
