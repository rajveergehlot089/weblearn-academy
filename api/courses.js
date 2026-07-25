// Courses API — Vercel Serverless (uses Express routes)
const { createHandler } = require('../serverless-lib/adapter');
const courseRoutes = require('../routes/courses');
module.exports = createHandler(courseRoutes, '/api/courses');
