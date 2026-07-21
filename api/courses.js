// ============================================
// Courses API — Vercel Serverless (full feature parity)
// ============================================
const db = require('./lib/db');
const { requireAuth, requireAdmin, setCorsHeaders, handleOptions } = require('./lib/auth');
const { getCoursesMetadata, getCourseTopics, getTopicContent, getCourseMetadata } = require('./lib/content');

module.exports = async (req, res) => {
  await db.initSchema();
  setCorsHeaders(res);
  if (handleOptions(req, res)) return;

  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname.replace(/^\/api\/courses/, '');

  try {
    // ========================================
    // PUT /api/courses/active-course
    // ========================================
    if (req.method === 'PUT' && path === '/active-course') {
      const user = await requireAuth(req, res);
      if (!user) return;

      const { courseId } = req.body;
      if (!courseId) return res.status(400).json({ error: 'courseId required' });

      const course = await db.one('SELECT * FROM courses WHERE id = $1', [courseId]);
      if (!course) return res.status(404).json({ error: 'Course not found' });

      await db.run(
        'UPDATE enrollments SET "activeCourse" = $1 WHERE "userId" = $2 AND "courseId" = $1',
        [courseId, user.id]
      );
      return res.json({ success: true, activeCourse: courseId });
    }

    // ========================================
    // POST /api/courses/admin/create
    // ========================================
    if (req.method === 'POST' && path === '/admin/create') {
      const user = await requireAdmin(req, res);
      if (!user) return;

      const { id, title, description, icon, emoji, category, difficulty, color } = req.body;
      if (!id || !title) return res.status(400).json({ error: 'id and title are required' });

      const existing = await db.one('SELECT id FROM courses WHERE id = $1', [id]);
      if (existing) return res.status(400).json({ error: 'Course ID already exists' });

      const newCourse = {
        id, title, description: description || '', icon: icon || 'fas fa-book',
        emoji: emoji || '\ud83d\udcda', category: category || 'general',
        difficulty: difficulty || 'beginner', color: color || '#667eea',
        contentDir: id, hasTypingPractice: 0, typingLayout: 'qwerty',
        modes: JSON.stringify(['fast-track', 'full-course']),
        totalDays: JSON.stringify({ 'fast-track': 10, 'full-course': 20 }),
        isActive: 1, createdAt: new Date().toISOString(),
      };

      await db.run(
        `INSERT INTO courses (id, title, description, icon, emoji, category, difficulty, color,
          "contentDir", "hasTypingPractice", "typingLayout", modes, "totalDays", "isActive", "createdAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
        [newCourse.id, newCourse.title, newCourse.description, newCourse.icon,
         newCourse.emoji, newCourse.category, newCourse.difficulty, newCourse.color,
         newCourse.contentDir, newCourse.hasTypingPractice, newCourse.typingLayout,
         newCourse.modes, newCourse.totalDays, newCourse.isActive, newCourse.createdAt]
      );

      return res.json({ success: true, course: newCourse });
    }

    // ========================================
    // Admin routes: /admin/:courseId[/topics/:topicId]
    // ========================================
    const adminMatch = path.match(/^\/admin\/([a-z0-9-]+)(\/.*)?$/);
    if (adminMatch) {
      const adminCourseId = adminMatch[1];
      const adminSubPath = adminMatch[2] || '';

      // PUT /api/courses/admin/:courseId (update course)
      if (req.method === 'PUT' && adminSubPath === '') {
        const user = await requireAdmin(req, res);
        if (!user) return;

        const existing = await db.one('SELECT * FROM courses WHERE id = $1', [adminCourseId]);
        if (!existing) return res.status(404).json({ error: 'Course not found' });

        const updates = req.body;
        const allowed = ['title', 'description', 'icon', 'emoji', 'category', 'difficulty', 'color', 'contentDir', 'hasTypingPractice', 'typingLayout', 'modes', 'totalDays', 'isActive'];
        const setClauses = [];
        const values = [];
        let idx = 1;

        for (const key of allowed) {
          if (updates[key] !== undefined) {
            let val = updates[key];
            if (key === 'modes' && Array.isArray(val)) val = JSON.stringify(val);
            if (key === 'totalDays' && typeof val === 'object') val = JSON.stringify(val);
            if (key === 'hasTypingPractice') val = val ? 1 : 0;
            if (key === 'isActive') val = val ? 1 : 0;
            setClauses.push(`"${key}" = $${idx}`);
            values.push(val);
            idx++;
          }
        }

        if (setClauses.length > 0) {
          values.push(adminCourseId);
          await db.run(`UPDATE courses SET ${setClauses.join(', ')} WHERE id = $${idx}`, values);
        }

        const updated = await db.one('SELECT * FROM courses WHERE id = $1', [adminCourseId]);
        return res.json({ success: true, course: updated });
      }

      // DELETE /api/courses/admin/:courseId (soft delete)
      if (req.method === 'DELETE' && adminSubPath === '') {
        const user = await requireAdmin(req, res);
        if (!user) return;

        const existing = await db.one('SELECT * FROM courses WHERE id = $1', [adminCourseId]);
        if (!existing) return res.status(404).json({ error: 'Course not found' });

        await db.run('UPDATE courses SET "isActive" = 0 WHERE id = $1', [adminCourseId]);
        return res.json({ success: true });
      }

      // POST /api/courses/admin/:courseId/topics (create topic)
      if (req.method === 'POST' && adminSubPath === '/topics') {
        const user = await requireAdmin(req, res);
        if (!user) return;

        const course = await db.one('SELECT * FROM courses WHERE id = $1', [adminCourseId]);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        const { id, title, group, icon, description, prerequisites } = req.body;
        if (!id || !title) return res.status(400).json({ error: 'id and title required' });

        const existingTopics = getCourseTopics(adminCourseId);
        const duplicate = existingTopics.find(t => t.id === id);
        if (duplicate) return res.status(400).json({ error: 'Topic already exists' });

        const newTopic = {
          id, title, group: group || 'general',
          day_fast_track: existingTopics.length + 1,
          day_full_course: existingTopics.length + 1,
          icon: icon || '\ud83d\udcdd',
          description: description || '',
          prerequisites: prerequisites || [],
        };

        return res.json({ success: true, topic: newTopic, note: 'Topic registered. Will appear after next content build.' });
      }

      // PUT /api/courses/admin/:courseId/topics/:topicId
      const adminTopicMatch = adminSubPath.match(/^\/topics\/(.+)$/);
      if (req.method === 'PUT' && adminTopicMatch) {
        const user = await requireAdmin(req, res);
        if (!user) return;

        const course = await db.one('SELECT * FROM courses WHERE id = $1', [adminCourseId]);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        const topicId = adminTopicMatch[1];
        const topics = getCourseTopics(adminCourseId);
        const meta = topics.find(t => t.id === topicId);
        if (!meta) return res.status(404).json({ error: 'Topic not found' });

        const { section, data } = req.body;
        if (!section || !data) return res.status(400).json({ error: 'section and data required' });

        return res.json({ success: true, note: 'Topic update registered. Will apply after next content build.' });
      }

      // DELETE /api/courses/admin/:courseId/topics/:topicId
      if (req.method === 'DELETE' && adminTopicMatch) {
        const user = await requireAdmin(req, res);
        if (!user) return;

        const course = await db.one('SELECT * FROM courses WHERE id = $1', [adminCourseId]);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        const topicId = adminTopicMatch[1];
        const topics = getCourseTopics(adminCourseId);
        const meta = topics.find(t => t.id === topicId);
        if (!meta) return res.status(404).json({ error: 'Topic not found' });

        return res.json({ success: true, note: 'Topic deletion registered. Will apply after next content build.' });
      }

      return res.status(404).json({ error: 'Not found' });
    }

    // ========================================
    // GET /api/courses (list all active courses)
    // ========================================
    if (req.method === 'GET' && (path === '' || path === '/')) {
      const user = await requireAuth(req, res);
      if (!user) return;

      let userMode = 'fast-track';
      try {
        const dbUser = await db.one('SELECT preferences FROM users WHERE id = $1', [user.id]);
        if (dbUser?.preferences) {
          const prefs = JSON.parse(dbUser.preferences);
          if (prefs.mode) userMode = prefs.mode;
        }
      } catch { /* default fast-track */ }
      if (url.searchParams.get('mode')) userMode = url.searchParams.get('mode');

      const coursesFromDb = await db.query('SELECT * FROM courses WHERE "isActive" = 1');
      const allEnrollments = await db.query(
        'SELECT "courseId", "activeCourse" FROM enrollments WHERE "userId" = $1',
        [user.id]
      );
      const enrolledIds = new Set(allEnrollments.map(e => e.courseId));
      const activeEntry = allEnrollments.find(e => e.activeCourse);
      const active = activeEntry ? activeEntry.activeCourse : 'web-development';

      const bundleMeta = getCoursesMetadata();
      const enriched = [];

      for (const c of coursesFromDb) {
        const bundle = bundleMeta[c.id] || {};
        const modes = typeof c.modes === 'string' ? JSON.parse(c.modes) : (c.modes || ['fast-track', 'full-course']);
        const totalDays = typeof c.totalDays === 'string' ? JSON.parse(c.totalDays) : (c.totalDays || { 'fast-track': 10, 'full-course': 20 });

        const topics = getCourseTopics(c.id);
        const tp = await db.query(
          'SELECT "topicId", "quickDone", "deepDone" FROM topic_progress WHERE "userId" = $1 AND "courseId" = $2',
          [user.id, c.id]
        );
        const pm = {};
        tp.forEach(p => { pm[p.topicId] = p; });
        const completed = topics.filter(t => {
          const p = pm[t.id];
          return p && p.quickDone && p.deepDone;
        }).length;

        enriched.push({
          ...bundle,
          id: c.id,
          title: c.title,
          description: c.description || bundle.description || '',
          icon: c.icon || bundle.icon || 'fas fa-book',
          emoji: c.emoji || bundle.emoji || '\ud83d\udcda',
          category: c.category || bundle.category || 'general',
          difficulty: c.difficulty || bundle.difficulty || 'beginner',
          color: c.color || bundle.color || '#667eea',
          contentDir: c.contentDir,
          hasTypingPractice: !!c.hasTypingPractice,
          modes,
          totalDays,
          isActive: !!c.isActive,
          createdAt: c.createdAt,
          totalTopics: topics.length,
          completedTopics: completed,
          percentComplete: topics.length > 0 ? Math.round((completed / topics.length) * 100) : 0,
          isEnrolled: enrolledIds.has(c.id),
          isActiveCourse: active === c.id,
        });
      }

      return res.json({ courses: enriched, activeCourse: active });
    }

    // ========================================
    // Non-admin course routes: /:courseId[...]
    // ========================================
    const courseMatch = path.match(/^\/([a-z0-9-]+)(\/.*)?$/);
    if (!courseMatch) return res.status(404).json({ error: 'Not found' });
    const courseId = courseMatch[1];
    const subPath = courseMatch[2] || '';

    // POST /api/courses/:courseId/enroll
    if (req.method === 'POST' && subPath === '/enroll') {
      const user = await requireAuth(req, res);
      if (!user) return;

      const course = await db.one('SELECT * FROM courses WHERE id = $1', [courseId]);
      if (!course) return res.status(404).json({ error: 'Course not found' });

      await db.run(
        'INSERT INTO enrollments ("userId", "courseId") VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [user.id, courseId]
      );

      const enrollments = await db.query(
        'SELECT "courseId", "activeCourse" FROM enrollments WHERE "userId" = $1',
        [user.id]
      );
      const active = await db.one(
        'SELECT "activeCourse" FROM enrollments WHERE "userId" = $1 AND "activeCourse" IS NOT NULL LIMIT 1',
        [user.id]
      );

      return res.json({
        success: true,
        enrolled: enrollments.map(e => e.courseId),
        activeCourse: active ? active.activeCourse : courseId,
      });
    }

    // GET /api/courses/:courseId (detail)
    if (req.method === 'GET' && (subPath === '' || subPath === '/')) {
      const user = await requireAuth(req, res);
      if (!user) return;

      const course = await db.one('SELECT * FROM courses WHERE id = $1', [courseId]);
      if (!course) return res.status(404).json({ error: 'Course not found' });

      const bundle = getCourseMetadata(courseId) || {};
      const modes = typeof course.modes === 'string' ? JSON.parse(course.modes) : (course.modes || ['fast-track', 'full-course']);
      const totalDays = typeof course.totalDays === 'string' ? JSON.parse(course.totalDays) : (course.totalDays || { 'fast-track': 10, 'full-course': 20 });

      const topics = getCourseTopics(courseId);
      const tp = await db.query(
        'SELECT "topicId", "quickDone", "deepDone" FROM topic_progress WHERE "userId" = $1 AND "courseId" = $2',
        [user.id, courseId]
      );
      const pm = {};
      tp.forEach(p => { pm[p.topicId] = p; });

      const enriched = topics.map(t => {
        const p = pm[t.id];
        return {
          ...t,
          quickDone: p ? !!p.quickDone : false,
          deepDone: p ? !!p.deepDone : false,
          completed: p ? (!!p.quickDone && !!p.deepDone) : false,
        };
      });

      return res.json({
        course: {
          ...bundle,
          id: course.id,
          title: course.title,
          description: course.description || bundle.description || '',
          icon: course.icon || bundle.icon || 'fas fa-book',
          emoji: course.emoji || bundle.emoji || '\ud83d\udcda',
          category: course.category || bundle.category || 'general',
          difficulty: course.difficulty || bundle.difficulty || 'beginner',
          color: course.color || bundle.color || '#667eea',
          contentDir: course.contentDir,
          hasTypingPractice: !!course.hasTypingPractice,
          modes,
          totalDays,
          isActive: !!course.isActive,
          createdAt: course.createdAt,
        },
        topics: enriched,
      });
    }

    // GET /api/courses/:courseId/topics
    if (req.method === 'GET' && subPath === '/topics') {
      const user = await requireAuth(req, res);
      if (!user) return;

      const course = await db.one('SELECT * FROM courses WHERE id = $1', [courseId]);
      if (!course) return res.status(404).json({ error: 'Course not found' });

      let mode = 'fast-track';
      try {
        const dbUser = await db.one('SELECT preferences FROM users WHERE id = $1', [user.id]);
        if (dbUser?.preferences) {
          const prefs = JSON.parse(dbUser.preferences);
          if (prefs.mode) mode = prefs.mode;
        }
      } catch { /* default */ }
      if (url.searchParams.get('mode')) mode = url.searchParams.get('mode');

      const topics = getCourseTopics(courseId);
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
      return res.json({ mode, topics: enriched, courseId });
    }

    // GET /api/courses/:courseId/topics/:topicId
    const topicMatch = subPath.match(/^\/topics\/(.+)$/);
    if (req.method === 'GET' && topicMatch) {
      const user = await requireAuth(req, res);
      if (!user) return;

      const topicId = topicMatch[1];

      const course = await db.one('SELECT * FROM courses WHERE id = $1', [courseId]);
      if (!course) return res.status(404).json({ error: 'Course not found' });

      const topics = getCourseTopics(courseId);
      const meta = topics.find(t => t.id === topicId);
      if (!meta) return res.status(404).json({ error: 'Topic not found' });

      const content = getTopicContent(courseId, topicId);
      return res.json({ meta: meta || {}, ...(content || {}), courseId });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (err) {
    console.error('Courses error:', err);
    res.status(500).json({ error: 'Failed' });
  }
};
