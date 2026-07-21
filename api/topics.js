// ============================================
// Topics API — lists all topics across courses
// ============================================
const db = require('./lib/db');
const { requireAuth, setCorsHeaders, handleOptions } = require('./lib/auth');
const { getCoursesMetadata, getCourseTopics, getTopicContent } = require('./lib/content');

module.exports = async (req, res) => {
  setCorsHeaders(res);
  if (handleOptions(req, res)) return;
  await db.initSchema();

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireAuth(req, res);
  if (!user) return;

  const url = new URL(req.url, 'http://localhost');
  const stripped = url.pathname.replace(/^\/api\/topics\/?/, '');
  const topicId = stripped.split('/').filter(Boolean)[0];

  try {
    const dbUser = await db.one('SELECT preferences FROM users WHERE id = $1', [user.id]);
    const mode = (dbUser && JSON.parse(dbUser.preferences || '{}').mode) || 'fast-track';

    // GET /api/topics — list all topics
    if (!topicId) {
      const courses = await db.query('SELECT id FROM courses WHERE "isActive" = 1');
      const allTopics = [];
      for (const course of courses) {
        const topics = getCourseTopics(course.id) || [];
        for (const t of topics) {
          allTopics.push({
            id: t.id, title: t.title, description: t.description, icon: t.icon,
            dayNumber: mode === 'fast-track' ? t.day_fast_track : t.day_full_course,
            group: t.group, courseId: course.id,
          });
        }
      }
      allTopics.sort((a, b) => a.dayNumber - b.dayNumber);
      return res.json({ mode, topics: allTopics });
    }

    // GET /api/topics/:id — get single topic content
    // Search across all courses for this topic ID
    const courses = await db.query('SELECT id FROM courses WHERE "isActive" = 1');
    for (const course of courses) {
      const topics = getCourseTopics(course.id) || [];
      const meta = topics.find(t => t.id === topicId);
      if (meta) {
        const content = getTopicContent(course.id, topicId);
        return res.json({
          meta,
          quick: content?.quick || null,
          deep: content?.deep || null,
          comparison: content?.comparison || null,
          interview: content?.interview || null,
          exercises: content?.exercises || null,
          courseId: course.id,
        });
      }
    }

    return res.status(404).json({ error: 'Topic not found' });
  } catch (err) {
    console.error('Topics error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
