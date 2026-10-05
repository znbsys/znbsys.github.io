/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { configDefaults } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    // Playwright 用例由 npm run test:e2e 单独执行
    exclude: [...configDefaults.exclude, 'tests/e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['lib/**', 'i18n/**', 'components/**', 'app/**'],
    },
  },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
});
