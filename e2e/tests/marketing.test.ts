import { expect, test } from '@playwright/test';

const PAGES = ['/', '/product', '/how-it-works', '/trust', '/pricing', '/docs'];

for (const path of PAGES) {
  test(`${path}: every Get started and Sign in goes to sign-up or sign-in (PX-13)`, async ({ page }) => {
    await page.goto(path);
    const links = page.getByRole('link', { name: /^(Get started|Sign in)$/ });
    const hrefs = await links.evaluateAll((els) => els.map((e) => e.getAttribute('href')));
    expect(hrefs.length).toBeGreaterThanOrEqual(2);
    for (const href of hrefs) expect(['/signup', '/signin']).toContain(href);
  });

  test(`${path}: has one page heading and no horizontal scroll on a phone`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('the navigation reaches every marketing page', async ({ page }) => {
  await page.goto('/');
  for (const [name, path] of [['Product', '/product'], ['How it works', '/how-it-works'], ['Trust', '/trust'], ['Pricing', '/pricing'], ['Docs', '/docs']] as const) {
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name })).toHaveAttribute('aria-current', 'page');
  }
});

test('the mobile menu opens and lists every page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile' }).getByRole('link')).toHaveCount(6);
});
