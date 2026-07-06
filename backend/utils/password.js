'use strict';

/**
 * Quantum Mentor World — Password Utilities
 * utils/password.js
 *
 * Encapsulates bcrypt operations for password hashing and validation.
 */

const bcrypt = require('bcryptjs');

/**
 * Compares plain text password against dynamic hash.
 *
 * @param {string} plainPassword - Plaintext input
 * @param {string} passwordHash - Bcrypt hash from DB
 * @returns {Promise<boolean>} True if matching, false otherwise
 */
async function comparePassword(plainPassword, passwordHash) {
  if (!plainPassword || !passwordHash) {
    return false;
  }
  return bcrypt.compare(plainPassword, passwordHash);
}

/**
 * Generates bcrypt hash for plaintext password.
 *
 * @param {string} plainPassword - Input to hash
 * @returns {Promise<string>} Encrypted hash string
 */
async function hashPassword(plainPassword) {
  if (!plainPassword) {
    throw new Error('Password is required for hashing.');
  }
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

module.exports = {
  comparePassword,
  hashPassword
};
