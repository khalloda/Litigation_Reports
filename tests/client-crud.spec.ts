import { test, expect } from '@playwright/test';
import { LoginHelpers } from './helpers/login-helpers';
import { ClientHelpers } from './helpers/client-helpers';

const loginHelpers = new LoginHelpers();
const clientHelpers = new ClientHelpers();

test.describe('Client CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await loginHelpers.login(page, 'admin@litigation.com', 'password123');
    await page.waitForURL('**/dashboard');

    // Navigate to clients page
    await page.click('[data-testid="nav-clients"]');
    await page.waitForURL('**/clients');
  });

  test('should display clients list', async ({ page }) => {
    // Check if clients page loads
    await expect(page.locator('h2')).toContainText(['العملاء', 'Clients']);

    // Check for add client button
    await expect(page.locator('[data-testid="add-client-btn"]')).toBeVisible();

    // Check for clients table
    await expect(page.locator('.table')).toBeVisible();
  });

  test('should create new individual client without logo', async ({ page }) => {
    const clientData = {
      nameAr: 'أحمد محمد علي',
      nameEn: 'Ahmed Mohammed Ali',
      type: 'individual',
      serviceType: 'cash',
      status: 'active',
      contactLawyer: 'محمد أحمد',
      phone: '+966501234567',
      email: 'ahmed@example.com',
      addressAr: 'الرياض، المملكة العربية السعودية',
      addressEn: 'Riyadh, Saudi Arabia',
      notesAr: 'عميل جديد - فرد',
      notesEn: 'New client - individual',
    };

    await clientHelpers.createClient(page, clientData);

    // Verify client appears in list
    await expect(page.locator(`text=${clientData.nameAr}`)).toBeVisible();
    await expect(page.locator(`text=${clientData.email}`)).toBeVisible();
  });

  test('should create new company client with logo', async ({ page }) => {
    const clientData = {
      nameAr: 'شركة التقنية المتقدمة',
      nameEn: 'Advanced Technology Company',
      type: 'company',
      serviceType: 'cash',
      status: 'active',
      contactLawyer: 'سارة أحمد',
      phone: '+966501234568',
      email: 'info@advtech.com',
      addressAr: 'جدة، المملكة العربية السعودية',
      addressEn: 'Jeddah, Saudi Arabia',
      notesAr: 'شركة تقنية كبيرة',
      notesEn: 'Large technology company',
      logoPath: 'tests/fixtures/company-logo.png',
    };

    await clientHelpers.createClient(page, clientData);

    // Verify client appears in list with logo
    await expect(page.locator(`text=${clientData.nameAr}`)).toBeVisible();

    // Check if logo indicator is present
    const logoIndicator = page.locator(`[data-testid="client-logo-${clientData.nameAr}"]`);
    await expect(logoIndicator).toBeVisible();
  });

  test('should edit existing client', async ({ page }) => {
    // First create a client
    const originalData = {
      nameAr: 'عميل للتعديل',
      nameEn: 'Client to Edit',
      type: 'individual',
      serviceType: 'cash',
      status: 'active',
      contactLawyer: 'محامي تجريبي',
      phone: '+966501111111',
      email: 'edit@test.com',
    };

    await clientHelpers.createClient(page, originalData);

    // Edit the client
    const updatedData = {
      ...originalData,
      nameAr: 'عميل تم تعديله',
      nameEn: 'Edited Client',
      phone: '+966502222222',
      status: 'inactive',
    };

    await clientHelpers.editClient(page, originalData.nameAr, updatedData);

    // Verify changes
    await expect(page.locator(`text=${updatedData.nameAr}`)).toBeVisible();
    await expect(page.locator(`text=${updatedData.phone}`)).toBeVisible();
  });

  test('should view client details', async ({ page }) => {
    const clientData = {
      nameAr: 'عميل للعرض',
      nameEn: 'Client to View',
      type: 'company',
      serviceType: 'probono',
      status: 'active',
      contactLawyer: 'محامي العرض',
      phone: '+966503333333',
      email: 'view@test.com',
      addressAr: 'الدمام، السعودية',
      notesAr: 'ملاحظات تجريبية',
    };

    await clientHelpers.createClient(page, clientData);
    await clientHelpers.viewClient(page, clientData.nameAr);

    // Verify all details are displayed
    await expect(page.locator(`input[value="${clientData.nameAr}"]`)).toBeDisabled();
    await expect(page.locator(`input[value="${clientData.email}"]`)).toBeDisabled();
    await expect(page.locator('textarea')).toContainText(clientData.notesAr);
  });

  test('should delete client', async ({ page }) => {
    const clientData = {
      nameAr: 'عميل للحذف',
      nameEn: 'Client to Delete',
      type: 'individual',
      serviceType: 'cash',
      status: 'active',
      contactLawyer: 'محامي الحذف',
      phone: '+966504444444',
      email: 'delete@test.com',
    };

    await clientHelpers.createClient(page, clientData);
    await clientHelpers.deleteClient(page, clientData.nameAr);

    // Verify client is removed from list
    await expect(page.locator(`text=${clientData.nameAr}`)).toBeHidden();
  });

  test('should upload and display client logo', async ({ page }) => {
    // Click add client button
    await page.click('[data-testid="add-client-btn"]');
    await page.waitForSelector('.modal');

    // Fill basic info
    await page.fill('input[placeholder*="اسم العميل"]', 'شركة مع شعار');
    await page.selectOption('select', 'company');
    await page.fill('input[placeholder*="المحامي"]', 'محامي تجريبي');

    // Upload logo
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/test-logo.png');

    // Verify preview appears
    await expect(page.locator('img[alt="Client Logo Preview"]')).toBeVisible();

    // Save client
    await page.click('button[type="submit"]');
    await page.waitForSelector('.modal', { state: 'hidden' });

    // Verify logo displays in client list
    const logoImg = page.locator('img[alt*="شركة مع شعار Logo"]');
    await expect(logoImg).toBeVisible();
    await expect(logoImg).toHaveAttribute('src', /blob:/);
  });

  test('should handle logo validation errors', async ({ page }) => {
    await page.click('[data-testid="add-client-btn"]');
    await page.waitForSelector('.modal');

    // Try to upload invalid file type
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/invalid-file.txt');

    // Verify error message appears
    await expect(page.locator('.invalid-feedback')).toContainText([
      'يرجى اختيار ملف صورة صحيح',
      'Please select a valid image file',
    ]);
  });

  test('should search and filter clients', async ({ page }) => {
    // Create multiple clients for testing
    const clients = [
      { nameAr: 'أحمد السعيد', nameEn: 'Ahmed Alsaeed', type: 'individual' },
      { nameAr: 'شركة التقنية', nameEn: 'Tech Company', type: 'company' },
      { nameAr: 'محمد علي', nameEn: 'Mohammed Ali', type: 'individual' },
    ];

    for (const client of clients) {
      await clientHelpers.createClient(page, {
        ...client,
        serviceType: 'cash',
        status: 'active',
        contactLawyer: 'محامي تجريبي',
        phone: '+966501111111',
        email: `${client.nameEn.toLowerCase().replace(' ', '')}@test.com`,
      });
    }

    // Test search functionality
    await page.fill('[data-testid="search-input"]', 'أحمد');
    await page.waitForTimeout(500);

    await expect(page.locator('text=أحمد السعيد')).toBeVisible();
    await expect(page.locator('text=شركة التقنية')).toBeHidden();

    // Clear search
    await page.fill('[data-testid="search-input"]', '');

    // Test type filter
    await page.selectOption('[data-testid="type-filter"]', 'company');
    await expect(page.locator('text=شركة التقنية')).toBeVisible();
    await expect(page.locator('text=أحمد السعيد')).toBeHidden();
  });

  test('should handle bilingual display correctly', async ({ page }) => {
    const clientData = {
      nameAr: 'شركة المستقبل للتقنية',
      nameEn: 'Future Technology Company',
      type: 'company',
      serviceType: 'cash',
      status: 'active',
      contactLawyer: 'سارة أحمد',
      phone: '+966505555555',
      email: 'future@tech.com',
    };

    await clientHelpers.createClient(page, clientData);

    // Switch to English and verify display
    await page.click('[data-testid="language-toggle"]');
    await page.waitForTimeout(500);

    await expect(page.locator('h2')).toContainText('Clients');
    await expect(page.locator(`text=${clientData.nameEn}`)).toBeVisible();

    // Switch back to Arabic
    await page.click('[data-testid="language-toggle"]');
    await page.waitForTimeout(500);

    await expect(page.locator('h2')).toContainText('العملاء');
    await expect(page.locator(`text=${clientData.nameAr}`)).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.click('[data-testid="add-client-btn"]');
    await page.waitForSelector('.modal');

    // Try to submit without required fields
    await page.click('button[type="submit"]');

    // Verify validation messages
    await expect(page.locator('.invalid-feedback')).toContainText([
      'اسم العميل بالعربية مطلوب',
      'Arabic client name is required',
    ]);
    await expect(page.locator('.invalid-feedback')).toContainText([
      'المحامي المسؤول مطلوب',
      'Contact lawyer is required',
    ]);
  });

  test('should handle logo removal', async ({ page }) => {
    await page.click('[data-testid="add-client-btn"]');
    await page.waitForSelector('.modal');

    // Fill basic info and upload logo
    await page.fill('input[placeholder*="اسم العميل"]', 'شركة لإزالة الشعار');
    await page.fill('input[placeholder*="المحامي"]', 'محامي تجريبي');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/test-logo.png');

    // Verify preview appears
    await expect(page.locator('img[alt="Client Logo Preview"]')).toBeVisible();

    // Remove logo
    await page.click('[title*="إزالة الشعار"], [title*="Remove Logo"]');

    // Verify preview is removed
    await expect(page.locator('img[alt="Client Logo Preview"]')).toBeHidden();
    await expect(page.locator('text*="اضغط لرفع الشعار"')).toBeVisible();
  });
});
