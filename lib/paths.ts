// NEXT_PUBLIC_* 构建期内联，客户端/服务端同源可用
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** 给站内绝对路径加 basePath（GitHub Pages 项目站为 /<repo>，其余为空） */
export function withBase(path: string): string {
  if (!BASE_PATH) return path;
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path;
  if (path === '/') return `${BASE_PATH}/`;
  return `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;
}

/** 去掉 pathname 上的 basePath，便于判断当前是否在首页 */
export function stripBasePath(pathname: string): string {
  if (!BASE_PATH) return pathname;
  if (!pathname.startsWith(BASE_PATH)) return pathname;
  return pathname.slice(BASE_PATH.length) || '/';
}

/** 路径首段是否已是规范 locale（如 /zh-CN/... -> true） */
function hasLocalePrefix(path: string): boolean {
  const seg = path.split('/')[1]?.toLowerCase() ?? '';
  return ['zh-cn', 'en', 'ja'].includes(seg);
}

/** 站内路径规范化：非根路径补尾部斜杠（trailingSlash 导出要求） */
function withTrailingSlash(path: string): string {
  if (path === '/' || path === '') return '/';
  const hashIndex = path.indexOf('#');
  const route = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : '';
  const clean = route.endsWith('/') ? route : `${route}/`;
  return `${clean}${hash}`;
}

/**
 * 导航/卡片/页脚链接解析（配置里一律写不带 locale 的站内路径）：
 * - 纯锚点：在对应 locale 首页原样返回；在子页则回到该 locale 首页锚点
 * - 站内绝对路径：补 locale 前缀 + 尾斜杠 + basePath
 * - 已带 locale 前缀的路径：仅补 basePath（兼容历史写法）
 * - 外链 / 协议相对：原样返回
 */
export function resolveSiteHref(href: string, locale: string, pathname: string): string {
  if (href.startsWith('#')) {
    const current = stripBasePath(pathname);
    const home = `/${locale}`;
    const onHome =
      current === home || current === `${home}/` || current === '/' || current === '';
    return onHome ? href : `${withBase(home)}/#${href.slice(1)}`;
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//')) return href;
  if (href.startsWith('/')) {
    const normalized = withTrailingSlash(href);
    if (hasLocalePrefix(normalized)) return withBase(normalized);
    return withBase(`/${locale}${normalized === '/' ? '/' : normalized}`);
  }
  return href;
}
