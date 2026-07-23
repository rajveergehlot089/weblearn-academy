// ============================================
// PostgreSQL Database Pool & Schema Initialization
// ============================================
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432'),
  user: process.env.PGUSER || 'postgres',
  database: process.env.PGDATABASE || 'weblearn_academy',
  password: process.env.PGPASSWORD || undefined,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        "passwordHash" TEXT NOT NULL,
        role TEXT DEFAULT 'customer',
        preferences TEXT DEFAULT '{}',
        "createdAt" TEXT NOT NULL
      );
    `);
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);');

    // Security columns (add if missing — idempotent)
    await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS "emailVerified" INTEGER DEFAULT 0;');
    await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS "failedLoginAttempts" INTEGER DEFAULT 0;');
    await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS "lockedUntil" TEXT;');
    await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS "tokenVersion" INTEGER DEFAULT 0;');

    // Verification tokens (email verification)
    await client.query(`
      CREATE TABLE IF NOT EXISTS verification_tokens (
        token TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        email TEXT NOT NULL,
        "expiresAt" TEXT NOT NULL
      );
    `);

    // Reset tokens (password reset)
    await client.query(`
      CREATE TABLE IF NOT EXISTS reset_tokens (
        token TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        email TEXT NOT NULL,
        "expiresAt" TEXT NOT NULL
      );
    `);

    // Courses table (move from file-based JSON to DB)
    await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        icon TEXT DEFAULT 'fas fa-book',
        emoji TEXT DEFAULT '📚',
        category TEXT DEFAULT 'general',
        difficulty TEXT DEFAULT 'beginner',
        color TEXT DEFAULT '#667eea',
        "contentDir" TEXT NOT NULL,
        "hasTypingPractice" INTEGER DEFAULT 0,
        "typingLayout" TEXT DEFAULT 'qwerty',
        modes TEXT DEFAULT '["fast-track","full-course"]',
        "totalDays" TEXT DEFAULT '{"fast-track":10,"full-course":20}',
        "isActive" INTEGER DEFAULT 1,
        "createdAt" TEXT NOT NULL
      );
    `);

    // Cleanup expired tokens on startup
    await client.query("DELETE FROM verification_tokens WHERE \"expiresAt\" < $1", [new Date().toISOString()]);
    await client.query("DELETE FROM reset_tokens WHERE \"expiresAt\" < $1", [new Date().toISOString()]);

    await client.query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        "userId" TEXT NOT NULL,
        "courseId" TEXT NOT NULL,
        "activeCourse" TEXT,
        UNIQUE("userId", "courseId")
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS topic_progress (
        "userId" TEXT NOT NULL,
        "courseId" TEXT NOT NULL,
        "topicId" TEXT NOT NULL,
        "quickDone" INTEGER DEFAULT 0,
        "deepDone" INTEGER DEFAULT 0,
        "extraData" TEXT DEFAULT '{}',
        "lastAccessed" TEXT,
        UNIQUE("userId", "courseId", "topicId")
      );
    `);
    await client.query('CREATE INDEX IF NOT EXISTS idx_progress_user_course ON topic_progress("userId", "courseId");');

    await client.query(`
      CREATE TABLE IF NOT EXISTS daily_log (
        "userId" TEXT NOT NULL,
        date TEXT NOT NULL,
        "minutesSpent" REAL DEFAULT 0,
        "topicsVisited" TEXT DEFAULT '[]',
        UNIQUE("userId", date)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS typing_scores (
        "userId" TEXT NOT NULL,
        "courseId" TEXT NOT NULL,
        "topicId" TEXT NOT NULL DEFAULT 'overall',
        "bestWpm" REAL DEFAULT 0,
        "bestAccuracy" REAL DEFAULT 0,
        "lastWpm" REAL DEFAULT 0,
        "lastAccuracy" REAL DEFAULT 0,
        attempts INTEGER DEFAULT 0,
        "timeLimit" INTEGER DEFAULT 60,
        "lastAttempt" TEXT,
        UNIQUE("userId", "courseId", "topicId")
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS interview_progress (
        "userId" TEXT NOT NULL,
        "courseId" TEXT NOT NULL,
        "topicId" TEXT NOT NULL,
        "questionIndex" INTEGER NOT NULL,
        correct INTEGER DEFAULT 0,
        UNIQUE("userId", "courseId", "topicId", "questionIndex")
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS exercise_progress (
        "userId" TEXT NOT NULL,
        "courseId" TEXT NOT NULL,
        "topicId" TEXT NOT NULL,
        "exerciseIndex" INTEGER NOT NULL,
        correct INTEGER DEFAULT 0,
        UNIQUE("userId", "courseId", "topicId", "exerciseIndex")
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS analysis_history (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        analysis TEXT NOT NULL,
        "createdAt" TEXT NOT NULL
      );
    `);
    await client.query('CREATE INDEX IF NOT EXISTS idx_analysis_user ON analysis_history("userId");');

    console.log('PostgreSQL tables initialized');

    // Seed courses from content directory if courses table is empty
    const { rows: existingCourses } = await client.query('SELECT COUNT(*) as count FROM courses');
    if (parseInt(existingCourses[0].count) === 0) {
      console.log('Seeding courses from content directory...');
      const path = require('path');
      const CONTENT_DIR = path.join(__dirname, '..', 'content');
      try {
        const contentIndex = require(path.join(CONTENT_DIR, 'index.js'));
        for (const [courseId, topics] of Object.entries(contentIndex)) {
          if (!Array.isArray(topics) || topics.length === 0) continue;
          const maxFast = Math.max(...topics.map(t => t.day_fast_track || 1));
          const maxFull = Math.max(...topics.map(t => t.day_full_course || 1));

          let category = 'technology';
          if (courseId.includes('hindi') || courseId.includes('english')) category = 'language';
          if (courseId.includes('typing')) category = 'typing';
          if (courseId.includes('self-awareness') || courseId.includes('communication') || courseId.includes('productivity') || courseId.includes('leadership') || courseId.includes('career') || courseId.includes('personality')) category = 'soft-skills';

          const isTyping = courseId.includes('typing');

          await client.query(
            `INSERT INTO courses (id, title, description, icon, emoji, category, difficulty, color, "contentDir", "hasTypingPractice", "typingLayout", modes, "totalDays", "isActive", "createdAt")
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) ON CONFLICT (id) DO NOTHING`,
            [
              courseId,
              courseId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
              `${topics.length} learning topics`,
              isTyping ? 'fas fa-keyboard' : 'fas fa-book',
              isTyping ? '\u2328\ufe0f' : '\ud83d\udcda',
              category,
              'beginner',
              '#667eea',
              courseId,
              isTyping ? 1 : 0,
              courseId.includes('hindi') ? 'remington' : 'qwerty',
              JSON.stringify(['fast-track', 'full-course']),
              JSON.stringify({ 'fast-track': maxFast, 'full-course': maxFull }),
              1,
              new Date().toISOString(),
            ]
          );
        }
        console.log('Courses seeded successfully');
      } catch (err) {
        console.error('Failed to seed courses:', err.message);
      }
    }
  } finally {
    client.release();
  }
}

function getPool() {
  return pool;
}

async function closeDb() {
  await pool.end();
}

module.exports = { initDb, getPool, closeDb };
