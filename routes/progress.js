// ============================================
// Progress Routes (PostgreSQL-backed)
// ============================================
const express = require('express');
const router = express.Router();
const path = require('path');
const auth = require('../middleware/auth');
const db = require('../utils/db');
const rateLimit = require('../middleware/rateLimit');
const { validate, topicProgressSchema, typingScoreSchema, interviewAttemptSchema, exerciseAttemptSchema, dailyLogSchema } = require('../middleware/validate');

function loadCourseTopics(courseId) {
  try {
    const coursesData = db.readJSON('courses.json');
    const course = coursesData.courses?.[courseId];
    if (!course) return [];
    const idx = require(path.join(__dirname, '..', 'content', course.contentDir, 'index.js'));
    return Array.isArray(idx) ? idx : [];
  } catch { return []; }
}

// GET /api/progress/summary
router.get('/summary', auth, async (req, res) => {
  try {
    const courseId = req.query.courseId || await db.getActiveCourse(req.user.id) || 'web-development';
    const topics = loadCourseTopics(courseId);
    const mode = req.user.mode || 'fast-track';

    const allProgress = await db.getAllTopicProgress(req.user.id, courseId);
    const progressMap = {};
    allProgress.forEach(p => { progressMap[p.topicId] = p; });

    const totalTopics = topics.length;
    const completedTopics = topics.filter(t => {
      const p = progressMap[t.id];
      return p && p.quickDone && p.deepDone;
    }).length;
    const percentComplete = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    const currentTopicId = allProgress.length > 0
      ? allProgress.sort((a, b) => (b.lastAccessed || '').localeCompare(a.lastAccessed || ''))[0]?.topicId
      : (topics[0]?.id || '');
    const currentTopic = topics.find(t => t.id === currentTopicId);
    const currentDay = currentTopic
      ? (mode === 'fast-track' ? currentTopic.day_fast_track : currentTopic.day_full_course)
      : 1;

    const totalDays = mode === 'fast-track'
      ? (topics.length > 0 ? Math.max(...topics.map(t => t.day_fast_track || 1)) : 10)
      : (topics.length > 0 ? Math.max(...topics.map(t => t.day_full_course || 1)) : 20);

    const dailyLogs = await db.getDailyLog(req.user.id);
    const logDates = new Set(dailyLogs.map(d => d.date));
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date(today);
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (logDates.has(dateStr)) { streak++; checkDate.setDate(checkDate.getDate() - 1); }
      else break;
    }

    const typingScoresList = await db.getTypingScores(req.user.id, courseId);
    const typingScores = {};
    typingScoresList.forEach(s => { typingScores[s.topicId] = s; });

    const topicsFormatted = {};
    allProgress.forEach(p => {
      topicsFormatted[p.topicId] = {
        quickDone: !!p.quickDone,
        deepDone: !!p.deepDone,
        ...JSON.parse(p.extraData || '{}'),
      };
    });

    res.json({
      mode, courseId, currentDay, totalDays,
      percentComplete, completedTopics, totalTopics,
      streak, topics: topicsFormatted,
      currentTopicId, typingScores,
    });
  } catch (err) {
    console.error('Progress summary error:', err);
    res.status(500).json({ error: 'Failed to load progress' });
  }
});

// POST /api/progress/topic/:id
router.post('/topic/:id', auth, validate(topicProgressSchema), async (req, res) => {
  try {
    const topicId = req.params.id;
    const courseId = req.body.courseId || await db.getActiveCourse(req.user.id) || 'web-development';

    const extraData = { ...req.body };
    delete extraData.courseId;
    delete extraData.quickDone;
    delete extraData.deepDone;

    const update = { extraData: JSON.stringify(extraData) };
    if (req.body.quickDone !== undefined) update.quickDone = req.body.quickDone;
    if (req.body.deepDone !== undefined) update.deepDone = req.body.deepDone;
    await db.upsertTopicProgress(req.user.id, courseId, topicId, update);

    const today = new Date().toISOString().split('T')[0];
    await db.logDailyActivity(req.user.id, today, 0, topicId);

    res.json({ ok: true });
  } catch (err) {
    console.error('Update topic progress error:', err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// POST /api/progress/typing-score
router.post('/typing-score', auth, rateLimit(30, 60 * 1000), validate(typingScoreSchema), async (req, res) => {
  try {
    const { courseId, topicId, wpm, accuracy, timeLimit } = req.body;
    if (!courseId || wpm == null) return res.status(400).json({ error: 'courseId and wpm required' });

    const score = await db.saveTypingScore(req.user.id, courseId, topicId, wpm, accuracy, timeLimit);
    res.json({ ok: true, score });
  } catch (err) {
    console.error('Save typing score error:', err);
    res.status(500).json({ error: 'Failed to save typing score' });
  }
});

// POST /api/progress/topic/:id/interview
router.post('/topic/:id/interview', auth, validate(interviewAttemptSchema), async (req, res) => {
  try {
    const { questionIndex, correct, courseId } = req.body;
    const topicId = req.params.id;
    const cid = courseId || await db.getActiveCourse(req.user.id) || 'web-development';

    await db.recordInterviewAttempt(req.user.id, cid, topicId, questionIndex, correct);
    res.json({ ok: true });
  } catch (err) {
    console.error('Record interview error:', err);
    res.status(500).json({ error: 'Failed to record interview attempt' });
  }
});

// POST /api/progress/topic/:id/exercise
router.post('/topic/:id/exercise', auth, validate(exerciseAttemptSchema), async (req, res) => {
  try {
    const { exerciseIndex, correct, courseId } = req.body;
    const topicId = req.params.id;
    const cid = courseId || await db.getActiveCourse(req.user.id) || 'web-development';

    await db.recordExerciseAttempt(req.user.id, cid, topicId, exerciseIndex, correct);
    res.json({ ok: true });
  } catch (err) {
    console.error('Record exercise error:', err);
    res.status(500).json({ error: 'Failed to record exercise attempt' });
  }
});

// POST /api/progress/log
router.post('/log', auth, validate(dailyLogSchema), async (req, res) => {
  try {
    const { minutes, topicId } = req.body;
    const today = new Date().toISOString().split('T')[0];
    await db.logDailyActivity(req.user.id, today, minutes || 0, topicId);
    res.json({ ok: true });
  } catch (err) {
    console.error('Log activity error:', err);
    res.status(500).json({ error: 'Failed to log activity' });
  }
});

module.exports = router;
