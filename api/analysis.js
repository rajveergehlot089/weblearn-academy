// Analysis API — Vercel Serverless (uses Express routes)
const { createHandler } = require('../serverless-lib/adapter');
const analysisRoutes = require('../routes/analysis');
module.exports = createHandler(analysisRoutes, '/api/analysis');
