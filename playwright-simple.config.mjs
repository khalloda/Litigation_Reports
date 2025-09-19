// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Simple Playwright config for testing existing server
 */
export default defineConfig({
  testDir: './',
  testMatch: ['test-login.js', 'test-login-simple.js'],
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [
    ['html', { open: 'never' }],
    ['line']
  ],
  use: {
    baseURL: 'http://lit.local:3001',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30000,
    navigationTimeout: 30000,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    locale: 'ar-SA',
    timezoneId: 'Asia/Riyadh',
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        locale: 'en-US',
        timezoneId: 'America/New_York'
      },
    },
  ],
  expect: {
    timeout: 10000,
    threshold: 0.2,
    animation: 'disabled',
  },
  timeout: 60000,
  outputDir: 'test-results/',
});
