import { describe, expect, it } from 'vitest';
import { resolveSiteHref, withBase, stripBasePath } from '@/lib/paths';

const HOME = '/zh-CN/';
const SUBPAGE = '/zh-CN/cases/some-slug/';

describe('withBase', () => {
  it('BASE_PATH 为空时原样返回', () => {
    expect(withBase('/services/')).toBe('/services/');
    expect(withBase('/')).toBe('/');
  });

  it('外链不加前缀', () => {
    expect(withBase('https://example.com/x')).toBe('https://example.com/x');
  });
});

describe('stripBasePath', () => {
  it('无 basePath 时原样返回', () => {
    expect(stripBasePath('/zh-CN/')).toBe('/zh-CN/');
  });
});

describe('resolveSiteHref', () => {
  it('站内路径补 locale 前缀与尾斜杠', () => {
    expect(resolveSiteHref('/services/', 'zh-CN', HOME)).toBe('/zh-CN/services/');
    expect(resolveSiteHref('/cases/some-slug', 'en', '/en/')).toBe('/en/cases/some-slug/');
    expect(resolveSiteHref('/', 'ja', '/ja/')).toBe('/ja/');
  });

  it('首页锚点：在首页原样返回，从子页回首页', () => {
    expect(resolveSiteHref('#hero', 'zh-CN', HOME)).toBe('#hero');
    expect(resolveSiteHref('#hero', 'zh-CN', SUBPAGE)).toBe('/zh-CN/#hero');
  });

  it('子路径锚点跨页保留', () => {
    expect(resolveSiteHref('/services/#service-web-app', 'zh-CN', SUBPAGE)).toBe(
      '/zh-CN/services/#service-web-app',
    );
  });

  it('外链与协议相对链接原样返回', () => {
    expect(resolveSiteHref('https://github.com/znbsys', 'en', '/en/')).toBe(
      'https://github.com/znbsys',
    );
    expect(resolveSiteHref('//cdn.example.com/a.js', 'en', '/en/')).toBe(
      '//cdn.example.com/a.js',
    );
  });

  it('已带 locale 前缀的路径不重复拼接', () => {
    expect(resolveSiteHref('/zh-CN/privacy/', 'zh-CN', HOME)).toBe('/zh-CN/privacy/');
  });
});
