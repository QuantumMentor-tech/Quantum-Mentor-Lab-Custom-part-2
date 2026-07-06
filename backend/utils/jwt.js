'use strict';

/**
 * Quantum Mentor World — JWT Utilities
 * utils/jwt.js
 *
 * Provides token generation and verification functions using configuration environment vars.
 */

const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Generates a signed JWT for the user payload.
 *
 * @param {Object} payload - Token payload (contains safe fields: id, email, role)
 * @returns {string} Signed token string
 */
function generateToken(payload) {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn
  });
}

/**
 * Verifies a JWT token signature and decodes the payload.
 *
 * @param {string} token - User JWT string
 * @returns {Object} Decoded payload
 * @throws Error if token is invalid or expired
 */
function verifyToken(token) {
  return jwt.verify(token, env.jwt.secret);
}

module.exports = {
  generateToken,
  verifyToken
};
