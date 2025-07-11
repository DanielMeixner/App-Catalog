// GitHub Pages Apps Overview Script

class GitHubPagesOverview {
    constructor() {
        this.appsData = null;
        this.init();
    }

    async init() {
        try {
            await this.loadAppsData();
            this.renderApps();
            this.updateLastUpdated();
        } catch (error) {
            console.error('Error initializing GitHub Pages overview:', error);
            this.showError();
        }
    }

    async loadAppsData() {
        try {
            const response = await fetch('apps-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.appsData = await response.json();
        } catch (error) {
            console.error('Error loading apps data:', error);
            // Fallback to hardcoded data for initial setup
            this.appsData = {
                lastUpdated: new Date().toISOString(),
                apps: [
                    {
                        name: "DanielMeixner.github.io",
                        description: "Main GitHub Pages site for Daniel Meixner",
                        url: "https://danielmeixner.github.io",
                        repository: "https://github.com/DanielMeixner/DanielMeixner.github.io",
                        screenshot: null,
                        tags: ["Portfolio", "Main Site"],
                        language: "HTML"
                    },
                    {
                        name: "SBOM Dependencies Viewer",
                        description: "A Vite React app to visualize SPDX SBOM dependencies as a graph in the browser",
                        url: "https://danielmeixner.github.io/sbomdepsviewer",
                        repository: "https://github.com/DanielMeixner/sbomdepsviewer",
                        screenshot: null,
                        tags: ["React", "Visualization", "SBOM", "Dependencies"],
                        language: "JavaScript"
                    }
                ]
            };
        }
    }

    renderApps() {
        const loadingElement = document.getElementById('loading');
        const appsContainer = document.getElementById('apps-container');
        const appsGrid = document.getElementById('apps-grid');

        if (!this.appsData || !this.appsData.apps) {
            this.showError();
            return;
        }

        // Hide loading, show apps container
        loadingElement.style.display = 'none';
        appsContainer.style.display = 'block';

        // Clear existing content
        appsGrid.innerHTML = '';

        // Render each app
        this.appsData.apps.forEach(app => {
            const appCard = this.createAppCard(app);
            appsGrid.appendChild(appCard);
        });
    }

    createAppCard(app) {
        const card = document.createElement('div');
        card.className = 'app-card';

        const screenshotSection = this.createScreenshotSection(app);
        const contentSection = this.createContentSection(app);

        card.appendChild(screenshotSection);
        card.appendChild(contentSection);

        return card;
    }

    createScreenshotSection(app) {
        const screenshotDiv = document.createElement('div');
        screenshotDiv.className = 'app-screenshot';

        if (app.screenshot) {
            const img = document.createElement('img');
            img.src = app.screenshot;
            img.alt = `Screenshot of ${app.name}`;
            img.onerror = () => {
                screenshotDiv.innerHTML = '<span>Screenshot not available</span>';
            };
            screenshotDiv.appendChild(img);
        } else {
            screenshotDiv.innerHTML = '<span>Screenshot not available</span>';
        }

        return screenshotDiv;
    }

    createContentSection(app) {
        const content = document.createElement('div');
        content.className = 'app-content';

        // Title
        const title = document.createElement('h2');
        title.className = 'app-title';
        title.textContent = app.name;
        content.appendChild(title);

        // Description
        if (app.description) {
            const description = document.createElement('p');
            description.className = 'app-description';
            description.textContent = app.description;
            content.appendChild(description);
        }

        // Tags
        if (app.tags && app.tags.length > 0) {
            const metaDiv = document.createElement('div');
            metaDiv.className = 'app-meta';

            app.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'app-tag';
                tagSpan.textContent = tag;
                metaDiv.appendChild(tagSpan);
            });

            content.appendChild(metaDiv);
        }

        // Links
        const linksDiv = document.createElement('div');
        linksDiv.className = 'app-links';

        // App link
        const appLink = document.createElement('a');
        appLink.href = app.url;
        appLink.className = 'app-link';
        appLink.target = '_blank';
        appLink.rel = 'noopener noreferrer';
        appLink.innerHTML = '🌐 Visit App';
        linksDiv.appendChild(appLink);

        // Repository link
        if (app.repository) {
            const repoLink = document.createElement('a');
            repoLink.href = app.repository;
            repoLink.className = 'app-link secondary';
            repoLink.target = '_blank';
            repoLink.rel = 'noopener noreferrer';
            repoLink.innerHTML = '📁 View Source';
            linksDiv.appendChild(repoLink);
        }

        content.appendChild(linksDiv);

        return content;
    }

    updateLastUpdated() {
        const lastUpdatedElement = document.getElementById('last-updated');
        if (this.appsData && this.appsData.lastUpdated) {
            const date = new Date(this.appsData.lastUpdated);
            lastUpdatedElement.textContent = date.toLocaleString();
        } else {
            lastUpdatedElement.textContent = 'Unknown';
        }
    }

    showError() {
        const loadingElement = document.getElementById('loading');
        const appsContainer = document.getElementById('apps-container');
        const errorElement = document.getElementById('error-message');

        loadingElement.style.display = 'none';
        appsContainer.style.display = 'none';
        errorElement.style.display = 'block';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GitHubPagesOverview();
});

// Add smooth scrolling for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});