import { defineConfig } from '@playwright/test';

/** Marketing-site checks only: needs the web app, not the API. Run with `pnpm --filter @wursor/e2e test:marketing`. */
export default defineConfig({
  testDir: './tests',
  testMatch: 'marketing.test.ts',
  fullyParallel: true,
  retries: 0,
  use: { baseURL: 'http://localhost:5173', launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH ?? undefined } },
  webServer: {
    command: 'pnpm --filter @wursor/web dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
