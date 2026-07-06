'use strict';

/**
 * Quantum Mentor World — Tag Database Model
 * models/tag.model.js
 */

const { query } = require('../config/db');
const { PUBLIC_RESOURCE_CONDITION } = require('../utils/constants');
const resourceModel = require('./resource.model');

/**
 * Fetches all active tags with counts of their associated public resources.
 *
 * @returns {Promise<Array>} List of tags with resource counts
 */
async function getActiveTags() {
  const sql = `
    SELECT 
      t.id, 
      t.name, 
      t.slug, 
      t.description,
      COUNT(DISTINCT resources.id) AS resource_count
    FROM tags AS t
    LEFT JOIN resource_tags AS rt ON rt.tag_id = t.id
    LEFT JOIN resources ON resources.id = rt.resource_id AND ${PUBLIC_RESOURCE_CONDITION}
    WHERE t.status = 'active' AND t.deleted_at IS NULL
    GROUP BY t.id
    ORDER BY t.name ASC
  `;
  return await query(sql);
}

/**
 * Fetches a single tag by slug.
 *
 * @param {string} slug - Unique tag slug
 * @returns {Promise<Object|null>} Tag row details, or null if not found
 */
async function getTagBySlug(slug) {
  const sql = `
    SELECT id, name, slug, description, status, created_at, updated_at
    FROM tags
    WHERE slug = ? AND status = 'active' AND deleted_at IS NULL
    LIMIT 1
  `;
  const rows = await query(sql, [slug]);
  return rows[0] || null;
}

/**
 * Fetches public resources mapped to a specific tag.
 */
async function getResourcesByTagSlug(slug, options = {}) {
  return await resourceModel.getPublicResources({ ...options, tag: slug });
}

/**
 * Counts total public resources mapped to a specific tag.
 */
async function countResourcesByTagSlug(slug, options = {}) {
  return await resourceModel.countPublicResources({ ...options, tag: slug });
}

module.exports = {
  getActiveTags,
  getTagBySlug,
  getResourcesByTagSlug,
  countResourcesByTagSlug
};
