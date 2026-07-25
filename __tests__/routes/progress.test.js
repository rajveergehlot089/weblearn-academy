// ============================================
// Integration Tests: Progress Routes
// ============================================
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');

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
const progressRoutes = require('../../routes/progress');

process.env.JWT_SECRET = 'test-secret-key-that-is-at-least-32-chars-long!!';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/progress', progressRoutes);
  return app;
}

function makeToken(payload) {
  return jwt.sign({ tokenVersion: 0, ...payload }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

beforeEach(() => {
  mockQuery.mockReset();
});

describe('GET /api/progress/summary', () => {
  it('returns progress summary for authenticated user', async () => {
    const token = makeToken({ id: 'user-1', role: 'customer' });

    // Auth middleware: getTokenVersion
    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    // Auth middleware: getUserById (lock check)
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'user-1' }] });
    // getActiveCourse
    mockQuery.mockResolvedValueOnce({ rows: [{ activeCourse: 'web-development' }] });
    // getCourseById
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 'web-development', contentDir: 'web-development' }],
    });
    // getAllTopicProgress
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // getDailyLog
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // getTypingScores
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp()).get('/api/progress/summary').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('courseId');
    expect(res.body).toHaveProperty('percentComplete');
    expect(res.body).toHaveProperty('streak');
  });

  it('rejects unauthenticated request', async () => {
    const res = await request(createApp()).get('/api/progress/summary');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/progress/topic/:id', () => {
  it('updates topic progress', async () => {
    const token = makeToken({ id: 'user-1', role: 'customer' });

    // Auth middleware
    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'user-1' }] });
    // getActiveCourse
    mockQuery.mockResolvedValueOnce({ rows: [{ activeCourse: 'web-dev' }] });
    // upsertTopicProgress - getTopicProgress (no existing)
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // upsertTopicProgress - INSERT
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // logDailyActivity - getExisting
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // logDailyActivity - INSERT
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp())
      .post('/api/progress/topic/html-basics')
      .set('Authorization', `Bearer ${token}`)
      .send({ quickDone: true, deepDone: false });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

describe('POST /api/progress/typing-score', () => {
  it('saves typing score', async () => {
    const token = makeToken({ id: 'user-1', role: 'customer' });

    // Auth middleware
    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'user-1' }] });
    // getTopicProgress (existing)
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // INSERT
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // Get saved score
    mockQuery.mockResolvedValueOnce({ rows: [{ bestWpm: 45, lastWpm: 45 }] });

    const res = await request(createApp())
      .post('/api/progress/typing-score')
      .set('Authorization', `Bearer ${token}`)
      .send({ courseId: 'typing', wpm: 45, accuracy: 95, timeLimit: 60 });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

describe('POST /api/progress/log', () => {
  it('logs daily activity', async () => {
    const token = makeToken({ id: 'user-1', role: 'customer' });

    // Auth middleware
    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'user-1' }] });
    // logDailyActivity - no existing
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // INSERT
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp())
      .post('/api/progress/log')
      .set('Authorization', `Bearer ${token}`)
      .send({ minutes: 30, topicId: 'html-basics' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
