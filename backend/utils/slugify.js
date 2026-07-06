'use strict';

/**
 * Quantum Mentor World — Slug Utility
 * utils/slugify.js
 *
 * Converts title text strings into URL-safe slugs and checks against database tables
 * to guarantee uniqueness by adding incremental numeric suffixes (e.g. title-2).
 */

const { query } = require('../config/db');

/**
 * Standard slugification logic.
 * @param {string} text
 * @returns {string}
 */
function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')    // Remove all non-word chars (except spaces/hyphens)
    .replace(/[\s_-]+/g, '-')     // Replace spaces/underscores with single hyphen
    .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens
}

/**
 * Checks a target table's slug column iteratively to return a unique URL slug.
 * @param {string} tableName - Target database table (e.g., 'resources', 'categories', 'tags')
 * @param {string} title - Plain text to convert and verify
 * @param {number|string|null} excludeId - ID of record to ignore (for edits)
 * @returns {Promise<string>} Unique slug
 */
async function generateUniqueSlug(tableName, title, excludeId = null) {
  const baseSlug = slugify(title) || 'untitled';
  let uniqueSlug = baseSlug;
  let counter = 1;
  let exists = true;

  // Enforce table name constraints to avoid SQL injections
  const allowedTables = ['resources', 'categories', 'tags'];
  if (!allowedTables.includes(tableName)) {
    throw new Error(`Invalid table name for unique slug generation: ${tableName}`);
  }

  while (exists) {
    let sql = `SELECT COUNT(*) AS count FROM ${tableName} WHERE slug = ? AND deleted_at IS NULL`;
    const params = [uniqueSlug];

    if (excludeId !== null) {
      sql += ` AND id != ?`;
      params.push(excludeId);
    }

    const rows = await query(sql, params);
    const count = rows[0] ? rows[0].count : 0;

    if (count > 0) {
      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;
    } else {
      exists = false;
    }
  }

  return uniqueSlug;
}

module.exports = {
  slugify,
  generateUniqueSlug
};
