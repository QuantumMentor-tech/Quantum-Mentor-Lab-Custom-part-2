'use strict';

/**
 * Quantum Mentor World — Input Validation Middleware
 * middleware/validation.middleware.js
 *
 * Catches express-validator validation results and formats error output consistently.
 */

const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

/**
 * Validates request validation results and intercepts with 422 error if validations fail.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 'Validation failed.', 422, errors.array());
  }
  next();
}

module.exports = validate;
