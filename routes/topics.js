// ============================================
// Topics Routes (DB-backed via courses)
// ============================================
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const db = require('../utils/db');
const logger = require('../utils/logger');
const { mediumCache } = require('../middleware/cacheHeaders');

function readContentJSON(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

// GET /api/topics - List all topics for active course
router.get('/', auth, mediumCache, async (req, res) => {
  try {
    const courseId = req.query.courseId || (await db.getActiveCourse(req.user.id)) || 'web-development';
    const course = await db.getCourseById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const contentIndex = require(path.join(__dirname, '..', 'content', course.contentDir, 'index.js'));
    const topics = Array.isArray(contentIndex) ? contentIndex : [];
    const mode = req.user.mode || 'fast-track';

    const topicList = topics.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      icon: t.icon,
      dayNumber: mode === 'fast-track' ? t.day_fast_track : t.day_full_course,
      group: t.group,
    }));

    topicList.sort((a, b) => a.dayNumber - b.dayNumber);

    res.json({
      courseId,
      mode,
      topics: topicList,
    });
  } catch (error) {
    logger.error({ err: error, requestId: req.id }, 'Error loading topics');
    res.status(500).json({ error: 'Failed to load topics' });
  }
});

// GET /api/topics/:id - Get single topic content
router.get('/:id', auth, mediumCache, async (req, res) => {
  try {
    const courseId = (await db.getActiveCourse(req.user.id)) || 'web-development';
    const course = await db.getCourseById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const contentIndex = require(path.join(__dirname, '..', 'content', course.contentDir, 'index.js'));
    const topics = Array.isArray(contentIndex) ? contentIndex : [];
    const topic = topics.find((t) => t.id === req.params.id);
    if (!topic) return res.status(404).json({ error: 'Topic not found' });

    const contentDir = path.join(__dirname, '..', 'content', course.contentDir, req.params.id);
    const content = {
      meta: topic,
      courseId,
      quick: readContentJSON(path.join(contentDir, 'quick.json')),
      deep: readContentJSON(path.join(contentDir, 'deep.json')),
      comparison: readContentJSON(path.join(contentDir, 'comparison.json')),
      interview: readContentJSON(path.join(contentDir, 'interview.json')),
      exercises: readContentJSON(path.join(contentDir, 'exercises.json')),
    };

    res.json(content);
  } catch (error) {
    logger.error({ err: error, requestId: req.id }, 'Error loading topic');
    res.status(500).json({ error: 'Failed to load topic content' });
  }
});

module.exports = router;
