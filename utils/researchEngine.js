// ============================================
// Research Engine - Web Research & Data Collection
// ============================================
// Fetches real-time data from multiple sources for analysis

const https = require('https');
const http = require('http');
const { URL } = require('url');

class ResearchEngine {
  constructor() {
    this.cache = new Map();
    this.cacheTTL = 30 * 60 * 1000; // 30 minutes
  }

  // Fetch with timeout and retry
  async fetchWithTimeout(url, options = {}, timeout = 10000) {
    const cacheKey = url + JSON.stringify(options);
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.time < this.cacheTTL) {
      return cached.data;
    }

    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const lib = parsedUrl.protocol === 'https:' ? https : http;
      
      const req = lib.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/html, */*',
          ...options.headers
        },
        timeout
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            this.cache.set(cacheKey, { data: parsed, time: Date.now() });
            resolve(parsed);
          } catch {
            this.cache.set(cacheKey, { data, time: Date.now() });
            resolve(data);
          }
        });
      });
      
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    });
  }

  // Search job market data using multiple sources
  async searchJobMarket(role, region = 'global') {
    const queries = [
      `${role} job requirements 2025 2026`,
      `${role} skills demanded 2026`,
      `${role} salary trends ${region}`,
      `${role} hiring trends technology`
    ];
    
    const results = [];
    for (const query of queries) {
      try {
        const data = await this.searchWeb(query);
        results.push({ query, results: data });
      } catch {
        results.push({ query, results: [] });
      }
    }
    return this.aggregateJobData(results, role, region);
  }

  // Search for industry trends
  async searchIndustryTrends(industry) {
    const queries = [
      `${industry} industry trends 2025 2026`,
      `${industry} technology disruption 2026`,
      `${industry} future outlook`,
      `${industry} market size growth`
    ];
    
    const results = [];
    for (const query of queries) {
      try {
        const data = await this.searchWeb(query);
        results.push({ query, results: data });
      } catch {
        results.push({ query, results: [] });
      }
    }
    return this.aggregateTrendData(results, industry);
  }

  // Search for technology landscape
  async searchTechLandscape(techStack) {
    const queries = [
      `${techStack} latest frameworks 2026`,
      `${techStack} best tools 2026`,
      `${techStack} emerging technologies`,
      `${techStack} industry standards`
    ];
    
    const results = [];
    for (const query of queries) {
      try {
        const data = await this.searchWeb(query);
        results.push({ query, results: data });
      } catch {
        results.push({ query, results: [] });
      }
    }
    return this.aggregateTechData(results, techStack);
  }

  // Search web using DuckDuckGo Lite (no API key required)
  async searchWeb(query) {
    try {
      const encoded = encodeURIComponent(query);
      const url = `https://lite.duckduckgo.com/lite/?q=${encoded}`;
      const html = await this.fetchWithTimeout(url, {}, 15000);
      
      // Parse results from DuckDuckGo Lite HTML
      const results = [];
      const resultRegex = /<a[^>]*class="result-link"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi;
      let match;
      
      while ((match = resultRegex.exec(html)) !== null) {
        results.push({
          url: match[1],
          title: match[2].trim()
        });
      }
      
      // Fallback: try to extract any links from results
      if (results.length === 0) {
        const linkRegex = /<a[^>]*href="(https?:\/\/[^"]*)"[^>]*>([^<]{10,})<\/a>/gi;
        while ((match = linkRegex.exec(html)) !== null) {
          if (!match[1].includes('duckduckgo')) {
            results.push({
              url: match[1],
              title: match[2].trim()
            });
          }
        }
      }
      
      return results.slice(0, 5);
    } catch (error) {
      return [];
    }
  }

  // Fetch and parse a webpage for key information
  async analyzeWebpage(url) {
    try {
      const html = await this.fetchWithTimeout(url, {}, 10000);
      
      // Extract title
      const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : '';
      
      // Extract meta description
      const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i);
      const description = descMatch ? descMatch[1].trim() : '';
      
      // Extract headings
      const headings = [];
      const headingRegex = /<h[1-6][^>]*>([^<]*)<\/h[1-6]>/gi;
      let match;
      while ((match = headingRegex.exec(html)) !== null) {
        headings.push(match[1].trim());
      }
      
      // Extract text content (simplified)
      const textContent = html.replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 5000);
      
      return { url, title, description, headings, textContent };
    } catch (error) {
      return { url, error: error.message };
    }
  }

  // Aggregate job market data from multiple search results
  aggregateJobData(searchResults, role, region) {
    const skills = new Set();
    const technologies = new Set();
    const trends = [];
    
    const skillKeywords = [
      'javascript', 'python', 'java', 'react', 'node', 'angular', 'vue',
      'aws', 'azure', 'docker', 'kubernetes', 'sql', 'mongodb', 'redis',
      'git', 'ci/cd', 'agile', 'scrum', 'typescript', 'graphql', 'rest',
      'machine learning', 'ai', 'data analysis', 'cloud', 'security',
      'communication', 'leadership', 'problem solving', 'teamwork'
    ];
    
    for (const result of searchResults) {
      for (const item of result.results) {
        const text = (item.title + ' ' + (item.url || '')).toLowerCase();
        for (const skill of skillKeywords) {
          if (text.includes(skill)) {
            skills.add(skill);
          }
        }
      }
    }
    
    return {
      role,
      region,
      skillsFound: Array.from(skills),
      technologiesFound: Array.from(technologies),
      trends,
      sourcesSearched: searchResults.length,
      timestamp: new Date().toISOString()
    };
  }

  // Aggregate trend data
  aggregateTrendData(searchResults, industry) {
    const trends = [];
    const keywords = [
      'ai', 'artificial intelligence', 'machine learning', 'automation',
      'digital transformation', 'cloud', 'sustainability', 'remote work',
      'cybersecurity', 'data', 'blockchain', 'iot', '5g', 'edge computing',
      'metaverse', 'web3', 'quantum computing'
    ];
    
    const found = new Set();
    for (const result of searchResults) {
      for (const item of result.results) {
        const text = (item.title || '').toLowerCase();
        for (const kw of keywords) {
          if (text.includes(kw)) {
            found.add(kw);
          }
        }
      }
    }
    
    return {
      industry,
      keyTrends: Array.from(found),
      sourcesSearched: searchResults.length,
      timestamp: new Date().toISOString()
    };
  }

  // Aggregate tech data
  aggregateTechData(searchResults, techStack) {
    const tools = new Set();
    const frameworks = new Set();
    
    const techKeywords = [
      'react', 'vue', 'angular', 'next.js', 'nuxt', 'svelte',
      'node.js', 'deno', 'bun', 'express', 'fastify',
      'typescript', 'rust', 'go', 'python',
      'postgresql', 'mongodb', 'redis', 'elasticsearch',
      'docker', 'kubernetes', 'terraform', 'vercel', 'netlify',
      'aws', 'azure', 'gcp', 'supabase', 'firebase'
    ];
    
    for (const result of searchResults) {
      for (const item of result.results) {
        const text = (item.title || '').toLowerCase();
        for (const tech of techKeywords) {
          if (text.includes(tech)) {
            tools.add(tech);
          }
        }
      }
    }
    
    return {
      techStack,
      toolsFound: Array.from(tools),
      frameworksFound: Array.from(frameworks),
      sourcesSearched: searchResults.length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new ResearchEngine();
