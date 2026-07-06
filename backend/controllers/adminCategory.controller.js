'use strict';

/**
 * Quantum Mentor World — Admin Category Controller
 * controllers/adminCategory.controller.js
 */

const adminCategoryModel = require('../models/adminCategory.model');
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
      entity_type: 'category',
      entity_id: entityId,
      description,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.headers['user-agent']
    });
  } catch (err) {
    console.error('[Activity Log Error] Category log failed:', err.message);
  }
}

const adminCategoryController = {
  /**
   * GET /api/admin/categories
   * Lists categories for administrative dashboard view.
   */
  getCategories: asyncHandler(async (req, res) => {
    const categories = await adminCategoryModel.getAdminCategories({
      q: req.query.q || '',
      show_deleted: req.query.show_deleted === 'true' || req.query.show_deleted === '1'
    });
    return sendSuccess(res, 'Categories fetched successfully.', categories);
  }),

  /**
   * GET /api/admin/categories/:id
   * Fetches detailed category data by ID.
   */
  getCategory: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid category ID.', 400);

    const category = await adminCategoryModel.getAdminCategoryById(id);
    if (!category) return sendError(res, 'Category not found.', 404);

    return sendSuccess(res, 'Category fetched successfully.', category);
  }),

  /**
   * POST /api/admin/categories
   * Creates a new category.
   */
  createCategory: asyncHandler(async (req, res) => {
    const data = req.body;

    if (!validators.isNonEmpty(data.name)) {
      return sendError(res, 'Category Name is required.', 400);
    }

    if (data.status && data.status !== 'active' && data.status !== 'inactive') {
      return sendError(res, 'Invalid category status.', 400);
    }

    // Block non-admin/editor from creating taxonomies
    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
      return sendError(res, 'Access denied. Administrator or Editor role required.', 403);
    }

    const newId = await adminCategoryModel.createCategory(data, req.user.id);
    await logAdminAction(req, 'category_create', newId, `Created category "${data.name}" successfully.`);

    return sendSuccess(res, 'Category created successfully.', { id: newId });
  }),

  /**
   * PATCH /api/admin/categories/:id
   * Updates an existing category configuration.
   */
  updateCategory: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid category ID.', 400);

    const data = req.body;

    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
      return sendError(res, 'Access denied. Administrator or Editor role required.', 403);
    }

    const category = await adminCategoryModel.getAdminCategoryById(id);
    if (!category) return sendError(res, 'Category not found.', 404);

    if (data.name !== undefined && !validators.isNonEmpty(data.name)) {
      return sendError(res, 'Category Name cannot be empty.', 400);
    }

    await adminCategoryModel.updateCategory(id, data, req.user.id);
    await logAdminAction(req, 'category_update', id, `Updated category "${data.name || category.name}" successfully.`);

    return sendSuccess(res, 'Category updated successfully.', { id });
  }),

  /**
   * DELETE /api/admin/categories/:id
   * Soft deletes a category.
   */
  deleteCategory: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid category ID.', 400);

    if (req.user.role !== 'admin') {
      return sendError(res, 'Access denied. Only administrators can delete categories.', 403);
    }

    const category = await adminCategoryModel.getAdminCategoryById(id);
    if (!category) return sendError(res, 'Category not found.', 404);

    await adminCategoryModel.softDeleteCategory(id, req.user.id);
    await logAdminAction(req, 'category_delete', id, `Soft-deleted category "${category.name}".`);

    return sendSuccess(res, 'Category moved to trash successfully.');
  })
};

module.exports = adminCategoryController;
