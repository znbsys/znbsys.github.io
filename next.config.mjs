const isStaticExport = process.env.STATIC_EXPORT === '1';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages：静态导出到 out/（工作流用 STATIC_EXPORT=1 构建，见 pages.yml）
  ...(isStaticExport
    ? { output: 'export', trailingSlash: true, images: { unoptimized: true } }
    : { output: 'standalone' }),
  basePath,
};
export default nextConfig;
