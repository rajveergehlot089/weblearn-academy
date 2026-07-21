// ============================================
// Admin Authorization Middleware (with JWT revocation)
// ============================================
const jwt = require('jsonwebtoken');
const db = require('../utils/db');

async function adminAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token has been revoked
    const currentVersion = await db.getTokenVersion(decoded.id);
    if (decoded.tokenVersion !== undefined && decoded.tokenVersion !== currentVersion) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }

    const user = await db.getUserById(decoded.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = adminAuth;
