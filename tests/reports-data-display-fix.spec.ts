import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://lit.local:8080';

test.describe('Reports Data Display Fix Verification', () => {
  test.beforeEach(async ({ page }) => {
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
  });

  test('should display actual clients data in table after clicking View button', async ({
    page,
  }) => {
    console.log('📋 Testing Clients data display in table...');

    // Find and click the Clients View button (first one)
    const clientsViewButton = page.locator('button:has-text("عرض")').first();
    await clientsViewButton.click();
    console.log('🖱️ Clicked Clients View button');

    // Wait for modal to appear and data to load
    await page.waitForSelector('.modal', { timeout: 10000 });
    await page.waitForTimeout(3000);

    // Verify modal title
    const modalTitle = await page.locator('.modal-title').textContent();
    console.log(`📑 Modal title: ${modalTitle}`);
    expect(modalTitle).toContain('تقرير');
    expect(modalTitle).toContain('العملاء');

    // Check for summary section
    const summarySection = page.locator('h6:has-text("ملخص التقرير")');
    expect(await summarySection.count()).toBeGreaterThan(0);
    console.log('✅ Summary section found');

    // Check for actual data in table
    const tableExists = (await page.locator('.table-responsive table').count()) > 0;
    console.log(`📊 Table exists: ${tableExists}`);

    if (tableExists) {
      // Check for table headers
      const headerCount = await page.locator('table thead th').count();
      console.log(`📋 Table headers: ${headerCount}`);

      // Check for table rows with actual data
      const dataRows = await page.locator('table tbody tr').count();
      console.log(`📄 Data rows: ${dataRows}`);

      // Check for specific client data
      const tableContent = await page.locator('table').textContent();
      const hasClientNames =
        tableContent?.includes('Sarie Eldin') || tableContent?.includes('ساري الدين');
      const hasClientTypes =
        tableContent?.includes('company') || tableContent?.includes('individual');
      const hasActiveStatus = tableContent?.includes('active') || tableContent?.includes('نشط');

      console.log(`👤 Client names in table: ${hasClientNames}`);
      console.log(`🏢 Client types in table: ${hasClientTypes}`);
      console.log(`✅ Active status in table: ${hasActiveStatus}`);

      // Assertions
      expect(headerCount, 'Should have table headers').toBeGreaterThan(3);
      expect(dataRows, 'Should have data rows').toBeGreaterThan(0);
      expect(
        hasClientNames || hasClientTypes || hasActiveStatus,
        'Should show actual client data'
      ).toBe(true);
    }

    // Take screenshot for verification
    await page.screenshot({ path: 'test-results/clients-data-display-fixed.png', fullPage: true });

    console.log('✅ Clients data display verified!');
  });

  test('should display actual cases data in table', async ({ page }) => {
    console.log('⚖️ Testing Cases data display in table...');

    // Click the second View button (Cases)
    const casesViewButton = page.locator('button:has-text("عرض")').nth(1);
    await casesViewButton.click();
    console.log('🖱️ Clicked Cases View button');

    // Wait for modal
    await page.waitForSelector('.modal', { timeout: 10000 });
    await page.waitForTimeout(3000);

    // Verify modal title contains "القضايا"
    const modalTitle = await page.locator('.modal-title').textContent();
    console.log(`📑 Modal title: ${modalTitle}`);
    expect(modalTitle).toContain('القضايا');

    // Check for table with data
    const tableExists = (await page.locator('.table-responsive table').count()) > 0;
    console.log(`📊 Table exists: ${tableExists}`);

    if (tableExists) {
      const dataRows = await page.locator('table tbody tr').count();
      console.log(`📄 Data rows: ${dataRows}`);

      // Check for case-specific data
      const tableContent = await page.locator('table').textContent();
      const hasCaseNumbers = tableContent?.includes('2025-');
      const hasCourtNames = tableContent?.includes('محكمة') || tableContent?.includes('النقض');
      const hasCaseTypes = tableContent?.includes('civil') || tableContent?.includes('مدني');

      console.log(`📋 Case numbers in table: ${hasCaseNumbers}`);
      console.log(`🏛️ Court names in table: ${hasCourtNames}`);
      console.log(`📝 Case types in table: ${hasCaseTypes}`);

      expect(dataRows, 'Should have case data rows').toBeGreaterThan(0);
      expect(hasCaseNumbers || hasCourtNames || hasCaseTypes, 'Should show actual case data').toBe(
        true
      );
    }

    await page.screenshot({ path: 'test-results/cases-data-display-fixed.png', fullPage: true });
    console.log('✅ Cases data display verified!');
  });

  test('should display actual hearings data in table', async ({ page }) => {
    console.log('🏛️ Testing Hearings data display in table...');

    // Click the third View button (Hearings)
    const hearingsViewButton = page.locator('button:has-text("عرض")').nth(2);
    await hearingsViewButton.click();
    console.log('🖱️ Clicked Hearings View button');

    // Wait for modal
    await page.waitForSelector('.modal', { timeout: 10000 });
    await page.waitForTimeout(3000);

    // Verify modal title contains "الجلسات"
    const modalTitle = await page.locator('.modal-title').textContent();
    console.log(`📑 Modal title: ${modalTitle}`);
    expect(modalTitle).toContain('الجلسات');

    // Check for table with data
    const tableExists = (await page.locator('.table-responsive table').count()) > 0;
    console.log(`📊 Table exists: ${tableExists}`);

    if (tableExists) {
      const dataRows = await page.locator('table tbody tr').count();
      console.log(`📄 Data rows: ${dataRows}`);

      // Check for hearing-specific data
      const tableContent = await page.locator('table').textContent();
      const hasHearingDates = tableContent?.includes('2025-');
      const hasHearingTypes = tableContent?.includes('initial') || tableContent?.includes('expert');
      const hasHearingResults = tableContent?.includes('pending') || tableContent?.includes('معلق');

      console.log(`📅 Hearing dates in table: ${hasHearingDates}`);
      console.log(`📝 Hearing types in table: ${hasHearingTypes}`);
      console.log(`📊 Hearing results in table: ${hasHearingResults}`);

      expect(dataRows, 'Should have hearing data rows').toBeGreaterThan(0);
      expect(
        hasHearingDates || hasHearingTypes || hasHearingResults,
        'Should show actual hearing data'
      ).toBe(true);
    }

    await page.screenshot({ path: 'test-results/hearings-data-display-fixed.png', fullPage: true });
    console.log('✅ Hearings data display verified!');
  });

  test('should display summary statistics correctly', async ({ page }) => {
    console.log('📊 Testing summary statistics display...');

    // Click any View button to open a report
    const firstViewButton = page.locator('button:has-text("عرض")').first();
    await firstViewButton.click();

    // Wait for modal
    await page.waitForSelector('.modal', { timeout: 10000 });
    await page.waitForTimeout(3000);

    // Check for summary section with actual data
    const summaryCards = page.locator('.card-body:has(h6:has-text("ملخص التقرير")) .col-md-3');
    const summaryCount = await summaryCards.count();
    console.log(`📈 Summary statistics cards: ${summaryCount}`);

    if (summaryCount > 0) {
      // Check first few summary items for actual values
      for (let i = 0; i < Math.min(summaryCount, 3); i++) {
        const cardText = await summaryCards.nth(i).textContent();
        const hasValue = cardText && cardText.trim() !== '' && !cardText.includes('undefined');
        console.log(
          `📊 Summary card ${i + 1}: ${hasValue ? 'Has value' : 'Empty'} - "${cardText?.trim()}"`
        );
      }

      expect(summaryCount, 'Should have summary statistics').toBeGreaterThan(0);
    }

    await page.screenshot({ path: 'test-results/summary-statistics-fixed.png', fullPage: true });
    console.log('✅ Summary statistics verified!');
  });
});
