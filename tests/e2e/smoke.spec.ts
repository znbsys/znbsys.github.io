import { expect, test } from '@playwright/test';

const LOCALES = ['zh-CN', 'en', 'ja'];

test('根路径跳转到默认语言', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/zh-CN\/?$/);
});

for (const locale of LOCALES) {
  test(`${locale} 首页与核心内页可访问`, async ({ page }) => {
    for (const path of ['/', '/services/', '/cases/', '/about/', '/contact/']) {
      const res = await page.goto(`/${locale}${path}`);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale === 'zh-CN' ? 'zh-CN' : locale);
    }
  });

  test(`${locale} 案例详情与语言切换`, async ({ page }) => {
    await page.goto(`/${locale}/cases/`);
    await page.locator('a[href*="/cases/"]').first().click();
    await expect(page).toHaveURL(/\/cases\/.+\/$/);

    await page.goto(`/${locale}/services/`);
    await page.locator('[data-testid="language-switcher"] summary').click();
    await page.locator('[data-testid="language-switcher"] a[hreflang="en"]').click();
    await expect(page).toHaveURL(/\/en\/services\/$/);
  });
}

test('未知路径返回 404 页面', async ({ page }) => {
  const res = await page.goto('/definitely-not-a-page/');
  expect(res?.status()).toBe(404);
  await expect(page.getByText('404')).toBeVisible();
});
