// ============================================
// CSRF Protection (Double-Submit Cookie Pattern)
// ============================================
// Server sets a cookie AND returns the token in a response header.
// Client reads the cookie value and sends it back as X-CSRF-Token header.
// Server compares both.

const crypto = require('crypto');

function generateCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Set CSRF cookie on GET requests (page loads)
function csrfInit(req, res, next) {
  if (req.method === 'GET') {
    let token = req.cookies?.csrf_token;
    if (!token) {
      token = generateCsrfToken();
      res.cookie('csrf_token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
    }
    // Always set header so client JS can read the token
    res.setHeader('X-CSRF-Token', token);
  }
  next();
}

// Verify CSRF on state-changing requests (POST, PUT, DELETE)
function csrfProtect(req, res, next) {
  // Skip for safe methods and OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip for API auth endpoints (login/register) — these are protected by rate limiting
  if (req.path.includes('/auth/login') || req.path.includes('/auth/register')) {
    return next();
  }

  const cookieToken = req.cookies?.csrf_token;
  const headerToken = req.headers['x-csrf-token'];

  if (!cookieToken || !headerToken) {
    return res.status(403).json({ error: 'CSRF token missing' });
  }

  // Use constant-time comparison to prevent timing attacks
  if (!crypto.timingSafeEqual(Buffer.from(cookieToken), Buffer.from(headerToken))) {
    return res.status(403).json({ error: 'CSRF token mismatch' });
  }

  next();
}

module.exports = { csrfInit, csrfProtect, generateCsrfToken };
