// ============================================
// PostgreSQL — Neon HTTP with $1→tagged-template adapter
// Converts $1 parameterized queries to neon() tagged templates
// ============================================
const { neon } = require('@neondatabase/serverless');

let sql;
let schemaReady = false;

function clean(val, fallback) {
  return String(val || fallback).replace(/\uFEFF/g, '').trim();
}

function getSql() {
  if (!sql) {
    const connStr = clean(process.env.DATABASE_URL)
      || `postgresql://${clean(process.env.PGUSER)}:${clean(process.env.PGPASSWORD)}@${clean(process.env.PGHOST)}:${clean(process.env.PGPORT, '5432')}/${clean(process.env.PGDATABASE)}?sslmode=require`;
    sql = neon(connStr);
  }
  return sql;
}

// Convert "$1, $2, ..." parameterized queries to tagged template format
// This lets us keep using $1 syntax in all API routes
function toTagged(sqlStr, params) {
  if (!params || params.length === 0) {
    // No params — just return the raw SQL
    return [sqlStr];
  }
  // Split on $N placeholders and build tagged template array
  const parts = [];
  const values = [];
  let remaining = sqlStr;
  for (let i = 1; i <= params.length; i++) {
    const idx = remaining.indexOf(`$${i}`);
    if (idx === -1) break;
    parts.push(remaining.slice(0, idx));
    values.push(params[i - 1]);
    remaining = remaining.slice(idx + `$${i}`.length);
  }
  parts.push(remaining);
  // Tagged template: sql`part1${val1}part2${val2}...partN`
  const template = parts.reduce((acc, part, idx) => acc + part + (idx < values.length ? `\${params[${idx}]}` : ''), '');
  // Actually we need to use the real tagged template function
  // neon() tagged template takes (strings, ...values)
  const strings = parts;
  return [strings, values];
}

async function query(sqlStr, params = []) {
  const s = getSql();
  if (!params || params.length === 0) {
    const result = await s(sqlStr);
    return result;
  }
  // Use sql.query() for $1 parameterized queries
  const result = await s.query(sqlStr, params);
  return result;
}

async function one(sqlStr, params = []) {
  const rows = await query(sqlStr, params);
  return rows[0] || null;
}

async function run(sqlStr, params = []) {
  return query(sqlStr, params);
}

async function initSchema() {
  if (schemaReady) return;
  const s = getSql();

  await s`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL, role TEXT DEFAULT 'customer',
    preferences TEXT DEFAULT '{}', "emailVerified" INTEGER DEFAULT 0,
    "failedLoginAttempts" INTEGER DEFAULT 0, "lockedUntil" TEXT,
    "tokenVersion" INTEGER DEFAULT 0, "createdAt" TEXT NOT NULL
  )`;
  await s`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;

  await s`CREATE TABLE IF NOT EXISTS enrollments (
    "userId" TEXT NOT NULL, "courseId" TEXT NOT NULL, "activeCourse" TEXT,
    UNIQUE("userId", "courseId")
  )`;

  await s`CREATE TABLE IF NOT EXISTS topic_progress (
    "userId" TEXT NOT NULL, "courseId" TEXT NOT NULL, "topicId" TEXT NOT NULL,
    "quickDone" INTEGER DEFAULT 0, "deepDone" INTEGER DEFAULT 0,
    "extraData" TEXT DEFAULT '{}', "lastAccessed" TEXT,
    UNIQUE("userId", "courseId", "topicId")
  )`;
  await s`CREATE INDEX IF NOT EXISTS idx_progress_user_course ON topic_progress("userId", "courseId")`;

  await s`CREATE TABLE IF NOT EXISTS daily_log (
    "userId" TEXT NOT NULL, date TEXT NOT NULL, "minutesSpent" REAL DEFAULT 0,
    "topicsVisited" TEXT DEFAULT '[]', UNIQUE("userId", date)
  )`;

  await s`CREATE TABLE IF NOT EXISTS typing_scores (
    "userId" TEXT NOT NULL, "courseId" TEXT NOT NULL, "topicId" TEXT NOT NULL DEFAULT 'overall',
    "bestWpm" REAL DEFAULT 0, "bestAccuracy" REAL DEFAULT 0, "lastWpm" REAL DEFAULT 0,
    "lastAccuracy" REAL DEFAULT 0, attempts INTEGER DEFAULT 0, "timeLimit" INTEGER DEFAULT 60,
    "lastAttempt" TEXT, UNIQUE("userId", "courseId", "topicId")
  )`;

  await s`CREATE TABLE IF NOT EXISTS interview_progress (
    "userId" TEXT NOT NULL, "courseId" TEXT NOT NULL, "topicId" TEXT NOT NULL,
    "questionIndex" INTEGER NOT NULL, correct INTEGER DEFAULT 0,
    UNIQUE("userId", "courseId", "topicId", "questionIndex")
  )`;

  await s`CREATE TABLE IF NOT EXISTS exercise_progress (
    "userId" TEXT NOT NULL, "courseId" TEXT NOT NULL, "topicId" TEXT NOT NULL,
    "exerciseIndex" INTEGER NOT NULL, correct INTEGER DEFAULT 0,
    UNIQUE("userId", "courseId", "topicId", "exerciseIndex")
  )`;

  await s`CREATE TABLE IF NOT EXISTS analysis_history (
    id TEXT PRIMARY KEY, "userId" TEXT NOT NULL, analysis TEXT NOT NULL, "createdAt" TEXT NOT NULL
  )`;
  await s`CREATE INDEX IF NOT EXISTS idx_analysis_user ON analysis_history("userId")`;

  await s`CREATE TABLE IF NOT EXISTS verification_tokens (
    token TEXT PRIMARY KEY, "userId" TEXT NOT NULL, email TEXT NOT NULL, "expiresAt" TEXT NOT NULL
  )`;

  await s`CREATE TABLE IF NOT EXISTS reset_tokens (
    token TEXT PRIMARY KEY, "userId" TEXT NOT NULL, email TEXT NOT NULL, "expiresAt" TEXT NOT NULL
  )`;

  await s`CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT DEFAULT '',
    icon TEXT DEFAULT 'fas fa-book', emoji TEXT DEFAULT '📚',
    category TEXT DEFAULT 'general', difficulty TEXT DEFAULT 'beginner',
    color TEXT DEFAULT '#667eea', "contentDir" TEXT NOT NULL,
    "hasTypingPractice" INTEGER DEFAULT 0, "typingLayout" TEXT DEFAULT 'qwerty',
    modes TEXT DEFAULT '["fast-track","full-course"]',
    "totalDays" TEXT DEFAULT '{"fast-track":10,"full-course":20}',
    "isActive" INTEGER DEFAULT 1, "createdAt" TEXT NOT NULL
  )`;

  const now = new Date().toISOString();
  await s`DELETE FROM verification_tokens WHERE "expiresAt" < ${now}`;
  await s`DELETE FROM reset_tokens WHERE "expiresAt" < ${now}`;
  schemaReady = true;
}

module.exports = { query, one, run, initSchema };
