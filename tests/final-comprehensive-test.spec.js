import { test, expect } from '@playwright/test';

test.describe('Complete Client Logo Upload Flow', () => {
  test('Login → Navigate to Clients → Create Client with Logo → Verify Success', async ({ page }) => {
    // Step 1: Navigate to login page
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    // Step 2: Login
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Wait for login to complete and dashboard to load
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Step 3: Navigate to clients page
    await page.click('a[href*="clients"]');
    await page.waitForLoadState('networkidle');

    // Step 4: Click "Add Client" button
    await page.click('button:has-text("Add Client")');
    await page.waitForSelector('.modal', { state: 'visible' });

    // Step 5: Fill client information
    await page.fill('input[placeholder*="اسم العميل"]', 'Test Client with Logo');
    await page.fill('input[placeholder*="Client Name"]', 'Test Client with Logo');

    // Step 6: Upload logo file
    const logoPath = 'logo/emblem_green_gold.png';
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    
    // Set the file directly on the hidden input
    await fileInput.setInputFiles(logoPath);
    
    // Wait for logo preview to appear
    await page.waitForSelector('img[src^="data:image"]', { timeout: 5000 });

    // Step 7: Click save button
    await page.click('button:has-text("Save")');
    
    // Step 8: Wait for modal to close and success indication
    await page.waitForSelector('.modal', { state: 'hidden', timeout: 10000 });
    
    // Step 9: Verify success - look for the new client in the list
    await page.waitForSelector('text=Test Client with Logo', { timeout: 10000 });
    
    // Step 10: Verify logo is displayed in the client list
    const clientRow = page.locator('tr').filter({ hasText: 'Test Client with Logo' });
    const logoInList = clientRow.locator('img[src*="uploads/logos"]');
    await expect(logoInList).toBeVisible();

    console.log('✅ SUCCESS: Complete client creation with logo upload flow completed successfully!');
  });
});

