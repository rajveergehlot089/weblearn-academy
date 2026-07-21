// ============================================
// Search API — web search with research engine
// ============================================
const db = require('./lib/db');
const { requireAuth, setCorsHeaders, handleOptions } = require('./lib/auth');

module.exports = async (req, res) => {
  setCorsHeaders(res);
  if (handleOptions(req, res)) return;
  await db.initSchema();

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireAuth(req, res);
  if (!user) return;

  const url = new URL(req.url, 'http://localhost');
  const q = url.searchParams.get('q');
  const context = url.searchParams.get('context');

  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: 'Search query must be at least 2 characters' });
  }

  try {
    // Use built-in fetch (Node 18+) for DuckDuckGo Lite search
    const query = context ? `${q} ${context} explanation tutorial` : q;
    const encoded = encodeURIComponent(query);
    const searchUrl = `https://lite.duckduckgo.com/lite/?q=${encoded}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const html = await response.text();

    // Parse results from DuckDuckGo Lite HTML
    const results = [];
    const resultRegex = /<a[^>]*class="result-link"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi;
    let match;
    while ((match = resultRegex.exec(html)) !== null) {
      results.push({ url: match[1], title: match[2].trim() });
    }

    // Fallback: extract any links
    if (results.length === 0) {
      const linkRegex = /<a[^>]*href="(https?:\/\/[^"]*)"[^>]*>([^<]{10,})<\/a>/gi;
      while ((match = linkRegex.exec(html)) !== null) {
        if (!match[1].includes('duckduckgo')) {
          results.push({ url: match[1], title: match[2].trim() });
        }
      }
    }

    res.json({ query: q, context: context || null, results: results.slice(0, 5) });
  } catch (error) {
    res.json({ query: q, results: [], error: 'Search temporarily unavailable' });
  }
};
