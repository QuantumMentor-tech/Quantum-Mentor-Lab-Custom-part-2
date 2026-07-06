'use strict';

/**
 * Quantum Mentor World — API Response Standard Helper
 * utils/response.js
 *
 * Provides standardized formats for Express responses.
 * Never includes raw stack traces or secret keys.
 */

/**
 * Standard Success Response Handler
 *
 * @param {Object} res        - Express response object
 * @param {string} message    - Description of status/success
 * @param {*}      [data=null]- Response payload
 * @param {number} [statusCode=200] - HTTP Status
 * @param {Object} [meta=null] - Pagination / extra metadata
 */
function sendSuccess(res, message, data = null, statusCode = 200, meta = null) {
  const response = {
    success: true,
    message
  };

  if (data !== null) {
    response.data = data;
  }
  
  if (meta !== null) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
}

/**
 * Standard Error Response Handler
 *
 * @param {Object} res        - Express response object
 * @param {string} message    - Description of error
 * @param {number} [statusCode=500] - HTTP Status
 * @param {Array}  [errors=null] - Validation / detailed errors
 */
function sendError(res, message, statusCode = 500, errors = null) {
  const response = {
    success: false,
    message
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
}

/* ─── Backwards Compatibility Helpers ────────────────────────── */

function success(res, data = {}, message = 'Success', statusCode = 200) {
  return sendSuccess(res, message, data, statusCode);
}

function error(res, message = 'An error occurred', statusCode = 500, errors = null) {
  return sendError(res, message, statusCode, errors);
}

function paginated(res, data, pagination, message = 'Success') {
  return sendSuccess(res, message, data, 200, pagination);
}

module.exports = {
  sendSuccess,
  sendError,
  success,
  error,
  paginated
};
