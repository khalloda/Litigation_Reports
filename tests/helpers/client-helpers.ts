import { Page, expect } from '@playwright/test';

export interface ClientData {
  nameAr: string;
  nameEn?: string;
  type: 'individual' | 'company';
  serviceType: 'cash' | 'probono';
  status: 'active' | 'inactive' | 'disabled';
  contactLawyer: string;
  phone?: string;
  email?: string;
  addressAr?: string;
  addressEn?: string;
  notesAr?: string;
  notesEn?: string;
  logoPath?: string;
}

export class ClientHelpers {
  /**
   * Create a new client with the given data
   */
  async createClient(page: Page, data: ClientData): Promise<void> {
    // Click add client button
    await page.click('[data-testid="add-client-btn"]');
    await page.waitForSelector('.modal');

    // Fill required Arabic name
    const arabicNameInput = page.locator('input[placeholder*="اسم العميل بالعربية"], input[placeholder*="Arabic client name"]').first();
    await arabicNameInput.fill(data.nameAr);

    // Fill English name if provided
    if (data.nameEn) {
      const englishNameInput = page.locator('input[placeholder*="اسم العميل بالإنجليزية"], input[placeholder*="English client name"]').first();
      await englishNameInput.fill(data.nameEn);
    }

    // Select client type
    const typeSelect = page.locator('select').first();
    await typeSelect.selectOption(data.type);

    // Select service type
    const serviceSelect = page.locator('select').nth(1);
    await serviceSelect.selectOption(data.serviceType);

    // Select status
    const statusSelect = page.locator('select').nth(2);
    await statusSelect.selectOption(data.status);

    // Fill contact lawyer (required)
    const lawyerInput = page.locator('input[placeholder*="المحامي"], input[placeholder*="lawyer"]').first();
    await lawyerInput.fill(data.contactLawyer);

    // Fill optional fields
    if (data.phone) {
      const phoneInput = page.locator('input[type="tel"]');
      await phoneInput.fill(data.phone);
    }

    if (data.email) {
      const emailInput = page.locator('input[type="email"]');
      await emailInput.fill(data.email);
    }

    if (data.addressAr) {
      const addressArTextarea = page.locator('textarea[placeholder*="العنوان بالعربية"], textarea[placeholder*="Arabic address"]').first();
      await addressArTextarea.fill(data.addressAr);
    }

    if (data.addressEn) {
      const addressEnTextarea = page.locator('textarea[placeholder*="العنوان بالإنجليزية"], textarea[placeholder*="English address"]').first();
      await addressEnTextarea.fill(data.addressEn);
    }

    if (data.notesAr) {
      const notesArTextarea = page.locator('textarea[placeholder*="ملاحظات"], textarea[placeholder*="notes"]').first();
      await notesArTextarea.fill(data.notesAr);
    }

    if (data.notesEn) {
      const notesEnTextarea = page.locator('textarea[placeholder*="ملاحظات"], textarea[placeholder*="notes"]').nth(1);
      await notesEnTextarea.fill(data.notesEn);
    }

    // Upload logo if provided
    if (data.logoPath) {
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(data.logoPath);

      // Wait for preview to appear
      await page.waitForSelector('img[alt="Client Logo Preview"]', { timeout: 5000 });
    }

    // Submit the form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for modal to close
    await page.waitForSelector('.modal', { state: 'hidden', timeout: 10000 });

    // Wait for the client to appear in the list
    await page.waitForSelector(`text=${data.nameAr}`, { timeout: 5000 });
  }

  /**
   * Edit an existing client
   */
  async editClient(page: Page, clientName: string, updatedData: Partial<ClientData>): Promise<void> {
    // Find and click edit button for the client
    const clientRow = page.locator(`tr:has-text("${clientName}")`);
    await clientRow.locator('[data-testid="edit-client"]').click();

    await page.waitForSelector('.modal');

    // Update fields as needed
    if (updatedData.nameAr) {
      const arabicNameInput = page.locator('input[placeholder*="اسم العميل بالعربية"], input[placeholder*="Arabic client name"]').first();
      await arabicNameInput.clear();
      await arabicNameInput.fill(updatedData.nameAr);
    }

    if (updatedData.nameEn) {
      const englishNameInput = page.locator('input[placeholder*="اسم العميل بالإنجليزية"], input[placeholder*="English client name"]').first();
      await englishNameInput.clear();
      await englishNameInput.fill(updatedData.nameEn);
    }

    if (updatedData.phone) {
      const phoneInput = page.locator('input[type="tel"]');
      await phoneInput.clear();
      await phoneInput.fill(updatedData.phone);
    }

    if (updatedData.status) {
      const statusSelect = page.locator('select').nth(2);
      await statusSelect.selectOption(updatedData.status);
    }

    // Submit the form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for modal to close
    await page.waitForSelector('.modal', { state: 'hidden', timeout: 10000 });
  }

  /**
   * View client details
   */
  async viewClient(page: Page, clientName: string): Promise<void> {
    // Find and click view button for the client
    const clientRow = page.locator(`tr:has-text("${clientName}")`);
    await clientRow.locator('[data-testid="view-client"]').click();

    await page.waitForSelector('.modal');

    // Verify we're in view mode (fields should be disabled)
    await expect(page.locator('input').first()).toBeDisabled();
  }

  /**
   * Delete a client
   */
  async deleteClient(page: Page, clientName: string): Promise<void> {
    // Find and click delete button for the client
    const clientRow = page.locator(`tr:has-text("${clientName}")`);
    await clientRow.locator('[data-testid="delete-client"]').click();

    // Confirm deletion in alert/confirmation dialog
    page.on('dialog', dialog => dialog.accept());

    // Wait for client to be removed from list
    await page.waitForSelector(`text=${clientName}`, { state: 'hidden', timeout: 5000 });
  }

  /**
   * Search for clients
   */
  async searchClients(page: Page, searchTerm: string): Promise<void> {
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill(searchTerm);
    await page.waitForTimeout(500); // Wait for debounced search
  }

  /**
   * Filter clients by type
   */
  async filterClientsByType(page: Page, type: 'all' | 'individual' | 'company'): Promise<void> {
    const typeFilter = page.locator('[data-testid="type-filter"]');
    await typeFilter.selectOption(type);
  }

  /**
   * Filter clients by status
   */
  async filterClientsByStatus(page: Page, status: 'all' | 'active' | 'inactive' | 'disabled'): Promise<void> {
    const statusFilter = page.locator('[data-testid="status-filter"]');
    await statusFilter.selectOption(status);
  }

  /**
   * Get client count from table
   */
  async getClientCount(page: Page): Promise<number> {
    const rows = await page.locator('tbody tr').count();
    return rows;
  }

  /**
   * Verify client exists in list
   */
  async verifyClientExists(page: Page, clientName: string): Promise<boolean> {
    try {
      await page.waitForSelector(`text=${clientName}`, { timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verify client logo is displayed
   */
  async verifyClientLogo(page: Page, clientName: string): Promise<void> {
    const logoImg = page.locator(`img[alt*="${clientName} Logo"]`);
    await expect(logoImg).toBeVisible();
    await expect(logoImg).toHaveAttribute('src', /blob:|data:|http/);
  }

  /**
   * Get client data from row
   */
  async getClientFromRow(page: Page, clientName: string): Promise<any> {
    const row = page.locator(`tr:has-text("${clientName}")`);
    const cells = await row.locator('td').allTextContents();

    return {
      name: cells[1] || '',
      type: cells[2] || '',
      lawyer: cells[3] || '',
      phone: cells[4] || '',
      email: cells[5] || '',
      status: cells[6] || ''
    };
  }

  /**
   * Verify form validation
   */
  async verifyRequiredFieldValidation(page: Page): Promise<void> {
    // Click add client button
    await page.click('[data-testid="add-client-btn"]');
    await page.waitForSelector('.modal');

    // Try to submit without filling required fields
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Verify validation messages appear
    await expect(page.locator('.invalid-feedback')).toBeVisible();
  }

  /**
   * Test logo upload validation
   */
  async testLogoValidation(page: Page, filePath: string, shouldFail: boolean = false): Promise<void> {
    await page.click('[data-testid="add-client-btn"]');
    await page.waitForSelector('.modal');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);

    if (shouldFail) {
      // Expect error message
      await expect(page.locator('.invalid-feedback')).toBeVisible();
    } else {
      // Expect preview to appear
      await expect(page.locator('img[alt="Client Logo Preview"]')).toBeVisible();
    }
  }
}