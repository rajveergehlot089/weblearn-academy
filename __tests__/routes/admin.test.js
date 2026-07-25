// ============================================
// Integration Tests: Admin Routes
// ============================================
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

const mockQuery = jest.fn();
jest.mock('../../utils/database', () => ({
  getPool: () => ({ query: mockQuery }),
}));

jest.mock('../../middleware/rateLimit', () => {
  const fn = () => (req, res, next) => next();
  fn.globalLimiter = (req, res, next) => next();
  fn.strictLimiter = (req, res, next) => next();
  return fn;
});

jest.mock('../../middleware/csrf', () => ({
  csrfInit: (req, res, next) => next(),
  csrfProtect: (req, res, next) => next(),
}));

const db = require('../../utils/db');
const adminRoutes = require('../../routes/admin');

process.env.JWT_SECRET = 'test-secret-key-that-is-at-least-32-chars-long!!';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/admin', adminRoutes);
  return app;
}

function makeToken(payload) {
  return jwt.sign({ tokenVersion: 0, ...payload }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

beforeEach(() => {
  mockQuery.mockReset();
});

describe('GET /api/admin/dashboard', () => {
  it('returns dashboard stats for admin', async () => {
    const token = makeToken({ id: 'admin-1', role: 'admin' });

    // Auth middleware: getTokenVersion
    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    // Auth middleware: getUserById
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'admin-1', role: 'admin' }] });
    // getAdminStats
    mockQuery
      .mockResolvedValueOnce({ rows: [{ count: 10 }] }) // totalUsers
      .mockResolvedValueOnce({ rows: [{ count: 2 }] }) // adminCount
      .mockResolvedValueOnce({ rows: [{ count: 50 }] }); // totalCompletions
    // getAllUsers
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 'u1', name: 'A', email: 'a@b.com', role: 'customer', createdAt: '2026-01-01' }],
    });
    // getEnrollments (per user)
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp()).get('/api/admin/dashboard').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('studentCount');
    expect(res.body).toHaveProperty('recentUsers');
  });

  it('rejects non-admin users', async () => {
    const token = makeToken({ id: 'user-1', role: 'customer' });

    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'user-1', role: 'customer' }] });

    const res = await request(createApp()).get('/api/admin/dashboard').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Admin access required');
  });
});

describe('GET /api/admin/users', () => {
  it('returns paginated users for admin', async () => {
    const token = makeToken({ id: 'admin-1', role: 'admin' });

    // Auth middleware
    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'admin-1', role: 'admin' }] });
    // getAllUsers
    mockQuery.mockResolvedValueOnce({
      rows: [
        { id: 'u1', name: 'Alice', email: 'alice@test.com', role: 'customer', createdAt: '2026-01-01' },
        { id: 'u2', name: 'Bob', email: 'bob@test.com', role: 'customer', createdAt: '2026-01-02' },
      ],
    });
    // getEnrollments per user
    mockQuery.mockResolvedValueOnce({ rows: [] });
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp())
      .get('/api/admin/users?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.users).toHaveLength(2);
    expect(res.body.pagination).toHaveProperty('total');
  });

  it('filters users by search', async () => {
    const token = makeToken({ id: 'admin-1', role: 'admin' });

    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'admin-1', role: 'admin' }] });
    mockQuery.mockResolvedValueOnce({
      rows: [
        { id: 'u1', name: 'Alice', email: 'alice@test.com', role: 'customer', createdAt: '2026-01-01' },
        { id: 'u2', name: 'Bob', email: 'bob@test.com', role: 'customer', createdAt: '2026-01-02' },
      ],
    });
    mockQuery.mockResolvedValueOnce({ rows: [] });
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp()).get('/api/admin/users?search=alice').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.users).toHaveLength(1);
    expect(res.body.users[0].name).toBe('Alice');
  });
});

describe('PUT /api/admin/users/:id/role', () => {
  it('updates user role as admin', async () => {
    const token = makeToken({ id: 'admin-1', role: 'admin' });

    // Auth middleware
    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'admin-1', role: 'admin' }] });
    // getUserById
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'user-1', role: 'customer' }] });
    // updateUserRole
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp())
      .put('/api/admin/users/user-1/role')
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'admin' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('rejects invalid role', async () => {
    const token = makeToken({ id: 'admin-1', role: 'admin' });

    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'admin-1', role: 'admin' }] });

    const res = await request(createApp())
      .put('/api/admin/users/user-1/role')
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'superadmin' });

    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/admin/users/:id', () => {
  it('prevents admin from deleting themselves', async () => {
    const token = makeToken({ id: 'admin-1', role: 'admin' });

    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'admin-1', role: 'admin' }] });

    const res = await request(createApp()).delete('/api/admin/users/admin-1').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Cannot delete');
  });

  it('prevents deleting admin accounts', async () => {
    const token = makeToken({ id: 'admin-1', role: 'admin' });

    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'admin-1', role: 'admin' }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'other-admin', role: 'admin' }] });

    const res = await request(createApp())
      .delete('/api/admin/users/other-admin')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toContain('Cannot delete admin');
  });
});
