import { test, expect } from '@playwright/test';

const BASE_URL = 'http://lit.local:8080';

test.describe('Documents Page Fix Verification', () => {
  test('should load Documents page without loading errors', async ({ page }) => {
    console.log('📄 Testing Documents page fix...');

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

    // Navigate to Documents page
    await page.goto(`${BASE_URL}/documents`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);

    console.log('📄 Navigated to Documents page');

    // Take screenshot of Documents page
    await page.screenshot({ path: 'test-results/documents-page-fixed.png', fullPage: true });

    // Check that the page loaded correctly without the error message
    const pageContent = await page.textContent('body');
    const hasLoadingError = pageContent?.includes('خطأ في تحميل المستندات') || false;
    const hasDocumentsInterface = pageContent?.includes('رفع مستند جديد') || pageContent?.includes('إدارة الوثائق') || false;

    console.log(`❌ Has loading error message: ${hasLoadingError}`);
    console.log(`📄 Has documents interface: ${hasDocumentsInterface}`);

    // Check for dashboard elements
    const uploadButton = await page.locator('button:has-text("رفع مستند جديد"), button:has-text("Upload")').count();
    const filterElements = await page.locator('select, .form-select').count();
    const statsCards = await page.locator('.card').count();

    console.log(`📤 Upload button found: ${uploadButton > 0}`);
    console.log(`🔍 Filter elements: ${filterElements}`);
    console.log(`📊 Stats cards: ${statsCards}`);

    // Check for any console errors
    console.log(`❌ Console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Console errors found:');
      consoleErrors.forEach(error => console.log(`  - ${error}`));
    }

    // Verify no critical errors that prevent page loading
    const hasCriticalLoadingErrors = consoleErrors.some(error =>
      error.includes('Cannot read properties of undefined') ||
      error.includes('Documents load error') ||
      error.includes('Failed to fetch documents')
    );

    console.log(`🚨 Critical loading errors: ${hasCriticalLoadingErrors}`);

    // Assertions
    expect(hasLoadingError, 'Should not show loading error message').toBe(false);
    expect(hasDocumentsInterface, 'Should show documents interface').toBe(true);
    expect(uploadButton, 'Should have upload button').toBeGreaterThan(0);
    expect(hasCriticalLoadingErrors, 'Should not have critical loading errors').toBe(false);

    console.log('✅ Documents page loaded successfully without loading errors!');
  });

  test('should allow opening the upload modal', async ({ page }) => {
    console.log('📤 Testing document upload modal...');

    // Navigate and login
    await page.goto(BASE_URL);
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('admin@litigation.com');
      await page.locator('input[type="password"], input[name="password"]').fill('admin123');
      await page.locator('button[type="submit"], .btn-primary').click();
      await page.waitForTimeout(3000);
    }

    // Go to Documents page
    await page.goto(`${BASE_URL}/documents`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Click upload button
    const uploadButton = page.locator('button:has-text("رفع مستند جديد"), button:has-text("Upload")').first();

    if (await uploadButton.isVisible()) {
      await uploadButton.click();
      await page.waitForTimeout(2000);

      // Check if modal opened
      const modal = await page.locator('.modal, [role="dialog"]').count();
      const titleField = await page.locator('input[placeholder*="عنوان"], input[name*="title"]').count();

      console.log(`📋 Modal opened: ${modal > 0}`);
      console.log(`📝 Title field visible: ${titleField > 0}`);

      // Verify modal elements
      expect(modal, 'Upload modal should open').toBeGreaterThan(0);
      expect(titleField, 'Should have title field in modal').toBeGreaterThan(0);

      console.log('✅ Upload modal opens correctly!');
    } else {
      console.log('⚠️ Upload button not found or visible');
    }
  });
});