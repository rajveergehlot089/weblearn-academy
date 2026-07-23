// ============================================
// Integration Tests: Course Routes
// ============================================
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');

// Mock database
const mockQuery = jest.fn();
jest.mock('../../utils/database', () => ({
  getPool: () => ({ query: mockQuery }),
}));

// Mock rate limiter
jest.mock('../../middleware/rateLimit', () => {
  const fn = () => (req, res, next) => next();
  fn.globalLimiter = (req, res, next) => next();
  fn.strictLimiter = (req, res, next) => next();
  return fn;
});

// Mock CSRF
jest.mock('../../middleware/csrf', () => ({
  csrfInit: (req, res, next) => next(),
  csrfProtect: (req, res, next) => next(),
}));

const db = require('../../utils/db');
const courseRoutes = require('../../routes/courses');

process.env.JWT_SECRET = 'test-secret-key-that-is-at-least-32-chars-long!!';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/courses', courseRoutes);
  return app;
}

function makeToken(payload) {
  return jwt.sign({ tokenVersion: 0, ...payload }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

beforeEach(() => {
  mockQuery.mockReset();
});

describe('GET /api/courses', () => {
  it('returns enriched courses for authenticated user', async () => {
    const token = makeToken({ id: 'user-1', role: 'customer' });

    // Auth middleware: get token version
    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    // Auth middleware: get user
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'user-1' }] });
    // getAllCourses
    mockQuery.mockResolvedValueOnce({
      rows: [{
        id: 'web-development', title: 'Web Development', description: 'Learn web dev',
        icon: 'fas fa-code', emoji: '🌐', category: 'technology', difficulty: 'beginner',
        color: '#667eea', contentDir: 'web-development', hasTypingPractice: 0,
        modes: '["fast-track","full-course"]', totalDays: '{"fast-track":10,"full-course":20}',
        isActive: 1,
      }],
    });
    // getEnrollments
    mockQuery.mockResolvedValueOnce({ rows: [{ courseId: 'web-development' }] });
    // getAllTopicProgress
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp())
      .get('/api/courses')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.courses).toHaveLength(1);
    expect(res.body.courses[0]).toMatchObject({
      id: 'web-development',
      isEnrolled: true,
    });
  });

  it('rejects unauthenticated request', async () => {
    const res = await request(createApp()).get('/api/courses');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/courses/:courseId/enroll', () => {
  it('enrolls user in a course', async () => {
    const token = makeToken({ id: 'user-1', role: 'customer' });

    // Auth middleware
    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'user-1' }] });
    // getCourseById
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'web-development' }] });
    // enrollUser - check existing
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // enrollUser - check active
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // enrollUser - insert
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // enrollUser - set active
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // getEnrollments
    mockQuery.mockResolvedValueOnce({ rows: [{ courseId: 'web-development' }] });
    // getActiveCourse
    mockQuery.mockResolvedValueOnce({ rows: [{ activeCourse: 'web-development' }] });

    const res = await request(createApp())
      .post('/api/courses/web-development/enroll')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.enrolled).toContain('web-development');
  });

  it('returns 404 for non-existent course', async () => {
    const token = makeToken({ id: 'user-1', role: 'customer' });

    // Auth middleware
    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'user-1' }] });
    // getCourseById - not found
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp())
      .post('/api/courses/nonexistent/enroll')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Course not found');
  });
});

describe('PUT /api/courses/active-course', () => {
  it('sets active course', async () => {
    const token = makeToken({ id: 'user-1', role: 'customer' });

    // Auth middleware
    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'user-1' }] });
    // getCourseById
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'web-development' }] });
    // setActiveCourse - clear
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // setActiveCourse - set
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp())
      .put('/api/courses/active-course')
      .set('Authorization', `Bearer ${token}`)
      .send({ courseId: 'web-development' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.activeCourse).toBe('web-development');
  });
});

describe('POST /api/courses/admin/create', () => {
  it('creates a course as admin', async () => {
    const token = makeToken({ id: 'admin-1', role: 'admin' });

    // Auth middleware
    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'admin-1', role: 'admin' }] });
    // getCourseById - not exists
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // createCourse insert
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp())
      .post('/api/courses/admin/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: 'new-course',
        title: 'New Course',
        description: 'A brand new course',
        category: 'technology',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.course.id).toBe('new-course');
  });

  it('rejects non-admin users', async () => {
    const token = makeToken({ id: 'user-1', role: 'customer' });

    // Auth middleware
    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'user-1', role: 'customer' }] });

    const res = await request(createApp())
      .post('/api/courses/admin/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ id: 'new-course', title: 'New Course' });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Admin access required');
  });

  it('rejects duplicate course ID', async () => {
    const token = makeToken({ id: 'admin-1', role: 'admin' });

    // Auth middleware
    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'admin-1', role: 'admin' }] });
    // getCourseById - exists
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'existing-course' }] });

    const res = await request(createApp())
      .post('/api/courses/admin/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ id: 'existing-course', title: 'Duplicate' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Course ID already exists');
  });
});

describe('PUT /api/courses/admin/:courseId', () => {
  it('updates course as admin', async () => {
    const token = makeToken({ id: 'admin-1', role: 'admin' });

    // Auth middleware
    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'admin-1', role: 'admin' }] });
    // getCourseById - exists
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'web-development' }] });
    // updateCourse
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // getCourseById - updated
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 'web-development', title: 'Updated Title', isActive: 1 }],
    });

    const res = await request(createApp())
      .put('/api/courses/admin/web-development')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('DELETE /api/courses/admin/:courseId', () => {
  it('soft-deletes course as admin', async () => {
    const token = makeToken({ id: 'admin-1', role: 'admin' });

    // Auth middleware
    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'admin-1', role: 'admin' }] });
    // getCourseById - exists
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'web-development' }] });
    // deleteCourse
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp())
      .delete('/api/courses/admin/web-development')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
