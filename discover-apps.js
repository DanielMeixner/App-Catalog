import { Octokit } from '@octokit/rest';
import fs from 'fs';

async function discoverAppsFromOrganization(orgName, token, ownerType = 'user') {
  const octokit = new Octokit({
    auth: token
  });
  
  console.log(`\nStarting GitHub Pages app discovery for ${orgName}...`);
  
  // Get all repositories for the user/organization with proper pagination
  let allRepos = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    console.log(`Fetching page ${page} of repositories for ${orgName}...`);
    
    try {
      let reposResponse;
      if (ownerType === 'org') {
        reposResponse = await octokit.rest.repos.listForOrg({
          org: orgName,
          per_page: 100,
          page: page,
          sort: 'updated',
          type: 'all'
        });
      } else {
        reposResponse = await octokit.rest.repos.listForUser({
          username: orgName,
          per_page: 100,
          page: page,
          sort: 'updated',
          type: 'all'
        });
      }
      
      const repos = reposResponse.data;
      console.log(`Page ${page}: Found ${repos.length} repositories for ${orgName}`);
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
      console.error(`Error fetching page ${page} for ${orgName}:`, error.message);
      if (error.status === 403) {
        console.log('Rate limit hit, waiting 60 seconds...');
        await new Promise(resolve => setTimeout(resolve, 60000));
        continue; // Try again
      }
      throw error;
    }
  }
  
  console.log(`Total repositories found for ${orgName}: ${allRepos.length}`);
  console.log(`Repository names for ${orgName}:`, allRepos.map(r => r.name).sort().join(', '));
  
  // Filter repositories with GitHub Pages enabled
  const pagesRepos = allRepos.filter(repo => {
    const hasPages = repo.has_pages;
    console.log(`${orgName}/${repo.name}: has_pages=${hasPages}`);
    return hasPages;
  });
  console.log(`\nRepositories with GitHub Pages for ${orgName}: ${pagesRepos.length}`);
  console.log(`Pages repositories for ${orgName}:`, pagesRepos.map(r => r.name).join(', '));
  
  const apps = [];
  
  for (const repo of pagesRepos) {
    console.log(`Processing repository: ${orgName}/${repo.name}`);
    
    try {
      // Get additional repository information
      const { data: repoDetails } = await octokit.rest.repos.get({
        owner: orgName,
        repo: repo.name
      });
      
      // Try to get the pages URL
      let pagesUrl = '';
      try {
        const { data: pages } = await octokit.rest.repos.getPages({
          owner: orgName,
          repo: repo.name
        });
        pagesUrl = pages.html_url;
      } catch (error) {
        console.log(`Could not get pages info for ${orgName}/${repo.name}, constructing URL manually`);
        // If pages API fails, construct URL based on repository name
        if (repo.name === `${orgName}.github.io`) {
          pagesUrl = `https://${orgName.toLowerCase()}.github.io`;
        } else {
          pagesUrl = `https://${orgName.toLowerCase()}.github.io/${repo.name}`;
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
      

      
      // Get contributors count
      let contributorsCount = 0;
      try {
        const { data: contributors } = await octokit.rest.repos.listContributors({
          owner: orgName,
          repo: repo.name,
          per_page: 100
        });
        contributorsCount = contributors.length;
      } catch (error) {
        console.log(`Could not fetch contributors for ${orgName}/${repo.name}:`, error.message);
      }
      
      // Check if it's an Electron app
      let isElectronApp = false;
      try {
        const { data: packageJson } = await octokit.rest.repos.getContent({
          owner: orgName,
          repo: repo.name,
          path: 'package.json'
        });
        
        const packageContent = Buffer.from(packageJson.content, 'base64').toString('utf-8');
        const packageData = JSON.parse(packageContent);
        
        // Check if electron is in dependencies or devDependencies
        const deps = { ...packageData.dependencies, ...packageData.devDependencies };
        isElectronApp = !!deps.electron;
      } catch (error) {
        console.log(`Could not check Electron dependency for ${orgName}/${repo.name}:`, error.message);
      }
      
      // Create app entry
      const app = {
        name: repo.name === `${orgName}.github.io` ? `${orgName}.github.io` : repo.name,
        description: repoDetails.description || 'No description available',
        url: pagesUrl,
        repository: repo.html_url,
        screenshot: `screenshots/${orgName}-${repo.name}.png`,
        tags: tags,
        language: repoDetails.language || 'Unknown',
        stars: repoDetails.stargazers_count,
        forks: repoDetails.forks_count,
        updatedAt: repoDetails.updated_at,
        contributors: contributorsCount,
        isElectronApp: isElectronApp,
        organization: orgName
      };
      
      apps.push(app);
      console.log(`Added app: ${app.name} from ${orgName}`);
    } catch (error) {
      console.error(`Error processing repository ${orgName}/${repo.name}:`, error.message);
    }
  }
  
  return apps;
}

async function discoverGitHubPagesApps() {
  try {
    console.log('Starting GitHub Pages app discovery...');
    
    let allApps = [];
    
    // Discover apps from DanielMeixner user
    if (process.env.GITHUB_TOKEN) {
      console.log('Discovering apps from DanielMeixner...');
      const danielApps = await discoverAppsFromOrganization('DanielMeixner', process.env.GITHUB_TOKEN, 'user');
      allApps = allApps.concat(danielApps);
    } else {
      console.warn('GITHUB_TOKEN not found, skipping DanielMeixner apps');
    }
    
    // Discover apps from opendmx organization
    if (process.env.OPENDMX_TOKEN) {
      console.log('Discovering apps from opendmx organization...');
      const opendmxApps = await discoverAppsFromOrganization('opendmx', process.env.OPENDMX_TOKEN, 'org');
      allApps = allApps.concat(opendmxApps);
    } else {
      console.warn('OPENDMX_TOKEN not found, skipping opendmx apps');
    }
    
    // Sort apps by update date (most recent first)
    allApps.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    // Create the apps data structure
    const appsData = {
      lastUpdated: new Date().toISOString(),
      totalApps: allApps.length,
      apps: allApps
    };
    
    // Write to apps-data.json
    fs.writeFileSync('apps-data.json', JSON.stringify(appsData, null, 2));
    
    console.log(`\nSuccessfully discovered ${allApps.length} GitHub Pages apps from all organizations`);
    console.log('Apps found:', allApps.map(app => `${app.name} (${app.organization})`).join(', '));
    
  } catch (error) {
    console.error('Error discovering GitHub Pages apps:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the discovery
discoverGitHubPagesApps();