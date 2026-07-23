// ============================================
// Database Access Layer (PostgreSQL)
// ============================================
const { getPool } = require('./database');

// Helper: run query and return all rows
async function all(sql, params = []) {
  const { rows } = await getPool().query(sql, params);
  return rows;
}

// Helper: run query and return first row
async function one(sql, params = []) {
  const { rows } = await getPool().query(sql, params);
  return rows[0] || null;
}

// Helper: run statement (INSERT/UPDATE/DELETE)
async function run(sql, params = []) {
  return getPool().query(sql, params);
}

// ============================================
// USER OPERATIONS
// ============================================
async function getUserByEmail(email) {
  return one('SELECT * FROM users WHERE email = $1', [email]);
}

async function getUserById(id) {
  return one('SELECT * FROM users WHERE id = $1', [id]);
}

async function createUser(id, name, email, passwordHash, role = 'customer') {
  await run(
    'INSERT INTO users (id, name, email, "passwordHash", role, preferences, "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [id, name, email, passwordHash, role, '{}', new Date().toISOString()]
  );
}

async function updateUserPreferences(userId, preferences) {
  await run('UPDATE users SET preferences = $1 WHERE id = $2', [JSON.stringify(preferences), userId]);
}

async function getAllUsers() {
  return all('SELECT id, name, email, role, "createdAt" FROM users');
}

async function deleteUser(userId) {
  const pool = getPool();
  await pool.query('DELETE FROM exercise_progress WHERE "userId" = $1', [userId]);
  await pool.query('DELETE FROM interview_progress WHERE "userId" = $1', [userId]);
  await pool.query('DELETE FROM typing_scores WHERE "userId" = $1', [userId]);
  await pool.query('DELETE FROM daily_log WHERE "userId" = $1', [userId]);
  await pool.query('DELETE FROM topic_progress WHERE "userId" = $1', [userId]);
  await pool.query('DELETE FROM enrollments WHERE "userId" = $1', [userId]);
  await pool.query('DELETE FROM analysis_history WHERE "userId" = $1', [userId]);
  await pool.query('DELETE FROM users WHERE id = $1', [userId]);
}

async function updateUser(userId, fields) {
  const updates = [];
  const params = [];
  let i = 1;
  if (fields.name) { updates.push(`name = $${i++}`); params.push(fields.name); }
  if (fields.email) { updates.push(`email = $${i++}`); params.push(fields.email); }
  if (fields.role && ['customer', 'admin'].includes(fields.role)) { updates.push(`role = $${i++}`); params.push(fields.role); }
  if (fields.passwordHash) { updates.push(`"passwordHash" = $${i++}`); params.push(fields.passwordHash); }
  if (updates.length === 0) return;
  params.push(userId);
  await run(`UPDATE users SET ${updates.join(', ')} WHERE id = $${i}`, params);
}

async function updateUserRole(userId, role) {
  await run('UPDATE users SET role = $1 WHERE id = $2', [role, userId]);
}

// ============================================
// ENROLLMENT OPERATIONS
// ============================================
async function getEnrollments(userId) {
  return all('SELECT "courseId", "activeCourse" FROM enrollments WHERE "userId" = $1', [userId]);
}

async function getActiveCourse(userId) {
  const row = await one('SELECT "activeCourse" FROM enrollments WHERE "userId" = $1 AND "activeCourse" IS NOT NULL LIMIT 1', [userId]);
  return row ? row.activeCourse : null;
}

async function enrollUser(userId, courseId) {
  const existing = await one('SELECT 1 FROM enrollments WHERE "userId" = $1 AND "courseId" = $2', [userId, courseId]);
  if (!existing) {
    await run('INSERT INTO enrollments ("userId", "courseId") VALUES ($1, $2)', [userId, courseId]);
  }

  const current = await one('SELECT "activeCourse" FROM enrollments WHERE "userId" = $1 AND "activeCourse" IS NOT NULL LIMIT 1', [userId]);
  if (!current) {
    await run('UPDATE enrollments SET "activeCourse" = $1 WHERE "userId" = $2', [courseId, userId]);
  }
}

async function setActiveCourse(userId, courseId) {
  const pool = getPool();
  await pool.query('UPDATE enrollments SET "activeCourse" = NULL WHERE "userId" = $1', [userId]);
  await pool.query('UPDATE enrollments SET "activeCourse" = $1 WHERE "userId" = $2 AND "courseId" = $3', [courseId, userId, courseId]);
}

async function isEnrolled(userId, courseId) {
  return !!(await one('SELECT 1 FROM enrollments WHERE "userId" = $1 AND "courseId" = $2', [userId, courseId]));
}

// ============================================
// TOPIC PROGRESS OPERATIONS
// ============================================
async function getTopicProgress(userId, courseId, topicId) {
  return one('SELECT * FROM topic_progress WHERE "userId" = $1 AND "courseId" = $2 AND "topicId" = $3', [userId, courseId, topicId]);
}

async function getAllTopicProgress(userId, courseId) {
  return all('SELECT * FROM topic_progress WHERE "userId" = $1 AND "courseId" = $2', [userId, courseId]);
}

async function upsertTopicProgress(userId, courseId, topicId, data) {
  const existing = await getTopicProgress(userId, courseId, topicId);
  const now = new Date().toISOString();

  if (existing) {
    const mergedExtra = { ...JSON.parse(existing.extraData || '{}'), ...JSON.parse(data.extraData || '{}') };
    await run(
      'UPDATE topic_progress SET "quickDone" = $1, "deepDone" = $2, "extraData" = $3, "lastAccessed" = $4 WHERE "userId" = $5 AND "courseId" = $6 AND "topicId" = $7',
      [
        data.quickDone !== undefined ? (data.quickDone ? 1 : 0) : existing.quickDone,
        data.deepDone !== undefined ? (data.deepDone ? 1 : 0) : existing.deepDone,
        JSON.stringify(mergedExtra),
        now,
        userId, courseId, topicId,
      ]
    );
  } else {
    await run(
      'INSERT INTO topic_progress ("userId", "courseId", "topicId", "quickDone", "deepDone", "extraData", "lastAccessed") VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [userId, courseId, topicId, data.quickDone ? 1 : 0, data.deepDone ? 1 : 0, data.extraData || '{}', now]
    );
  }
}

// ============================================
// DAILY LOG OPERATIONS
// ============================================
async function getDailyLog(userId) {
  return all('SELECT * FROM daily_log WHERE "userId" = $1', [userId]);
}

async function logDailyActivity(userId, date, minutes, topicId) {
  const existing = await one('SELECT * FROM daily_log WHERE "userId" = $1 AND date = $2', [userId, date]);

  if (existing) {
    const visited = JSON.parse(existing.topicsVisited || '[]');
    if (topicId && !visited.includes(topicId)) {
      visited.push(topicId);
    }
    await run(
      'UPDATE daily_log SET "minutesSpent" = "minutesSpent" + $1, "topicsVisited" = $2 WHERE "userId" = $3 AND date = $4',
      [minutes || 0, JSON.stringify(visited), userId, date]
    );
  } else {
    const visited = topicId ? [topicId] : [];
    await run(
      'INSERT INTO daily_log ("userId", date, "minutesSpent", "topicsVisited") VALUES ($1, $2, $3, $4)',
      [userId, date, minutes || 0, JSON.stringify(visited)]
    );
  }
}

// ============================================
// TYPING SCORE OPERATIONS
// ============================================
async function getTypingScores(userId, courseId) {
  return all('SELECT * FROM typing_scores WHERE "userId" = $1 AND "courseId" = $2', [userId, courseId]);
}

async function saveTypingScore(userId, courseId, topicId, wpm, accuracy, timeLimit) {
  const key = topicId || 'overall';
  const existing = await one('SELECT * FROM typing_scores WHERE "userId" = $1 AND "courseId" = $2 AND "topicId" = $3', [userId, courseId, key]);
  const now = new Date().toISOString();

  if (existing) {
    await run(
      'UPDATE typing_scores SET "bestWpm" = GREATEST("bestWpm", $1), "bestAccuracy" = GREATEST("bestAccuracy", $2), "lastWpm" = $1, "lastAccuracy" = $2, attempts = attempts + 1, "timeLimit" = $3, "lastAttempt" = $4 WHERE "userId" = $5 AND "courseId" = $6 AND "topicId" = $7',
      [wpm, accuracy || 0, timeLimit || 60, now, userId, courseId, key]
    );
  } else {
    await run(
      'INSERT INTO typing_scores ("userId", "courseId", "topicId", "bestWpm", "bestAccuracy", "lastWpm", "lastAccuracy", attempts, "timeLimit", "lastAttempt") VALUES ($1, $2, $3, $4, $5, $6, $7, 1, $8, $9)',
      [userId, courseId, key, wpm, accuracy || 0, wpm, accuracy || 0, timeLimit || 60, now]
    );
  }

  return one('SELECT * FROM typing_scores WHERE "userId" = $1 AND "courseId" = $2 AND "topicId" = $3', [userId, courseId, key]);
}

// ============================================
// INTERVIEW / EXERCISE PROGRESS
// ============================================
async function recordInterviewAttempt(userId, courseId, topicId, questionIndex, correct) {
  const existing = await one(
    'SELECT 1 FROM interview_progress WHERE "userId" = $1 AND "courseId" = $2 AND "topicId" = $3 AND "questionIndex" = $4',
    [userId, courseId, topicId, questionIndex]
  );
  if (!existing) {
    await run(
      'INSERT INTO interview_progress ("userId", "courseId", "topicId", "questionIndex", correct) VALUES ($1, $2, $3, $4, $5)',
      [userId, courseId, topicId, questionIndex, correct ? 1 : 0]
    );
  } else if (correct) {
    await run(
      'UPDATE interview_progress SET correct = 1 WHERE "userId" = $1 AND "courseId" = $2 AND "topicId" = $3 AND "questionIndex" = $4',
      [userId, courseId, topicId, questionIndex]
    );
  }
}

async function getInterviewProgress(userId, courseId, topicId) {
  return all('SELECT "questionIndex", correct FROM interview_progress WHERE "userId" = $1 AND "courseId" = $2 AND "topicId" = $3', [userId, courseId, topicId]);
}

async function recordExerciseAttempt(userId, courseId, topicId, exerciseIndex, correct) {
  const existing = await one(
    'SELECT 1 FROM exercise_progress WHERE "userId" = $1 AND "courseId" = $2 AND "topicId" = $3 AND "exerciseIndex" = $4',
    [userId, courseId, topicId, exerciseIndex]
  );
  if (!existing) {
    await run(
      'INSERT INTO exercise_progress ("userId", "courseId", "topicId", "exerciseIndex", correct) VALUES ($1, $2, $3, $4, $5)',
      [userId, courseId, topicId, exerciseIndex, correct ? 1 : 0]
    );
  } else if (correct) {
    await run(
      'UPDATE exercise_progress SET correct = 1 WHERE "userId" = $1 AND "courseId" = $2 AND "topicId" = $3 AND "exerciseIndex" = $4',
      [userId, courseId, topicId, exerciseIndex]
    );
  }
}

async function getExerciseProgress(userId, courseId, topicId) {
  return all('SELECT "exerciseIndex", correct FROM exercise_progress WHERE "userId" = $1 AND "courseId" = $2 AND "topicId" = $3', [userId, courseId, topicId]);
}

// ============================================
// ANALYSIS HISTORY
// ============================================
async function saveAnalysis(userId, id, analysis) {
  await run(
    'INSERT INTO analysis_history (id, "userId", analysis, "createdAt") VALUES ($1, $2, $3, $4)',
    [id, userId, JSON.stringify(analysis), new Date().toISOString()]
  );
}

async function getAnalysisById(id) {
  return one('SELECT * FROM analysis_history WHERE id = $1', [id]);
}

async function getAnalysisHistory(userId) {
  return all('SELECT id, analysis, "createdAt" FROM analysis_history WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT 20', [userId]);
}

async function deleteAnalysis(id) {
  await run('DELETE FROM analysis_history WHERE id = $1', [id]);
}

// ============================================
// ADMIN STATS
// ============================================
async function getAdminStats() {
  const [totalUsers, adminCount, totalCompletions] = await Promise.all([
    one('SELECT COUNT(*) as count FROM users'),
    one("SELECT COUNT(*) as count FROM users WHERE role = 'admin'"),
    one('SELECT COUNT(*) as count FROM topic_progress WHERE "quickDone" = 1 AND "deepDone" = 1'),
  ]);
  return {
    totalUsers: totalUsers.count,
    adminCount: adminCount.count,
    totalTopicCompletions: totalCompletions.count,
  };
}

async function getDailyActiveLast30Days() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const rows = await all(
    'SELECT date, COUNT(DISTINCT "userId") as count FROM daily_log WHERE date >= $1 GROUP BY date ORDER BY date',
    [thirtyDaysAgo]
  );
  const result = {};
  rows.forEach(r => { result[r.date] = parseInt(r.count); });
  return result;
}

async function getCourseTopicCompletions(courseId) {
  return all(
    'SELECT "topicId", COUNT(*) as completions FROM topic_progress WHERE "courseId" = $1 AND "quickDone" = 1 AND "deepDone" = 1 GROUP BY "topicId"',
    [courseId]
  );
}

// ============================================
// SECURITY: TOKEN MANAGEMENT
// ============================================
async function saveVerificationToken(token, userId, email, expiresAt) {
  await run(
    'INSERT INTO verification_tokens (token, "userId", email, "expiresAt") VALUES ($1, $2, $3, $4)',
    [token, userId, email, expiresAt]
  );
}

async function getVerificationToken(token) {
  return one('SELECT * FROM verification_tokens WHERE token = $1', [token]);
}

async function deleteVerificationToken(token) {
  await run('DELETE FROM verification_tokens WHERE token = $1', [token]);
}

async function saveResetToken(token, userId, email, expiresAt) {
  await run(
    'INSERT INTO reset_tokens (token, "userId", email, "expiresAt") VALUES ($1, $2, $3, $4)',
    [token, userId, email, expiresAt]
  );
}

async function getResetToken(token) {
  return one('SELECT * FROM reset_tokens WHERE token = $1', [token]);
}

async function deleteResetToken(token) {
  await run('DELETE FROM reset_tokens WHERE token = $1', [token]);
}

// ============================================
// SECURITY: ACCOUNT LOCKOUT
// ============================================
async function incrementFailedLogin(userId) {
  await run(
    'UPDATE users SET "failedLoginAttempts" = "failedLoginAttempts" + 1 WHERE id = $1',
    [userId]
  );
}

async function resetFailedLogin(userId) {
  await run(
    'UPDATE users SET "failedLoginAttempts" = 0, "lockedUntil" = NULL WHERE id = $1',
    [userId]
  );
}

async function lockAccount(userId, until) {
  await run(
    'UPDATE users SET "lockedUntil" = $1 WHERE id = $2',
    [until, userId]
  );
}

// ============================================
// SECURITY: TOKEN VERSION (JWT revocation)
// ============================================
async function incrementTokenVersion(userId) {
  await run(
    'UPDATE users SET "tokenVersion" = "tokenVersion" + 1 WHERE id = $1',
    [userId]
  );
}

async function getTokenVersion(userId) {
  const row = await one('SELECT "tokenVersion" FROM users WHERE id = $1', [userId]);
  return row ? row.tokenVersion : 0;
}

// ============================================
// SECURITY: EMAIL VERIFICATION
// ============================================
async function setEmailVerified(userId) {
  await run('UPDATE users SET "emailVerified" = 1 WHERE id = $1', [userId]);
}

// ============================================
// COURSES DB OPERATIONS (replaces file-based courses.json)
// ============================================
async function getAllCourses() {
  return all('SELECT * FROM courses WHERE "isActive" = 1');
}

async function getCourseById(courseId) {
  return one('SELECT * FROM courses WHERE id = $1', [courseId]);
}

async function createCourse(data) {
  await run(
    `INSERT INTO courses (id, title, description, icon, emoji, category, difficulty, color, "contentDir", "hasTypingPractice", "typingLayout", modes, "totalDays", "isActive", "createdAt")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
    [data.id, data.title, data.description || '', data.icon || 'fas fa-book', data.emoji || '📚',
     data.category || 'general', data.difficulty || 'beginner', data.color || '#667eea',
     data.contentDir || data.id, data.hasTypingPractice ? 1 : 0, data.typingLayout || 'qwerty',
     JSON.stringify(data.modes || ['fast-track', 'full-course']),
     JSON.stringify(data.totalDays || { 'fast-track': 10, 'full-course': 20 }),
     data.isActive !== false ? 1 : 0, new Date().toISOString()]
  );
}

async function updateCourse(courseId, fields) {
  const updates = [];
  const params = [];
  let i = 1;
  if (fields.title !== undefined) { updates.push(`title = $${i++}`); params.push(fields.title); }
  if (fields.description !== undefined) { updates.push(`description = $${i++}`); params.push(fields.description); }
  if (fields.icon !== undefined) { updates.push(`icon = $${i++}`); params.push(fields.icon); }
  if (fields.emoji !== undefined) { updates.push(`emoji = $${i++}`); params.push(fields.emoji); }
  if (fields.category !== undefined) { updates.push(`category = $${i++}`); params.push(fields.category); }
  if (fields.difficulty !== undefined) { updates.push(`difficulty = $${i++}`); params.push(fields.difficulty); }
  if (fields.color !== undefined) { updates.push(`color = $${i++}`); params.push(fields.color); }
  if (fields.isActive !== undefined) { updates.push(`"isActive" = $${i++}`); params.push(fields.isActive ? 1 : 0); }
  if (updates.length === 0) return;
  params.push(courseId);
  await run(`UPDATE courses SET ${updates.join(', ')} WHERE id = $${i}`, params);
}

async function deleteCourse(courseId) {
  await run('UPDATE courses SET "isActive" = 0 WHERE id = $1', [courseId]);
}

module.exports = {
  getUserByEmail, getUserById, createUser, updateUserPreferences, getAllUsers,
  deleteUser, updateUser, updateUserRole,
  getEnrollments, getActiveCourse, enrollUser, setActiveCourse, isEnrolled,
  getTopicProgress, getAllTopicProgress, upsertTopicProgress,
  getDailyLog, logDailyActivity,
  getTypingScores, saveTypingScore,
  recordInterviewAttempt, getInterviewProgress,
  recordExerciseAttempt, getExerciseProgress,
  saveAnalysis, getAnalysisById, getAnalysisHistory, deleteAnalysis,
  getAdminStats, getDailyActiveLast30Days, getCourseTopicCompletions,
  // Security
  saveVerificationToken, getVerificationToken, deleteVerificationToken,
  saveResetToken, getResetToken, deleteResetToken,
  incrementFailedLogin, resetFailedLogin, lockAccount,
  incrementTokenVersion, getTokenVersion,
  setEmailVerified,
  // Courses DB
  getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse,
};
