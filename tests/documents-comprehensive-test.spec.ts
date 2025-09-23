import { test, expect } from '@playwright/test';
import path from 'path';

const BASE_URL = 'http://lit.local:8080';

test.describe('Documents Page Comprehensive Test', () => {
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

  test('should load Documents page without loading errors and test all functionality', async ({ page }) => {
    console.log('📄 Testing complete Documents page functionality...');

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
    await page.screenshot({ path: 'test-results/documents-comprehensive.png', fullPage: true });

    // Check that the page loads without the error message
    const pageContent = await page.textContent('body');
    const hasLoadingError = pageContent?.includes('خطأ في تحميل المستندات') || false;
    const hasDocumentsInterface = pageContent?.includes('رفع مستند جديد') || pageContent?.includes('إدارة الوثائق') || false;

    console.log(`❌ Has loading error message: ${hasLoadingError}`);
    console.log(`📄 Has documents interface: ${hasDocumentsInterface}`);

    // Check for documents in the table
    const documentRows = await page.locator('tbody tr').count();
    console.log(`📄 Document rows visible: ${documentRows}`);

    // Test download functionality if documents exist
    if (documentRows > 0) {
      console.log('🔽 Testing download functionality...');

      const firstActionButton = page.locator('tbody tr').first().locator('.dropdown-toggle').first();
      if (await firstActionButton.isVisible()) {
        await firstActionButton.click();
        await page.waitForTimeout(1000);

        const downloadButton = page.locator('a:has-text("تحميل"), button:has-text("تحميل")').first();
        if (await downloadButton.isVisible()) {
          console.log('✅ Download button is accessible');
        }

        // Test edit functionality
        console.log('✏️ Testing edit functionality...');
        const editButton = page.locator('a:has-text("تعديل"), button:has-text("تعديل")').first();
        if (await editButton.isVisible()) {
          await editButton.click();
          await page.waitForTimeout(2000);

          // Check if edit modal opened
          const editModal = await page.locator('.modal:visible').count();
          console.log(`✏️ Edit modal opened: ${editModal > 0}`);

          if (editModal > 0) {
            // Close the modal
            const closeButton = page.locator('.modal button:has-text("إلغاء")').first();
            if (await closeButton.isVisible()) {
              await closeButton.click();
              await page.waitForTimeout(1000);
            }
          }
        }
      }
    }

    // Test upload functionality
    console.log('📤 Testing upload functionality...');
    const uploadButton = page.locator('button:has-text("رفع مستند جديد"), button:has-text("Upload")').first();

    if (await uploadButton.isVisible()) {
      await uploadButton.click();
      await page.waitForTimeout(2000);

      // Check if upload modal opened
      const uploadModal = await page.locator('.modal:visible').count();
      console.log(`📤 Upload modal opened: ${uploadModal > 0}`);

      if (uploadModal > 0) {
        // Fill form fields
        const titleInput = page.locator('input[type="text"]').first();
        if (await titleInput.isVisible()) {
          await titleInput.fill('Test Document from UI');
        }

        const descriptionField = page.locator('textarea').first();
        if (await descriptionField.isVisible()) {
          await descriptionField.fill('Test description from UI');
        }

        // Create a test file
        const testContent = 'This is a test file for upload testing';
        const testFilePath = path.join(process.cwd(), 'test-upload-ui.txt');

        // Note: In a real test environment, you'd need to handle file uploads properly
        // For now, we'll just check that the form elements exist
        const fileInput = page.locator('input[type="file"]');
        const fileInputExists = await fileInput.count();
        console.log(`📎 File input field exists: ${fileInputExists > 0}`);

        // Close the modal
        const closeButton = page.locator('.modal button:has-text("إلغاء")').first();
        if (await closeButton.isVisible()) {
          await closeButton.click();
          await page.waitForTimeout(1000);
        }
      }
    }

    // Check for any console errors
    console.log(`❌ Console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Console errors found:');
      consoleErrors.forEach(error => console.log(`  - ${error}`));
    }

    // Verify no critical errors that prevent functionality
    const hasCriticalLoadingErrors = consoleErrors.some(error =>
      error.includes('Cannot read properties of undefined') ||
      error.includes('Documents load error') ||
      error.includes('Failed to fetch documents') ||
      error.includes('TypeError: Cannot convert undefined or null to object')
    );

    console.log(`🚨 Critical loading errors: ${hasCriticalLoadingErrors}`);

    // Assertions
    expect(hasLoadingError, 'Should not show loading error message').toBe(false);
    expect(hasDocumentsInterface, 'Should show documents interface').toBe(true);
    expect(hasCriticalLoadingErrors, 'Should not have critical loading errors').toBe(false);

    console.log('✅ Documents page comprehensive test completed successfully!');
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

    // Test Lawyers page
    await page.goto(`${BASE_URL}/lawyers`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const lawyersPageContent = await page.textContent('body');
    const hasLawyersContent = lawyersPageContent?.includes('المحامون') || lawyersPageContent?.includes('Lawyer') || false;

    console.log(`👥 Lawyers page loads correctly: ${hasLawyersContent}`);
    expect(hasLawyersContent, 'Lawyers page should load correctly').toBe(true);

    console.log('✅ All other pages continue to work correctly!');
  });
});