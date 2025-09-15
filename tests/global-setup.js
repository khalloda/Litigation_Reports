const { chromium } = require('@playwright/test');

async function globalSetup(config) {
  console.log('🚀 Starting global setup...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Wait for the application to be ready
    await page.goto(config.projects[0].use.baseURL || 'http://lit.local');
    await page.waitForLoadState('networkidle');
    
    // Check if the application is responding
    const title = await page.title();
    console.log(`✅ Application is ready. Title: ${title}`);
    
    // Set up test database or seed data if needed
    await setupTestDatabase(page);
    
    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function setupTestDatabase(page) {
  try {
    // Navigate to a setup page or API endpoint to initialize test data
    // This would typically involve calling your PHP setup scripts
    console.log('📊 Setting up test database...');
    
    // Example: Call a setup endpoint if you have one
    // await page.goto('http://lit.local/setup/test-data');
    
    console.log('✅ Test database setup completed');
  } catch (error) {
    console.error('⚠️ Test database setup failed:', error);
    // Don't throw here as it might not be critical
  }
}

module.exports = globalSetup;
