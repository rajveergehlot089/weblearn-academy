// Search API — Vercel Serverless (uses Express routes)
const { createHandler } = require('../serverless-lib/adapter');
const searchRoutes = require('../routes/search');
module.exports = createHandler(searchRoutes, '/api/search');
