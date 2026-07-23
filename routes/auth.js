// ============================================
// Authentication Routes (PostgreSQL-backed, production-secured)
// ============================================
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { hashPassword, comparePassword } = require('../utils/hash');
const auth = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');
const db = require('../utils/db');
const { validate, registerSchema, loginSchema, preferencesSchema, forgotPasswordSchema, resetPasswordSchema } = require('../middleware/validate');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

// POST /api/auth/register
router.post('/register', rateLimit(10, 15 * 60 * 1000), validate(registerSchema), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const id = uuidv4();
    const passwordHash = await hashPassword(password);
    await db.createUser(id, name, email, passwordHash, 'customer');

    // Generate email verification token (stored in DB)
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await db.saveVerificationToken(verifyToken, id, email, expiresAt);

    // Include tokenVersion in JWT
    const token = jwt.sign(
      { id, name, email, role: 'customer', tokenVersion: 0 },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send verification email (non-blocking)
    sendVerificationEmail(email, verifyToken).catch(err => {
      console.error('Failed to send verification email:', err.message);
    });

    res.json({
      token,
      user: { id, name, email, role: 'customer', emailVerified: false },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', rateLimit(20, 15 * 60 * 1000), validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check account lockout
    if (user.lockedUntil) {
      const lockTime = new Date(user.lockedUntil);
      if (lockTime > new Date()) {
        const minutesLeft = Math.ceil((lockTime - new Date()) / 60000);
        return res.status(423).json({ error: `Account locked. Try again in ${minutesLeft} minutes.` });
      }
      // Lock expired, reset
      await db.resetFailedLogin(user.id);
    }

    const validPassword = await comparePassword(password, user.passwordHash);
    if (!validPassword) {
      // Increment failed attempts
      await db.incrementFailedLogin(user.id);

      const updatedUser = await db.getUserById(user.id);
      if (updatedUser.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000).toISOString();
        await db.lockAccount(user.id, lockUntil);
        return res.status(423).json({ error: `Too many failed attempts. Account locked for ${LOCKOUT_MINUTES} minutes.` });
      }

      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Successful login — reset failed attempts
    await db.resetFailedLogin(user.id);

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role || 'customer', tokenVersion: user.tokenVersion || 0 },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role || 'customer' } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/verify-email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Verification token required' });

    const record = await db.getVerificationToken(token);
    if (!record) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    if (new Date(record.expiresAt) < new Date()) {
      await db.deleteVerificationToken(token);
      return res.status(400).json({ error: 'Verification token has expired' });
    }

    // Mark user as verified
    await db.setEmailVerified(record.userId);
    await db.deleteVerificationToken(token);
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', rateLimit(3, 15 * 60 * 1000), validate(forgotPasswordSchema), async (req, res) => {
  try {
    const { email } = req.body;

    // Always return success to prevent email enumeration
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    await db.saveResetToken(resetToken, user.id, user.email, expiresAt);

    // Send password reset email (non-blocking)
    sendPasswordResetEmail(user.email, resetToken).catch(err => {
      console.error('Failed to send password reset email:', err.message);
    });

    res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', rateLimit(5, 15 * 60 * 1000), validate(resetPasswordSchema), async (req, res) => {
  try {
    const { token, password } = req.body;

    const record = await db.getResetToken(token);
    if (!record) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    if (new Date(record.expiresAt) < new Date()) {
      await db.deleteResetToken(token);
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    const passwordHash = await hashPassword(password);
    await db.updateUser(record.userId, { passwordHash });

    // Revoke all existing tokens by incrementing tokenVersion
    await db.incrementTokenVersion(record.userId);

    await db.deleteResetToken(token);
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/change-password (authenticated)
router.post('/change-password', auth, rateLimit(5, 15 * 60 * 1000), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      return res.status(400).json({ error: 'New password must include uppercase, lowercase, number, and special character' });
    }

    const user = await db.getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const valid = await comparePassword(currentPassword, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const newHash = await hashPassword(newPassword);
    await db.updateUser(req.user.id, { passwordHash: newHash });

    // Revoke old tokens
    await db.incrementTokenVersion(req.user.id);

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/logout (revoke current token)
router.post('/logout', auth, async (req, res) => {
  try {
    await db.incrementTokenVersion(req.user.id);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'customer',
        emailVerified: !!user.emailVerified,
        preferences: JSON.parse(user.preferences || '{}'),
      },
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/auth/preferences
router.put('/preferences', auth, validate(preferencesSchema), async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const currentPrefs = JSON.parse(user.preferences || '{}');
    const newPrefs = { ...currentPrefs, ...req.body };
    await db.updateUserPreferences(req.user.id, newPrefs);

    res.json({ ok: true });
  } catch (error) {
    console.error('Preferences error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
