// ============================================
// Rate Limiting Middleware (Improved)
// ============================================
// Prevents abuse by limiting requests per IP.
// Returns 429 Too Many Requests with Retry-After header.

const attempts = new Map();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of attempts) {
    if (now > record.resetAt) attempts.delete(key);
  }
}, 5 * 60 * 1000);

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.connection?.remoteAddress || 'unknown';
}

function rateLimit(maxAttempts = 10, windowMs = 15 * 60 * 1000) {
  return (req, res, next) => {
    const ip = getClientIp(req);
    const key = `${ip}:${req.path}`;
    const now = Date.now();

    let record = attempts.get(key);
    if (!record || now > record.resetAt) {
      record = { count: 0, resetAt: now + windowMs };
    }

    record.count++;
    attempts.set(key, record);

    // Set rate limit headers
    res.set('X-RateLimit-Limit', String(maxAttempts));
    res.set('X-RateLimit-Remaining', String(Math.max(0, maxAttempts - record.count)));
    res.set('X-RateLimit-Reset', String(Math.ceil(record.resetAt / 1000)));

    if (record.count > maxAttempts) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({
        error: 'Too many requests. Please try again later.',
        retryAfter,
      });
    }

    next();
  };
}

// Global rate limiter: 100 requests per minute per IP
const globalLimiter = rateLimit(100, 60 * 1000);

// Strict limiter: 5 requests per 15 minutes (for password reset, etc.)
const strictLimiter = rateLimit(5, 15 * 60 * 1000);

module.exports = rateLimit;
module.exports.globalLimiter = globalLimiter;
module.exports.strictLimiter = strictLimiter;
module.exports.getClientIp = getClientIp;
