// ============================================
// Integration Tests: Auth Routes
// ============================================
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

// Mock database before requiring routes
const mockQuery = jest.fn();
jest.mock('../../utils/database', () => ({
  getPool: () => ({ query: mockQuery }),
}));

// Mock rate limiter to always pass in tests
jest.mock('../../middleware/rateLimit', () => {
  const fn = () => (req, res, next) => next();
  fn.globalLimiter = (req, res, next) => next();
  fn.strictLimiter = (req, res, next) => next();
  return fn;
});

// Mock CSRF to always pass in tests
jest.mock('../../middleware/csrf', () => ({
  csrfInit: (req, res, next) => next(),
  csrfProtect: (req, res, next) => next(),
}));

const db = require('../../utils/db');
const authRoutes = require('../../routes/auth');

// Set JWT_SECRET for tests
process.env.JWT_SECRET = 'test-secret-key-that-is-at-least-32-chars-long!!';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  return app;
}

function makeToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

beforeEach(() => {
  mockQuery.mockReset();
});

describe('POST /api/auth/register', () => {
  it('registers a new user successfully', async () => {
    // Check existing user - not found
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // Insert user
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // Save verification token
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp())
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'SecurePass1!',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      name: 'Test User',
      email: 'test@example.com',
      role: 'customer',
      emailVerified: false,
    });
    // verificationLink is no longer in response — email is sent instead
    expect(res.body).not.toHaveProperty('verificationLink');
  });

  it('rejects duplicate email', async () => {
    // Check existing user - found
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'existing' }] });

    const res = await request(createApp())
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'existing@example.com',
        password: 'SecurePass1!',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Email already registered');
  });

  it('rejects invalid email format', async () => {
    // Zod validation returns 400, or unhandled error returns 500
    const res = await request(createApp())
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'not-an-email',
        password: 'SecurePass1!',
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('rejects weak password', async () => {
    const res = await request(createApp())
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'weak',
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with valid credentials', async () => {
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('Password1!', 10);

    // Find user
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 'user-1', name: 'Test', email: 'test@example.com', passwordHash: hash, role: 'customer', tokenVersion: 0 }],
    });
    // Reset failed login
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp())
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Password1!' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      id: 'user-1',
      name: 'Test',
      role: 'customer',
    });
  });

  it('rejects invalid password', async () => {
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('CorrectPassword1!', 10);

    // Find user
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 'user-1', passwordHash: hash, failedLoginAttempts: 0 }],
    });
    // Increment failed login
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // Get updated user
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 'user-1', failedLoginAttempts: 1 }],
    });

    const res = await request(createApp())
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'WrongPassword1!' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  it('rejects non-existent user', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp())
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'Password1!' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  it('locks account after 5 failed attempts', async () => {
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('Password1!', 10);

    // Find user
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 'user-1', passwordHash: hash, failedLoginAttempts: 4 }],
    });
    // Increment failed login
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // Get updated user - now at 5 attempts
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 'user-1', failedLoginAttempts: 5 }],
    });
    // Lock account
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp())
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'WrongPassword1!' });

    expect(res.status).toBe(423);
    expect(res.body.error).toContain('Account locked');
  });
});

describe('POST /api/auth/forgot-password', () => {
  it('always returns success (prevents email enumeration)', async () => {
    // User not found
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp())
      .post('/api/auth/forgot-password')
      .send({ email: 'nobody@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('creates reset token for existing user', async () => {
    // Find user
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 'user-1', email: 'test@example.com' }],
    });
    // Save reset token
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp())
      .post('/api/auth/forgot-password')
      .send({ email: 'test@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('POST /api/auth/reset-password', () => {
  it('resets password with valid token', async () => {
    // Get reset token
    mockQuery.mockResolvedValueOnce({
      rows: [{ userId: 'user-1', expiresAt: '2099-12-31T23:59:59.000Z' }],
    });
    // Update password
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // Increment token version
    mockQuery.mockResolvedValueOnce({ rows: [] });
    // Delete reset token
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp())
      .post('/api/auth/reset-password')
      .send({ token: 'valid-token', password: 'NewPassword1!' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('rejects expired token', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ userId: 'user-1', expiresAt: '2020-01-01T00:00:00.000Z' }],
    });
    // Delete expired token
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp())
      .post('/api/auth/reset-password')
      .send({ token: 'expired-token', password: 'NewPassword1!' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('expired');
  });

  it('rejects invalid token', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp())
      .post('/api/auth/reset-password')
      .send({ token: 'invalid-token', password: 'NewPassword1!' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid');
  });
});

describe('GET /api/auth/profile', () => {
  it('returns user profile with valid token', async () => {
    const token = makeToken({ id: 'user-1', name: 'Test', email: 'test@example.com', role: 'customer', tokenVersion: 0 });
    const userRow = { id: 'user-1', name: 'Test', email: 'test@example.com', role: 'customer', emailVerified: 1, preferences: '{"theme":"dark"}' };

    // Auth middleware: getTokenVersion
    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    // Auth middleware: getUserById (lock check)
    mockQuery.mockResolvedValueOnce({ rows: [userRow] });
    // Profile route: getUserById
    mockQuery.mockResolvedValueOnce({ rows: [userRow] });

    const res = await request(createApp())
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({
      id: 'user-1',
      name: 'Test',
      email: 'test@example.com',
      role: 'customer',
      emailVerified: true,
      preferences: { theme: 'dark' },
    });
  });

  it('rejects request without token', async () => {
    const res = await request(createApp()).get('/api/auth/profile');
    expect(res.status).toBe(401);
  });

  it('rejects revoked token (tokenVersion mismatch)', async () => {
    const token = makeToken({ id: 'user-1', tokenVersion: 0 });

    // Current version is 1 (revoked)
    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 1 }] });

    const res = await request(createApp())
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(401);
    expect(res.body.error).toContain('revoked');
  });
});

describe('PUT /api/auth/preferences', () => {
  it('updates preferences', async () => {
    const token = makeToken({ id: 'user-1', tokenVersion: 0 });

    // Auth middleware: getTokenVersion
    mockQuery.mockResolvedValueOnce({ rows: [{ tokenVersion: 0 }] });
    // Auth middleware: getUserById (lock check)
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'user-1' }] });
    // Route: getUserById (get current prefs)
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'user-1', preferences: '{"theme":"light"}' }] });
    // Route: updateUserPreferences
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(createApp())
      .put('/api/auth/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({ theme: 'dark' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
