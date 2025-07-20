# Devcontainer Setup

This repository includes a devcontainer configuration that provides a consistent development environment for the App Catalog project.

## What's Included

- **Node.js 18**: Matches the version used in GitHub Actions
- **Git & GitHub CLI**: For version control and GitHub integration
- **Required Dependencies**: Automatically installs `@octokit/rest` and `playwright`
- **VS Code Extensions**: Pre-configured with helpful extensions for web development
- **Port Forwarding**: Ports 8000, 3000, and 5000 are forwarded for local development servers

## Getting Started

1. **Open in VS Code**: Click "Open in Container" when VS Code detects the devcontainer configuration
2. **Wait for Setup**: The container will automatically install dependencies and set up Playwright
3. **Start Development**: Use one of the following commands to start a local server:

```bash
# Using Python (recommended)
python3 -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Using PHP (if available)
php -S localhost:8000
```

4. **Access Your Site**: Open `http://localhost:8000` in your browser

## Available Scripts

- **Discover Apps**: `node discover-apps.js` (requires GITHUB_TOKEN environment variable)
- **Take Screenshots**: `node take-screenshots.js` (requires apps-data.json to exist)

## Environment Variables

For the discovery script to work, you'll need to set the `GITHUB_TOKEN` environment variable:

```bash
export GITHUB_TOKEN="your_github_token_here"
```

## Pre-configured Extensions

The devcontainer includes these VS Code extensions:
- JSON support
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Playwright Test for VS Code
- Prettier for code formatting
- Live Server extension

## Development Workflow

1. Make changes to HTML, CSS, or JavaScript files
2. The local server will serve your changes immediately
3. Use the browser dev tools to test and debug
4. Commit changes when ready

## Troubleshooting

- **Playwright Installation Fails**: This can happen due to network issues. Try running `npx playwright install --with-deps chromium` manually
- **Port Already in Use**: Try using a different port (3000 or 5000 are also forwarded)
- **Dependencies Missing**: Run `npm install` to reinstall dependencies