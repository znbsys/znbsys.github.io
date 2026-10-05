import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { t } from '@/i18n/t';

const root = resolve(__dirname, '../..');
const globals = readFileSync(resolve(root, 'app/globals.css'), 'utf8');
const tailwind = readFileSync(resolve(root, 'tailwind.config.ts'), 'utf8');

describe('设计令牌', () => {
  it('globals.css 定义了全部语义颜色变量', () => {
    const tokens = [
      '--color-primary',
      '--color-secondary',
      '--color-page',
      '--color-band',
      '--color-surface',
      '--color-line',
      '--color-line-strong',
      '--color-panel',
      '--color-panel-line',
      '--color-accent',
      '--color-title',
      '--color-ink',
      '--color-soft',
      '--color-muted',
      '--radius-card',
    ];
    for (const token of tokens) {
      expect(globals).toContain(`${token}:`);
    }
  });

  it('Tailwind 语义类映射到 CSS 变量（purge 后仍存在）', () => {
    const classes = ['primary', 'page', 'band', 'surface', 'line', 'title', 'ink', 'soft', 'muted'];
    for (const cls of classes) {
      expect(tailwind).toContain(`${cls}: 'rgb(var(--color-${cls}`);
    }
    expect(tailwind).toContain("'line-strong'");
    expect(tailwind).toContain("'panel-line'");
    expect(tailwind).toContain("card: 'var(--radius-card)'");
  });

  it('全局样式包含锚点偏移与无障碍降级', () => {
    expect(globals).toContain('scroll-padding-top: 5rem');
    expect(globals).toContain('prefers-reduced-motion');
  });
});

describe('t() 文案插值', () => {
  it('替换 {var} 占位', () => {
    expect(t({ 'a.b': '当前语言：{label}' }, 'a.b', { label: 'English' })).toBe(
      '当前语言：English',
    );
  });

  it('缺少变量时保留占位符', () => {
    expect(t({ 'a.b': 'hello {name}' }, 'a.b')).toBe('hello {name}');
  });
});
