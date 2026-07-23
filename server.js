require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { initDb } = require('./utils/database');
const { csrfInit, csrfProtect } = require('./middleware/csrf');
const { globalLimiter } = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 2007;
const isProd = process.env.NODE_ENV === 'production';

// Validate critical env vars
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('FATAL: JWT_SECRET must be set and at least 32 characters');
  process.exit(1);
}

// ============================================
// Middleware
// ============================================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      // TODO: Remove 'unsafe-inline' by migrating onclick handlers to addEventListener
      // and inline styles to CSS classes
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      ...(isProd ? { upgradeInsecureRequests: [] } : {}),
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : isProd ? false : '*',
  credentials: true,
}));
app.use(compression());
app.use(morgan(isProd ? 'combined' : 'dev'));
app.use(cookieParser());
app.use(express.json({ limit: isProd ? '1mb' : '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// CSRF: set cookie on page loads, verify on mutations
app.use(csrfInit);
app.use('/api', globalLimiter);
app.use('/api', csrfProtect);

// ============================================
// Static Files
// ============================================
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// Health Check
// ============================================
app.get('/health', async (req, res) => {
  try {
    const { getPool } = require('./utils/database');
    await getPool().query('SELECT 1');
    res.json({ status: 'ok', uptime: process.uptime(), db: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: 'error', uptime: process.uptime(), db: 'disconnected', timestamp: new Date().toISOString() });
  }
});
app.get('/api/health', async (req, res) => {
  try {
    const { getPool } = require('./utils/database');
    await getPool().query('SELECT 1');
    res.json({ status: 'ok', uptime: process.uptime(), db: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: 'error', uptime: process.uptime(), db: 'disconnected', timestamp: new Date().toISOString() });
  }
});

// ============================================
// API Routes
// ============================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/topics', require('./routes/topics'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/search', require('./routes/search'));
app.use('/api/analysis', require('./routes/analysis'));

// ============================================
// SPA Catch-All (must be after API routes)
// ============================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================
// Error Handler
// ============================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// Start Server
// ============================================
async function start() {
  try {
    await initDb();
    console.log('Database initialized');

    // Create admin from environment variables if ADMIN_EMAIL is set
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const db = require('./utils/db');
      const existingAdmin = await db.getUserByEmail(process.env.ADMIN_EMAIL);
      if (!existingAdmin) {
        const { v4: uuidv4 } = require('uuid');
        const { hashPassword } = require('./utils/hash');
        const adminId = uuidv4();
        const adminHash = await hashPassword(process.env.ADMIN_PASSWORD);
        await db.createUser(adminId, 'Admin', process.env.ADMIN_EMAIL, adminHash, 'admin');
        console.log(`Admin user created: ${process.env.ADMIN_EMAIL}`);
      }
    }

    const server = app.listen(PORT, () => {
      console.log(`WebLearn Academy: http://localhost:${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(() => {
        const { closeDb } = require('./utils/database');
        closeDb().then(() => {
          console.log('Database connection closed.');
          process.exit(0);
        });
      });
      // Force exit after 10 seconds
      setTimeout(() => process.exit(1), 10000);
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
