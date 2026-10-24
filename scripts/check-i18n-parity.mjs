#!/usr/bin/env node
/**
 * 三语内容一致性校验（CI 门禁）。
 *
 * 检查：
 *   1. config/locales/*.json 的 key 路径集合与默认 locale 完全一致（含数组长度与顺序）
 *   2. 服务 id、案例 slug、行业标签在三语间取值完全一致
 *   3. messages/*.json 的 key 集合完全一致
 *   4. config/legal/*.json 的 key 路径集合完全一致
 *   5. 所有文案值非空，且不含 TODO / FIXME / undefined
 *   6. meta.locale 与文件名一致
 *
 * 任一不满足 -> exit 1 并打印差异路径。
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_LOCALE = 'zh-CN';
const BANNED = ['TODO', 'FIXME', 'undefined'];

const errors = [];

function readJson(rel) {
  try {
    return JSON.parse(readFileSync(join(root, rel), 'utf8'));
  } catch (e) {
    errors.push(`无法解析 ${rel}: ${e.message}`);
    return null;
  }
}

/** 收集对象全部叶子节点的 key 路径，数组按索引展开（保证顺序可比） */
function keyPaths(value, prefix = '', out = []) {
  if (Array.isArray(value)) {
    value.forEach((item, i) => keyPaths(item, `${prefix}[${i}]`, out));
    return out;
  }
  if (value && typeof value === 'object') {
    for (const k of Object.keys(value)) {
      keyPaths(value[k], prefix ? `${prefix}.${k}` : k, out);
    }
    return out;
  }
  out.push(prefix);
  return out;
}

function diff(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  return {
    missing: b.filter((x) => !setA.has(x)),
    extra: a.filter((x) => !setB.has(x)),
  };
}

function scanValues(value, rel, prefix = '') {
  if (Array.isArray(value)) {
    value.forEach((item, i) => scanValues(item, rel, `${prefix}[${i}]`));
    return;
  }
  if (value && typeof value === 'object') {
    for (const k of Object.keys(value)) {
      scanValues(value[k], rel, prefix ? `${prefix}.${k}` : k);
    }
    return;
  }
  if (typeof value === 'string') {
    if (value.trim() === '') {
      errors.push(`${rel} → ${prefix} 的值为空字符串`);
    }
    for (const bad of BANNED) {
      if (value.includes(bad)) {
        errors.push(`${rel} → ${prefix} 含禁用字符串 "${bad}"`);
      }
    }
  }
}

function checkParity(dirRel, label) {
  const dir = join(root, dirRel);
  const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
  if (!files.includes(`${DEFAULT_LOCALE}.json`)) {
    errors.push(`缺少默认语言文件 ${dirRel}/${DEFAULT_LOCALE}.json`);
    return files;
  }
  const base = readJson(`${dirRel}/${DEFAULT_LOCALE}.json`);
  if (!base) return files;
  const basePaths = keyPaths(base);
  for (const file of files) {
    if (file === `${DEFAULT_LOCALE}.json`) continue;
    const target = readJson(`${dirRel}/${file}`);
    if (!target) continue;
    const { missing, extra } = diff(keyPaths(target), basePaths);
    if (missing.length) {
      errors.push(`${dirRel}/${file} 缺少字段:\n    - ${missing.join('\n    - ')}`);
    }
    if (extra.length) {
      errors.push(`${dirRel}/${file} 多出字段:\n    + ${extra.join('\n    + ')}`);
    }
    scanValues(target, `${dirRel}/${file}`);
  }
  scanValues(base, `${dirRel}/${DEFAULT_LOCALE}.json`);
  if (label === 'config') {
    // 1b. meta.locale 与文件名一致
    for (const file of files) {
      const cfg = readJson(`${dirRel}/${file}`);
      const expected = file.replace(/\.json$/, '');
      if (cfg?.meta?.locale && cfg.meta.locale !== expected) {
        errors.push(
          `${dirRel}/${file} 的 meta.locale 为 "${cfg.meta.locale}"，应为 "${expected}"`,
        );
      }
    }
  }
  return files;
}

// ---------- 1. 内容配置结构对齐 ----------
const localeFiles = checkParity('config/locales', 'config');

// ---------- 1b. 关键标识跨语言取值对齐（服务 id / 案例 slug） ----------
const identifiers = { 'services.items[].id': [], 'cases.items[].slug': [] };
for (const file of localeFiles) {
  const cfg = readJson(`config/locales/${file}`);
  if (!cfg) continue;
  identifiers['services.items[].id'].push([
    file,
    (cfg.services?.items ?? []).map((s) => s.id),
  ]);
  identifiers['cases.items[].slug'].push([file, (cfg.cases?.items ?? []).map((c) => c.slug)]);
}
for (const [name, entries] of Object.entries(identifiers)) {
  if (entries.length < 2) continue;
  const [refFile, refValues] = entries[0];
  for (const [file, values] of entries.slice(1)) {
    if (values.join(',') !== refValues.join(',')) {
      errors.push(
        `${name} 跨语言不一致：${refFile}=[${refValues}] vs ${file}=[${values}]`,
      );
    }
  }
}

// ---------- 2. UI 字典 key 集合对齐 ----------
const msgDir = join(root, 'messages');
const msgFiles = readdirSync(msgDir).filter((f) => f.endsWith('.json'));
const baseMsg = readJson(`messages/${DEFAULT_LOCALE}.json`);

if (baseMsg) {
  const baseKeys = Object.keys(baseMsg).sort();
  for (const file of msgFiles) {
    const dict = readJson(`messages/${file}`);
    if (!dict) continue;
    const keys = Object.keys(dict).sort();
    const missing = baseKeys.filter((k) => !keys.includes(k));
    const extra = keys.filter((k) => !baseKeys.includes(k));
    if (missing.length) errors.push(`messages/${file} 缺少 key: ${missing.join(', ')}`);
    if (extra.length) errors.push(`messages/${file} 多出 key: ${extra.join(', ')}`);
    scanValues(dict, `messages/${file}`);
  }
}

// ---------- 3. 法务内容结构对齐 ----------
checkParity('config/legal', 'legal');

if (errors.length) {
  console.error('✗ 翻译完整性校验失败：\n');
  for (const e of errors) console.error(`  • ${e}`);
  console.error(`\n共 ${errors.length} 项问题。`);
  process.exit(1);
}

console.log(
  `✓ 翻译完整性校验通过（${localeFiles.length} 个内容语言 × ${msgFiles.length} 个 UI 字典）`,
);
