// Auth API — Vercel Serverless (uses Express routes)
const { createHandler } = require('../serverless-lib/adapter');
const authRoutes = require('../routes/auth');
module.exports = createHandler(authRoutes, '/api/auth');
