import { test, expect } from '@playwright/test';

test.describe('UI State After Login', () => {
  test('should check UI state changes after successful login', async ({ page }) => {
    console.log('Testing UI state after login...');
    
    // Navigate to application
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    // Fill and submit login form
    await page.locator('input[type="email"]').fill('admin@litigation.com');
    await page.locator('input[type="password"]').fill('admin123');
    await page.locator('button[type="submit"]').click();
    
    // Wait for login to complete
    await page.waitForTimeout(3000);
    
    // Check if login form is still visible
    const loginForm = page.locator('[data-testid="login-form"]');
    const loginFormVisible = await loginForm.isVisible();
    console.log('Login form still visible:', loginFormVisible);
    
    // Check what elements are visible on the page
    const allButtons = await page.locator('button').all();
    console.log('Number of buttons on page:', allButtons.length);
    
    for (let i = 0; i < allButtons.length; i++) {
      const button = allButtons[i];
      const text = await button.textContent();
      const visible = await button.isVisible();
      console.log(`Button ${i + 1}: "${text}" (visible: ${visible})`);
    }
    
    // Check for navigation elements
    const navLinks = await page.locator('a, [role="button"]').all();
    console.log('Number of navigation elements:', navLinks.length);
    
    for (let i = 0; i < Math.min(navLinks.length, 10); i++) {
      const link = navLinks[i];
      const text = await link.textContent();
      const visible = await link.isVisible();
      console.log(`Nav element ${i + 1}: "${text}" (visible: ${visible})`);
    }
    
    // Check page content
    const bodyText = await page.locator('body').textContent();
    console.log('Page contains "dashboard":', bodyText.includes('dashboard'));
    console.log('Page contains "clients":', bodyText.includes('clients'));
    console.log('Page contains "cases":', bodyText.includes('cases'));
    console.log('Page contains "hearings":', bodyText.includes('hearings'));
    
    // Try to navigate to clients page
    console.log('Navigating to clients page...');
    await page.goto('http://localhost:3001/clients');
    await page.waitForLoadState('networkidle');
    
    // Check what's on the clients page
    const clientsPageText = await page.locator('body').textContent();
    console.log('Clients page contains "Add Client":', clientsPageText.includes('Add Client'));
    console.log('Clients page contains "إضافة عميل":', clientsPageText.includes('إضافة عميل'));
    
    // Look for client management elements
    const addClientButton = page.locator('button:has-text("Add Client"), button:has-text("إضافة عميل")');
    const clientTable = page.locator('table, .table');
    const clientList = page.locator('[class*="client"], [class*="Client"]');
    
    console.log('Add client button visible:', await addClientButton.isVisible());
    console.log('Client table visible:', await clientTable.isVisible());
    console.log('Client list visible:', await clientList.isVisible());
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/ui-after-login.png' });
    console.log('UI after login screenshot saved');
    
    // Check if we can interact with client elements
    if (await addClientButton.isVisible()) {
      console.log('Add client button is visible - can proceed with client creation');
    } else {
      console.log('Add client button not visible - checking for alternative elements...');
      
      // Look for any clickable elements that might open a modal
      const clickableElements = await page.locator('button, [role="button"], .btn').all();
      console.log('Clickable elements found:', clickableElements.length);
      
      for (let i = 0; i < Math.min(clickableElements.length, 5); i++) {
        const element = clickableElements[i];
        const text = await element.textContent();
        const visible = await element.isVisible();
        console.log(`Clickable ${i + 1}: "${text}" (visible: ${visible})`);
      }
    }
  });
});

