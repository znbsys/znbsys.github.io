import defaultDict from '@/messages/zh-CN.json';
import { t, type Dictionary } from '@/i18n/t';
import { withBase } from '@/lib/paths';

const dict = defaultDict as Dictionary;

const LANGUAGES = [
  { label: '简体中文', path: '/zh-CN/' },
  { label: 'English', path: '/en/' },
  { label: '日本語', path: '/ja/' },
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 text-ink">
      <div className="w-full max-w-md text-center">
        <p className="text-7xl font-extrabold tracking-tight text-primary">404</p>
        <h1 className="mt-4 text-2xl font-bold text-title">{t(dict, 'notFound.title')}</h1>
        <p className="mt-3 leading-relaxed text-muted">{t(dict, 'notFound.description')}</p>

        <a
          href={withBase('/zh-CN/')}
          className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-band"
        >
          {t(dict, 'notFound.backHome')}
        </a>

        <nav aria-label="Language" className="mt-8 flex justify-center gap-4 text-sm text-muted">
          {LANGUAGES.map((lang) => (
            <a
              key={lang.path}
              href={withBase(lang.path)}
              className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              {lang.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
