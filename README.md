# GitHub Pages Apps Catalog

A dynamic catalog showcasing all GitHub Pages applications running under `danielmeixner.github.io`. This static website automatically discovers and displays GitHub Pages apps with their descriptions, links, and metadata.

## 🌟 Features

- **Automatic Discovery**: Uses GitHub API to automatically find repositories with GitHub Pages enabled
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Updates**: Automatically updates daily via GitHub Actions
- **Clean Interface**: Modern, card-based design with smooth animations
- **Direct Links**: Quick access to both the live app and source code
- **Metadata Display**: Shows repository stats, technologies used, and last update time

## 🚀 Live Demo

Visit the live catalog at: [https://danielmeixner.github.io/appcatalog](https://danielmeixner.github.io/appcatalog)

## 📸 Screenshots

### Desktop View
![Desktop Screenshot](screenshots/desktop-view.png)

### Mobile View
![Mobile Screenshot](screenshots/mobile-view.png)

## 🛠️ How It Works

### 1. Automatic Discovery
The catalog uses a GitHub Action workflow that runs daily to:
- Query the GitHub API for all repositories under `DanielMeixner`
- Filter repositories that have GitHub Pages enabled
- Extract metadata like description, topics, language, and stats
- Generate a JSON file with all discovered apps

### 2. Static Site Generation
The static website:
- Loads the JSON data asynchronously
- Renders responsive cards for each app
- Provides direct links to both the live app and source code
- Shows relevant metadata and tags

### 3. Automated Updates
- **Daily Updates**: Runs every day at 02:00 UTC
- **Manual Trigger**: Can be triggered manually via GitHub Actions
- **Push Updates**: Automatically updates when the workflow changes

## 🏗️ Technical Architecture

### Frontend
- **HTML5**: Semantic markup with modern standards
- **CSS3**: Responsive design with CSS Grid and Flexbox
- **Vanilla JavaScript**: No frameworks, pure ES6+ for maximum performance
- **Progressive Enhancement**: Works with JavaScript disabled

### Backend Automation
- **GitHub Actions**: Automated discovery and updates
- **GitHub API**: Repository information retrieval
- **JSON Data**: Structured data format for easy consumption

### File Structure
```
appcatalog/
├── index.html              # Main HTML file
├── style.css               # Styles and responsive design
├── script.js               # JavaScript functionality
├── apps-data.json          # Auto-generated apps data
├── .github/workflows/
│   ├── update-apps.yml     # App discovery workflow
│   └── deploy-pages.yml    # GitHub Pages deployment
└── README.md               # This file
```

## 🔧 Setup and Development

### Prerequisites
- Node.js (for local development)
- GitHub account with Pages enabled
- Repository with GitHub Actions enabled

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/DanielMeixner/appcatalog.git
   cd appcatalog
   ```

2. Serve the files locally:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. Open `http://localhost:8000` in your browser

### GitHub Pages Setup
1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. The site will be available at `https://yourusername.github.io/appcatalog`

## 🤖 Automation Details

### App Discovery Workflow
Located at `.github/workflows/update-apps.yml`, this workflow:
- Runs daily at 02:00 UTC
- Can be triggered manually
- Uses GitHub API to discover Pages-enabled repositories
- Generates `apps-data.json` with current information
- Commits changes automatically

### Deployment Workflow
Located at `.github/workflows/deploy-pages.yml`, this workflow:
- Deploys to GitHub Pages on every push to main
- Uses GitHub's official Pages actions
- Handles static asset optimization

## 📊 Current Apps

As of the last update, the catalog includes:

1. **sbomdepsviewer** - A Vite React app to visualize SPDX SBOM dependencies as a graph in the browser
2. **DanielMeixner.github.io** - Main GitHub Pages site for Daniel Meixner

## 🎨 Customization

### Styling
Modify `style.css` to customize:
- Color scheme and branding
- Layout and spacing
- Card design and animations
- Responsive breakpoints

### Content
Update `script.js` to modify:
- App card structure
- Data display format
- Interactive behaviors
- Error handling

### Automation
Modify `.github/workflows/update-apps.yml` to:
- Change update frequency
- Add screenshot functionality
- Include additional metadata
- Filter specific repositories

## 🔐 Security

- Uses GitHub's GITHUB_TOKEN for API access
- No sensitive data exposed
- All operations run in GitHub's secure environment
- Static site with no server-side vulnerabilities

## 🐛 Troubleshooting

### Common Issues

1. **Apps not showing**: Check if `apps-data.json` exists and is valid JSON
2. **Workflow fails**: Verify GitHub token permissions and API rate limits
3. **Pages not deploying**: Ensure GitHub Pages is enabled and source is set to "GitHub Actions"
4. **Styles not loading**: Check file paths and ensure all CSS/JS files are committed

### Debug Mode
Add `?debug=true` to the URL to enable console logging for troubleshooting.

## 📈 Future Enhancements

- [ ] Screenshot generation for app previews
- [ ] Search and filter functionality
- [ ] Category organization
- [ ] Performance metrics display
- [ ] Integration with GitHub Stars/Forks
- [ ] RSS feed for updates
- [ ] Analytics integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- GitHub for the powerful API and Pages platform
- The open source community for inspiration and best practices
- All contributors who help improve this project

---

**Last Updated**: Automatically updated daily via GitHub Actions  
**Next Update**: Every day at 02:00 UTC
