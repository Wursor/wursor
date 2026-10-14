import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['__tests__/**/*.test.{ts,tsx}'],
    // Screens that render the whole app shell take a few seconds when all test files run in parallel.
    testTimeout: 20_000,
  },
});
