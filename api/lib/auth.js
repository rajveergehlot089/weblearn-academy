// ============================================
// Auth Helper — JWT verification with revocation for Vercel API routes
// ============================================
const jwt = require('jsonwebtoken');
const db = require('./db');

function verifyToken(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

async function requireAuth(req, res) {
  const user = verifyToken(req);
  if (!user) {
    res.status(401).json({ error: 'No token provided' });
    return null;
  }

  // Check if token has been revoked
  const currentVersion = await db.one('SELECT "tokenVersion" FROM users WHERE id = $1', [user.id]);
  if (currentVersion && user.tokenVersion !== undefined && user.tokenVersion !== currentVersion.tokenVersion) {
    res.status(401).json({ error: 'Token has been revoked' });
    return null;
  }

  // Check if account is locked
  const fullUser = await db.one('SELECT "lockedUntil" FROM users WHERE id = $1', [user.id]);
  if (fullUser && fullUser.lockedUntil) {
    if (new Date(fullUser.lockedUntil) > new Date()) {
      const minutesLeft = Math.ceil((new Date(fullUser.lockedUntil) - new Date()) / 60000);
      res.status(423).json({ error: `Account locked. Try again in ${minutesLeft} minutes.` });
      return null;
    }
  }

  return user;
}

async function requireAdmin(req, res) {
  const user = await requireAuth(req, res);
  if (!user) return null;
  const dbUser = await db.one('SELECT role FROM users WHERE id = $1', [user.id]);
  if (!dbUser || dbUser.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return null;
  }
  return user;
}

// CORS headers for all API responses
function setCorsHeaders(res) {
  const origin = process.env.ALLOWED_ORIGINS || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-CSRF-Token');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    return true;
  }
  return false;
}

module.exports = { verifyToken, requireAuth, requireAdmin, setCorsHeaders, handleOptions };
