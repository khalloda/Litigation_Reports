import { test, expect } from '@playwright/test';

test.describe('Clients Page Navigation', () => {
  test('should navigate to clients page and test client management', async ({ page }) => {
    console.log('Testing clients page navigation...');
    
    // Navigate to application and login
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    await page.locator('input[type="email"]').fill('admin@litigation.com');
    await page.locator('input[type="password"]').fill('admin123');
    await page.locator('button[type="submit"]').click();
    
    // Wait for login to complete
    await page.waitForTimeout(3000);
    
    // Click on the Clients navigation link
    console.log('Clicking on Clients navigation link...');
    const clientsLink = page.locator('a:has-text("العملاء"), [role="button"]:has-text("العملاء")');
    
    if (await clientsLink.isVisible()) {
      await clientsLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      console.log('Current URL after clicking clients link:', page.url());
      
      // Take screenshot
      await page.screenshot({ path: 'test-results/clients-page-after-navigation.png' });
      console.log('Clients page after navigation screenshot saved');
      
      // Check what's visible on the clients page
      const pageContent = await page.locator('body').textContent();
      console.log('Page content preview:', pageContent.substring(0, 500));
      
      // Look for client management elements
      const addClientButton = page.locator('button:has-text("Add Client"), button:has-text("إضافة عميل"), button:has-text("Add"), button:has-text("إضافة")');
      const clientTable = page.locator('table, .table, [class*="table"]');
      const clientList = page.locator('[class*="client"], [class*="Client"], [class*="list"]');
      
      console.log('Add client button visible:', await addClientButton.isVisible());
      console.log('Client table visible:', await clientTable.isVisible());
      console.log('Client list visible:', await clientList.isVisible());
      
      // Check for any buttons on the page
      const allButtons = await page.locator('button').all();
      console.log('Number of buttons on clients page:', allButtons.length);
      
      for (let i = 0; i < allButtons.length; i++) {
        const button = allButtons[i];
        const text = await button.textContent();
        const visible = await button.isVisible();
        console.log(`Button ${i + 1}: "${text}" (visible: ${visible})`);
      }
      
      // Check for any forms or inputs
      const allInputs = await page.locator('input').all();
      console.log('Number of inputs on clients page:', allInputs.length);
      
      // Check for any modals or overlays
      const modals = page.locator('.modal, [role="dialog"], .overlay');
      console.log('Number of modals:', await modals.count());
      
      // Try to find any element that might trigger client creation
      const clickableElements = await page.locator('button, [role="button"], .btn, [onclick]').all();
      console.log('Clickable elements found:', clickableElements.length);
      
      for (let i = 0; i < Math.min(clickableElements.length, 10); i++) {
        const element = clickableElements[i];
        const text = await element.textContent();
        const visible = await element.isVisible();
        const tagName = await element.evaluate(el => el.tagName);
        console.log(`Clickable ${i + 1}: "${text}" (${tagName}, visible: ${visible})`);
      }
      
      // Check for any loading indicators
      const loadingElements = page.locator('.loading, .spinner, [class*="loading"], [class*="spinner"]');
      console.log('Loading elements visible:', await loadingElements.count());
      
      // Check for any error messages
      const errorElements = page.locator('.error, .alert-danger, [class*="error"]');
      console.log('Error elements visible:', await errorElements.count());
      
      if (await errorElements.count() > 0) {
        for (let i = 0; i < await errorElements.count(); i++) {
          const errorText = await errorElements.nth(i).textContent();
          console.log(`Error ${i + 1}:`, errorText);
        }
      }
      
    } else {
      console.log('Clients navigation link not found');
    }
  });
});

