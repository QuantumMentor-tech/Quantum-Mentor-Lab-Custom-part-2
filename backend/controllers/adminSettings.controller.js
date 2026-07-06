'use strict';

/**
 * Quantum Mentor World — Admin Settings Controller
 * controllers/adminSettings.controller.js
 */

const adminSettingsModel = require('../models/adminSettings.model');
const userModel = require('../models/user.model');
const { sendSuccess, sendError } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');
const { isSafeUrl } = require('../utils/urlSafety');
const validators = require('../utils/validators');

/**
 * Helper to log admin activity.
 */
async function logAdminAction(req, action, description) {
  try {
    await userModel.createAdminActivityLog({
      user_id: req.user.id,
      action,
      entity_type: 'settings',
      description,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.headers['user-agent']
    });
  } catch (err) {
    console.error('[Activity Log Error] Settings log failed:', err.message);
  }
}

const adminSettingsController = {
  /**
   * GET /api/admin/settings
   * Loads safe, non-sensitive site-wide settings.
   */
  getSettings: asyncHandler(async (req, res) => {
    const settings = await adminSettingsModel.getAdminSettings();
    return sendSuccess(res, 'Settings fetched successfully.', settings);
  }),

  /**
   * PATCH /api/admin/settings
   * Updates multiple site settings parameters safely in a transaction.
   */
  updateSettings: asyncHandler(async (req, res) => {
    const settings = req.body;

    // Access check: only admins can modify site configurations
    if (req.user.role !== 'admin') {
      return sendError(res, 'Access denied. Administrator privileges required.', 403);
    }

    if (!settings || typeof settings !== 'object') {
      return sendError(res, 'Invalid settings payload.', 400);
    }

    // 1. Enforce Allowed Keys Validation Checks
    for (const key of Object.keys(settings)) {
      if (!adminSettingsModel.ALLOWED_KEYS.includes(key)) {
        return sendError(res, `Forbidden key updating blocked: "${key}". Site settings API cannot update system credentials or database passwords.`, 400);
      }
    }

    // 2. Value-specific validation checks
    if (settings.site_email !== undefined && !validators.isValidEmail(settings.site_email)) {
      return sendError(res, 'Please provide a valid support email address format.', 400);
    }

    // 3. Update settings in database transaction
    await adminSettingsModel.updateSettings(settings, req.user.id);
    
    // Log audit activity
    await logAdminAction(req, 'settings_update', 'Updated site configuration parameters.');

    const updatedSettings = await adminSettingsModel.getAdminSettings();
    return sendSuccess(res, 'Site settings updated successfully.', updatedSettings);
  })
};

module.exports = adminSettingsController;
