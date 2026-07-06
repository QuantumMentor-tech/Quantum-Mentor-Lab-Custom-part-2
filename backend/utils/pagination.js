'use strict';

/**
 * Quantum Mentor World — Pagination Helper Utility
 * utils/pagination.js
 */

/**
 * Extracts and validates numeric page and limit parameters from request query.
 *
 * @param {Object} query - Express request query object (req.query)
 * @returns {Object} { page, limit, offset }
 */
function getPaginationParams(query) {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  // Apply fallback values if missing or invalid
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  
  if (isNaN(limit) || limit < 1) {
    limit = 12; // default resources limit per page
  }

  // Enforce upper boundary on page limits for safety
  if (limit > 50) {
    limit = 50;
  }

  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Generates standard pagination metadata response.
 *
 * @param {number} total - Total records count
 * @param {number} page - Current page index
 * @param {number} limit - Items limit per page
 * @returns {Object} { page, limit, total, totalPages }
 */
function getPaginationMeta(total, page, limit) {
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    page,
    limit,
    total,
    totalPages
  };
}

module.exports = {
  getPaginationParams,
  getPaginationMeta
};
