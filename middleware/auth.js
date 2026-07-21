// ============================================
// Authentication Middleware (with JWT revocation)
// ============================================
const jwt = require('jsonwebtoken');
const db = require('../utils/db');

async function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token has been revoked (tokenVersion mismatch)
    const currentVersion = await db.getTokenVersion(decoded.id);
    if (decoded.tokenVersion !== undefined && decoded.tokenVersion !== currentVersion) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }

    // Check if account is locked
    const user = await db.getUserById(decoded.id);
    if (user && user.lockedUntil) {
      const lockTime = new Date(user.lockedUntil);
      if (lockTime > new Date()) {
        const minutesLeft = Math.ceil((lockTime - new Date()) / 60000);
        return res.status(423).json({ error: `Account locked. Try again in ${minutesLeft} minutes.` });
      }
      // Lock expired, unlock
      await db.resetFailedLogin(decoded.id);
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = auth;
