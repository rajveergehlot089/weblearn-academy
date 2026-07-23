// ============================================
// PostgreSQL — Neon Serverless (WebSocket Pool)
// Uses WebSocket to avoid Vercel TCP/TLS issues
// ============================================
const { Pool } = require('pg');
const { neonConfig } = require('@neondatabase/serverless');

// Route WebSocket connections through Neon's proxy
neonConfig.webSocketConstructor = require('ws');

let pool;

function clean(val, fallback) {
  return String(val || fallback).replace(/^\uFEFF/g, '').trim();
}

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL
        || `postgresql://${clean(process.env.PGUSER)}:${clean(process.env.PGPASSWORD)}@${clean(process.env.PGHOST)}:${clean(process.env.PGPORT, '5432')}/${clean(process.env.PGDATABASE)}`,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 20000,
    });
    pool.on('error', (err) => console.error('Pool error:', err));
  }
  return pool;
}

async function query(sqlStr, params = []) {
  const { rows } = await getPool().query(sqlStr, params);
  return rows;
}

async function one(sqlStr, params = []) {
  const rows = await query(sqlStr, params);
  return rows[0] || null;
}

async function run(sqlStr, params = []) {
  return getPool().query(sqlStr, params);
}

let schemaReady = false;

async function initSchema() {
  if (schemaReady) return;
  const client = await getPool().connect();
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
      "passwordHash" TEXT NOT NULL, role TEXT DEFAULT 'customer',
      preferences TEXT DEFAULT '{}', "emailVerified" INTEGER DEFAULT 0,
      "failedLoginAttempts" INTEGER DEFAULT 0, "lockedUntil" TEXT,
      "tokenVersion" INTEGER DEFAULT 0, "createdAt" TEXT NOT NULL
    )`);
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');

    await client.query(`CREATE TABLE IF NOT EXISTS enrollments (
      "userId" TEXT NOT NULL, "courseId" TEXT NOT NULL, "activeCourse" TEXT,
      UNIQUE("userId", "courseId")
    )`);

    await client.query(`CREATE TABLE IF NOT EXISTS topic_progress (
      "userId" TEXT NOT NULL, "courseId" TEXT NOT NULL, "topicId" TEXT NOT NULL,
      "quickDone" INTEGER DEFAULT 0, "deepDone" INTEGER DEFAULT 0,
      "extraData" TEXT DEFAULT '{}', "lastAccessed" TEXT,
      UNIQUE("userId", "courseId", "topicId")
    )`);
    await client.query('CREATE INDEX IF NOT EXISTS idx_progress_user_course ON topic_progress("userId", "courseId")');

    await client.query(`CREATE TABLE IF NOT EXISTS daily_log (
      "userId" TEXT NOT NULL, date TEXT NOT NULL, "minutesSpent" REAL DEFAULT 0,
      "topicsVisited" TEXT DEFAULT '[]', UNIQUE("userId", date)
    )`);

    await client.query(`CREATE TABLE IF NOT EXISTS typing_scores (
      "userId" TEXT NOT NULL, "courseId" TEXT NOT NULL, "topicId" TEXT NOT NULL DEFAULT 'overall',
      "bestWpm" REAL DEFAULT 0, "bestAccuracy" REAL DEFAULT 0, "lastWpm" REAL DEFAULT 0,
      "lastAccuracy" REAL DEFAULT 0, attempts INTEGER DEFAULT 0, "timeLimit" INTEGER DEFAULT 60,
      "lastAttempt" TEXT, UNIQUE("userId", "courseId", "topicId")
    )`);

    await client.query(`CREATE TABLE IF NOT EXISTS interview_progress (
      "userId" TEXT NOT NULL, "courseId" TEXT NOT NULL, "topicId" TEXT NOT NULL,
      "questionIndex" INTEGER NOT NULL, correct INTEGER DEFAULT 0,
      UNIQUE("userId", "courseId", "topicId", "questionIndex")
    )`);

    await client.query(`CREATE TABLE IF NOT EXISTS exercise_progress (
      "userId" TEXT NOT NULL, "courseId" TEXT NOT NULL, "topicId" TEXT NOT NULL,
      "exerciseIndex" INTEGER NOT NULL, correct INTEGER DEFAULT 0,
      UNIQUE("userId", "courseId", "topicId", "exerciseIndex")
    )`);

    await client.query(`CREATE TABLE IF NOT EXISTS analysis_history (
      id TEXT PRIMARY KEY, "userId" TEXT NOT NULL, analysis TEXT NOT NULL, "createdAt" TEXT NOT NULL
    )`);
    await client.query('CREATE INDEX IF NOT EXISTS idx_analysis_user ON analysis_history("userId")');

    await client.query(`CREATE TABLE IF NOT EXISTS verification_tokens (
      token TEXT PRIMARY KEY, "userId" TEXT NOT NULL, email TEXT NOT NULL, "expiresAt" TEXT NOT NULL
    )`);

    await client.query(`CREATE TABLE IF NOT EXISTS reset_tokens (
      token TEXT PRIMARY KEY, "userId" TEXT NOT NULL, email TEXT NOT NULL, "expiresAt" TEXT NOT NULL
    )`);

    await client.query(`CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT DEFAULT '',
      icon TEXT DEFAULT 'fas fa-book', emoji TEXT DEFAULT '📚',
      category TEXT DEFAULT 'general', difficulty TEXT DEFAULT 'beginner',
      color TEXT DEFAULT '#667eea', "contentDir" TEXT NOT NULL,
      "hasTypingPractice" INTEGER DEFAULT 0, "typingLayout" TEXT DEFAULT 'qwerty',
      modes TEXT DEFAULT '["fast-track","full-course"]',
      "totalDays" TEXT DEFAULT '{"fast-track":10,"full-course":20}',
      "isActive" INTEGER DEFAULT 1, "createdAt" TEXT NOT NULL
    )`);

    const now = new Date().toISOString();
    await client.query('DELETE FROM verification_tokens WHERE "expiresAt" < $1', [now]);
    await client.query('DELETE FROM reset_tokens WHERE "expiresAt" < $1', [now]);
    schemaReady = true;
  } finally {
    client.release();
  }
}

module.exports = { query, one, run, initSchema };
