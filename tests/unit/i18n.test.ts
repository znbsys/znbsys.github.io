import { describe, expect, it } from 'vitest';
import { canonicalLocale, localeMeta, locales, localizedPath, matchLocale, stripLocale } from '@/i18n/config';

describe('locale 配置', () => {
  it('包含三语且默认语言为 zh-CN', () => {
    expect(locales).toEqual(['zh-CN', 'en', 'ja']);
  });

  it('每个 locale 都有完整的元信息', () => {
    for (const locale of locales) {
      const meta = localeMeta[locale];
      expect(meta.htmlLang).toBeTruthy();
      expect(meta.ogLocale).toBeTruthy();
      expect(meta.fontStack === 'cjk' || meta.fontStack === 'latin').toBe(true);
    }
  });
});

describe('语言协商', () => {
  it('大小写不敏感地规范化 locale', () => {
    expect(canonicalLocale('zh-cn')).toBe('zh-CN');
    expect(canonicalLocale('EN')).toBe('en');
    expect(canonicalLocale('fr')).toBeNull();
  });

  it('按 q 值选择最匹配的语言', () => {
    expect(matchLocale('ja-JP,ja;q=0.9,en;q=0.8')).toBe('ja');
    expect(matchLocale('en-US,en;q=0.9')).toBe('en');
    expect(matchLocale('fr-FR')).toBeNull();
  });
});

describe('路径处理', () => {
  it('localizedPath 追加 locale 前缀', () => {
    expect(localizedPath('en', '/cases/')).toBe('/en/cases/');
    expect(localizedPath('ja')).toBe('/ja/');
  });

  it('stripLocale 拆分 locale 与路径', () => {
    expect(stripLocale('/zh-CN/services/')).toEqual({ locale: 'zh-CN', path: '/services/' });
    expect(stripLocale('/unknown')).toEqual({ locale: null, path: '/unknown' });
  });
});
