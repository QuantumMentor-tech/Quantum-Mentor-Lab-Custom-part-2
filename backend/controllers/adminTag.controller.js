'use strict';

/**
 * Quantum Mentor World — Admin Tag Controller
 * controllers/adminTag.controller.js
 */

const adminTagModel = require('../models/adminTag.model');
const userModel = require('../models/user.model');
const { sendSuccess, sendError } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');
const validators = require('../utils/validators');

/**
 * Helper to log admin activity.
 */
async function logAdminAction(req, action, entityId, description) {
  try {
    await userModel.createAdminActivityLog({
      user_id: req.user.id,
      action,
      entity_type: 'tag',
      entity_id: entityId,
      description,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.headers['user-agent']
    });
  } catch (err) {
    console.error('[Activity Log Error] Tag log failed:', err.message);
  }
}

const adminTagController = {
  /**
   * GET /api/admin/tags
   * Lists tags for admin view.
   */
  getTags: asyncHandler(async (req, res) => {
    const tags = await adminTagModel.getAdminTags({
      q: req.query.q || '',
      show_deleted: req.query.show_deleted === 'true' || req.query.show_deleted === '1'
    });
    return sendSuccess(res, 'Tags fetched successfully.', tags);
  }),

  /**
   * GET /api/admin/tags/:id
   * Fetches detailed tag details by ID.
   */
  getTag: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid tag ID.', 400);

    const tag = await adminTagModel.getAdminTagById(id);
    if (!tag) return sendError(res, 'Tag not found.', 404);

    return sendSuccess(res, 'Tag fetched successfully.', tag);
  }),

  /**
   * POST /api/admin/tags
   * Creates a new tag.
   */
  createTag: asyncHandler(async (req, res) => {
    const data = req.body;

    if (!validators.isNonEmpty(data.name)) {
      return sendError(res, 'Tag Name is required.', 400);
    }

    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
      return sendError(res, 'Access denied. Administrator or Editor role required.', 403);
    }

    const newId = await adminTagModel.createTag(data, req.user.id);
    await logAdminAction(req, 'tag_create', newId, `Created tag "#${data.name}" successfully.`);

    return sendSuccess(res, 'Tag created successfully.', { id: newId });
  }),

  /**
   * PATCH /api/admin/tags/:id
   * Updates an existing tag configuration.
   */
  updateTag: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid tag ID.', 400);

    const data = req.body;

    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
      return sendError(res, 'Access denied. Administrator or Editor role required.', 403);
    }

    const tag = await adminTagModel.getAdminTagById(id);
    if (!tag) return sendError(res, 'Tag not found.', 404);

    if (data.name !== undefined && !validators.isNonEmpty(data.name)) {
      return sendError(res, 'Tag Name cannot be empty.', 400);
    }

    await adminTagModel.updateTag(id, data, req.user.id);
    await logAdminAction(req, 'tag_update', id, `Updated tag "${data.name || tag.name}" successfully.`);

    return sendSuccess(res, 'Tag updated successfully.', { id });
  }),

  /**
   * DELETE /api/admin/tags/:id
   * Soft deletes a tag.
   */
  deleteTag: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid tag ID.', 400);

    if (req.user.role !== 'admin') {
      return sendError(res, 'Access denied. Only administrators can delete tags.', 403);
    }

    const tag = await adminTagModel.getAdminTagById(id);
    if (!tag) return sendError(res, 'Tag not found.', 404);

    await adminTagModel.softDeleteTag(id, req.user.id);
    await logAdminAction(req, 'tag_delete', id, `Soft-deleted tag "#${tag.name}".`);

    return sendSuccess(res, 'Tag moved to trash successfully.');
  })
};

module.exports = adminTagController;
