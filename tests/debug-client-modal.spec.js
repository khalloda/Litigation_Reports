import { test, expect } from '@playwright/test';

test.describe('Debug Client Modal', () => {
  test('should debug what is actually in the client edit modal', async ({ page }) => {
    console.log('Debugging client modal content...');
    
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
    
    // Find and click edit button for Sarieldin and Partners
    const clientRow = page.locator('tr:has-text("Sarieldin and Partners")');
    const editButton = clientRow.locator('button:has-text("Edit"), button:has-text("تعديل"), button[title*="Edit"], button[title*="تعديل"]');
    await editButton.click();
    await page.waitForTimeout(2000);
    
    // Take screenshot of modal
    await page.screenshot({ path: 'test-results/debug-modal-full.png' });
    console.log('Full modal screenshot saved');
    
    // Get all text content in the modal
    const modalContent = await page.locator('.modal, [role="dialog"]').textContent();
    console.log('Modal content preview:', modalContent.substring(0, 1000));
    
    // Look for all form elements
    const allInputs = await page.locator('input').all();
    console.log('Number of inputs in modal:', allInputs.length);
    
    for (let i = 0; i < allInputs.length; i++) {
      const input = allInputs[i];
      const type = await input.getAttribute('type');
      const name = await input.getAttribute('name');
      const placeholder = await input.getAttribute('placeholder');
      const visible = await input.isVisible();
      console.log(`Input ${i + 1}: type="${type}", name="${name}", placeholder="${placeholder}", visible=${visible}`);
    }
    
    // Look for all buttons
    const allButtons = await page.locator('button').all();
    console.log('Number of buttons in modal:', allButtons.length);
    
    for (let i = 0; i < allButtons.length; i++) {
      const button = allButtons[i];
      const text = await button.textContent();
      const visible = await button.isVisible();
      console.log(`Button ${i + 1}: "${text}" (visible: ${visible})`);
    }
    
    // Look for any elements with "logo" in class or text
    const logoElements = page.locator('[class*="logo"], [id*="logo"], :has-text("logo"), :has-text("Logo"), :has-text("شعار")');
    const logoElementCount = await logoElements.count();
    console.log('Elements containing "logo":', logoElementCount);
    
    for (let i = 0; i < logoElementCount; i++) {
      const element = logoElements.nth(i);
      const text = await element.textContent();
      const tagName = await element.evaluate(el => el.tagName);
      const className = await element.getAttribute('class');
      const visible = await element.isVisible();
      console.log(`Logo element ${i + 1}: ${tagName}, class="${className}", text="${text}", visible=${visible}`);
    }
    
    // Look for file inputs specifically
    const fileInputs = page.locator('input[type="file"]');
    const fileInputCount = await fileInputs.count();
    console.log('File inputs found:', fileInputCount);
    
    for (let i = 0; i < fileInputCount; i++) {
      const fileInput = fileInputs.nth(i);
      const accept = await fileInput.getAttribute('accept');
      const visible = await fileInput.isVisible();
      const display = await fileInput.evaluate(el => window.getComputedStyle(el).display);
      console.log(`File input ${i + 1}: accept="${accept}", visible=${visible}, display="${display}"`);
    }
    
    // Look for upload-related elements
    const uploadElements = page.locator('[class*="upload"], [id*="upload"], :has-text("upload"), :has-text("Upload"), :has-text("رفع")');
    const uploadElementCount = await uploadElements.count();
    console.log('Upload-related elements:', uploadElementCount);
    
    for (let i = 0; i < uploadElementCount; i++) {
      const element = uploadElements.nth(i);
      const text = await element.textContent();
      const tagName = await element.evaluate(el => el.tagName);
      const className = await element.getAttribute('class');
      const visible = await element.isVisible();
      console.log(`Upload element ${i + 1}: ${tagName}, class="${className}", text="${text}", visible=${visible}`);
    }
    
    // Check if there are any hidden elements
    const allElements = await page.locator('*').all();
    console.log('Total elements in modal:', allElements.length);
    
    // Look for any divs that might be the upload area
    const allDivs = await page.locator('div').all();
    console.log('Total divs in modal:', allDivs.length);
    
    for (let i = 0; i < Math.min(allDivs.length, 20); i++) {
      const div = allDivs[i];
      const className = await div.getAttribute('class');
      const text = await div.textContent();
      const visible = await div.isVisible();
      if (className && (className.includes('upload') || className.includes('logo') || className.includes('file'))) {
        console.log(`Div ${i + 1}: class="${className}", text="${text?.substring(0, 50)}", visible=${visible}`);
      }
    }
    
    console.log('Modal debug completed');
  });
});

