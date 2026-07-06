'use strict';

/**
 * Quantum Mentor World — User Model
 * models/user.model.js
 *
 * Exposes methods to search the users table, update last login timestamps,
 * and write logs into admin_activity_logs.
 */

const { query } = require('../config/db');

const userModel = {
  /**
   * Finds active/non-deleted user record by email.
   * Required for credential verification on login.
   *
   * @param {string} email - Email query input
   * @returns {Promise<Object|null>} Safe user object with password hash if found, null otherwise.
   */
  findUserByEmail: async (email) => {
    const rows = await query(
      `SELECT id, full_name, username, email, password_hash, role, status, avatar, last_login_at, created_at
       FROM users
       WHERE email = ? AND deleted_at IS NULL`,
      [email]
    );
    return rows[0] || null;
  },

  /**
   * Finds active/non-deleted user record by ID.
   * Excludes password_hash to maintain profile safety.
   *
   * @param {number} id - User ID key
   * @returns {Promise<Object|null>} Safe profile object or null if not found.
   */
  findUserById: async (id) => {
    const rows = await query(
      `SELECT id, full_name, username, email, role, status, avatar, last_login_at, created_at
       FROM users
       WHERE id = ? AND deleted_at IS NULL`,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Updates the last_login_at timestamp for a specific user.
   *
   * @param {number} userId - The identifier of the authenticated user
   * @returns {Promise<void>}
   */
  updateLastLogin: async (userId) => {
    await query(
      `UPDATE users
       SET last_login_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [userId]
    );
  },

  /**
   * Creates an administrative audit entry in admin_activity_logs.
   *
   * @param {Object} logData - Information to log
   * @param {number} logData.user_id - Logging administrator
   * @param {string} logData.action - Action label (e.g. 'login', 'logout')
   * @param {string} [logData.entity_type=null] - Type of modified entity
   * @param {number} [logData.entity_id=null] - Key of modified entity
   * @param {string} [logData.description=null] - Human readable description
   * @param {Object} [logData.old_values=null] - Previous state payload
   * @param {Object} [logData.new_values=null] - Updated state payload
   * @param {string} [logData.ip_address=null] - Source IP address
   * @param {string} [logData.user_agent=null] - Source User-Agent string
   * @returns {Promise<void>}
   */
  createAdminActivityLog: async (logData) => {
    const {
      user_id,
      action,
      entity_type = null,
      entity_id = null,
      description = null,
      old_values = null,
      new_values = null,
      ip_address = null,
      user_agent = null
    } = logData;

    await query(
      `INSERT INTO admin_activity_logs
       (user_id, action, entity_type, entity_id, description, old_values, new_values, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        action,
        entity_type,
        entity_id,
        description,
        old_values ? JSON.stringify(old_values) : null,
        new_values ? JSON.stringify(new_values) : null,
        ip_address,
        user_agent
      ]
    );
  }
};

module.exports = userModel;
