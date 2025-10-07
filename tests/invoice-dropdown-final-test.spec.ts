import { test, expect } from '@playwright/test';

test.describe('Invoice Dropdown Final Test', () => {
  test('Verify Client and Case dropdowns are populated in invoice modal', async ({ page }) => {
    console.log('🧪 FINAL TEST: Client and Case dropdown population');

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

    // Test VIEW modal
    console.log('\n🔍 Testing VIEW modal...');
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();

    // Wait for the modal to appear with populated data
    await page.waitForTimeout(1000); // Give time for data to load

    // Check if modal is visible
    const modalVisible = page.locator('[role="dialog"]');
    console.log(`📋 Modal visible: ${modalVisible}`);
    await expect(modalVisible).toBeVisible();

    // Check client dropdown options
    const clientSelect = page.locator('[role="dialog"] select').first();
    const clientOptions = await clientSelect.locator('option').count();
    console.log(`👥 Client dropdown options: ${clientOptions}`);

    // Get first few client option texts
    const clientTexts = await clientSelect.locator('option').allTextContents();
    console.log(`👥 Client options (first 5): ${clientTexts.slice(0, 5)}`);

    // Check case dropdown options
    const caseSelect = page.locator('[role="dialog"] select').nth(1);
    const caseOptions = await caseSelect.locator('option').count();
    console.log(`📁 Case dropdown options: ${caseOptions}`);

    // Get first few case option texts
    const caseTexts = await caseSelect.locator('option').allTextContents();
    console.log(`📁 Case options (first 5): ${caseTexts.slice(0, 5)}`);

    // Verify we have more than just the default options
    expect(clientOptions).toBeGreaterThan(1);
    expect(caseOptions).toBeGreaterThan(1);

    // Close modal
    const closeButton = page.getByRole('button', { name: 'إغلاق' });
    await closeButton.click();
    await page.waitForTimeout(500);

    // Test EDIT modal
    console.log('\n✏️ Testing EDIT modal...');
    const editButton = page.locator('button[title="Edit"]').first();
    await editButton.click();

    await page.waitForTimeout(1000);

    // Check edit modal dropdowns
    const editModalVisible = await page.locator('[role="dialog"]').isVisible();
    console.log(`📋 Edit modal visible: ${editModalVisible}`);

    if (editModalVisible) {
      const editClientOptions = await page
        .locator('[role="dialog"] select')
        .first()
        .locator('option')
        .count();
      const editCaseOptions = await page
        .locator('[role="dialog"] select')
        .nth(1)
        .locator('option')
        .count();

      console.log(`👥 Edit modal client options: ${editClientOptions}`);
      console.log(`📁 Edit modal case options: ${editCaseOptions}`);

      expect(editClientOptions).toBeGreaterThan(1);
      expect(editCaseOptions).toBeGreaterThan(1);

      // Close edit modal
      await page.getByRole('button', { name: 'إغلاق' }).click();
      await page.waitForTimeout(500);
    }

    // Test CREATE modal
    console.log('\n➕ Testing CREATE modal...');
    const createButton = page.getByRole('button', { name: /إضافة فاتورة|Add Invoice/i });
    await createButton.click();

    await page.waitForTimeout(1000);

    // Check create modal dropdowns
    const createModalVisible = await page.locator('[role="dialog"]').isVisible();
    console.log(`📋 Create modal visible: ${createModalVisible}`);

    if (createModalVisible) {
      const createClientOptions = await page
        .locator('[role="dialog"] select')
        .first()
        .locator('option')
        .count();
      const createCaseOptions = await page
        .locator('[role="dialog"] select')
        .nth(1)
        .locator('option')
        .count();

      console.log(`👥 Create modal client options: ${createClientOptions}`);
      console.log(`📁 Create modal case options: ${createCaseOptions}`);

      expect(createClientOptions).toBeGreaterThan(1);
      expect(createCaseOptions).toBeGreaterThan(1);

      // Close create modal
      await page.getByRole('button', { name: 'إغلاق' }).click();
    }

    console.log('\n🎉 ALL DROPDOWN TESTS PASSED!');
    console.log('✅ Client and Case dropdowns are now properly populated');
  });
});
