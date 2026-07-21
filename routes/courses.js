// ============================================
// Course Routes (PostgreSQL-backed)
// ============================================
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/admin');
const db = require('../utils/db');
const { validate, createCourseSchema, updateCourseSchema, createTopicSchema } = require('../middleware/validate');

function readContentJSON(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
  catch { return null; }
}

function invalidateContentCache(courseContentDir) {
  const indexPath = require.resolve(path.join(__dirname, '..', 'content', courseContentDir, 'index.js'));
  delete require.cache[indexPath];
}

// ============================================
// GET /api/courses - List all active courses
// ============================================
router.get('/', auth, async (req, res) => {
  try {
    const coursesData = db.readJSON('courses.json');
    const courses = Object.values(coursesData.courses || {}).filter(c => c.isActive);

    const allEnrollments = await db.getEnrollments(req.user.id);
    const enrolledIds = new Set(allEnrollments.map(e => e.courseId));
    const activeEntry = allEnrollments.find(e => e.activeCourse);
    const active = activeEntry ? activeEntry.activeCourse : 'web-development';

    const enriched = [];
    for (const c of courses) {
      const contentIndex = require(path.join(__dirname, '..', 'content', c.contentDir, 'index.js'));
      const topics = Array.isArray(contentIndex) ? contentIndex : [];
      const topicProgress = await db.getAllTopicProgress(req.user.id, c.id);
      const progressMap = {};
      topicProgress.forEach(p => { progressMap[p.topicId] = p; });

      const completed = topics.filter(t => {
        const tp = progressMap[t.id];
        return tp && tp.quickDone && tp.deepDone;
      }).length;

      enriched.push({
        ...c,
        totalTopics: topics.length,
        completedTopics: completed,
        percentComplete: topics.length > 0 ? Math.round((completed / topics.length) * 100) : 0,
        isEnrolled: enrolledIds.has(c.id),
        isActiveCourse: active === c.id,
      });
    }

    res.json({ courses: enriched, activeCourse: active });
  } catch (err) {
    console.error('Courses list error:', err);
    res.status(500).json({ error: 'Failed to load courses' });
  }
});

// ============================================
// PUT /api/courses/active-course - Set active course
// ============================================
router.put('/active-course', auth, async (req, res) => {
  try {
    const { courseId } = req.body;
    const coursesData = db.readJSON('courses.json');
    if (!coursesData.courses?.[courseId]) return res.status(404).json({ error: 'Course not found' });

    await db.setActiveCourse(req.user.id, courseId);
    res.json({ success: true, activeCourse: courseId });
  } catch (err) {
    console.error('Set active course error:', err);
    res.status(500).json({ error: 'Failed to set active course' });
  }
});

// ============================================
// POST /api/courses/admin/create - Create course
// ============================================
router.post('/admin/create', adminAuth, validate(createCourseSchema), async (req, res) => {
  try {
    const { id, title, description, icon, emoji, category, difficulty, color } = req.body;
    if (!id || !title) return res.status(400).json({ error: 'id and title are required' });

    const coursesData = db.readJSON('courses.json');
    if (coursesData.courses?.[id]) return res.status(400).json({ error: 'Course ID already exists' });

    const newCourse = {
      id, title, description: description || '', icon: icon || 'fas fa-book',
      emoji: emoji || '\ud83d\udcda', category: category || 'general',
      difficulty: difficulty || 'beginner', color: color || '#667eea',
      contentDir: id, hasTypingPractice: false, modes: ['fast-track', 'full-course'],
      totalDays: { 'fast-track': 10, 'full-course': 20 },
      isActive: true, createdAt: new Date().toISOString(),
    };

    if (!coursesData.courses) coursesData.courses = {};
    coursesData.courses[id] = newCourse;
    db.writeJSON('courses.json', coursesData);

    const contentDir = path.join(__dirname, '..', 'content', id);
    if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });
    fs.writeFileSync(path.join(contentDir, 'index.js'), 'module.exports = [];');

    res.json({ success: true, course: newCourse });
  } catch (err) {
    console.error('Create course error:', err);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// ============================================
// GET /api/courses/:courseId - Get course details
// ============================================
router.get('/:courseId', auth, async (req, res) => {
  try {
    const coursesData = db.readJSON('courses.json');
    const course = coursesData.courses?.[req.params.courseId];
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const contentIndex = require(path.join(__dirname, '..', 'content', course.contentDir, 'index.js'));
    const topics = Array.isArray(contentIndex) ? contentIndex : [];
    const topicProgress = await db.getAllTopicProgress(req.user.id, course.id);
    const progressMap = {};
    topicProgress.forEach(p => { progressMap[p.topicId] = p; });

    const enrichedTopics = topics.map(t => {
      const tp = progressMap[t.id];
      return {
        ...t,
        quickDone: tp ? !!tp.quickDone : false,
        deepDone: tp ? !!tp.deepDone : false,
        completed: tp ? (!!tp.quickDone && !!tp.deepDone) : false,
      };
    });

    res.json({ course, topics: enrichedTopics });
  } catch (err) {
    console.error('Get course error:', err);
    res.status(500).json({ error: 'Failed to load course' });
  }
});

// ============================================
// GET /api/courses/:courseId/topics - List topics
// ============================================
router.get('/:courseId/topics', auth, async (req, res) => {
  try {
    const coursesData = db.readJSON('courses.json');
    const course = coursesData.courses?.[req.params.courseId];
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const contentIndex = require(path.join(__dirname, '..', 'content', course.contentDir, 'index.js'));
    const topics = Array.isArray(contentIndex) ? contentIndex : [];
    const mode = req.user.mode || 'fast-track';

    const enriched = topics.map(t => ({
      id: t.id,
      title: t.title,
      group: t.group,
      dayNumber: t[`day_${mode}`] || t.day_fast_track || 1,
      icon: t.icon,
      description: t.description,
      prerequisites: t.prerequisites || [],
    }));

    enriched.sort((a, b) => a.dayNumber - b.dayNumber);
    res.json({ mode, topics: enriched, courseId: req.params.courseId });
  } catch (err) {
    console.error('Get topics error:', err);
    res.status(500).json({ error: 'Failed to load topics' });
  }
});

// ============================================
// GET /api/courses/:courseId/topics/:topicId - Get topic content
// ============================================
router.get('/:courseId/topics/:topicId', auth, async (req, res) => {
  try {
    const coursesData = db.readJSON('courses.json');
    const course = coursesData.courses?.[req.params.courseId];
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const topicDir = path.join(__dirname, '..', 'content', course.contentDir, req.params.topicId);
    if (!fs.existsSync(topicDir)) return res.status(404).json({ error: 'Topic not found' });

    const contentIndex = require(path.join(__dirname, '..', 'content', course.contentDir, 'index.js'));
    const topics = Array.isArray(contentIndex) ? contentIndex : [];
    const meta = topics.find(t => t.id === req.params.topicId);

    res.json({
      meta: meta || {},
      quick: readContentJSON(path.join(topicDir, 'quick.json')),
      deep: readContentJSON(path.join(topicDir, 'deep.json')),
      comparison: readContentJSON(path.join(topicDir, 'comparison.json')),
      interview: readContentJSON(path.join(topicDir, 'interview.json')),
      exercises: readContentJSON(path.join(topicDir, 'exercises.json')),
      courseId: req.params.courseId,
    });
  } catch (err) {
    console.error('Get topic content error:', err);
    res.status(500).json({ error: 'Failed to load topic content' });
  }
});

// ============================================
// POST /api/courses/:courseId/enroll - Enroll in a course
// ============================================
router.post('/:courseId/enroll', auth, async (req, res) => {
  try {
    const coursesData = db.readJSON('courses.json');
    const course = coursesData.courses?.[req.params.courseId];
    if (!course) return res.status(404).json({ error: 'Course not found' });

    await db.enrollUser(req.user.id, course.id);
    const enrollments = await db.getEnrollments(req.user.id);
    const active = await db.getActiveCourse(req.user.id);

    res.json({
      success: true,
      enrolled: enrollments.map(e => e.courseId),
      activeCourse: active,
    });
  } catch (err) {
    console.error('Enroll error:', err);
    res.status(500).json({ error: 'Failed to enroll' });
  }
});

// ============================================
// PUT /api/courses/admin/:courseId - Update course
// ============================================
router.put('/admin/:courseId', adminAuth, validate(updateCourseSchema), async (req, res) => {
  try {
    const coursesData = db.readJSON('courses.json');
    if (!coursesData.courses?.[req.params.courseId]) return res.status(404).json({ error: 'Course not found' });

    const updates = req.body;
    const course = coursesData.courses[req.params.courseId];
    Object.assign(course, updates, { id: course.id, contentDir: course.contentDir });
    db.writeJSON('courses.json', coursesData);
    res.json({ success: true, course });
  } catch (err) {
    console.error('Update course error:', err);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// ============================================
// DELETE /api/courses/admin/:courseId - Soft delete
// ============================================
router.delete('/admin/:courseId', adminAuth, async (req, res) => {
  try {
    const coursesData = db.readJSON('courses.json');
    if (!coursesData.courses?.[req.params.courseId]) return res.status(404).json({ error: 'Course not found' });

    coursesData.courses[req.params.courseId].isActive = false;
    db.writeJSON('courses.json', coursesData);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete course error:', err);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// ============================================
// POST /api/courses/admin/:courseId/topics - Create topic
// ============================================
router.post('/admin/:courseId/topics', adminAuth, validate(createTopicSchema), async (req, res) => {
  try {
    const coursesData = db.readJSON('courses.json');
    const course = coursesData.courses?.[req.params.courseId];
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const { id, title, group, icon, description, prerequisites } = req.body;
    if (!id || !title) return res.status(400).json({ error: 'id and title required' });

    const topicDir = path.join(__dirname, '..', 'content', course.contentDir, id);
    if (fs.existsSync(topicDir)) return res.status(400).json({ error: 'Topic already exists' });

    fs.mkdirSync(topicDir, { recursive: true });

    const indexPath = path.join(__dirname, '..', 'content', course.contentDir, 'index.js');
    let topics = [];
    try {
      invalidateContentCache(course.contentDir);
      topics = require(indexPath);
    } catch { topics = []; }
    if (!Array.isArray(topics)) topics = [];

    const newTopic = {
      id, title, group: group || 'general',
      day_fast_track: topics.length + 1, day_full_course: topics.length + 1,
      icon: icon || '\ud83d\udcdd', description: description || '',
      prerequisites: prerequisites || [],
    };

    const existingIdx = topics.findIndex(t => t.id === id);
    if (existingIdx >= 0) topics[existingIdx] = newTopic;
    else topics.push(newTopic);

    fs.writeFileSync(indexPath, `module.exports = ${JSON.stringify(topics, null, 2)};`);
    invalidateContentCache(course.contentDir);

    ['quick.json', 'deep.json', 'exercises.json', 'interview.json', 'comparison.json'].forEach(f => {
      fs.writeFileSync(path.join(topicDir, f), JSON.stringify({ topicId: id, type: f.replace('.json', ''), sections: [] }, null, 2));
    });

    res.json({ success: true, topic: newTopic });
  } catch (err) {
    console.error('Create topic error:', err);
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

// ============================================
// PUT /api/courses/admin/:courseId/topics/:topicId
// ============================================
router.put('/admin/:courseId/topics/:topicId', adminAuth, async (req, res) => {
  try {
    const coursesData = db.readJSON('courses.json');
    const course = coursesData.courses?.[req.params.courseId];
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const topicDir = path.join(__dirname, '..', 'content', course.contentDir, req.params.topicId);
    if (!fs.existsSync(topicDir)) return res.status(404).json({ error: 'Topic not found' });

    const { section, data } = req.body;
    if (!section || !data) return res.status(400).json({ error: 'section and data required' });

    fs.writeFileSync(path.join(topicDir, `${section}.json`), JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error('Update topic error:', err);
    res.status(500).json({ error: 'Failed to update topic' });
  }
});

// ============================================
// DELETE /api/courses/admin/:courseId/topics/:topicId
// ============================================
router.delete('/admin/:courseId/topics/:topicId', adminAuth, async (req, res) => {
  try {
    const coursesData = db.readJSON('courses.json');
    const course = coursesData.courses?.[req.params.courseId];
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const topicDir = path.join(__dirname, '..', 'content', course.contentDir, req.params.topicId);
    if (fs.existsSync(topicDir)) fs.rmSync(topicDir, { recursive: true });

    const indexPath = path.join(__dirname, '..', 'content', course.contentDir, 'index.js');
    let topics = [];
    try {
      invalidateContentCache(course.contentDir);
      topics = require(indexPath);
    } catch { topics = []; }
    if (!Array.isArray(topics)) topics = [];

    const filtered = topics.filter(t => t.id !== req.params.topicId);
    fs.writeFileSync(indexPath, `module.exports = ${JSON.stringify(filtered, null, 2)};`);
    invalidateContentCache(course.contentDir);

    res.json({ success: true });
  } catch (err) {
    console.error('Delete topic error:', err);
    res.status(500).json({ error: 'Failed to delete topic' });
  }
});

module.exports = router;
