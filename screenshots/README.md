# Screenshots

This directory contains screenshots of the GitHub Pages applications discovered by the automated workflow.

## Current Status

Screenshot functionality is now implemented using Playwright! The GitHub Action workflow automatically generates screenshots for all discovered GitHub Pages applications.

## How It Works

The GitHub Action workflow:

1. **Discovers GitHub Pages Apps**: Scans all repositories for GitHub Pages enabled sites
2. **Captures Screenshots**: Uses Playwright with Chromium to take screenshots at 1200x800 resolution
3. **Saves Screenshots**: Stores screenshots as PNG files in this directory
4. **Updates App Data**: Updates apps-data.json with screenshot paths

## Screenshot Files

Screenshots are automatically generated with the following naming convention:
- `{repository-name}.png` - Screenshot of the GitHub Pages app

## Automated Generation

Screenshots are automatically generated when:
- The workflow runs manually via GitHub Actions
- The workflow is triggered by updates to the discovery script
- New GitHub Pages apps are discovered

## Manual Screenshot Generation

To manually generate screenshots:

1. Navigate to the live application
2. Take screenshots at different viewport sizes (desktop: 1920x1080, mobile: 375x667)
3. Save as PNG files in this directory
4. Update the apps-data.json file to reference the screenshot files