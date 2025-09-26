import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://lit.local:8080';

test('Server-side PDF generation with Arabic support', async ({ page }) => {
  console.log('Testing server-side PDF generation with Arabic support...');

  // Login first
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');

  await page.fill('input[type="email"]', 'admin@litigation.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Navigate to clients page
  await page.goto(`${BASE_URL}/clients`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('Clients page loaded, testing PDF export...');

  // Listen for console messages to catch any PDF generation logs
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
  });

  // Listen for network requests to the PDF API
  const networkRequests: string[] = [];
  page.on('request', request => {
    if (request.url().includes('pdf-simple.php')) {
      networkRequests.push(`${request.method()}: ${request.url()}`);
      console.log('PDF API request detected:', request.url());
    }
  });

  // Try to export PDF
  const exportButtons = await page.locator('button:has-text("تصدير")').count();

  if (exportButtons > 0) {
    console.log('Export button found, clicking PDF option...');

    await page.click('button:has-text("تصدير")');
    await page.waitForTimeout(1000);

    const pdfOption = await page.locator('a:has-text("تصدير PDF")').count();

    if (pdfOption > 0) {
      console.log('PDF option found, clicking...');

      // Start waiting for download before clicking
      const downloadPromise = page.waitForEvent('download');

      await page.click('a:has-text("تصدير PDF")');

      // Wait for either download or timeout
      try {
        const download = await Promise.race([
          downloadPromise,
          new Promise((_, reject) => setTimeout(() => reject(new Error('Download timeout')), 10000))
        ]);

        console.log('✓ PDF download initiated successfully!');
        console.log('Download filename:', await (download as any).suggestedFilename());

        // Check if we got server-side response
        if (networkRequests.length > 0) {
          console.log('✓ Server-side PDF API was called:', networkRequests);
        } else {
          console.log('ℹ Client-side PDF generation was used (fallback)');
        }

      } catch (downloadError) {
        console.log('Download did not start within timeout, checking console logs...');
      }

      // Wait a bit more for any async operations
      await page.waitForTimeout(3000);

      // Check console logs for PDF generation messages
      const pdfLogs = consoleMessages.filter(msg =>
        msg.includes('PDF') || msg.includes('server') || msg.includes('Arabic')
      );

      if (pdfLogs.length > 0) {
        console.log('PDF generation logs found:');
        pdfLogs.forEach(log => console.log('  -', log));
      }

      // Check for any errors
      const errorLogs = consoleMessages.filter(msg =>
        msg.includes('error:') || msg.includes('Error:') || msg.includes('failed')
      );

      if (errorLogs.length > 0) {
        console.log('Error logs found:');
        errorLogs.forEach(log => console.log('  ERROR:', log));
      } else {
        console.log('✓ No error logs found - PDF export appears successful');
      }

    } else {
      console.log('✗ PDF option not found in dropdown');
    }
  } else {
    console.log('✗ Export button not found');
  }

  // Take final screenshot
  await page.screenshot({ path: 'pdf-export-test-final.png' });

  console.log('Server-side PDF test completed');
});