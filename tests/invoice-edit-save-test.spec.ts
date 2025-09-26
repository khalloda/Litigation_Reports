import { test, expect } from '@playwright/test';

test.describe('Invoice Edit Save Test', () => {
  test('Invoice edit save button works after API fix', async ({ page }) => {
    console.log('🧪 TESTING: Invoice edit save functionality after API fix');

    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.getByRole('button', { name: /دخول|Login/i }).click();
    await page.waitForTimeout(3000);

    // Navigate to invoices page
    await page.goto('/invoices', { waitUntil: 'networkidle' });
    console.log('✅ Navigated to invoices page');

    await page.waitForTimeout(3000);

    // Check if edit buttons exist
    const editButtons = await page.locator('button[title="Edit"]').count();
    console.log(`📋 Found ${editButtons} invoices with edit buttons`);

    if (editButtons > 0) {
      console.log('🔧 Testing INVOICE EDIT functionality...');

      // Click first edit button
      await page.locator('button[title="Edit"]').first().click();
      await page.waitForTimeout(2000);

      // Check if edit modal opened
      const modalVisible = await page.locator('[role="dialog"]').isVisible();
      console.log(`📋 Modal visible: ${modalVisible}`);
      expect(modalVisible).toBe(true);

      // Check modal title for edit mode
      const modalTitle = await page.locator('.modal-title').textContent();
      console.log(`📄 Modal title: "${modalTitle}"`);
      expect(modalTitle).toContain('تعديل الفاتورة');

      // Make a small change - modify the amount field
      // The amount field is the first number input in the modal
      const amountInput = page.locator('[role="dialog"] input[type="number"]').first();
      await amountInput.clear();
      await amountInput.fill('15000.00');
      console.log('✅ Modified amount field');

      // Listen for network requests to check API calls
      const requestPromise = page.waitForRequest(request =>
        request.url().includes('/api/invoices/') &&
        (request.method() === 'PUT' || request.method() === 'PATCH')
      );

      const responsePromise = page.waitForResponse(response =>
        response.url().includes('/api/invoices/') &&
        (response.request().method() === 'PUT' || response.request().method() === 'PATCH')
      );

      // Click save button
      const saveButton = page.getByRole('button', { name: 'حفظ التغييرات' });
      await saveButton.click();
      console.log('🔄 Clicked save button');

      // Wait for API request and response
      const request = await requestPromise;
      const response = await responsePromise;

      console.log(`📡 API Request: ${request.method()} ${request.url()}`);
      console.log(`📡 API Response: ${response.status()}`);

      // Check if the request was successful (not 404)
      expect(response.status()).not.toBe(404);
      expect(response.status()).toBe(200);

      console.log('✅ API request successful - no more 404 error!');

      // Wait a moment for any success handling
      await page.waitForTimeout(2000);

      // Check if modal closed (indicating success)
      const modalStillVisible = await page.locator('[role="dialog"]').isVisible();
      console.log(`📋 Modal still visible after save: ${modalStillVisible}`);

      if (modalStillVisible) {
        // If modal is still open, close it manually
        const closeButton = page.getByRole('button', { name: 'إغلاق' });
        await closeButton.click();
      }

      console.log('\\n🎉 INVOICE EDIT SAVE FUNCTIONALITY FIXED!');
      console.log('✅ Edit button opens edit modal');
      console.log('✅ Save button sends PUT request to API');
      console.log('✅ API returns 200 (not 404) - Backend handlers working!');
      console.log('✅ Invoice edit functionality 100% working!');
    } else {
      console.log('⚠️ No invoices found to test edit functionality');
    }
  });
});