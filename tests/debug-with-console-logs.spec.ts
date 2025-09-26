import { test, expect } from '@playwright/test';

test.describe('Debug with Console Logs', () => {
  test('Check console logs when opening invoice view', async ({ page }) => {
    console.log('🧪 DEBUGGING: Console logs during invoice view');

    // Capture console messages
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });

    // Capture uncaught errors
    page.on('pageerror', error => {
      console.log(`❌ Page error: ${error.message}`);
    });

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

    // Wait for the async operations and console logs
    await page.waitForTimeout(8000);

    // Check if modal is visible
    const modalVisible = await page.locator('[role="dialog"]').isVisible();
    console.log(`📋 Modal visible: ${modalVisible}`);

    // Print all console messages
    console.log('\\n📋 Console Messages:');
    for (const message of consoleMessages) {
      console.log(`   ${message}`);
    }

    // Check client dropdown after waiting
    const clientSelect = page.locator('[role="dialog"] select').first();
    const clientOptions = await clientSelect.locator('option').count();
    console.log(`👥 Final client dropdown options: ${clientOptions}`);

    // Check case dropdown after waiting
    const caseSelect = page.locator('[role="dialog"] select').nth(1);
    const caseOptions = await caseSelect.locator('option').count();
    console.log(`📁 Final case dropdown options: ${caseOptions}`);

    // Close modal
    if (modalVisible) {
      const closeButton = page.getByRole('button', { name: 'إغلاق' });
      await closeButton.click();
    }

    console.log('\\n📊 DEBUG COMPLETE');
  });
});