// Topics API — Vercel Serverless (uses Express routes)
const { createHandler } = require('../serverless-lib/adapter');
const topicRoutes = require('../routes/topics');
module.exports = createHandler(topicRoutes, '/api/topics');
