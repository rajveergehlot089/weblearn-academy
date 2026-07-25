// Admin API — Vercel Serverless (uses Express routes)
const { createHandler } = require('../serverless-lib/adapter');
const adminRoutes = require('../routes/admin');
module.exports = createHandler(adminRoutes, '/api/admin');
