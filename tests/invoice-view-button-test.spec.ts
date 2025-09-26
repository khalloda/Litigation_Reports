import { test, expect } from '@playwright/test';

test.describe('Invoice View Button Test', () => {
  test('Invoice view button opens view modal correctly', async ({ page }) => {
    console.log('🧪 Testing invoice view button functionality');

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

    // Check if view buttons exist
    const viewButtons = await page.locator('button[title="View"]').count();
    console.log(`📋 Found ${viewButtons} invoices with view buttons`);

    if (viewButtons > 0) {
      console.log('🔧 Testing VIEW functionality...');

      // Click first view button
      await page.locator('button[title="View"]').first().click();
      await page.waitForTimeout(2000);

      // Check if view modal opened
      const modalVisible = await page.locator('[role="dialog"]').isVisible();
      console.log(`📋 Modal visible: ${modalVisible}`);

      if (modalVisible) {
        // Check modal title
        const modalTitle = await page.locator('.modal-title').textContent();
        console.log(`📄 Modal title: "${modalTitle}"`);
        expect(modalTitle).toContain('تفاصيل الفاتورة');

        // Check if form fields are disabled (view mode)
        const firstInput = page.locator('input[type="text"]').first();
        const isDisabled = await firstInput.isDisabled();
        console.log(`✅ First input field disabled: ${isDisabled}`);
        expect(isDisabled).toBe(true);

        // Check if only close button exists (no save button)
        const saveButton = page.getByRole('button', { name: 'إضافة الفاتورة' });
        const editButton = page.getByRole('button', { name: 'حفظ التغييرات' });
        const closeButton = page.getByRole('button', { name: 'إغلاق' });

        const saveVisible = await saveButton.isVisible().catch(() => false);
        const editVisible = await editButton.isVisible().catch(() => false);
        const closeVisible = await closeButton.isVisible();

        console.log(`✅ Save button visible: ${saveVisible}`);
        console.log(`✅ Edit button visible: ${editVisible}`);
        console.log(`✅ Close button visible: ${closeVisible}`);

        expect(saveVisible).toBe(false);
        expect(editVisible).toBe(false);
        expect(closeVisible).toBe(true);

        // Close the modal
        await closeButton.click();
        await page.waitForTimeout(1000);
        console.log('✅ View modal closed');

        console.log('\\n🎉 INVOICE VIEW FUNCTIONALITY SUCCESSFUL!');
        console.log('✅ View button opens view modal with correct title');
        console.log('✅ Form fields are disabled in view mode');
        console.log('✅ Only close button is visible (no save/edit buttons)');
      } else {
        throw new Error('View modal did not open');
      }
    } else {
      console.log('⚠️ No invoices found to test view functionality');
    }
  });
});