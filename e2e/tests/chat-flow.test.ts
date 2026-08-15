import { test, expect } from '@playwright/test';

test('user signs up and sees the chat interface', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Email').fill(`e2e-${Date.now()}@example.com`);
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign up' }).click();

  await expect(page.locator('.wursor-chat-input')).toBeVisible();
  await expect(page.locator('.wursor-welcome')).toContainText('Describe what you want');
});
