// ============================================
// Rate Limiting Middleware
// ============================================
// Redis-backed when UPSTASH_REDIS_REST_URL is set, otherwise in-memory.
// Returns 429 Too Many Requests with Retry-After header.

const logger = require('../utils/logger');

// --- In-memory fallback ---
const attempts = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, record] of attempts) {
    if (now > record.resetAt) attempts.delete(key);
  }
}, 5 * 60 * 1000);

// --- Redis backend (Upstash) ---
let redisLimiter = null;

function getRedisLimiter() {
  if (redisLimiter !== null) return redisLimiter;

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const { Ratelimit } = require('@upstash/ratelimit');
      const { Redis } = require('@upstash/redis');

      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });

      redisLimiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '10s'),
        analytics: true,
      });
      logger.info('Redis rate limiter initialized');
    } catch (err) {
      logger.warn({ err }, 'Failed to init Redis rate limiter, using in-memory');
      redisLimiter = false;
    }
  } else {
    redisLimiter = false;
  }

  return redisLimiter;
}

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.connection?.remoteAddress || 'unknown';
}

function rateLimit(maxAttempts = 10, windowMs = 15 * 60 * 1000) {
  const redis = getRedisLimiter();

  if (redis) {
    // Async Redis-based rate limiter
    return async (req, res, next) => {
      const ip = getClientIp(req);
      const key = `${ip}:${req.path}`;

      try {
        const { success, limit, remaining, reset } = await redis.limit(key, {
          maxAttempts,
          window: windowMs,
        });

        res.set('X-RateLimit-Limit', String(limit));
        res.set('X-RateLimit-Remaining', String(Math.max(0, remaining)));
        res.set('X-RateLimit-Reset', String(Math.ceil(reset / 1000)));

        if (!success) {
          const retryAfter = Math.ceil((reset - Date.now()) / 1000);
          res.set('Retry-After', String(retryAfter));
          return res.status(429).json({
            error: 'Too many requests. Please try again later.',
            retryAfter,
          });
        }

        next();
      } catch (err) {
        logger.warn({ err }, 'Redis rate limit failed, falling through');
        next();
      }
    };
  }

  // In-memory fallback
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
