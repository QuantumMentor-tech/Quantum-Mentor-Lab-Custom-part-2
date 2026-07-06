'use strict';

/**
 * Quantum Mentor World — Admin Controller — Handles admin dashboard data and settings.
 * controllers/admin.controller.js
 */

const adminModel = require('../models/admin.model');
const { sendSuccess, sendError } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const adminController = {
  /**
   * GET /api/admin/overview
   * Fetches general dashboard count statistics from the database.
   */
  getOverview: asyncHandler(async (req, res) => {
    const stats = await adminModel.getOverviewStats();
    return sendSuccess(res, 'Admin overview fetched successfully.', stats);
  })
};

module.exports = adminController;
