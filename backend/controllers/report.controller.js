'use strict';

/**
 * Quantum Mentor World — Resource Report Controller
 * controllers/report.controller.js
 */

const reportModel = require('../models/report.model');
const userModel = require('../models/user.model');
const { sendSuccess, sendError } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');
const {
  isNonEmpty,
  isValidEmail,
  isValidReportType,
  isValidReportStatus,
  normalizeString
} = require('../utils/validators');

/**
 * Helper to log admin actions for reports.
 */
async function logReportAction(req, action, entityId, description, oldValues = null, newValues = null) {
  try {
    await userModel.createAdminActivityLog({
      user_id: req.user.id,
      action,
      entity_type: 'resource_report',
      entity_id: entityId,
      description,
      old_values: oldValues,
      new_values: newValues,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.headers['user-agent']
    });
  } catch (err) {
    console.error('[Activity Log Error] Report log failed:', err.message);
  }
}

const reportController = {
  /**
   * POST /api/reports
   * Handles public submissions to report resource/link issues.
   */
  submitReport: asyncHandler(async (req, res) => {
    const { resource_id, link_id, report_type, reporter_name, reporter_email, message } = req.body;

    // 1. Validations
    const resId = parseInt(resource_id, 10);
    if (isNaN(resId)) {
      return sendError(res, 'A valid Resource ID is required.', 400);
    }

    if (!isValidReportType(report_type)) {
      return sendError(res, 'A valid Report Type is required.', 400);
    }

    if (!isNonEmpty(message)) {
      return sendError(res, 'Detailed report message is required.', 400);
    }

    if (reporter_email && !isValidEmail(reporter_email)) {
      return sendError(res, 'Reporter Email is invalid.', 400);
    }

    let parsedLinkId = null;
    if (link_id !== undefined && link_id !== null && link_id !== '') {
      parsedLinkId = parseInt(link_id, 10);
      if (isNaN(parsedLinkId)) {
        return sendError(res, 'Invalid Link ID format.', 400);
      }
    }

    const ip_address = req.ip || req.connection.remoteAddress;

    const data = {
      resource_id: resId,
      link_id: parsedLinkId,
      report_type,
      reporter_name: reporter_name ? normalizeString(reporter_name) : null,
      reporter_email: reporter_email ? normalizeString(reporter_email) : null,
      message: normalizeString(message),
      ip_address
    };

    const reportId = await reportModel.createReport(data);

    return sendSuccess(res, 'Thank you! Your report has been submitted for review.', { id: reportId }, 201);
  }),

  /**
   * GET /api/reports/admin
   * Lists submitted reports for administrators (paginated & filterable).
   */
  getReports: asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;
    const status = req.query.status || null;
    const report_type = req.query.report_type || null;

    const total = await reportModel.countReports({ status, report_type });
    const reports = await reportModel.getReports({ limit, offset, status, report_type });

    return sendSuccess(res, 'Reports fetched successfully.', reports, 200, {
      total,
      limit,
      offset
    });
  }),

  /**
   * GET /api/reports/admin/:id
   * Fetches full detail of a single report.
   */
  getReportById: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid report ID.', 400);

    const report = await reportModel.getReportById(id);
    if (!report) return sendError(res, 'Report not found.', 404);

    return sendSuccess(res, 'Report details fetched successfully.', report);
  }),

  /**
   * PATCH /api/reports/admin/:id/status
   * Updates report status.
   */
  updateReportStatus: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid report ID.', 400);

    const { status } = req.body;
    if (!isValidReportStatus(status)) {
      return sendError(res, 'Invalid report status value.', 400);
    }

    const report = await reportModel.getReportById(id);
    if (!report) return sendError(res, 'Report not found.', 404);

    await reportModel.updateReportStatus(id, status);

    await logReportAction(
      req,
      'report_status_update',
      id,
      `Updated report status on Resource ID ${report.resource_id} from "${report.status}" to "${status}"`,
      { status: report.status },
      { status }
    );

    return sendSuccess(res, 'Report status updated successfully.', { id, status });
  }),

  /**
   * DELETE /api/reports/admin/:id
   * Soft deletes a report.
   */
  deleteReport: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid report ID.', 400);

    const report = await reportModel.getReportById(id);
    if (!report) return sendError(res, 'Report not found.', 404);

    await reportModel.softDeleteReport(id);

    await logReportAction(
      req,
      'report_delete',
      id,
      `Soft-deleted report ID ${id} for Resource ID ${report.resource_id}`
    );

    return sendSuccess(res, 'Report moved to trash successfully.');
  })
};

module.exports = reportController;
