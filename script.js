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
            console.log('Successfully loaded apps data:', this.appsData.totalApps, 'apps found');
        } catch (error) {
            console.error('Error loading apps data:', error);
            throw error; // Re-throw the error to be handled by the caller
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
        this.appsData.apps.forEach((app, index) => {
            const appCard = this.createAppCard(app, index);
            appsGrid.appendChild(appCard);
        });
    }

    createAppCard(app, index) {
        const colorClasses = ['color-coral', 'color-orange', 'color-amber', 'color-emerald', 'color-blue', 'color-indigo', 'color-pink', 'color-teal'];
        const colorClass = colorClasses[index % colorClasses.length];
        
        const card = document.createElement('div');
        card.className = `app-card ${colorClass}`;

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

        // Title with Electron icon if applicable
        const titleContainer = document.createElement('div');
        titleContainer.className = 'app-title-container';
        
        const title = document.createElement('h2');
        title.className = 'app-title';
        title.textContent = app.name;
        titleContainer.appendChild(title);
        
        // Add Electron icon if it's an Electron app
        if (app.isElectronApp) {
            const electronIcon = document.createElement('span');
            electronIcon.className = 'electron-icon';
            electronIcon.innerHTML = '⚡';
            electronIcon.title = 'Available as Electron app';
            titleContainer.appendChild(electronIcon);
        }
        
        content.appendChild(titleContainer);

        // Organization badge
        if (app.organization) {
            const orgBadge = document.createElement('div');
            orgBadge.className = 'app-organization';
            orgBadge.innerHTML = `<span class="org-icon">🏢</span> ${app.organization}`;
            content.appendChild(orgBadge);
        }

        // Description
        if (app.description) {
            const description = document.createElement('p');
            description.className = 'app-description';
            description.textContent = app.description;
            content.appendChild(description);
        }

        // Metadata section
        const metadataContainer = document.createElement('div');
        metadataContainer.className = 'app-metadata';
        
        // Last commit date
        if (app.updatedAt) {
            const lastCommit = document.createElement('div');
            lastCommit.className = 'app-meta-item';
            const commitDate = new Date(app.updatedAt).toLocaleDateString();
            lastCommit.innerHTML = `<span class="meta-icon">📅</span> Last updated: ${commitDate}`;
            metadataContainer.appendChild(lastCommit);
        }
        
        // Contributors
        if (app.contributors !== undefined) {
            const contributors = document.createElement('div');
            contributors.className = 'app-meta-item';
            contributors.innerHTML = `<span class="meta-icon">👥</span> Contributors: ${app.contributors}`;
            metadataContainer.appendChild(contributors);
        }
        
        // Stars and forks
        if (app.stars !== undefined || app.forks !== undefined) {
            const stats = document.createElement('div');
            stats.className = 'app-meta-item';
            let statsText = '';
            if (app.stars !== undefined) {
                statsText += `<span class="meta-icon">⭐</span> ${app.stars}`;
            }
            if (app.forks !== undefined) {
                if (statsText) statsText += ' • ';
                statsText += `<span class="meta-icon">🍴</span> ${app.forks}`;
            }
            stats.innerHTML = statsText;
            metadataContainer.appendChild(stats);
        }
        
        content.appendChild(metadataContainer);

        // Tags
        if (app.tags && app.tags.length > 0) {
            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'app-tags';

            app.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'app-tag';
                tagSpan.textContent = tag;
                tagsDiv.appendChild(tagSpan);
            });

            content.appendChild(tagsDiv);
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