import { chromium } from 'playwright';

async function testPageContentAnalysis() {
  console.log('🔍 Analyzing Page Content and Navigation...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to the React app
    console.log('1. Navigating to React app...');
    await page.goto('http://lit.local:3001');
    await page.waitForLoadState('networkidle');
    
    // Enable console logging
    page.on('console', msg => {
      const text = msg.text();
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', text);
      } else if (text.includes('Failed') || text.includes('Error') || text.includes('API')) {
        console.log('🔍 Console Log:', text);
      }
    });
    
    // Login first
    console.log('\n2. Logging in...');
    const loginForm = await page.locator('form').first();
    if (await loginForm.isVisible()) {
      await page.fill('input[type="email"]', 'admin@litigation.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
    }
    
    // Analyze the current page content
    console.log('\n3. Analyzing page content...');
    const pageAnalysis = await page.evaluate(() => {
      // Get all text content
      const bodyText = document.body.textContent || '';
      
      // Find all elements with "Failed" in their text
      const allElements = document.querySelectorAll('*');
      const failedElements = [];
      const errorElements = [];
      const emptyElements = [];
      
      allElements.forEach(el => {
        const text = el.textContent?.trim() || '';
        if (text.includes('Failed to load')) {
          failedElements.push({
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            text: text,
            innerHTML: el.innerHTML
          });
        }
        if (text.includes('Error') || text.includes('error')) {
          errorElements.push({
            tagName: el.tagName,
            className: el.className,
            text: text
          });
        }
        if (text.includes('لا توجد') || text.includes('No') && text.includes('found')) {
          emptyElements.push({
            tagName: el.tagName,
            className: el.className,
            text: text
          });
        }
      });
      
      // Find navigation elements
      const navElements = document.querySelectorAll('nav, [role="navigation"], [class*="nav"], [class*="menu"]');
      const links = document.querySelectorAll('a, button');
      const navigationLinks = [];
      
      links.forEach(link => {
        const text = link.textContent?.trim() || '';
        const href = link.getAttribute('href') || '';
        if (text.includes('القضايا') || text.includes('Cases') || 
            text.includes('العملاء') || text.includes('Clients') ||
            text.includes('الجلسات') || text.includes('Hearings')) {
          navigationLinks.push({
            tagName: link.tagName,
            text: text,
            href: href,
            className: link.className,
            id: link.id
          });
        }
      });
      
      // Find main content areas
      const mainContent = document.querySelector('main, [role="main"], [class*="main"], [class*="content"]');
      const sections = document.querySelectorAll('section, [class*="section"], [class*="page"]');
      
      return {
        url: window.location.href,
        title: document.title,
        bodyTextLength: bodyText.length,
        bodyTextPreview: bodyText.substring(0, 500),
        failedElements: failedElements,
        errorElements: errorElements,
        emptyElements: emptyElements,
        navigationLinks: navigationLinks,
        hasMainContent: !!mainContent,
        sectionsCount: sections.length,
        allText: bodyText
      };
    });
    
    console.log('   📊 Page Analysis Results:');
    console.log(`      URL: ${pageAnalysis.url}`);
    console.log(`      Title: ${pageAnalysis.title}`);
    console.log(`      Body Text Length: ${pageAnalysis.bodyTextLength} characters`);
    console.log(`      Body Text Preview: ${pageAnalysis.bodyTextPreview}...`);
    console.log(`      Failed Elements: ${pageAnalysis.failedElements.length}`);
    console.log(`      Error Elements: ${pageAnalysis.errorElements.length}`);
    console.log(`      Empty Elements: ${pageAnalysis.emptyElements.length}`);
    console.log(`      Navigation Links: ${pageAnalysis.navigationLinks.length}`);
    console.log(`      Has Main Content: ${pageAnalysis.hasMainContent}`);
    console.log(`      Sections Count: ${pageAnalysis.sectionsCount}`);
    
    // Show failed elements if any
    if (pageAnalysis.failedElements.length > 0) {
      console.log('\n   📋 Failed Elements:');
      pageAnalysis.failedElements.forEach((el, index) => {
        console.log(`      ${index + 1}. ${el.tagName}.${el.className}: "${el.text}"`);
      });
    }
    
    // Show error elements if any
    if (pageAnalysis.errorElements.length > 0) {
      console.log('\n   📋 Error Elements:');
      pageAnalysis.errorElements.forEach((el, index) => {
        console.log(`      ${index + 1}. ${el.tagName}.${el.className}: "${el.text}"`);
      });
    }
    
    // Show empty elements if any
    if (pageAnalysis.emptyElements.length > 0) {
      console.log('\n   📋 Empty Elements:');
      pageAnalysis.emptyElements.forEach((el, index) => {
        console.log(`      ${index + 1}. ${el.tagName}.${el.className}: "${el.text}"`);
      });
    }
    
    // Show navigation links
    if (pageAnalysis.navigationLinks.length > 0) {
      console.log('\n   📋 Navigation Links:');
      pageAnalysis.navigationLinks.forEach((link, index) => {
        console.log(`      ${index + 1}. ${link.tagName}: "${link.text}" (href: ${link.href})`);
      });
    }
    
    // Try to click on navigation links
    console.log('\n4. Testing navigation...');
    for (const link of pageAnalysis.navigationLinks) {
      try {
        console.log(`   📝 Trying to click: "${link.text}"`);
        
        // Find the element by text content
        const element = page.locator(`text="${link.text}"`).first();
        if (await element.isVisible()) {
          await element.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(2000);
          
          // Check for errors after navigation
          const afterNav = await page.evaluate(() => {
            const failedElements = [];
            const allElements = document.querySelectorAll('*');
            
            allElements.forEach(el => {
              const text = el.textContent?.trim() || '';
              if (text.includes('Failed to load')) {
                failedElements.push({
                  tagName: el.tagName,
                  className: el.className,
                  text: text
                });
              }
            });
            
            return {
              url: window.location.href,
              failedCount: failedElements.length,
              failedElements: failedElements
            };
          });
          
          console.log(`      📊 After navigation to "${link.text}":`);
          console.log(`         URL: ${afterNav.url}`);
          console.log(`         Failed Elements: ${afterNav.failedCount}`);
          if (afterNav.failedElements.length > 0) {
            afterNav.failedElements.forEach((el, index) => {
              console.log(`            ${index + 1}. ${el.tagName}.${el.className}: "${el.text}"`);
            });
          }
        } else {
          console.log(`      ⚠️ Element not visible: "${link.text}"`);
        }
      } catch (error) {
        console.log(`      ❌ Error clicking "${link.text}": ${error.message}`);
      }
    }
    
    // Check if we can find any React components
    console.log('\n5. Checking for React components...');
    const reactComponents = await page.evaluate(() => {
      // Look for React component indicators
      const reactElements = document.querySelectorAll('[data-reactroot], [data-react-helmet], [class*="react"]');
      const componentElements = document.querySelectorAll('[class*="component"], [class*="page"], [class*="container"]');
      
      return {
        reactElements: reactElements.length,
        componentElements: componentElements.length,
        hasReactRoot: !!document.querySelector('[data-reactroot]'),
        hasReactHelmet: !!document.querySelector('[data-react-helmet]')
      };
    });
    
    console.log('   📊 React Components:');
    console.log(`      React Elements: ${reactComponents.reactElements}`);
    console.log(`      Component Elements: ${reactComponents.componentElements}`);
    console.log(`      Has React Root: ${reactComponents.hasReactRoot}`);
    console.log(`      Has React Helmet: ${reactComponents.hasReactHelmet}`);
    
    // Take screenshot
    console.log('\n6. Taking screenshot...');
    await page.screenshot({ path: 'page-content-analysis-test.png', fullPage: true });
    console.log('   ✅ Screenshot saved as page-content-analysis-test.png');
    
  } catch (error) {
    console.error('❌ Error during page content analysis:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎉 Page content analysis completed!');
}

testPageContentAnalysis().catch(console.error);
