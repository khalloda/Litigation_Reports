import { test, expect } from '@playwright/test';

test.describe('Debug Export Modal Structure', () => {
  test('Check the actual structure of export modal', async ({ page }) => {
    console.log('🧪 DEBUGGING: Export modal structure');

    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.getByRole('button', { name: /دخول|Login/i }).click();
    await page.waitForTimeout(3000);

    // Navigate to reports page
    await page.goto('/reports', { waitUntil: 'networkidle' });
    console.log('✅ Navigated to reports page');
    await page.waitForTimeout(3000);

    // Click export button
    const exportButton = page.getByRole('button', { name: /تصدير|Export/i });
    await exportButton.click();
    await page.waitForTimeout(2000);

    // Check if export modal opened
    const exportModalVisible = await page.locator('.modal-title:has-text("خيارات التصدير")').isVisible();
    console.log(`📋 Export modal opened: ${exportModalVisible}`);

    if (exportModalVisible) {
      // Get all button texts in the modal
      const allButtons = await page.locator('.modal-content button').allTextContents();
      console.log(`📋 All buttons in modal: ${JSON.stringify(allButtons)}`);

      // Get all text content in the modal to see what's there
      const modalContent = await page.locator('.modal-content').textContent();
      console.log(`📋 Modal content: ${modalContent}`);

      // Look for buttons with Download icon specifically
      const downloadButtons = await page.locator('button:has(svg)').allTextContents();
      console.log(`📥 Buttons with icons: ${JSON.stringify(downloadButtons)}`);

      // Look for CSV and Excel buttons more specifically
      const csvButtonExists = await page.locator('button:has-text("CSV")').count();
      const excelButtonExists = await page.locator('button:has-text("Excel")').count();

      console.log(`📊 CSV buttons found: ${csvButtonExists}`);
      console.log(`📊 Excel buttons found: ${excelButtonExists}`);

      if (csvButtonExists > 0) {
        for (let i = 0; i < csvButtonExists; i++) {
          const csvButton = page.locator('button:has-text("CSV")').nth(i);
          const disabled = await csvButton.isDisabled();
          const visible = await csvButton.isVisible();
          console.log(`📊 CSV button ${i}: visible=${visible}, disabled=${disabled}`);
        }
      }

      if (excelButtonExists > 0) {
        for (let i = 0; i < excelButtonExists; i++) {
          const excelButton = page.locator('button:has-text("Excel")').nth(i);
          const disabled = await excelButton.isDisabled();
          const visible = await excelButton.isVisible();
          console.log(`📊 Excel button ${i}: visible=${visible}, disabled=${disabled}`);
        }
      }

      // Check for status messages
      const statusElements = await page.locator('.modal-content small').allTextContents();
      console.log(`ℹ️ Status messages: ${JSON.stringify(statusElements)}`);
    }

    console.log('\n📊 EXPORT MODAL STRUCTURE DEBUG COMPLETE');
  });
});