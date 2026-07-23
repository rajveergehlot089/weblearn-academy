// ============================================
// Consolidated Auth API — all /api/auth/* routes
// Full feature parity with Express routes
// ============================================
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const db = require('../serverless-lib/db');
const { requireAuth, setCorsHeaders, handleOptions } = require('../serverless-lib/auth');

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

module.exports = async (req, res) => {
  setCorsHeaders(res);
  if (handleOptions(req, res)) return;

  // Ensure schema exists (skip for now — schema created via dbtest)
  // await db.initSchema();

  const url = new URL(req.url, 'http://localhost');
  const pathParts = url.pathname.replace('/api/auth', '').split('/').filter(Boolean);
  const action = pathParts[0] || '';

  try {
    // ============================================
    // POST /api/auth/register
    // ============================================
    if (req.method === 'POST' && action === 'register') {
      const { name, email, password } = req.body || {};
      if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });
      if (name.length < 2 || name.length > 100) return res.status(400).json({ error: 'Name must be 2-100 characters' });
      if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
      if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
        return res.status(400).json({ error: 'Password must include uppercase, lowercase, number, and special character' });
      }

      const emailLower = email.toLowerCase().trim();
      const existing = await db.one('SELECT id FROM users WHERE email = $1', [emailLower]);
      if (existing) return res.status(400).json({ error: 'Email already registered' });

      const id = uuidv4();
      const passwordHash = await bcrypt.hash(password, 10);
      await db.run(
        'INSERT INTO users (id, name, email, "passwordHash", role, preferences, "emailVerified", "tokenVersion", "createdAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
        [id, name.trim(), emailLower, passwordHash, 'customer', '{}', 0, 0, new Date().toISOString()]
      );

      // Generate verification token (stored in DB)
      const verifyToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      await db.run(
        'INSERT INTO verification_tokens (token, "userId", email, "expiresAt") VALUES ($1,$2,$3,$4)',
        [verifyToken, id, emailLower, expiresAt]
      );

      const token = jwt.sign({ id, name: name.trim(), email: emailLower, role: 'customer', tokenVersion: 0 }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id, name: name.trim(), email: emailLower, role: 'customer', emailVerified: false }, verificationLink: `/verify-email?token=${verifyToken}` });
    }

    // ============================================
    // POST /api/auth/login
    // ============================================
    if (req.method === 'POST' && action === 'login') {
      const { email, password } = req.body || {};
      if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

      const emailLower = email.toLowerCase().trim();
      const user = await db.one('SELECT * FROM users WHERE email = $1', [emailLower]);
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      // Check account lockout
      if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
        const minutesLeft = Math.ceil((new Date(user.lockedUntil) - new Date()) / 60000);
        return res.status(423).json({ error: `Account locked. Try again in ${minutesLeft} minutes.` });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        // Increment failed attempts
        await db.run('UPDATE users SET "failedLoginAttempts" = "failedLoginAttempts" + 1 WHERE id = $1', [user.id]);
        const updated = await db.one('SELECT "failedLoginAttempts" FROM users WHERE id = $1', [user.id]);
        if (updated && updated.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
          const lockUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000).toISOString();
          await db.run('UPDATE users SET "lockedUntil" = $1 WHERE id = $2', [lockUntil, user.id]);
          return res.status(423).json({ error: `Too many failed attempts. Account locked for ${LOCKOUT_MINUTES} minutes.` });
        }
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Reset failed attempts on success
      await db.run('UPDATE users SET "failedLoginAttempts" = 0, "lockedUntil" = NULL WHERE id = $1', [user.id]);

      const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role || 'customer', tokenVersion: user.tokenVersion || 0 }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role || 'customer' } });
    }

    // ============================================
    // GET /api/auth/profile
    // ============================================
    if (req.method === 'GET' && action === 'profile') {
      const user = await requireAuth(req, res);
      if (!user) return;
      const dbUser = await db.one('SELECT * FROM users WHERE id = $1', [user.id]);
      if (!dbUser) return res.status(404).json({ error: 'User not found' });
      return res.json({ user: { id: dbUser.id, name: dbUser.name, email: dbUser.email, role: dbUser.role || 'customer', emailVerified: !!dbUser.emailVerified, preferences: JSON.parse(dbUser.preferences || '{}') } });
    }

    // ============================================
    // PUT /api/auth/preferences
    // ============================================
    if (req.method === 'PUT' && action === 'preferences') {
      const user = await requireAuth(req, res);
      if (!user) return;
      const dbUser = await db.one('SELECT preferences FROM users WHERE id = $1', [user.id]);
      if (!dbUser) return res.status(404).json({ error: 'User not found' });
      const newPrefs = { ...JSON.parse(dbUser.preferences || '{}'), ...req.body };
      await db.run('UPDATE users SET preferences = $1 WHERE id = $2', [JSON.stringify(newPrefs), user.id]);
      return res.json({ ok: true });
    }

    // ============================================
    // POST /api/auth/change-password
    // ============================================
    if (req.method === 'POST' && action === 'change-password') {
      const user = await requireAuth(req, res);
      if (!user) return;
      const { currentPassword, newPassword } = req.body || {};
      if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Current and new password required' });
      if (newPassword.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters' });
      if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
        return res.status(400).json({ error: 'New password must include uppercase, lowercase, number, and special character' });
      }
      const dbUser = await db.one('SELECT * FROM users WHERE id = $1', [user.id]);
      const valid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
      if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });
      const newHash = await bcrypt.hash(newPassword, 10);
      await db.run('UPDATE users SET "passwordHash" = $1 WHERE id = $2', [newHash, user.id]);
      // Revoke old tokens
      await db.run('UPDATE users SET "tokenVersion" = "tokenVersion" + 1 WHERE id = $1', [user.id]);
      return res.json({ success: true, message: 'Password changed successfully' });
    }

    // ============================================
    // POST /api/auth/logout
    // ============================================
    if (req.method === 'POST' && action === 'logout') {
      const user = await requireAuth(req, res);
      if (!user) return;
      await db.run('UPDATE users SET "tokenVersion" = "tokenVersion" + 1 WHERE id = $1', [user.id]);
      return res.json({ success: true, message: 'Logged out successfully' });
    }

    // ============================================
    // POST /api/auth/verify-email
    // ============================================
    if (req.method === 'POST' && action === 'verify-email') {
      const { token } = req.body || {};
      if (!token) return res.status(400).json({ error: 'Verification token required' });
      const record = await db.one('SELECT * FROM verification_tokens WHERE token = $1', [token]);
      if (!record) return res.status(400).json({ error: 'Invalid or expired verification token' });
      if (new Date(record.expiresAt) < new Date()) {
        await db.run('DELETE FROM verification_tokens WHERE token = $1', [token]);
        return res.status(400).json({ error: 'Verification token has expired' });
      }
      await db.run('UPDATE users SET "emailVerified" = 1 WHERE id = $1', [record.userId]);
      await db.run('DELETE FROM verification_tokens WHERE token = $1', [token]);
      return res.json({ success: true, message: 'Email verified successfully' });
    }

    // ============================================
    // POST /api/auth/forgot-password
    // ============================================
    if (req.method === 'POST' && action === 'forgot-password') {
      const { email } = req.body || {};
      if (!email) return res.status(400).json({ error: 'Email is required' });
      const emailLower = email.toLowerCase().trim();
      const user = await db.one('SELECT id, email FROM users WHERE email = $1', [emailLower]);
      // Always return success to prevent email enumeration
      if (!user) return res.json({ success: true, message: 'If the email exists, a reset link has been sent' });

      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      await db.run('INSERT INTO reset_tokens (token, "userId", email, "expiresAt") VALUES ($1,$2,$3,$4)', [resetToken, user.id, user.email, expiresAt]);

      // TODO: Send email via Resend when configured
      console.log(`Password reset for ${emailLower}: /reset-password?token=${resetToken}`);
      return res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
    }

    // ============================================
    // POST /api/auth/reset-password
    // ============================================
    if (req.method === 'POST' && action === 'reset-password') {
      const { token, password } = req.body || {};
      if (!token || !password) return res.status(400).json({ error: 'Token and password are required' });
      if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

      const record = await db.one('SELECT * FROM reset_tokens WHERE token = $1', [token]);
      if (!record) return res.status(400).json({ error: 'Invalid or expired reset token' });
      if (new Date(record.expiresAt) < new Date()) {
        await db.run('DELETE FROM reset_tokens WHERE token = $1', [token]);
        return res.status(400).json({ error: 'Reset token has expired' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      await db.run('UPDATE users SET "passwordHash" = $1 WHERE id = $2', [passwordHash, record.userId]);
      // Revoke all tokens
      await db.run('UPDATE users SET "tokenVersion" = "tokenVersion" + 1 WHERE id = $1', [record.userId]);
      await db.run('DELETE FROM reset_tokens WHERE token = $1', [token]);
      return res.json({ success: true, message: 'Password reset successfully' });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
