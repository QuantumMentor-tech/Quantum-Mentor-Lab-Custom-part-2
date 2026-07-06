'use strict';

/**
 * Quantum Mentor World — Authentication Middleware
 * middleware/auth.middleware.js
 *
 * Verifies JWT token headers and attaches authenticated user profiles to request context.
 */

const { verifyToken } = require('../utils/jwt');
const userModel = require('../models/user.model');
const { sendError } = require('../utils/response');

/**
 * Enforces valid authentication token is present.
 */
async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required.', 401);
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = verifyToken(token);
    } catch (err) {
      return sendError(res, 'Invalid or expired token.', 401);
    }

    const user = await userModel.findUserById(decoded.id);
    if (!user) {
      return sendError(res, 'Authentication required.', 401);
    }

    if (user.status !== 'active') {
      return sendError(res, 'Your account is inactive or suspended. Please contact support.', 403);
    }

    // Attach active user context
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Soft checks token if present, but does not block if unauthenticated.
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = verifyToken(token);
    } catch (err) {
      return next();
    }

    const user = await userModel.findUserById(decoded.id);
    if (user && user.status === 'active') {
      req.user = user;
    }
    next();
  } catch (err) {
    next();
  }
}

module.exports = {
  protect,
  optionalAuth
};
