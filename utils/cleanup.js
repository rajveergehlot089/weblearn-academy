// ============================================
// Data Cleanup Jobs
// ============================================
// Periodic cleanup of expired tokens and stale data
const { getPool } = require('./database');
const logger = require('./logger');

async function cleanupExpiredTokens() {
  const pool = getPool();
  const now = new Date().toISOString();

  const [verifications, resets] = await Promise.all([
    pool.query('DELETE FROM verification_tokens WHERE "expiresAt" < $1', [now]),
    pool.query('DELETE FROM reset_tokens WHERE "expiresAt" < $1', [now]),
  ]);

  const total = verifications.rowCount + resets.rowCount;
  if (total > 0) {
    logger.info({ verifications: verifications.rowCount, resets: resets.rowCount }, 'Cleaned up expired tokens');
  }
  return total;
}

async function cleanupStaleDailyLogs(daysToKeep = 90) {
  const pool = getPool();
  const cutoff = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000).toISOString();

  const result = await pool.query('DELETE FROM daily_log WHERE date < $1', [cutoff]);
  if (result.rowCount > 0) {
    logger.info({ deleted: result.rowCount, olderThan: `${daysToKeep} days` }, 'Cleaned up stale daily logs');
  }
  return result.rowCount;
}

async function cleanupOldAnalysisHistory(maxPerUser = 50) {
  const pool = getPool();

  const result = await pool.query(
    `
    DELETE FROM analysis_history
    WHERE id IN (
      SELECT id FROM (
        SELECT id, "userId", "createdAt",
               ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY "createdAt" DESC) as rn
        FROM analysis_history
      ) ranked
      WHERE rn > $1
    )
  `,
    [maxPerUser],
  );

  if (result.rowCount > 0) {
    logger.info({ deleted: result.rowCount, maxPerUser }, 'Cleaned up old analysis history');
  }
  return result.rowCount;
}

async function runAllCleanups() {
  try {
    const [tokens, logs, analysis] = await Promise.all([
      cleanupExpiredTokens(),
      cleanupStaleDailyLogs(),
      cleanupOldAnalysisHistory(),
    ]);
    logger.info({ tokens, logs, analysis }, 'Data cleanup completed');
  } catch (err) {
    logger.error({ err }, 'Data cleanup failed');
  }
}

module.exports = { cleanupExpiredTokens, cleanupStaleDailyLogs, cleanupOldAnalysisHistory, runAllCleanups };
