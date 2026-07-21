// ============================================
// Admin API — handles all /api/admin/* routes
// ============================================
const db = require('./lib/db');
const { requireAdmin, setCorsHeaders, handleOptions } = require('./lib/auth');
const { getCourseTopics, getCoursesMetadata } = require('./lib/content');

module.exports = async (req, res) => {
  await db.initSchema();
  setCorsHeaders(res);
  if (handleOptions(req, res)) return res.status(200).end();

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname.replace(/^\/api\/admin/, '') || '/';

  try {
    // ---- GET /dashboard ----
    if (req.method === 'GET' && path === '/dashboard') {
      const totalUsersRow = await db.one('SELECT COUNT(*)::int AS cnt FROM users');
      const totalUsers = totalUsersRow?.cnt || 0;

      const adminCountRow = await db.one("SELECT COUNT(*)::int AS cnt FROM users WHERE role='admin'");
      const adminCount = adminCountRow?.cnt || 0;
      const studentCount = totalUsers - adminCount;

      const recentRow = await db.one(
        "SELECT COUNT(*)::int AS cnt FROM users WHERE \"createdAt\" >= $1",
        [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()]
      );
      const recentUsers = recentRow?.cnt || 0;

      // Single JOIN to count all completed topics across all users
      const completedRow = await db.one(`
        SELECT COUNT(*)::int AS cnt
        FROM topic_progress
        WHERE "quickDone" = 1 AND "deepDone" = 1
      `);
      const totalCompleted = completedRow?.cnt || 0;

      const avgCompletion = totalUsers > 0 ? Math.round(totalCompleted / totalUsers) : 0;

      return res.json({ studentCount, recentUsers, totalCompleted, avgCompletion });
    }

    // ---- GET /users ----
    if (req.method === 'GET' && path === '/users') {
      const page = parseInt(url.searchParams.get('page')) || 1;
      const limit = parseInt(url.searchParams.get('limit')) || 10;
      const search = (url.searchParams.get('search') || '').toLowerCase();

      let where = '';
      const params = [];
      if (search) {
        params.push(`%${search}%`, `%${search}%`);
        const idx = params.length;
        where = `WHERE lower(u.name) LIKE $${idx - 1} OR lower(u.email) LIKE $${idx}`;
      }

      const countRow = await db.one(
        `SELECT COUNT(*)::int AS cnt FROM users u ${where}`,
        params
      );
      const total = countRow?.cnt || 0;
      const totalPages = Math.ceil(total / limit);
      const offset = (page - 1) * limit;

      const users = await db.query(`
        SELECT u.id, u.name, u.email, u.role, u."createdAt",
               COALESCE(e."courseId", '') AS "enrolledCourseId"
        FROM users u
        LEFT JOIN enrollments e ON e."userId" = u.id
        ${where}
        ORDER BY u."createdAt" DESC NULLS LAST
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `, [...params, limit, offset]);

      // Batch-compute completion percent for the page
      const userIds = users.map(u => u.id);
      let enriched;
      if (userIds.length === 0) {
        enriched = [];
      } else {
        const placeholders = userIds.map((_, i) => `$${i + 1}`).join(',');
        const progressRows = await db.query(`
          SELECT "userId", "courseId",
                 COUNT(*) FILTER (WHERE "quickDone"=1 AND "deepDone"=1)::int AS completed,
                 COUNT(*)::int AS total
          FROM topic_progress
          WHERE "userId" IN (${placeholders})
          GROUP BY "userId", "courseId"
        `, userIds);

        // Build a map: userId -> best courseId progress
        const progressMap = {};
        for (const r of progressRows) {
          const existing = progressMap[r.userId];
          if (!existing || (r.total > existing.total)) {
            progressMap[r.userId] = r;
          }
        }

        enriched = users.map(u => {
          const p = progressMap[u.id];
          const completed = p ? p.completed : 0;
          const totalTopics = p ? p.total : 0;
          const percentComplete = totalTopics > 0 ? Math.round((completed / totalTopics) * 100) : 0;
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            createdAt: u.createdAt,
            progress: { percentComplete },
          };
        });
      }

      return res.json({ users: enriched, pagination: { page, limit, total, totalPages } });
    }

    // ---- GET /stats ----
    if (req.method === 'GET' && path === '/stats') {
      const totalRow = await db.one('SELECT COUNT(*)::int AS cnt FROM users');
      const totalUsers = totalRow?.cnt || 0;

      // Daily active users for last 30 days (single query, no N+1)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const dailyRows = await db.query(`
        SELECT date, COUNT(DISTINCT "userId")::int AS count
        FROM daily_log
        WHERE date >= $1
        GROUP BY date
        ORDER BY date ASC
      `, [thirtyDaysAgo]);
      const dailyActive = {};
      for (const r of dailyRows) {
        dailyActive[r.date] = r.count;
      }

      // Topic stats via content bundle + single JOIN query
      const coursesMetadata = getCoursesMetadata();
      const courseIds = Object.keys(coursesMetadata);
      const allTopics = [];
      for (const cid of courseIds) {
        const topics = getCourseTopics(cid);
        if (Array.isArray(topics)) {
          for (const t of topics) {
            allTopics.push({ id: t.id, title: t.title, courseId: cid });
          }
        }
      }

      // Single query to count completions per topic
      const compRows = await db.query(`
        SELECT "courseId", "topicId", COUNT(*)::int AS completions
        FROM topic_progress
        WHERE "quickDone" = 1 AND "deepDone" = 1
        GROUP BY "courseId", "topicId"
      `);
      const compMap = {};
      for (const r of compRows) {
        compMap[`${r.courseId}::${r.topicId}`] = r.completions;
      }

      const topicStats = allTopics
        .map(t => ({
          id: t.id,
          title: t.title,
          courseId: t.courseId,
          completions: compMap[`${t.courseId}::${t.id}`] || 0,
        }))
        .sort((a, b) => b.completions - a.completions);

      return res.json({ topicStats, dailyActive, totalUsers, totalTopics: topicStats.length });
    }

    // ---- GET /users/:id ----
    const userMatch = path.match(/^\/users\/([^/]+)$/);
    if (req.method === 'GET' && userMatch) {
      const user = await db.one(
        'SELECT id, name, email, role, "createdAt" FROM users WHERE id = $1',
        [userMatch[1]]
      );
      if (!user) return res.status(404).json({ error: 'User not found' });

      const enrollments = await db.query(
        'SELECT * FROM enrollments WHERE "userId" = $1',
        [user.id]
      );
      const courseId = enrollments[0]?.courseId || 'web-development';
      const progress = await db.query(
        'SELECT * FROM topic_progress WHERE "userId" = $1 AND "courseId" = $2',
        [user.id, courseId]
      );

      return res.json({
        user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
        enrollments,
        progressCount: progress.length,
      });
    }

    // ---- PUT /users/:id ----
    if (req.method === 'PUT' && userMatch) {
      const user = await db.one('SELECT id FROM users WHERE id = $1', [userMatch[1]]);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const { name, email, role } = req.body;
      const updates = [];
      const params = [];
      let i = 1;
      if (name) { updates.push(`name=$${i++}`); params.push(name); }
      if (email) { updates.push(`email=$${i++}`); params.push(email); }
      if (role && ['customer', 'admin'].includes(role)) { updates.push(`role=$${i++}`); params.push(role); }
      if (updates.length > 0) {
        params.push(userMatch[1]);
        await db.run(`UPDATE users SET ${updates.join(', ')} WHERE id=$${i}`, params);
      }
      return res.json({ success: true });
    }

    // ---- DELETE /users/:id ----
    if (req.method === 'DELETE' && userMatch) {
      const id = userMatch[1];
      if (id === admin.id) return res.status(400).json({ error: 'Cannot delete your own account' });
      const target = await db.one('SELECT role FROM users WHERE id = $1', [id]);
      if (!target) return res.status(404).json({ error: 'User not found' });
      if (target.role === 'admin') return res.status(403).json({ error: 'Cannot delete admin accounts' });

      for (const table of ['exercise_progress', 'interview_progress', 'typing_scores', 'daily_log', 'topic_progress', 'enrollments', 'analysis_history']) {
        await db.run(`DELETE FROM ${table} WHERE "userId" = $1`, [id]);
      }
      await db.run('DELETE FROM users WHERE id = $1', [id]);
      return res.json({ success: true });
    }

    // ---- PUT /users/:id/role ----
    const roleMatch = path.match(/^\/users\/([^/]+)\/role$/);
    if (req.method === 'PUT' && roleMatch) {
      const { role } = req.body;
      if (!role || !['customer', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Valid role required (customer or admin)' });
      }
      const user = await db.one('SELECT id FROM users WHERE id = $1', [roleMatch[1]]);
      if (!user) return res.status(404).json({ error: 'User not found' });
      await db.run('UPDATE users SET role = $1 WHERE id = $2', [role, roleMatch[1]]);
      return res.json({ success: true });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (err) {
    console.error('Admin error:', err);
    res.status(500).json({ error: 'Failed' });
  }
};
