'use strict';

/**
 * Quantum Mentor World — Not Found Handler Middleware
 * middleware/not-found.middleware.js
 *
 * Catches all unmatched requests to return a standardized 404 JSON message.
 */

const { sendError } = require('../utils/response');

function notFoundMiddleware(req, res, next) {
  return sendError(res, 'API route not found.', 404);
}

module.exports = notFoundMiddleware;
