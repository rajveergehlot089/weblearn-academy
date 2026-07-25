// Health Check API — Vercel Serverless
const { createHandler } = require('../serverless-lib/adapter');
const express = require('express');
const { getPool } = require('../utils/database');

const healthRouter = express.Router();
healthRouter.get('/', async (req, res) => {
  try {
    await getPool().query('SELECT 1');
    res.json({ status: 'ok', uptime: process.uptime(), db: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res
      .status(503)
      .json({ status: 'error', uptime: process.uptime(), db: 'disconnected', timestamp: new Date().toISOString() });
  }
});

module.exports = createHandler(healthRouter);
