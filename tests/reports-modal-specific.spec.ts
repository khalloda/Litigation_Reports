import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://lit.local:8080';

test.describe('Reports Modal Specific Tests', () => {
  test('should display clients data in the modal table specifically', async ({ page }) => {
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

    console.log('📋 Testing modal-specific table content...');

    // Ensure no modal is open initially
    const initialModalCount = await page.locator('.modal.show').count();
    console.log(`Initial modals open: ${initialModalCount}`);

    // Click the first view button (clients)
    const clientsViewButton = page.locator('button:has-text("عرض")').first();
    await clientsViewButton.click();
    console.log('🖱️ Clicked Clients View button');

    // Wait specifically for the modal to appear and be visible
    await page.waitForSelector('.modal.show', { timeout: 10000 });
    console.log('✅ Modal appeared');

    // Wait for the modal to be fully loaded
    await page.waitForTimeout(3000);

    // Verify modal is open and contains the correct title
    const modalTitle = await page.locator('.modal.show .modal-title').textContent();
    console.log(`📑 Modal title: "${modalTitle}"`);
    expect(modalTitle).toContain('تقرير');
    expect(modalTitle).toContain('العملاء');

    // Check specifically for tables within the modal
    const modalTablesCount = await page.locator('.modal.show table').count();
    console.log(`📊 Tables in modal: ${modalTablesCount}`);

    if (modalTablesCount > 0) {
      // Get the modal table content specifically
      const modalTable = page.locator('.modal.show .table-responsive table').first();

      // Check headers of the modal table
      const modalHeaders = await modalTable.locator('thead th').allTextContents();
      console.log('📋 Modal table headers:', modalHeaders);

      // Check if headers contain client-related terms
      const hasClientHeaders = modalHeaders.some(
        (header) =>
          header.includes('العميل') ||
          header.includes('client') ||
          header.includes('اسم') ||
          header.includes('النوع') ||
          header.includes('الحالة')
      );

      console.log(`👤 Has client-related headers: ${hasClientHeaders}`);

      // Count rows in the modal table
      const modalRowsCount = await modalTable.locator('tbody tr').count();
      console.log(`📄 Modal table rows: ${modalRowsCount}`);

      if (modalRowsCount > 0) {
        // Get first few rows content
        const firstRowCells = await modalTable
          .locator('tbody tr')
          .first()
          .locator('td')
          .allTextContents();
        console.log('📝 First row cells in modal:', firstRowCells);

        // Check for actual client data
        const modalTableText = await modalTable.textContent();
        const hasClientData =
          modalTableText?.includes('Test Direct Upload Client') ||
          modalTableText?.includes('Sarie Eldin') ||
          modalTableText?.includes('ساري الدين') ||
          modalTableText?.includes('company') ||
          modalTableText?.includes('individual') ||
          modalTableText?.includes('active');

        console.log(`👥 Modal has client data: ${hasClientData}`);
        console.log('📊 Modal table content sample:', modalTableText?.substring(0, 200));

        // Assertions for modal table
        expect(modalRowsCount, 'Modal should have data rows').toBeGreaterThan(0);
        expect(hasClientData, 'Modal should show actual client data').toBe(true);
      } else {
        console.log('❌ No rows in modal table');
      }
    } else {
      console.log('❌ No tables found in modal');
    }

    // Check summary section in modal
    const modalSummary = page.locator('.modal.show h6:has-text("ملخص التقرير")');
    const hasSummary = (await modalSummary.count()) > 0;
    console.log(`📊 Modal has summary section: ${hasSummary}`);

    if (hasSummary) {
      const summaryContent = await page
        .locator('.modal.show .card-body:has(h6:has-text("ملخص التقرير"))')
        .textContent();
      console.log('📈 Summary content:', summaryContent?.substring(0, 200));
    }

    // Take screenshot of the modal specifically
    await page.screenshot({ path: 'test-results/modal-specific-content.png', fullPage: true });

    console.log('✅ Modal-specific test completed');
  });

  test('should debug modal DOM structure', async ({ page }) => {
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

    console.log('🔍 Debugging modal DOM structure...');

    // Count all tables on the page before clicking
    const initialTablesCount = await page.locator('table').count();
    console.log(`📊 Tables on page initially: ${initialTablesCount}`);

    // Click the first view button
    const clientsViewButton = page.locator('button:has-text("عرض")').first();
    await clientsViewButton.click();

    // Wait for modal
    await page.waitForSelector('.modal.show', { timeout: 10000 });
    await page.waitForTimeout(3000);

    // Count all tables after modal opens
    const finalTablesCount = await page.locator('table').count();
    console.log(`📊 Tables on page after modal: ${finalTablesCount}`);

    // Get all modal elements
    const modalExists = await page.locator('.modal.show').count();
    console.log(`🔍 Modals open: ${modalExists}`);

    if (modalExists > 0) {
      // Get modal HTML structure
      const modalHTML = await page.locator('.modal.show .modal-body').innerHTML();
      console.log('📄 Modal body HTML:');
      console.log(modalHTML.substring(0, 500) + '...');

      // Check if modal body contains table-responsive div
      const hasTableDiv = modalHTML.includes('table-responsive');
      console.log(`📋 Modal has table-responsive div: ${hasTableDiv}`);

      // Check if modal body contains actual table
      const hasTable = modalHTML.includes('<table');
      console.log(`📊 Modal has table element: ${hasTable}`);
    }

    await page.screenshot({ path: 'test-results/modal-dom-debug.png', fullPage: true });

    console.log('🔍 DOM debug completed');
  });
});
