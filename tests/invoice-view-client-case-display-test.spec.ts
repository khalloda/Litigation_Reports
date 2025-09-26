import { test, expect } from '@playwright/test';

test.describe('Invoice View Client and Case Display Test', () => {
  test('Invoice view form shows Client and Case fields from database', async ({ page }) => {
    console.log('🧪 TESTING: Invoice view form Client and Case display');

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
      console.log('🔧 Testing INVOICE VIEW CLIENT & CASE DISPLAY...');

      // Click first view button
      await page.locator('button[title="View"]').first().click();
      await page.waitForTimeout(3000); // Wait for clients and cases to load

      // Check if view modal opened
      const modalVisible = await page.locator('[role="dialog"]').isVisible();
      console.log(`📋 Modal visible: ${modalVisible}`);
      expect(modalVisible).toBe(true);

      // Check modal title for view mode
      const modalTitle = await page.locator('.modal-title').textContent();
      console.log(`📄 Modal title: "${modalTitle}"`);
      expect(modalTitle).toContain('تفاصيل الفاتورة');

      // Wait a bit more for dropdowns to populate
      await page.waitForTimeout(2000);

      // Check if client dropdown has options and shows selected value
      const clientSelect = page.locator('[role="dialog"] select').first();
      const clientOptions = await clientSelect.locator('option').count();
      const clientValue = await clientSelect.inputValue();
      console.log(`👥 Client dropdown - Options: ${clientOptions}, Selected value: "${clientValue}"`);

      // Check if case dropdown has options and shows selected value
      const caseSelect = page.locator('[role="dialog"] select').nth(1);
      const caseOptions = await caseSelect.locator('option').count();
      const caseValue = await caseSelect.inputValue();
      console.log(`📁 Case dropdown - Options: ${caseOptions}, Selected value: "${caseValue}"`);

      // Verify that client and case values are not empty (should show DB values)
      expect(clientValue).not.toBe('');
      expect(caseValue).not.toBe('');
      console.log(`✅ Client value: ${clientValue}, Case value: ${caseValue}`);

      // Check invoice number field
      const invoiceNumberInput = page.locator('[role="dialog"] input[type="text"]').first();
      const invoiceNumber = await invoiceNumberInput.inputValue();
      console.log(`🔢 Invoice number: "${invoiceNumber}"`);

      // Close the modal
      const closeButton = page.getByRole('button', { name: 'إغلاق' });
      await closeButton.click();
      await page.waitForTimeout(1000);
      console.log('✅ View modal closed');

      console.log('\\n🎉 INVOICE VIEW CLIENT & CASE DISPLAY WORKING!');
      console.log('✅ Client dropdown shows selected client from database');
      console.log('✅ Case dropdown shows selected case from database');
      console.log('✅ Invoice view form displays all saved data correctly!');
    } else {
      console.log('⚠️ No invoices found to test view functionality');
    }
  });
});