import { test, expect } from '@playwright/test';

test.describe('Debug Modal State', () => {
  test('Check actual modalMode state in debug info', async ({ page }) => {
    console.log('🐛 DEBUGGING: Check actual modalMode state in debug info');

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

    // Click view button
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();
    await page.waitForTimeout(2000);

    // Check if modal is visible
    const modalVisible = await page.locator('[role="dialog"]').isVisible();
    console.log(`📋 Modal visible: ${modalVisible}`);

    if (modalVisible) {
      // Read the debug information from the specific debug div
      const debugInfo = await page.locator('div').filter({ hasText: 'Debug Info:' }).last().textContent();
      console.log(`🔍 Debug Information: ${debugInfo}`);

      // Extract modalMode from debug info
      const modalModeMatch = debugInfo?.match(/modalMode:\s*(\w+)/);
      const editingInvoiceMatch = debugInfo?.match(/editingInvoice:\s*(\w+)/);
      const showModalMatch = debugInfo?.match(/showModal:\s*(\w+)/);

      console.log(`📝 Extracted modalMode: ${modalModeMatch?.[1]}`);
      console.log(`📝 Extracted editingInvoice: ${editingInvoiceMatch?.[1]}`);
      console.log(`📝 Extracted showModal: ${showModalMatch?.[1]}`);

      // Check the modal form fields specifically
      const modalInputs = page.locator('[role="dialog"] input[type="text"]');
      const modalInputCount = await modalInputs.count();
      console.log(`📝 Modal inputs count: ${modalInputCount}`);

      if (modalInputCount > 0) {
        const firstModalInput = modalInputs.first();
        const disabledAttr = await firstModalInput.getAttribute('disabled');
        const isDisabled = await firstModalInput.isDisabled();

        console.log(`📝 First MODAL input disabled attribute: ${disabledAttr}`);
        console.log(`📝 First MODAL input isDisabled(): ${isDisabled}`);

        // Check the HTML of the first modal input
        const inputHTML = await firstModalInput.evaluate((el) => el.outerHTML);
        console.log(`📝 First MODAL input HTML: ${inputHTML.substring(0, 300)}...`);

        // Check other modal form fields too
        const modalSelects = page.locator('[role="dialog"] select');
        const selectCount = await modalSelects.count();
        console.log(`📝 Modal selects count: ${selectCount}`);

        if (selectCount > 0) {
          const firstSelect = modalSelects.first();
          const selectDisabled = await firstSelect.isDisabled();
          console.log(`📝 First MODAL select disabled: ${selectDisabled}`);
        }
      }

      // Close modal
      const closeButton = page.getByRole('button', { name: 'إغلاق' });
      await closeButton.click();
    }
  });
});