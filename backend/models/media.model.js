'use strict';

/**
 * Quantum Mentor World — Media Model — Query methods for the media table.
 * models/media.model.js
 */

const { query } = require('../config/db');

const mediaModel = {
  /**
   * Fetches paginated uploaded media files.
   *
   * @param {Object} options - Pagination options (limit, offset)
   */
  async getMediaFiles(options = {}) {
    const limit = parseInt(options.limit, 10) || 24;
    const offset = parseInt(options.offset, 10) || 0;

    const sql = `
      SELECT m.*, u.username as uploaded_by_username
      FROM media m
      LEFT JOIN users u ON m.uploaded_by = u.id
      WHERE m.deleted_at IS NULL
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `;

    return await query(sql, [limit, offset]);
  },

  /**
   * Returns total count of active media files.
   */
  async countMediaFiles() {
    const sql = `
      SELECT COUNT(*) AS total
      FROM media
      WHERE deleted_at IS NULL
    `;
    const rows = await query(sql);
    return rows[0] ? rows[0].total : 0;
  },

  /**
   * Fetches details of a single media item.
   */
  async getMediaById(id) {
    const sql = `
      SELECT m.*, u.username as uploaded_by_username
      FROM media m
      LEFT JOIN users u ON m.uploaded_by = u.id
      WHERE m.id = ? AND m.deleted_at IS NULL
    `;
    const rows = await query(sql, [id]);
    return rows[0] || null;
  },

  /**
   * Creates a new media record in the database.
   */
  async createMedia(data, userId) {
    const sql = `
      INSERT INTO media (
        file_name, original_name, file_path, file_url,
        mime_type, file_size, alt_text, caption, uploaded_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.file_name,
      data.original_name,
      data.file_path,
      data.file_url,
      data.mime_type,
      data.file_size,
      data.alt_text || '',
      data.caption || '',
      userId
    ];
    const result = await query(sql, params);
    return result.insertId;
  },

  /**
   * Updates alt_text and caption fields.
   */
  async updateMedia(id, data) {
    const sql = `
      UPDATE media
      SET 
        alt_text = ?, 
        caption = ?, 
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND deleted_at IS NULL
    `;
    const result = await query(sql, [
      data.alt_text !== undefined ? data.alt_text : '',
      data.caption !== undefined ? data.caption : '',
      id
    ]);
    return result.affectedRows > 0;
  },

  /**
   * Soft deletes a media file.
   */
  async softDeleteMedia(id) {
    const sql = `
      UPDATE media
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = ? AND deleted_at IS NULL
    `;
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
};

module.exports = mediaModel;
