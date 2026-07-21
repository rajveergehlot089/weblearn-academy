const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');
const researchEngine = require('../utils/researchEngine');

// GET /api/search?q=<query>&context=<topicId>
router.get('/', auth, rateLimit(20, 60 * 1000), async (req, res) => {
  const { q, context } = req.query;
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: 'Search query must be at least 2 characters' });
  }

  try {
    const query = context ? `${q} ${context} explanation tutorial` : q;
    const results = await researchEngine.searchWeb(query);
    res.json({ query: q, context: context || null, results });
  } catch (error) {
    res.json({ query: q, results: [], error: 'Search temporarily unavailable' });
  }
});

module.exports = router;
