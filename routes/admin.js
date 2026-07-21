// ============================================
// Admin Routes (PostgreSQL-backed)
// ============================================
const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/admin');
const db = require('../utils/db');
const { validate, adminUpdateUserSchema, adminRoleSchema, paginationSchema } = require('../middleware/validate');

// ============================================
// GET /api/admin/dashboard
// ============================================
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const stats = await db.getAdminStats();
    const allUsers = await db.getAllUsers();
    const totalUsers = allUsers.length;
    const studentCount = totalUsers - stats.adminCount;

    const recentUsers = allUsers
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      .slice(0, 10);

    let totalCompleted = 0;
    for (const user of allUsers) {
      const enrollments = await db.getEnrollments(user.id);
      if (enrollments.length > 0) {
        const courseId = enrollments[0].courseId;
        const progress = await db.getAllTopicProgress(user.id, courseId);
        totalCompleted += progress.filter(p => p.quickDone && p.deepDone).length;
      }
    }

    const avgCompletion = totalUsers > 0 ? Math.round(totalCompleted / Math.max(totalUsers, 1)) : 0;

    res.json({
      studentCount,
      recentUsers: recentUsers.length,
      totalCompleted,
      avgCompletion,
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// ============================================
// GET /api/admin/users?page=N&limit=N&search=X
// ============================================
router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = (req.query.search || '').toLowerCase();

    let allUsers = await db.getAllUsers();

    if (search) {
      allUsers = allUsers.filter(u =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
      );
    }

    allUsers.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

    const total = allUsers.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const pagedUsers = allUsers.slice(offset, offset + limit);

    const enriched = [];
    for (const u of pagedUsers) {
      const enrollments = await db.getEnrollments(u.id);
      let percentComplete = 0;
      if (enrollments.length > 0) {
        const courseId = enrollments[0].courseId;
        const progress = await db.getAllTopicProgress(u.id, courseId);
        const completed = progress.filter(p => p.quickDone && p.deepDone).length;
        percentComplete = progress.length > 0 ? Math.round((completed / progress.length) * 100) : 0;
      }
      enriched.push({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        progress: { percentComplete },
      });
    }

    res.json({
      users: enriched,
      pagination: { page, limit, total, totalPages },
    });
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ error: 'Failed to load users' });
  }
});

// ============================================
// GET /api/admin/stats
// ============================================
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const stats = await db.getAdminStats();
    const allUsers = await db.getAllUsers();

    const dailyActive = {};
    for (const user of allUsers) {
      const logs = await db.getDailyLog(user.id);
      logs.forEach(log => {
        const logDate = new Date(log.date);
        if (logDate > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
          dailyActive[log.date] = (dailyActive[log.date] || 0) + 1;
        }
      });
    }

    const topicStats = [];
    const coursesContent = require('../content/index');
    for (const [courseId, topics] of Object.entries(coursesContent)) {
      if (Array.isArray(topics)) {
        for (const t of topics) {
          let completions = 0;
          for (const user of allUsers) {
            const tp = await db.getTopicProgress(user.id, courseId, t.id);
            if (tp && tp.quickDone && tp.deepDone) completions++;
          }
          topicStats.push({ id: t.id, title: t.title, courseId, completions });
        }
      }
    }

    res.json({
      topicStats,
      dailyActive,
      totalUsers: stats.totalUsers,
      totalTopics: topicStats.length,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

// ============================================
// GET /api/admin/users/:id
// ============================================
router.get('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await db.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const enrollments = await db.getEnrollments(user.id);
    const progress = await db.getAllTopicProgress(user.id, enrollments[0]?.courseId || 'web-development');

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
      enrollments,
      progressCount: progress.length,
    });
  } catch (err) {
    console.error('Admin get user error:', err);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// ============================================
// PUT /api/admin/users/:id
// ============================================
router.put('/users/:id', adminAuth, validate(adminUpdateUserSchema), async (req, res) => {
  try {
    const user = await db.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { name, email, role } = req.body;
    await db.updateUser(req.params.id, { name, email, role });

    res.json({ success: true });
  } catch (err) {
    console.error('Admin update user error:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// ============================================
// PUT /api/admin/users/:id/role
// ============================================
router.put('/users/:id/role', adminAuth, validate(adminRoleSchema), async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !['customer', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Valid role required (customer or admin)' });
    }

    const user = await db.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await db.updateUserRole(req.params.id, role);
    res.json({ success: true });
  } catch (err) {
    console.error('Admin update role error:', err);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// ============================================
// DELETE /api/admin/users/:id
// ============================================
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    const user = await db.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') {
      return res.status(403).json({ error: 'Cannot delete admin accounts' });
    }

    await db.deleteUser(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Admin delete user error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
