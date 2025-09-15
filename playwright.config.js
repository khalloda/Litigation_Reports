// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 3 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['github'],
    ['line']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://lit.local',
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
    
    /* Global timeout for each action */
    actionTimeout: 30000,
    
    /* Global timeout for navigation */
    navigationTimeout: 30000,
    
    /* Browser context options */
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    /* RTL testing support */
    locale: 'ar-SA',
    timezoneId: 'Asia/Riyadh',
    
    /* Accessibility testing */
    reducedMotion: 'reduce',
    
    /* User agent for consistent testing */
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },

  /* Configure projects for major browsers */
  projects: [
    /* Desktop Browsers */
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        locale: 'en-US',
        timezoneId: 'America/New_York'
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        locale: 'en-US',
        timezoneId: 'America/New_York'
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        locale: 'en-US',
        timezoneId: 'America/New_York'
      },
    },

    /* RTL/Arabic Testing */
    {
      name: 'chromium-rtl',
      use: { 
        ...devices['Desktop Chrome'],
        locale: 'ar-SA',
        timezoneId: 'Asia/Riyadh',
        extraHTTPHeaders: {
          'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8'
        }
      },
    },

    {
      name: 'firefox-rtl',
      use: { 
        ...devices['Desktop Firefox'],
        locale: 'ar-SA',
        timezoneId: 'Asia/Riyadh',
        extraHTTPHeaders: {
          'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8'
        }
      },
    },

    /* Mobile Browsers */
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        locale: 'en-US'
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        locale: 'en-US'
      },
    },
    {
      name: 'Mobile Chrome RTL',
      use: { 
        ...devices['Pixel 5'],
        locale: 'ar-SA',
        extraHTTPHeaders: {
          'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8'
        }
      },
    },

    /* Branded Browsers */
    {
      name: 'Microsoft Edge',
      use: { 
        ...devices['Desktop Edge'], 
        channel: 'msedge',
        locale: 'en-US'
      },
    },
    {
      name: 'Google Chrome',
      use: { 
        ...devices['Desktop Chrome'], 
        channel: 'chrome',
        locale: 'en-US'
      },
    },

    /* Accessibility Testing */
    {
      name: 'accessibility-testing',
      use: { 
        ...devices['Desktop Chrome'],
        reducedMotion: 'reduce',
        forcedColors: 'active',
        colorScheme: 'dark'
      },
    },

    /* Visual Regression Testing */
    {
      name: 'visual-regression',
      use: { 
        ...devices['Desktop Chrome'],
        locale: 'en-US'
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  /* Global test configuration */
  expect: {
    /* Maximum time expect() should wait for the condition to be met */
    timeout: 10000,
    
    /* Threshold for visual comparisons */
    threshold: 0.2,
    
    /* Animation handling */
    animation: 'disabled',
  },

  /* Test timeout */
  timeout: 60000,

  /* Global setup and teardown */
  globalSetup: require.resolve('./tests/global-setup.js'),
  globalTeardown: require.resolve('./tests/global-teardown.js'),

  /* Output directory for test artifacts */
  outputDir: 'test-results/',
});
