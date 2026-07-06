'use strict';

/**
 * Quantum Mentor World — Global Error Handling Middleware
 * middleware/error.middleware.js
 *
 * Catches all unhandled errors, logs them, and returns a standardized JSON response.
 * Strictly hides detailed stack traces and SQL query details in production environment.
 */

const logger = require('../utils/logger');
const { sendError } = require('../utils/response');
const env = require('../config/env');

function errorMiddleware(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;
  let message = err.message || 'Internal server error.';

  // Censorship for production environments
  if (env.nodeEnv === 'production') {
    // Hide SQL details if it is a mysql database connection error
    if (err.sql || err.code || err.sqlState) {
      message = 'A database operation error occurred.';
    } else if (statusCode === 500) {
      message = 'An unexpected internal server error occurred.';
    }
  }

  // Log error with metadata (avoiding full request body/secrets)
  logger.error(`${req.method} ${req.originalUrl} — ${message}`, {
    statusCode,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    ...(env.nodeEnv === 'development' && { stack: err.stack, sql: err.sql })
  });

  // Safe development debug info
  let errorDetail = null;
  if (env.nodeEnv === 'development') {
    errorDetail = {
      stack: err.stack,
      detail: err.toString(),
      ...(err.sql && { sql: err.sql })
    };
  }

  // Formatting response via standard error helper
  return sendError(
    res, 
    message, 
    statusCode, 
    errorDetail ? [errorDetail] : null
  );
}

module.exports = errorMiddleware;
