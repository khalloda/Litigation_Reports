import { test, expect } from '@playwright/test';

const BASE_URL = 'http://lit.local:8080';

test.describe('Lawyers and Documents Pages Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application and login
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

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
  });

  test('should load Lawyers page without errors', async ({ page }) => {
    console.log('👥 Testing Lawyers page functionality...');

    // Monitor console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to Lawyers page
    const lawyersLink = page.locator('a[href*="lawyers"], a:has-text("Lawyers"), a:has-text("المحامون")').first();

    if (await lawyersLink.isVisible()) {
      await lawyersLink.click();
    } else {
      // Try direct navigation
      await page.goto(`${BASE_URL}/lawyers`, { waitUntil: 'networkidle' });
    }

    console.log('👥 Navigated to Lawyers page');

    // Wait for page to load
    await page.waitForTimeout(5000);

    // Take screenshot of Lawyers page
    await page.screenshot({ path: 'test-results/lawyers-page-working.png', fullPage: true });

    // Check for page elements
    const pageTitle = await page.locator('h1, h2, h3').count();
    const lawyerElements = await page.locator('table, .card, .list-group').count();
    const buttonElements = await page.locator('button, .btn').count();

    console.log(`📋 Page titles found: ${pageTitle}`);
    console.log(`👥 Lawyer-related elements: ${lawyerElements}`);
    console.log(`🔘 Buttons found: ${buttonElements}`);

    // Check for specific text that indicates the page loaded correctly
    const pageContent = await page.textContent('body');
    const hasLawyerText = pageContent?.includes('Lawyer') || pageContent?.includes('محامي') || pageContent?.includes('المحامون') || false;
    const hasNoDataMessage = pageContent?.includes('No lawyers') || pageContent?.includes('لا يوجد محامون') || false;

    console.log(`👥 Contains lawyer-related text: ${hasLawyerText}`);
    console.log(`📭 Shows data or no data message: ${hasNoDataMessage || hasLawyerText}`);

    // Check for any console errors
    console.log(`❌ Console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Console errors found:');
      consoleErrors.forEach(error => console.log(`  - ${error}`));
    }

    // Verify no critical errors
    const hasCriticalErrors = consoleErrors.some(error =>
      error.includes('404') ||
      error.includes('Failed to load lawyers') ||
      error.includes('TypeError') ||
      error.includes('Cannot read properties') ||
      error.includes('Cannot convert undefined or null to object')
    );

    console.log(`🚨 Critical errors: ${hasCriticalErrors}`);

    // Assertions
    expect(pageTitle, 'Lawyers page should have a title').toBeGreaterThan(0);
    expect(lawyerElements, 'Should have lawyer-related elements').toBeGreaterThan(0);
    expect(hasCriticalErrors, 'Should not have critical console errors').toBe(false);

    console.log('✅ Lawyers page loaded successfully without critical errors!');
  });

  test('should load Documents page without errors', async ({ page }) => {
    console.log('📄 Testing Documents page functionality...');

    // Monitor console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to Documents page
    const documentsLink = page.locator('a[href*="documents"], a:has-text("Documents"), a:has-text("الوثائق")').first();

    if (await documentsLink.isVisible()) {
      await documentsLink.click();
    } else {
      // Try direct navigation
      await page.goto(`${BASE_URL}/documents`, { waitUntil: 'networkidle' });
    }

    console.log('📄 Navigated to Documents page');

    // Wait for page to load
    await page.waitForTimeout(5000);

    // Take screenshot of Documents page
    await page.screenshot({ path: 'test-results/documents-page-working.png', fullPage: true });

    // Check for page elements
    const pageTitle = await page.locator('h1, h2, h3').count();
    const documentElements = await page.locator('table, .card, .list-group').count();
    const buttonElements = await page.locator('button, .btn').count();
    const dropdownElements = await page.locator('select, .form-select').count();

    console.log(`📋 Page titles found: ${pageTitle}`);
    console.log(`📄 Document-related elements: ${documentElements}`);
    console.log(`🔘 Buttons found: ${buttonElements}`);
    console.log(`📋 Dropdown elements: ${dropdownElements}`);

    // Check for specific text that indicates the page loaded correctly
    const pageContent = await page.textContent('body');
    const hasDocumentText = pageContent?.includes('Document') || pageContent?.includes('وثيقة') || pageContent?.includes('الوثائق') || false;
    const hasNoDataMessage = pageContent?.includes('No documents') || pageContent?.includes('لا توجد وثائق') || false;

    console.log(`📄 Contains document-related text: ${hasDocumentText}`);
    console.log(`📭 Shows data or no data message: ${hasNoDataMessage || hasDocumentText}`);

    // Check for any console errors
    console.log(`❌ Console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Console errors found:');
      consoleErrors.forEach(error => console.log(`  - ${error}`));
    }

    // Verify no critical errors
    const hasCriticalErrors = consoleErrors.some(error =>
      error.includes('404') ||
      error.includes('Failed to load documents') ||
      error.includes('TypeError') ||
      error.includes('Cannot read properties') ||
      error.includes('Cannot convert undefined or null to object')
    );

    console.log(`🚨 Critical errors: ${hasCriticalErrors}`);

    // Assertions
    expect(pageTitle, 'Documents page should have a title').toBeGreaterThan(0);
    expect(documentElements, 'Should have document-related elements').toBeGreaterThan(0);
    expect(hasCriticalErrors, 'Should not have critical console errors').toBe(false);

    console.log('✅ Documents page loaded successfully without critical errors!');
  });

  test('should verify other pages still work correctly', async ({ page }) => {
    console.log('🔍 Testing that other pages still work correctly...');

    // Test Reports page
    await page.goto(`${BASE_URL}/reports`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const reportsPageContent = await page.textContent('body');
    const hasReportsContent = reportsPageContent?.includes('التقارير') || reportsPageContent?.includes('Reports') || false;

    console.log(`📊 Reports page loads correctly: ${hasReportsContent}`);
    expect(hasReportsContent, 'Reports page should load correctly').toBe(true);

    // Test Invoices page
    await page.goto(`${BASE_URL}/invoices`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const invoicesPageContent = await page.textContent('body');
    const hasInvoicesContent = invoicesPageContent?.includes('الفواتير') || invoicesPageContent?.includes('Invoice') || false;

    console.log(`💰 Invoices page loads correctly: ${hasInvoicesContent}`);
    expect(hasInvoicesContent, 'Invoices page should load correctly').toBe(true);

    console.log('✅ All other pages continue to work correctly!');
  });
});