'use strict';

/**
 * Quantum Mentor World — Category Database Model
 * models/category.model.js
 */

const { query } = require('../config/db');
const { PUBLIC_RESOURCE_CONDITION } = require('../utils/constants');
const resourceModel = require('./resource.model');

/**
 * Fetches all active categories with counts of their associated public resources.
 *
 * @returns {Promise<Array>} List of categories with resource counts
 */
async function getActiveCategories() {
  const sql = `
    SELECT 
      c.id, 
      c.name, 
      c.slug, 
      c.description, 
      c.icon, 
      c.parent_id, 
      c.sort_order,
      COUNT(DISTINCT resources.id) AS resource_count
    FROM categories AS c
    LEFT JOIN resource_categories AS rc ON rc.category_id = c.id
    LEFT JOIN resources ON resources.id = rc.resource_id AND ${PUBLIC_RESOURCE_CONDITION}
    WHERE c.status = 'active' AND c.deleted_at IS NULL
    GROUP BY c.id
    ORDER BY c.sort_order ASC, c.name ASC
  `;
  return await query(sql);
}


/**
 * Fetches a single category by slug.
 *
 * @param {string} slug - Unique category slug
 * @returns {Promise<Object|null>} Category row details, or null if not found
 */
async function getCategoryBySlug(slug) {
  const sql = `
    SELECT id, name, slug, description, icon, parent_id, sort_order, status, created_at, updated_at
    FROM categories
    WHERE slug = ? AND status = 'active' AND deleted_at IS NULL
    LIMIT 1
  `;
  const rows = await query(sql, [slug]);
  return rows[0] || null;
}

/**
 * Fetches public resources mapped to a specific category.
 */
async function getResourcesByCategorySlug(slug, options = {}) {
  return await resourceModel.getPublicResources({ ...options, category: slug });
}

/**
 * Counts total public resources mapped to a specific category.
 */
async function countResourcesByCategorySlug(slug, options = {}) {
  return await resourceModel.countPublicResources({ ...options, category: slug });
}

module.exports = {
  getActiveCategories,
  getCategoryBySlug,
  getResourcesByCategorySlug,
  countResourcesByCategorySlug
};
