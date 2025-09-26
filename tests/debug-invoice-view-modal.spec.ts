import { test, expect } from '@playwright/test';

test.describe('Debug Invoice View Modal', () => {
  test('Debug invoice view modal state', async ({ page }) => {
    console.log('🐛 DEBUGGING: Invoice view modal state');

    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.getByRole('button', { name: /دخول|Login/i }).click();
    await page.waitForTimeout(3000);

    // Navigate to invoices page
    await page.goto('/invoices', { waitUntil: 'networkidle' });
    console.log('✅ Navigated to invoices page');

    // Monitor console for any errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      } else if (msg.type() === 'log') {
        console.log('📝 Console Log:', msg.text());
      }
    });

    await page.waitForTimeout(3000);

    // Check what buttons exist
    const allButtons = await page.locator('button').all();
    console.log(`📋 Total buttons found: ${allButtons.length}`);

    // Find view buttons specifically
    const viewButtons = await page.locator('button[title="View"]').all();
    console.log(`👁️ View buttons found: ${viewButtons.length}`);

    const eyeButtons = await page.locator('button').filter({ has: page.locator('svg') }).all();
    console.log(`👁️ Buttons with icons: ${eyeButtons.length}`);

    if (viewButtons.length > 0) {
      console.log('🔧 Clicking first view button...');

      // Add React state inspection
      await page.evaluate(() => {
        console.log('🔍 React Dev Tools Check');
        // Try to access React state if possible
        if (window.React) {
          console.log('✅ React is available');
        }
      });

      await viewButtons[0].click();
      await page.waitForTimeout(2000);

      // Check modal state
      const modalVisible = await page.locator('.modal, [role="dialog"]').isVisible();
      console.log(`📋 Modal visible: ${modalVisible}`);

      if (modalVisible) {
        const modalTitle = await page.locator('.modal-title').textContent();
        console.log(`📄 Modal title: "${modalTitle}"`);

        // Check form field states
        const allInputs = await page.locator('input, select, textarea').all();
        console.log(`📝 Total form fields: ${allInputs.length}`);

        for (let i = 0; i < Math.min(5, allInputs.length); i++) {
          const field = allInputs[i];
          const isDisabled = await field.isDisabled();
          const tagName = await field.evaluate(el => el.tagName);
          const type = await field.evaluate(el => el.type || el.tagName);
          console.log(`📝 Field ${i + 1} (${tagName}/${type}): disabled=${isDisabled}`);
        }

        // Check button states
        const cancelButton = page.getByRole('button', { name: 'إلغاء' });
        const closeButton = page.getByRole('button', { name: 'إغلاق' });
        const saveButton = page.getByRole('button', { name: 'إضافة الفاتورة' });
        const editSaveButton = page.getByRole('button', { name: 'حفظ التغييرات' });

        const cancelVisible = await cancelButton.isVisible().catch(() => false);
        const closeVisible = await closeButton.isVisible().catch(() => false);
        const saveVisible = await saveButton.isVisible().catch(() => false);
        const editSaveVisible = await editSaveButton.isVisible().catch(() => false);

        console.log(`🔘 Cancel button visible: ${cancelVisible}`);
        console.log(`🔘 Close button visible: ${closeVisible}`);
        console.log(`🔘 Save button visible: ${saveVisible}`);
        console.log(`🔘 Edit Save button visible: ${editSaveVisible}`);

        // Take screenshot for debugging
        await page.screenshot({ path: 'debug-invoice-view-modal.png', fullPage: true });
        console.log('📸 Screenshot saved as debug-invoice-view-modal.png');

        // Close modal
        if (closeVisible) {
          await closeButton.click();
        } else if (cancelVisible) {
          await cancelButton.click();
        }
      } else {
        console.log('⚠️ No modal appeared');
      }
    } else {
      console.log('⚠️ No view buttons found');
    }
  });
});