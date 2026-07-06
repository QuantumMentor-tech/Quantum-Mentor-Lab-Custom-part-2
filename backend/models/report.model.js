'use strict';

/**
 * Quantum Mentor World — Resource Report Model
 * models/report.model.js
 */

const { query } = require('../config/db');

const reportModel = {
  /**
   * Creates a new resource report record.
   *
   * @param {Object} data - Input report parameters
   */
  async createReport(data) {
    const sql = `
      INSERT INTO resource_reports (
        resource_id, link_id, report_type, reporter_name, reporter_email, message, status, ip_address
      ) VALUES (?, ?, ?, ?, ?, ?, 'new', ?)
    `;
    const params = [
      data.resource_id,
      data.link_id || null,
      data.report_type,
      data.reporter_name || null,
      data.reporter_email || null,
      data.message,
      data.ip_address || null
    ];
    const result = await query(sql, params);
    return result.insertId;
  },

  /**
   * Fetches paginated reports for admin dashboard review.
   *
   * @param {Object} options - Search options, filters, and pagination offset/limit
   */
  async getReports(options = {}) {
    const limit = parseInt(options.limit, 10) || 20;
    const offset = parseInt(options.offset, 10) || 0;
    const params = [];
    let whereClause = `r.deleted_at IS NULL`;

    if (options.status) {
      whereClause += ` AND r.status = ?`;
      params.push(options.status);
    }

    if (options.report_type) {
      whereClause += ` AND r.report_type = ?`;
      params.push(options.report_type);
    }

    const sql = `
      SELECT 
        r.id, 
        r.resource_id, 
        r.link_id, 
        r.report_type, 
        r.reporter_name, 
        r.reporter_email, 
        r.message, 
        r.status, 
        r.ip_address, 
        r.created_at, 
        r.updated_at,
        res.title AS resource_title,
        rl.label AS link_label,
        rl.url AS link_url
      FROM resource_reports r
      LEFT JOIN resources res ON r.resource_id = res.id
      LEFT JOIN resource_links rl ON r.link_id = rl.id
      WHERE ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);
    return await query(sql, params);
  },

  /**
   * Counts active reports matching specific query filters.
   *
   * @param {Object} options - Query filters (status, report_type)
   */
  async countReports(options = {}) {
    const params = [];
    let whereClause = `deleted_at IS NULL`;

    if (options.status) {
      whereClause += ` AND status = ?`;
      params.push(options.status);
    }

    if (options.report_type) {
      whereClause += ` AND report_type = ?`;
      params.push(options.report_type);
    }

    const sql = `
      SELECT COUNT(*) AS total
      FROM resource_reports
      WHERE ${whereClause}
    `;

    const rows = await query(sql, params);
    return rows[0] ? rows[0].total : 0;
  },

  /**
   * Fetches detailed report data by ID.
   *
   * @param {number} id - Report ID
   */
  async getReportById(id) {
    const sql = `
      SELECT 
        r.id, 
        r.resource_id, 
        r.link_id, 
        r.report_type, 
        r.reporter_name, 
        r.reporter_email, 
        r.message, 
        r.status, 
        r.ip_address, 
        r.created_at, 
        r.updated_at,
        res.title AS resource_title,
        rl.label AS link_label,
        rl.url AS link_url
      FROM resource_reports r
      LEFT JOIN resources res ON r.resource_id = res.id
      LEFT JOIN resource_links rl ON r.link_id = rl.id
      WHERE r.id = ? AND r.deleted_at IS NULL
    `;
    const rows = await query(sql, [id]);
    return rows[0] || null;
  },

  /**
   * Modifies report status.
   *
   * @param {number} id - Report primary key
   * @param {string} status - New report status ENUM value
   */
  async updateReportStatus(id, status) {
    const sql = `
      UPDATE resource_reports
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND deleted_at IS NULL
    `;
    const result = await query(sql, [status, id]);
    return result.affectedRows > 0;
  },

  /**
   * Soft deletes a report record.
   *
   * @param {number} id - Report primary key
   */
  async softDeleteReport(id) {
    const sql = `
      UPDATE resource_reports
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = ? AND deleted_at IS NULL
    `;
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
};

module.exports = reportModel;
