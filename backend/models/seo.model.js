'use strict';

/**
 * Quantum Mentor World — SEO Model
 * models/seo.model.js
 *
 * Provides database queries to fetch active public resources, categories,
 * and tags for sitemap generation.
 */

const { query } = require('../config/db');

const seoModel = {
  /**
   * Retrieves slugs of all published, approved, and safe public resources.
   *
   * @returns {Promise<Array>} List of resources with slug and update timestamp
   */
  async getSitemapResources() {
    const sql = `
      SELECT slug, updated_at
      FROM resources
      WHERE status = 'published'
        AND visibility = 'public'
        AND legal_status = 'approved'
        AND safety_status IN ('safe', 'warning')
        AND deleted_at IS NULL
      ORDER BY updated_at DESC
    `;
    return await query(sql);
  },

  /**
   * Retrieves slugs of all active categories.
   *
   * @returns {Promise<Array>} List of categories with name and slug
   */
  async getSitemapCategories() {
    const sql = `
      SELECT name, slug, updated_at
      FROM categories
      WHERE status = 'active'
        AND deleted_at IS NULL
      ORDER BY sort_order ASC
    `;
    return await query(sql);
  },

  /**
   * Retrieves slugs of all active tags.
   *
   * @returns {Promise<Array>} List of tags with name and slug
   */
  async getSitemapTags() {
    const sql = `
      SELECT name, slug, updated_at
      FROM tags
      WHERE status = 'active'
        AND deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await query(sql);
  }
};

module.exports = seoModel;
