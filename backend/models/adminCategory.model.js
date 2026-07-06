'use strict';

/**
 * Quantum Mentor World — Admin Category Model
 * models/adminCategory.model.js
 */

const { query } = require('../config/db');
const { generateUniqueSlug } = require('../utils/slugify');

/**
 * Lists categories for admin, supporting search and soft delete flags.
 */
async function getAdminCategories(options = {}) {
  const { q = '', show_deleted = false } = options;
  let sql = 'SELECT * FROM categories WHERE 1=1';
  const params = [];

  if (!show_deleted) {
    sql += ' AND deleted_at IS NULL';
  }

  if (q) {
    sql += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }

  sql += ' ORDER BY sort_order ASC, name ASC';

  return await query(sql, params);
}

/**
 * Fetches category by ID.
 */
async function getAdminCategoryById(id) {
  const sql = 'SELECT * FROM categories WHERE id = ? LIMIT 1';
  const rows = await query(sql, [id]);
  return rows[0] || null;
}

/**
 * Creates a new category.
 */
async function createCategory(data, userId) {
  const slug = await generateUniqueSlug('categories', data.name);
  const sql = `
    INSERT INTO categories (name, slug, description, icon, parent_id, sort_order, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    data.name,
    slug,
    data.description || null,
    data.icon || null,
    data.parent_id || null,
    data.sort_order || 0,
    data.status || 'active'
  ];

  const result = await query(sql, params);
  return result.insertId;
}

/**
 * Updates category details.
 */
async function updateCategory(id, data, userId) {
  let slug = data.slug;
  if (data.name) {
    slug = await generateUniqueSlug('categories', data.name, id);
  }

  const fields = [];
  const params = [];

  const fieldMap = {
    name: 'name',
    description: 'description',
    icon: 'icon',
    parent_id: 'parent_id',
    sort_order: 'sort_order',
    status: 'status'
  };

  for (const [apiKey, dbKey] of Object.entries(fieldMap)) {
    if (data[apiKey] !== undefined) {
      fields.push(`${dbKey} = ?`);
      params.push(data[apiKey]);
    }
  }

  if (data.name) {
    fields.push('slug = ?');
    params.push(slug);
  }

  if (fields.length === 0) return id;

  const sql = `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`;
  params.push(id);

  await query(sql, params);
  return id;
}

/**
 * Sets a soft delete timestamp on a category.
 */
async function softDeleteCategory(id, userId) {
  const sql = 'UPDATE categories SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?';
  return await query(sql, [id]);
}

module.exports = {
  getAdminCategories,
  getAdminCategoryById,
  createCategory,
  updateCategory,
  softDeleteCategory
};
