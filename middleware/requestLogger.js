// ============================================
// Request Logging Middleware (pino-based)
// ============================================
const { randomUUID } = require('crypto');
const logger = require('../utils/logger');

function requestLogger(req, res, next) {
  const requestId = randomUUID();
  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip,
      userAgent: req.headers['user-agent'],
    };

    if (res.statusCode >= 500) {
      logger.error(logData, 'request error');
    } else if (res.statusCode >= 400) {
      logger.warn(logData, 'request warning');
    } else {
      logger.info(logData, 'request completed');
    }
  });

  next();
}

module.exports = requestLogger;
