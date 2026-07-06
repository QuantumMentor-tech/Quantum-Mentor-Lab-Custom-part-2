'use strict';

/**
 * Quantum Mentor World — Contact Message Model
 * models/contact.model.js
 */

const { query } = require('../config/db');

const contactModel = {
  /**
   * Saves a new contact message into the database.
   *
   * @param {Object} data - Contact message input payload
   */
  async createMessage(data) {
    const sql = `
      INSERT INTO contact_messages (
        full_name, email, subject, message, status, ip_address, user_agent
      ) VALUES (?, ?, ?, ?, 'new', ?, ?)
    `;
    const params = [
      data.full_name,
      data.email,
      data.subject,
      data.message,
      data.ip_address || null,
      data.user_agent || null
    ];
    const result = await query(sql, params);
    return result.insertId;
  },

  /**
   * Fetches paginated contact messages for admin view with optional status filters.
   *
   * @param {Object} options - Query filters and pagination
   */
  async getMessages(options = {}) {
    const limit = parseInt(options.limit, 10) || 20;
    const offset = parseInt(options.offset, 10) || 0;
    const params = [];
    let whereClause = `deleted_at IS NULL`;

    if (options.status) {
      whereClause += ` AND status = ?`;
      params.push(options.status);
    }

    if (options.search) {
      whereClause += ` AND (full_name LIKE ? OR email LIKE ? OR subject LIKE ?)`;
      const searchWild = `%${options.search}%`;
      params.push(searchWild, searchWild, searchWild);
    }

    const sql = `
      SELECT id, full_name, email, subject, status, ip_address, user_agent, created_at, updated_at
      FROM contact_messages
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);
    return await query(sql, params);
  },

  /**
   * Counts active messages matching filters.
   *
   * @param {Object} options - Search and status filters
   */
  async countMessages(options = {}) {
    const params = [];
    let whereClause = `deleted_at IS NULL`;

    if (options.status) {
      whereClause += ` AND status = ?`;
      params.push(options.status);
    }

    if (options.search) {
      whereClause += ` AND (full_name LIKE ? OR email LIKE ? OR subject LIKE ?)`;
      const searchWild = `%${options.search}%`;
      params.push(searchWild, searchWild, searchWild);
    }

    const sql = `
      SELECT COUNT(*) AS total
      FROM contact_messages
      WHERE ${whereClause}
    `;

    const rows = await query(sql, params);
    return rows[0] ? rows[0].total : 0;
  },

  /**
   * Fetches a single message details (including body content).
   *
   * @param {number} id - Message primary key
   */
  async getMessageById(id) {
    const sql = `
      SELECT id, full_name, email, subject, message, status, ip_address, user_agent, created_at, updated_at
      FROM contact_messages
      WHERE id = ? AND deleted_at IS NULL
    `;
    const rows = await query(sql, [id]);
    return rows[0] || null;
  },

  /**
   * Modifies a message status.
   *
   * @param {number} id - Message primary key
   * @param {string} status - New message status ENUM value
   */
  async updateMessageStatus(id, status) {
    const sql = `
      UPDATE contact_messages
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND deleted_at IS NULL
    `;
    const result = await query(sql, [status, id]);
    return result.affectedRows > 0;
  },

  /**
   * Soft deletes a contact message record.
   *
   * @param {number} id - Message primary key
   */
  async softDeleteMessage(id) {
    const sql = `
      UPDATE contact_messages
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = ? AND deleted_at IS NULL
    `;
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
};

module.exports = contactModel;
