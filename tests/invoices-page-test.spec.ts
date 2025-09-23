import { test, expect } from '@playwright/test';

const BASE_URL = 'http://lit.local:8080';

test.describe('Invoices Page Test', () => {
  test('should load Invoices page without errors', async ({ page }) => {
    console.log('📊 Testing Invoices page functionality...');

    // Navigate to the application
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Login first
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    const loginButton = page.locator('button[type="submit"], .btn-primary');

    if (await emailInput.isVisible()) {
      await emailInput.fill('admin@litigation.com');
      await passwordInput.fill('admin123');
      await loginButton.click();
      await page.waitForTimeout(3000);
    }

    console.log('✅ Logged in successfully');

    // Monitor console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to Invoices page
    const invoicesLink = page.locator('a[href*="invoices"], a:has-text("Invoices"), a:has-text("الفواتير")').first();

    if (await invoicesLink.isVisible()) {
      await invoicesLink.click();
    } else {
      // Try direct navigation
      await page.goto(`${BASE_URL}/invoices`, { waitUntil: 'networkidle' });
    }

    console.log('💰 Navigated to Invoices page');

    // Wait for page to load
    await page.waitForTimeout(5000);

    // Take screenshot of Invoices page
    await page.screenshot({ path: 'test-results/invoices-page-working.png', fullPage: true });

    // Check for page elements
    const pageTitle = await page.locator('h1, h2, h3').count();
    const invoiceElements = await page.locator('table, .card, .list-group').count();
    const buttonElements = await page.locator('button, .btn').count();

    console.log(`📋 Page titles found: ${pageTitle}`);
    console.log(`💰 Invoice-related elements: ${invoiceElements}`);
    console.log(`🔘 Buttons found: ${buttonElements}`);

    // Check for specific text that indicates the page loaded correctly
    const pageContent = await page.textContent('body');
    const hasInvoiceText = pageContent?.includes('Invoice') || pageContent?.includes('فاتورة') || pageContent?.includes('الفواتير') || false;
    const hasNoDataMessage = pageContent?.includes('No invoices') || pageContent?.includes('لا توجد فواتير') || false;

    console.log(`💰 Contains invoice-related text: ${hasInvoiceText}`);
    console.log(`📭 Shows no data message: ${hasNoDataMessage}`);

    // Check for any console errors
    console.log(`❌ Console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Console errors found:');
      consoleErrors.forEach(error => console.log(`  - ${error}`));
    }

    // Verify no critical errors
    const hasCriticalErrors = consoleErrors.some(error =>
      error.includes('404') ||
      error.includes('Failed to load invoices') ||
      error.includes('TypeError') ||
      error.includes('Cannot read properties')
    );

    console.log(`🚨 Critical errors: ${hasCriticalErrors}`);

    // Assertions
    expect(pageTitle, 'Invoices page should have a title').toBeGreaterThan(0);
    expect(invoiceElements, 'Should have invoice-related elements').toBeGreaterThan(0);
    expect(hasCriticalErrors, 'Should not have critical console errors').toBe(false);
    expect(hasInvoiceText || hasNoDataMessage, 'Should show invoice content or no data message').toBe(true);

    console.log('✅ Invoices page loaded successfully without critical errors!');
  });
});