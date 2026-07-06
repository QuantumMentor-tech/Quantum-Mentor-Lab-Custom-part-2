'use strict';

/**
 * Quantum Mentor World — Authorization Middleware
 * middleware/admin.middleware.js
 *
 * Implements role-based access checks for administrative and restricted endpoints.
 */

const { sendError } = require('../utils/response');

/**
 * Enforces admin-only privileges.
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return sendError(res, 'Admin access required.', 403);
  }
  next();
}

/**
 * Enforces membership in a specified set of administrative roles.
 *
 * @param {Array<string>} allowedRoles - Whitelist of allowed roles (e.g. ['admin', 'editor'])
 */
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return sendError(res, 'Access denied. Forbidden.', 403);
    }
    next();
  };
}

module.exports = {
  requireAdmin,
  requireRole
};
