// Progress API — Vercel Serverless (uses Express routes)
const { createHandler } = require('../serverless-lib/adapter');
const progressRoutes = require('../routes/progress');
module.exports = createHandler(progressRoutes, '/api/progress');
