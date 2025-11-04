/**
 * Security Audit Logger Middleware
 * Logs all security-relevant events for monitoring and compliance
 */

const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const securityLogPath = path.join(logsDir, 'security-audit.log');

/**
 * Log security events to file
 */
const logSecurityEvent = (event, details) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    ...details
  };

  const logLine = JSON.stringify(logEntry) + '\n';

  fs.appendFile(securityLogPath, logLine, (err) => {
    if (err) {
      console.error('[AUDIT] Failed to write security log:', err);
    }
  });

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[AUDIT] ${event}:`, details);
  }
};

/**
 * Middleware to log all authenticated requests
 */
const auditLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log request
  const requestDetails = {
    method: req.method,
    path: req.path,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    userId: req.user?._id || 'anonymous',
  };

  // Log response after it's sent
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const responseDetails = {
      ...requestDetails,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    };

    // Log security-relevant events
    if (
      req.path.includes('/auth/') ||
      req.path.includes('/login') ||
      req.path.includes('/signup') ||
      ['POST', 'PUT', 'DELETE'].includes(req.method)
    ) {
      logSecurityEvent('API_REQUEST', responseDetails);
    }

    // Log failed requests
    if (res.statusCode >= 400) {
      logSecurityEvent('FAILED_REQUEST', responseDetails);
    }

    // Log suspicious activity
    if (res.statusCode === 429) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', responseDetails);
    }

    if (res.statusCode === 403) {
      logSecurityEvent('FORBIDDEN_ACCESS', responseDetails);
    }

    if (res.statusCode === 401) {
      logSecurityEvent('UNAUTHORIZED_ACCESS', responseDetails);
    }
  });

  next();
};

/**
 * Log specific security events
 */
const logAuthEvent = (eventType, userId, email, ipAddress, success = true) => {
  logSecurityEvent(eventType, {
    userId,
    email,
    ipAddress,
    success,
  });
};

/**
 * Get security logs (for admin dashboard)
 */
const getSecurityLogs = (lines = 100) => {
  try {
    const logs = fs.readFileSync(securityLogPath, 'utf8');
    const logLines = logs.trim().split('\n');
    const recentLogs = logLines.slice(-lines);
    return recentLogs.map(line => JSON.parse(line));
  } catch (err) {
    console.error('[AUDIT] Failed to read security logs:', err);
    return [];
  }
};

/**
 * Log rotation (keep last 30 days)
 */
const rotateSecurityLogs = () => {
  try {
    const stats = fs.statSync(securityLogPath);
    const fileAge = Date.now() - stats.mtime.getTime();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    if (fileAge > thirtyDays) {
      const archivePath = path.join(
        logsDir,
        `security-audit-${new Date().toISOString().split('T')[0]}.log`
      );
      fs.renameSync(securityLogPath, archivePath);
      console.log(`[AUDIT] Rotated security logs to ${archivePath}`);
    }
  } catch (err) {
    // File doesn't exist yet, no rotation needed
  }
};

// Rotate logs daily
setInterval(rotateSecurityLogs, 24 * 60 * 60 * 1000);

module.exports = {
  auditLogger,
  logSecurityEvent,
  logAuthEvent,
  getSecurityLogs,
};
