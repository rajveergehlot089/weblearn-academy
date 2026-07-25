// ============================================
// Cache Headers Middleware
// ============================================
// Sets appropriate Cache-Control headers on read-heavy API responses

function cacheControl(maxAge = 300) {
  return (req, res, next) => {
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', `private, max-age=${maxAge}`);
      res.setHeader('Vary', 'Authorization');
    }
    next();
  };
}

// Short cache for frequently changing data (progress, user-specific)
const shortCache = cacheControl(30);

// Medium cache for semi-static data (course lists, topic content)
const mediumCache = cacheControl(300); // 5 minutes

// Long cache for static content (health check, metadata)
const longCache = cacheControl(3600); // 1 hour

module.exports = { cacheControl, shortCache, mediumCache, longCache };
