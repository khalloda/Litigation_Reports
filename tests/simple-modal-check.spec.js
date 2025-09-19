import { test, expect } from '@playwright/test';

test.describe('Simple Modal Check', () => {
  test('should check what happens when clicking edit button', async ({ page }) => {
    console.log('Simple modal check...');
    
    // Navigate to application and login
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    await page.locator('input[type="email"]').fill('admin@litigation.com');
    await page.locator('input[type="password"]').fill('admin123');
    await page.locator('button[type="submit"]').click();
    
    // Wait for login to complete
    await page.waitForTimeout(3000);
    
    // Navigate to clients page
    const clientsLink = page.locator('a:has-text("العملاء"), [role="button"]:has-text("العملاء")');
    await clientsLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take screenshot before clicking edit
    await page.screenshot({ path: 'test-results/before-edit-click.png' });
    console.log('Before edit click screenshot saved');
    
    // Find the Sarieldin and Partners row
    const clientRow = page.locator('tr:has-text("Sarieldin and Partners")');
    const rowVisible = await clientRow.isVisible();
    console.log('Sarieldin and Partners row visible:', rowVisible);
    
    if (rowVisible) {
      // Look for any buttons in the row
      const buttons = clientRow.locator('button');
      const buttonCount = await buttons.count();
      console.log('Number of buttons in row:', buttonCount);
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const text = await button.textContent();
        const visible = await button.isVisible();
        console.log(`Button ${i + 1}: "${text}" (visible: ${visible})`);
      }
      
      // Try to click the first button (likely edit)
      if (buttonCount > 0) {
        console.log('Clicking first button in row...');
        await buttons.first().click();
        await page.waitForTimeout(3000);
        
        // Take screenshot after click
        await page.screenshot({ path: 'test-results/after-edit-click.png' });
        console.log('After edit click screenshot saved');
        
        // Check if anything appeared
        const bodyText = await page.locator('body').textContent();
        console.log('Page contains "modal":', bodyText.includes('modal'));
        console.log('Page contains "edit":', bodyText.includes('edit'));
        console.log('Page contains "تعديل":', bodyText.includes('تعديل'));
        
        // Check for any overlays or modals
        const overlays = page.locator('.modal, .overlay, [role="dialog"], .backdrop');
        const overlayCount = await overlays.count();
        console.log('Number of overlays/modals:', overlayCount);
        
        // Check for any forms
        const forms = page.locator('form');
        const formCount = await forms.count();
        console.log('Number of forms:', formCount);
        
        // Check for any inputs
        const inputs = page.locator('input');
        const inputCount = await inputs.count();
        console.log('Number of inputs:', inputCount);
        
        // Check current URL
        const currentUrl = page.url();
        console.log('Current URL after edit click:', currentUrl);
      }
    }
    
    console.log('Simple modal check completed');
  });
});

