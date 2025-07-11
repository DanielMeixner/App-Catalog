const { Octokit } = require('@octokit/rest');
const fs = require('fs');

async function discoverGitHubPagesApps() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });
  
  try {
    console.log('Starting GitHub Pages app discovery...');
    
    // Get all repositories for the user with proper pagination
    let allRepos = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      console.log(`Fetching page ${page} of repositories...`);
      
      try {
        const { data: repos } = await octokit.rest.repos.listForUser({
          username: 'DanielMeixner',
          per_page: 100,
          page: page,
          sort: 'updated',
          type: 'all'
        });
        
        console.log(`Page ${page}: Found ${repos.length} repositories`);
        allRepos = allRepos.concat(repos);
        
        // Check if there are more pages - if we got less than 100 repos, we're done
        hasMore = repos.length === 100;
        page++;
        
        // Safety check to avoid infinite loops
        if (page > 50) {
          console.log('Reached maximum page limit (50), stopping pagination');
          break;
        }
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error.message);
        if (error.status === 403) {
          console.log('Rate limit hit, waiting 60 seconds...');
          await new Promise(resolve => setTimeout(resolve, 60000));
          continue; // Try again
        }
        throw error;
      }
    }
    
    console.log(`Total repositories found: ${allRepos.length}`);
    console.log('All repository names:', allRepos.map(r => r.name).sort().join(', '));
    
    // Filter repositories with GitHub Pages enabled
    const pagesRepos = allRepos.filter(repo => {
      const hasPages = repo.has_pages;
      console.log(`${repo.name}: has_pages=${hasPages}`);
      return hasPages;
    });
    console.log(`\nRepositories with GitHub Pages: ${pagesRepos.length}`);
    console.log('Pages repositories:', pagesRepos.map(r => r.name).join(', '));
    
    const apps = [];
    
    for (const repo of pagesRepos) {
      console.log(`Processing repository: ${repo.name}`);
      
      try {
        // Get additional repository information
        const { data: repoDetails } = await octokit.rest.repos.get({
          owner: 'DanielMeixner',
          repo: repo.name
        });
        
        // Try to get the pages URL
        let pagesUrl = '';
        try {
          const { data: pages } = await octokit.rest.repos.getPages({
            owner: 'DanielMeixner',
            repo: repo.name
          });
          pagesUrl = pages.html_url;
        } catch (error) {
          console.log(`Could not get pages info for ${repo.name}, constructing URL manually`);
          // If pages API fails, construct URL based on repository name
          if (repo.name === 'DanielMeixner.github.io') {
            pagesUrl = 'https://danielmeixner.github.io';
          } else {
            pagesUrl = `https://danielmeixner.github.io/${repo.name}`;
          }
        }
        
        // Extract tags from topics and language
        const tags = [];
        if (repoDetails.topics) {
          tags.push(...repoDetails.topics.map(topic => 
            topic.charAt(0).toUpperCase() + topic.slice(1)
          ));
        }
        if (repoDetails.language) {
          tags.push(repoDetails.language);
        }
        
        // Create app entry
        const app = {
          name: repo.name === 'DanielMeixner.github.io' ? 'DanielMeixner.github.io' : repo.name,
          description: repoDetails.description || 'No description available',
          url: pagesUrl,
          repository: repo.html_url,
          screenshot: `screenshots/${repo.name}.png`,
          tags: tags,
          language: repoDetails.language || 'Unknown',
          stars: repoDetails.stargazers_count,
          forks: repoDetails.forks_count,
          updatedAt: repoDetails.updated_at
        };
        
        apps.push(app);
        console.log(`Added app: ${app.name}`);
      } catch (error) {
        console.error(`Error processing repository ${repo.name}:`, error.message);
      }
    }
    
    // Sort apps by update date (most recent first)
    apps.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    // Create the apps data structure
    const appsData = {
      lastUpdated: new Date().toISOString(),
      totalApps: apps.length,
      apps: apps
    };
    
    // Write to apps-data.json
    fs.writeFileSync('apps-data.json', JSON.stringify(appsData, null, 2));
    
    console.log(`\nSuccessfully discovered ${apps.length} GitHub Pages apps`);
    console.log('Apps found:', apps.map(app => app.name).join(', '));
    
  } catch (error) {
    console.error('Error discovering GitHub Pages apps:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the discovery
discoverGitHubPagesApps();