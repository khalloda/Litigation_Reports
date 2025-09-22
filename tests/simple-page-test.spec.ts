import { test, expect } from '@playwright/test';

test.describe('Simple Page Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page and authenticate
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Login with test credentials
    await page.fill('input[type="email"]', 'admin@litigation.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Wait for successful login and redirect
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
  });

  test('Dashboard should load successfully', async ({ page }) => {
    console.log('🧪 Testing Dashboard page...');

    // Verify we're on the dashboard
    await expect(page.url()).toContain('dashboard');

    // Check for dashboard elements
    await expect(page.locator('h2')).toContainText(['اللوحة الرئيسية', 'Dashboard']);

    console.log('✅ Dashboard loaded successfully');
  });

  test('Clients page should load successfully', async ({ page }) => {
    console.log('🧪 Testing Clients page navigation...');

    // Navigate to clients page
    await page.click('[data-testid="nav-clients"], a[href*="clients"]');
    await page.waitForURL('**/clients');
    await page.waitForLoadState('networkidle');

    // Verify page loaded with correct title
    await expect(page.locator('h2')).toContainText(['إدارة العملاء', 'Client Management']);

    // Check for table structure
    const table = page.locator('.table, [data-testid="clients-table"]');
    await expect(table).toBeVisible();

    console.log('✅ Clients page loaded successfully');
  });

  test('Cases page should load successfully', async ({ page }) => {
    console.log('🧪 Testing Cases page navigation...');

    // Navigate to cases page
    await page.click('[data-testid="nav-cases"], a[href*="cases"]');
    await page.waitForURL('**/cases');
    await page.waitForLoadState('networkidle');

    // Verify page loaded with correct title
    await expect(page.locator('h2')).toContainText(['إدارة القضايا', 'Case Management']);

    // Check for table structure
    const table = page.locator('.table, [data-testid="cases-table"]');
    await expect(table).toBeVisible();

    console.log('✅ Cases page loaded successfully');
  });

  test('Lawyers page should load successfully', async ({ page }) => {
    console.log('🧪 Testing Lawyers page navigation...');

    // Navigate to lawyers page
    await page.click('[data-testid="nav-lawyers"], a[href*="lawyers"]');
    await page.waitForURL('**/lawyers');
    await page.waitForLoadState('networkidle');

    // Verify page loaded with correct title
    await expect(page.locator('h2')).toContainText(['إدارة المحامين', 'Lawyer Management']);

    // Check for table structure
    const table = page.locator('.table, [data-testid="lawyers-table"]');
    await expect(table).toBeVisible();

    console.log('✅ Lawyers page loaded successfully');
  });

  test('Hearings page should load successfully', async ({ page }) => {
    console.log('🧪 Testing Hearings page navigation...');

    // Navigate to hearings page
    await page.click('[data-testid="nav-hearings"], a[href*="hearings"]');
    await page.waitForURL('**/hearings');
    await page.waitForLoadState('networkidle');

    // Verify page loaded with correct title
    await expect(page.locator('h2')).toContainText(['إدارة الجلسات', 'Hearing Management']);

    // Check for table structure
    const table = page.locator('.table, [data-testid="hearings-table"]');
    await expect(table).toBeVisible();

    console.log('✅ Hearings page loaded successfully');
  });

  test('Documents page should load successfully', async ({ page }) => {
    console.log('🧪 Testing Documents page navigation...');

    // Navigate to documents page
    await page.click('[data-testid="nav-documents"], a[href*="documents"]');
    await page.waitForURL('**/documents');
    await page.waitForLoadState('networkidle');

    // Verify page loaded with correct title
    await expect(page.locator('h2')).toContainText(['إدارة المستندات', 'Document Management']);

    // Check for table structure
    const table = page.locator('.table, [data-testid="documents-table"]');
    await expect(table).toBeVisible();

    console.log('✅ Documents page loaded successfully');
  });

  test('Invoices page should load successfully', async ({ page }) => {
    console.log('🧪 Testing Invoices page navigation...');

    // Navigate to invoices page
    await page.click('[data-testid="nav-invoices"], a[href*="invoices"]');
    await page.waitForURL('**/invoices');
    await page.waitForLoadState('networkidle');

    // Verify page loaded with correct title
    await expect(page.locator('h2')).toContainText(['إدارة الفواتير', 'Invoice Management']);

    // Check for table structure
    const table = page.locator('.table, [data-testid="invoices-table"]');
    await expect(table).toBeVisible();

    console.log('✅ Invoices page loaded successfully');
  });

  test('All pages should have proper RTL support', async ({ page }) => {
    console.log('🧪 Testing RTL layout support...');

    // Test RTL on clients page
    await page.click('[data-testid="nav-clients"], a[href*="clients"]');
    await page.waitForURL('**/clients');

    // Check for Arabic text
    await expect(page.locator('text=إدارة العملاء')).toBeVisible();

    // Check HTML direction attribute
    const htmlElement = page.locator('html');
    const direction = await htmlElement.getAttribute('dir');
    expect(direction).toBe('rtl');

    console.log('✅ RTL layout working correctly');
  });
});
