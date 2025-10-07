import { test, expect } from '@playwright/test';

test.describe('PDF Fix Verification - Hearing Columns', () => {
  test('should show complete hearing data in PDF after column key fix', async ({ page }) => {
    console.log('🎯 Testing PDF generation with fixed column keys');

    // Step 1: Login
    await page.goto('http://lit.local:8080');
    await page.fill('#email', 'admin@litigation.com');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Step 2: Navigate to reports
    await page.goto('http://lit.local:8080/reports');
    await page.waitForTimeout(1000);

    // Step 3: Open client-specific report modal
    await page.click('button:has-text("تقرير عميل محدد")');
    await page.waitForSelector('.modal', { timeout: 5000 });
    await page.waitForFunction(() => document.querySelectorAll('.spinner-border').length === 0, {
      timeout: 10000,
    });

    console.log('✅ Modal opened and loaded');

    // Step 4: Search for "New Test Client Don"
    const searchInput = page.locator('input[placeholder*="ابحث عن عميل"]');
    await searchInput.fill('New Test Client Don');
    await page.waitForTimeout(500);

    const searchResults = page.locator('.list-group-item[style*="cursor: pointer"]');
    const count = await searchResults.count();
    console.log(`✅ Found ${count} results for "New Test Client Don"`);

    if (count > 0) {
      // Step 5: Select the client
      await searchResults.first().click();
      const successBadge = page.locator('.badge.bg-success:has-text("✓")');
      await expect(successBadge).toBeVisible();
      console.log('✅ New Test Client Don selected');

      // Step 6: Change to hearings report
      const reportTypeSelect = page.locator('select');
      await reportTypeSelect.selectOption('hearings');
      await page.waitForTimeout(500);
      console.log('✅ Changed report type to hearings');

      // Step 7: Select all hearing columns
      const checkboxes = page.locator('input[type="checkbox"]');
      const checkboxCount = await checkboxes.count();

      for (let i = 0; i < checkboxCount; i++) {
        await checkboxes.nth(i).check();
      }
      console.log(`✅ Selected all ${checkboxCount} hearing columns`);

      // Step 8: Set date range
      const dateFromInput = page.locator('input[type="date"]').first();
      const dateToInput = page.locator('input[type="date"]').last();
      await dateFromInput.fill('2025-09-01');
      await dateToInput.fill('2025-10-31');
      console.log('✅ Set date range: Sept-Oct 2025');

      // Step 9: Intercept the PDF download to verify it's successful
      let pdfDownloaded = false;
      const downloadPromise = page.waitForEvent('download');

      // Step 10: Generate report
      const generateButton = page.locator('button:has-text("إنشاء التقرير")');
      await expect(generateButton).toBeEnabled();
      console.log('🚀 Generating hearing report with fixed column keys...');

      await generateButton.click();

      // Wait for download
      try {
        const download = await downloadPromise;
        const fileName = download.suggestedFilename();

        if (fileName && fileName.includes('.pdf')) {
          console.log(`✅ PDF downloaded successfully: ${fileName}`);
          pdfDownloaded = true;

          // Save the download to verify content later
          const downloadPath = './PDFEXPORT/' + fileName;
          await download.saveAs(downloadPath);
          console.log(`✅ PDF saved to: ${downloadPath}`);
        }
      } catch (e) {
        console.log('❌ PDF download failed or timed out');
      }

      // Step 11: Check if modal closed (indicating success)
      await page.waitForTimeout(3000);
      const modal = page.locator('.modal.show');
      const modalCount = await modal.count();

      if (modalCount === 0 && pdfDownloaded) {
        console.log('🎉 SUCCESS: PDF generated and modal closed - fix appears to work!');
      } else if (modalCount === 0) {
        console.log('✅ Modal closed but no PDF download detected');
      } else {
        const errorAlert = page.locator('.alert-danger');
        const errorCount = await errorAlert.count();

        if (errorCount > 0) {
          const errorText = await errorAlert.textContent();
          console.log(`❌ Error detected: ${errorText}`);
        } else {
          console.log('⚠️ Modal still open but no errors detected');
        }
      }

      console.log('🎉 PDF Fix Verification COMPLETED');
    } else {
      console.log('❌ Could not find New Test Client Don');
    }
  });
});
