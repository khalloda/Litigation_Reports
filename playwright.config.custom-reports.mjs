// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration specifically for custom reports column selection tests
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  testMatch: ['**/reports-custom-columns.spec.ts', '**/reports-column-fix-verification.spec.ts'],

  /* Run tests in files in parallel */
  fullyParallel: false, // Disable for debugging

  /* Retry on failure to capture traces */
  retries: 2,

  /* Use single worker for consistent debugging */
  workers: 1,

  /* Reporter configuration for bug reproduction and fix verification */
  reporter: [
    ['html', {
      open: 'never',
      outputFolder: 'playwright-report-custom-columns'
    }],
    ['json', { outputFile: 'test-results/custom-columns-results.json' }],
    ['line'],
    ['github']
  ],

  /* Test configuration */
  use: {
    /* IMPORTANT: Use the correct base URL for the backend */
    baseURL: 'http://lit.local:8080',

    /* Collect trace on first retry to debug the bug */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record video for debugging */
    video: 'retain-on-failure',

    /* Longer timeouts for complex report generation */
    actionTimeout: 45000,
    navigationTimeout: 45000,

    /* Browser viewport for consistent testing */
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    /* RTL testing support for Arabic UI */
    locale: 'ar-SA',
    timezoneId: 'Asia/Riyadh',
    extraHTTPHeaders: {
      'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8'
    },
  },

  /* Configure projects */
  projects: [
    {
      name: 'custom-reports-bug-reproduction',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'ar-SA',
        timezoneId: 'Asia/Riyadh'
      },
    },

    /* Also test in English to ensure the fix works for both languages */
    {
      name: 'custom-reports-english',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'en-US',
        timezoneId: 'America/New_York'
      },
    }
  ],

  /* Global test configuration */
  expect: {
    /* Longer timeout for complex assertions */
    timeout: 15000,

    /* Take screenshot on assertion failure */
    screenshot: 'only-on-failure',
  },

  /* Overall test timeout */
  timeout: 120000, // 2 minutes for complex report operations

  /* Output directory for test artifacts */
  outputDir: 'test-results/custom-columns-artifacts/',

  /* Global setup if needed */
  // globalSetup: './tests/reports-global-setup.js',
});