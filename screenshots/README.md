# Screenshots

This directory will contain screenshots of the GitHub Pages Apps Catalog.

## Current Status

Screenshot functionality is planned for future implementation. The application currently works without screenshots, displaying placeholder text where screenshots would appear.

## Future Enhancement

The GitHub Action workflow can be extended to automatically generate screenshots using a headless browser such as:

1. [Playwright](https://playwright.dev/) 
2. [Puppeteer](https://pptr.dev/)
3. [Selenium](https://www.selenium.dev/)

## Manual Screenshot Generation

To manually generate screenshots:

1. Navigate to the live application
2. Take screenshots at different viewport sizes (desktop: 1920x1080, mobile: 375x667)
3. Save as PNG files in this directory
4. Update the apps-data.json file to reference the screenshot files