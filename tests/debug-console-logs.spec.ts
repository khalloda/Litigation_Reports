import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://lit.local:8080';

test.describe('Debug Console Logs', () => {
  test('should capture console logs during report generation', async ({ page }) => {
    // Capture console messages
    const consoleMessages: { type: string; text: string; timestamp: number }[] = [];
    page.on('console', (msg) => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        timestamp: Date.now(),
      });
    });

    // Navigate and login
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const emailInput = page.locator('input[type="email"], input[name="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('admin@litigation.com');
      await page.locator('input[type="password"], input[name="password"]').fill('admin123');
      await page.locator('button[type="submit"], .btn-primary').click();
      await page.waitForTimeout(3000);
    }

    // Navigate to Reports page
    await page.goto(`${BASE_URL}/reports`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('🔍 Starting console log capture...');

    // Clear previous messages
    consoleMessages.length = 0;

    // Click the first view button
    const clientsViewButton = page.locator('button:has-text("عرض")').first();
    await clientsViewButton.click();
    console.log('🖱️ Clicked view button');

    // Wait for modal and API response
    await page.waitForSelector('.modal.show', { timeout: 10000 });
    await page.waitForTimeout(5000); // Wait for API and state updates

    // Print all console messages
    console.log('📝 Console messages captured:');
    console.log('='.repeat(80));
    consoleMessages.forEach((msg, index) => {
      console.log(`[${index + 1}] [${msg.type.toUpperCase()}] ${msg.text}`);
    });
    console.log('='.repeat(80));

    // Filter for our debug messages
    const debugMessages = consoleMessages.filter(
      (msg) =>
        msg.text.includes('🔍') ||
        msg.text.includes('📡') ||
        msg.text.includes('✅') ||
        msg.text.includes('❌') ||
        msg.text.includes('🔄')
    );

    console.log(`🔍 Debug messages: ${debugMessages.length}`);
    debugMessages.forEach((msg) => {
      console.log(`  [${msg.type}] ${msg.text}`);
    });

    // Check for API response messages
    const apiMessages = consoleMessages.filter(
      (msg) =>
        msg.text.includes('API response') ||
        msg.text.includes('Response data length') ||
        msg.text.includes('Setting reportData')
    );

    console.log(`📡 API-related messages: ${apiMessages.length}`);
    apiMessages.forEach((msg) => {
      console.log(`  [${msg.type}] ${msg.text}`);
    });

    // Check for errors
    const errorMessages = consoleMessages.filter((msg) => msg.type === 'error');
    console.log(`❌ Error messages: ${errorMessages.length}`);
    errorMessages.forEach((msg) => {
      console.log(`  [ERROR] ${msg.text}`);
    });

    // Take screenshot
    await page.screenshot({ path: 'test-results/debug-console-logs.png', fullPage: true });

    // We expect to see debug messages if our changes are applied
    expect(
      debugMessages.length,
      'Should have debug messages from generateDetailedReport'
    ).toBeGreaterThan(0);

    console.log('✅ Console log capture completed');
  });
});
