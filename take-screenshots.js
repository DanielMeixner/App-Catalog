const { chromium } = require('playwright');
const fs = require('fs');

async function takeScreenshots() {
  console.log('Starting screenshot capture...');
  
  // Read the apps data to get URLs
  if (!fs.existsSync('apps-data.json')) {
    console.error('apps-data.json not found');
    process.exit(1);
  }
  
  const appsData = JSON.parse(fs.readFileSync('apps-data.json', 'utf8'));
  console.log(`Found ${appsData.apps.length} apps to screenshot`);
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set viewport size for consistent screenshots
  await page.setViewportSize({ width: 1200, height: 800 });
  
  // Create screenshots directory if it doesn't exist
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }
  
  for (const app of appsData.apps) {
    try {
      console.log(`Taking screenshot for ${app.name} at ${app.url}`);
      
      // Set a timeout and wait for the page to load
      await page.goto(app.url, { waitUntil: 'networkidle', timeout: 30000 });
      
      // Wait a bit more for any dynamic content
      await page.waitForTimeout(3000);
      
      // Take screenshot
      const screenshotPath = `screenshots/${app.name}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: false });
      
      console.log(`Screenshot saved: ${screenshotPath}`);
      
    } catch (error) {
      console.error(`Failed to take screenshot for ${app.name}:`, error.message);
      // Create a placeholder file so we know the screenshot was attempted
      const placeholderPath = `screenshots/${app.name}.failed.txt`;
      fs.writeFileSync(placeholderPath, `Screenshot failed: ${error.message}\nURL: ${app.url}\nTimestamp: ${new Date().toISOString()}`);
    }
  }
  
  await browser.close();
  console.log('Screenshot capture completed');
}

takeScreenshots().catch(console.error);