'use strict';

/**
 * Quantum Mentor World — Admin Tag Model
 * models/adminTag.model.js
 */

const { query } = require('../config/db');
const { generateUniqueSlug } = require('../utils/slugify');

/**
 * Lists tags for admin, supporting search and soft delete filters.
 */
async function getAdminTags(options = {}) {
  const { q = '', show_deleted = false } = options;
  let sql = 'SELECT * FROM tags WHERE 1=1';
  const params = [];

  if (!show_deleted) {
    sql += ' AND deleted_at IS NULL';
  }

  if (q) {
    sql += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }

  sql += ' ORDER BY name ASC';

  return await query(sql, params);
}

/**
 * Fetches tag by ID.
 */
async function getAdminTagById(id) {
  const sql = 'SELECT * FROM tags WHERE id = ? LIMIT 1';
  const rows = await query(sql, [id]);
  return rows[0] || null;
}

/**
 * Creates a new tag.
 */
async function createTag(data, userId) {
  const slug = await generateUniqueSlug('tags', data.name);
  const sql = 'INSERT INTO tags (name, slug, description, status) VALUES (?, ?, ?, ?)';
  const params = [
    data.name,
    slug,
    data.description || null,
    data.status || 'active'
  ];

  const result = await query(sql, params);
  return result.insertId;
}

/**
 * Updates tag details.
 */
async function updateTag(id, data, userId) {
  let slug = data.slug;
  if (data.name) {
    slug = await generateUniqueSlug('tags', data.name, id);
  }

  const fields = [];
  const params = [];

  const fieldMap = {
    name: 'name',
    description: 'description',
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

  const sql = `UPDATE tags SET ${fields.join(', ')} WHERE id = ?`;
  params.push(id);

  await query(sql, params);
  return id;
}

/**
 * Sets a soft delete timestamp on a tag.
 */
async function softDeleteTag(id, userId) {
  const sql = 'UPDATE tags SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?';
  return await query(sql, [id]);
}

module.exports = {
  getAdminTags,
  getAdminTagById,
  createTag,
  updateTag,
  softDeleteTag
};
