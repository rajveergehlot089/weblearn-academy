// ============================================
// Express → Vercel Serverless Adapter
// ============================================
// Wraps an Express route into a Vercel serverless handler

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

function createHandler(routeMiddleware, basePath = '') {
  const app = express();
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : process.env.NODE_ENV === 'production'
          ? false
          : '*',
      credentials: true,
    }),
  );

  app.use(basePath, routeMiddleware);

  return (req, res) => app(req, res);
}

module.exports = { createHandler };
