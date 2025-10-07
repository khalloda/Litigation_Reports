import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://lit.local:8080';

test.describe('Modal HTML Capture', () => {
  test('should capture complete modal HTML', async ({ page }) => {
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

    console.log('🔍 Capturing complete modal HTML...');

    // Click the first view button
    const clientsViewButton = page.locator('button:has-text("عرض")').first();
    await clientsViewButton.click();
    console.log('🖱️ Clicked view button');

    // Wait for modal
    await page.waitForSelector('.modal.show', { timeout: 10000 });
    await page.waitForTimeout(5000); // Wait longer for data to load

    // Get complete modal HTML
    const modalHTML = await page.locator('.modal.show').innerHTML();
    console.log('📄 COMPLETE MODAL HTML:');
    console.log('='.repeat(80));
    console.log(modalHTML);
    console.log('='.repeat(80));

    // Check for specific elements
    const hasDebugSection = modalHTML.includes('Debug:');
    const hasLoadingSection = modalHTML.includes('reportLoading:');
    const hasReportDataSection = modalHTML.includes('reportData:');
    const hasSummarySection = modalHTML.includes('ملخص التقرير');

    console.log(`🔍 Debug section: ${hasDebugSection}`);
    console.log(`⏳ Loading section: ${hasLoadingSection}`);
    console.log(`📊 ReportData section: ${hasReportDataSection}`);
    console.log(`📈 Summary section: ${hasSummarySection}`);

    // Also check the page console for any errors
    const consoleMessages: { type: string; text: string }[] = [];
    page.on('console', (msg) => {
      consoleMessages.push({ type: msg.type(), text: msg.text() });
    });

    // Wait a bit more to catch any console messages
    await page.waitForTimeout(2000);

    if (consoleMessages.length > 0) {
      console.log('📝 Console messages:');
      consoleMessages.forEach((msg) => {
        console.log(`  [${msg.type.toUpperCase()}] ${msg.text}`);
      });
    }

    // Take screenshot
    await page.screenshot({ path: 'test-results/modal-html-capture.png', fullPage: true });

    console.log('✅ HTML capture completed');
  });
});
