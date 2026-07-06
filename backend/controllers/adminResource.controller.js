'use strict';

/**
 * Quantum Mentor World — Admin Resource Controller
 * controllers/adminResource.controller.js
 */

const adminResourceModel = require('../models/adminResource.model');
const userModel = require('../models/user.model');
const { sendSuccess, sendError } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');
const { isSafeUrl } = require('../utils/urlSafety');
const validators = require('../utils/validators');

/**
 * Helper to log admin activity.
 */
async function logAdminAction(req, action, entityId, description) {
  try {
    await userModel.createAdminActivityLog({
      user_id: req.user.id,
      action,
      entity_type: 'resource',
      entity_id: entityId,
      description,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.headers['user-agent']
    });
  } catch (err) {
    console.error('[Activity Log Error] Resource log failed:', err.message);
  }
}

const adminResourceController = {
  /**
   * GET /api/admin/resources
   * Fetches paginated resources including draft or private entries.
   */
  getResources: asyncHandler(async (req, res) => {
    const { page, limit, offset } = getPaginationParams(req.query);
    
    const filterOptions = {
      limit,
      offset,
      q: req.query.q || '',
      resource_type: req.query.resource_type || '',
      status: req.query.status || '',
      visibility: req.query.visibility || '',
      legal_status: req.query.legal_status || '',
      safety_status: req.query.safety_status || '',
      source_type: req.query.source_type || '',
      access_type: req.query.access_type || '',
      featured: req.query.featured !== undefined ? (req.query.featured === 'true' || req.query.featured === '1') : null,
      trending: req.query.trending !== undefined ? (req.query.trending === 'true' || req.query.trending === '1') : null,
      sort: req.query.sort || 'latest',
      show_deleted: req.query.show_deleted === 'true' || req.query.show_deleted === '1'
    };

    const resources = await adminResourceModel.getAdminResources(filterOptions);
    const total = await adminResourceModel.countAdminResources(filterOptions);
    const meta = getPaginationMeta(total, page, limit);

    return sendSuccess(res, 'Admin resources fetched successfully.', resources, 200, meta);
  }),

  /**
   * GET /api/admin/resources/:id
   * Fetches full resource configuration details by ID.
   */
  getResource: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, 'Invalid resource ID.', 400);
    }

    const resource = await adminResourceModel.getAdminResourceById(id);
    if (!resource) {
      return sendError(res, 'Resource not found.', 404);
    }

    return sendSuccess(res, 'Resource details fetched successfully.', resource);
  }),

  /**
   * POST /api/admin/resources
   * Creates a new resource record, specifications, categories/tags, and safe links.
   */
  createResource: asyncHandler(async (req, res) => {
    const data = req.body;

    // 1. Mandatory Fields Validations
    if (!validators.isNonEmpty(data.title)) return sendError(res, 'Title is required.', 400);
    if (!validators.isValidResourceType(data.resource_type)) return sendError(res, 'Invalid resource type.', 400);
    if (!validators.isNonEmpty(data.short_description)) return sendError(res, 'Short description is required.', 400);
    if (!validators.isValidLegalStatus(data.legal_status)) return sendError(res, 'Invalid legal review status.', 400);
    if (!validators.isValidSafetyStatus(data.safety_status)) return sendError(res, 'Invalid safety scan status.', 400);
    if (!validators.isValidSourceType(data.source_type)) return sendError(res, 'Invalid source code category type.', 400);
    if (!validators.isValidAccessType(data.access_type)) return sendError(res, 'Invalid cost access type.', 400);

    // 2. URL Safety Screening
    if (data.featured_image && !isSafeUrl(data.featured_image)) {
      return sendError(res, 'Unsafe URL format detected for featured cover image.', 400);
    }

    // Validate details URL specs
    if (data.details) {
      const urlFields = ['official_url', 'documentation_url', 'demo_url', 'trailer_url', 'github_url', 'read_online_url', 'download_url'];
      for (const f of urlFields) {
        if (data.details[f] && !isSafeUrl(data.details[f])) {
          return sendError(res, `Unsafe URL protocol or host block for spec field: ${f}`, 400);
        }
      }
    }

    // Validate link mirrors rows
    if (data.links && Array.isArray(data.links)) {
      for (const link of data.links) {
        if (!link.label || !link.url) {
          return sendError(res, 'All URL links must have labels and URLs.', 400);
        }
        if (!isSafeUrl(link.url)) {
          return sendError(res, `Unsafe URL protocol or loopback block detected: ${link.url}`, 400);
        }
      }
    }

    // 3. Publish Conditions Guard
    if (data.status === 'published') {
      if (data.legal_status !== 'approved') {
        return sendError(res, 'Publishing is blocked. Legal status must be approved first.', 400);
      }
      if (data.safety_status !== 'safe' && data.safety_status !== 'warning') {
        return sendError(res, 'Publishing is blocked. Safety scan status must be marked safe or warning.', 400);
      }
    }

    // 4. Create resource
    const newId = await adminResourceModel.createResource(data, req.user.id);
    
    // Log audit activity
    await logAdminAction(req, 'resource_create', newId, `Created resource "${data.title}" successfully.`);

    return sendSuccess(res, 'Resource created successfully.', { id: newId });
  }),

  /**
   * PATCH /api/admin/resources/:id
   * Updates an existing resource configuration dynamically.
   */
  updateResource: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid resource ID.', 400);

    const data = req.body;

    // Validate exists
    const resource = await adminResourceModel.getAdminResourceById(id);
    if (!resource) return sendError(res, 'Resource not found.', 404);

    // 1. Mandatory Fields Validations (if provided)
    if (data.title !== undefined && !validators.isNonEmpty(data.title)) return sendError(res, 'Title cannot be empty.', 400);
    if (data.resource_type !== undefined && !validators.isValidResourceType(data.resource_type)) return sendError(res, 'Invalid resource type.', 400);
    if (data.short_description !== undefined && !validators.isNonEmpty(data.short_description)) return sendError(res, 'Short description cannot be empty.', 400);
    if (data.legal_status !== undefined && !validators.isValidLegalStatus(data.legal_status)) return sendError(res, 'Invalid legal review status.', 400);
    if (data.safety_status !== undefined && !validators.isValidSafetyStatus(data.safety_status)) return sendError(res, 'Invalid safety scan status.', 400);
    if (data.source_type !== undefined && !validators.isValidSourceType(data.source_type)) return sendError(res, 'Invalid source type.', 400);
    if (data.access_type !== undefined && !validators.isValidAccessType(data.access_type)) return sendError(res, 'Invalid access type.', 400);

    // 2. URL Safety Screening
    if (data.featured_image && !isSafeUrl(data.featured_image)) {
      return sendError(res, 'Unsafe URL format detected for cover image.', 400);
    }

    if (data.details) {
      const urlFields = ['official_url', 'documentation_url', 'demo_url', 'trailer_url', 'github_url', 'read_online_url', 'download_url'];
      for (const f of urlFields) {
        if (data.details[f] && !isSafeUrl(data.details[f])) {
          return sendError(res, `Unsafe URL protocol or host block for spec field: ${f}`, 400);
        }
      }
    }

    if (data.links && Array.isArray(data.links)) {
      for (const link of data.links) {
        if (!link.label || !link.url) {
          return sendError(res, 'All URL links must have labels and URLs.', 400);
        }
        if (!isSafeUrl(link.url)) {
          return sendError(res, `Unsafe URL protocol or loopback block detected: ${link.url}`, 400);
        }
      }
    }

    // 3. Publish Conditions Guard
    const finalStatus = data.status !== undefined ? data.status : resource.status;
    const finalLegal = data.legal_status !== undefined ? data.legal_status : resource.legal_status;
    const finalSafety = data.safety_status !== undefined ? data.safety_status : resource.safety_status;

    if (finalStatus === 'published') {
      if (finalLegal !== 'approved') {
        return sendError(res, 'Publishing is blocked. Legal status must be approved first.', 400);
      }
      if (finalSafety !== 'safe' && finalSafety !== 'warning') {
        return sendError(res, 'Publishing is blocked. Safety scan status must be marked safe or warning.', 400);
      }
    }

    // 4. Update resource
    await adminResourceModel.updateResource(id, data, req.user.id);
    
    // Log audit activity
    await logAdminAction(req, 'resource_update', id, `Updated resource "${data.title || resource.title}" successfully.`);

    return sendSuccess(res, 'Resource updated successfully.', { id });
  }),

  /**
   * DELETE /api/admin/resources/:id
   * Soft deletes a resource.
   */
  deleteResource: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid resource ID.', 400);

    // Require admin role for delete action
    if (req.user.role !== 'admin') {
      return sendError(res, 'Access denied. Only administrators can delete records.', 403);
    }

    const resource = await adminResourceModel.getAdminResourceById(id);
    if (!resource) return sendError(res, 'Resource not found.', 404);

    await adminResourceModel.softDeleteResource(id, req.user.id);
    await logAdminAction(req, 'resource_delete', id, `Soft-deleted resource "${resource.title}".`);

    return sendSuccess(res, 'Resource moved to trash successfully.');
  }),

  /**
   * PATCH /api/admin/resources/:id/restore
   * Restores a soft-deleted resource.
   */
  restoreResource: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid resource ID.', 400);

    if (req.user.role !== 'admin') {
      return sendError(res, 'Access denied. Only administrators can restore records.', 403);
    }

    // Check if it exists (including deleted)
    const [rows] = await adminResourceModel.getAdminResources({ show_deleted: true, limit: 1 });
    // Or check via simple query
    const checkSql = 'SELECT id, title FROM resources WHERE id = ? LIMIT 1';
    const checkRows = await require('../config/db').query(checkSql, [id]);
    if (checkRows.length === 0) return sendError(res, 'Resource not found.', 404);

    await adminResourceModel.restoreResource(id, req.user.id);
    await logAdminAction(req, 'resource_restore', id, `Restored resource "${checkRows[0].title}".`);

    return sendSuccess(res, 'Resource restored successfully.');
  }),

  /**
   * PATCH /api/admin/resources/:id/status
   * Patches status of a resource.
   */
  updateStatus: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid resource ID.', 400);

    const { status } = req.body;
    if (!validators.isValidResourceStatus(status)) {
      return sendError(res, 'Invalid resource status.', 400);
    }

    const resource = await adminResourceModel.getAdminResourceById(id);
    if (!resource) return sendError(res, 'Resource not found.', 404);

    // Enforce publish controls
    if (status === 'published') {
      if (resource.legal_status !== 'approved') {
        return sendError(res, 'Resource cannot be published until legal review is approved.', 400);
      }
      if (resource.safety_status !== 'safe' && resource.safety_status !== 'warning') {
        return sendError(res, 'Resource cannot be published until safety review is approved.', 400);
      }
    }

    await adminResourceModel.updateResourceStatus(id, status, req.user.id);
    await logAdminAction(req, 'resource_status_update', id, `Updated status to "${status}" for resource "${resource.title}".`);

    return sendSuccess(res, `Resource status updated to "${status}" successfully.`);
  }),

  /**
   * PATCH /api/admin/resources/:id/feature
   * Patches featured flag.
   */
  updateFeatured: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid resource ID.', 400);

    const { is_featured } = req.body;
    const featured = is_featured === true || is_featured === 1 || is_featured === 'true';

    const resource = await adminResourceModel.getAdminResourceById(id);
    if (!resource) return sendError(res, 'Resource not found.', 404);

    await adminResourceModel.updateResourceFeatured(id, featured, req.user.id);
    await logAdminAction(req, 'resource_feature_update', id, `${featured ? 'Featured' : 'Unfeatured'} resource "${resource.title}".`);

    return sendSuccess(res, `Resource featured status updated successfully.`);
  }),

  /**
   * PATCH /api/admin/resources/:id/trending
   * Patches trending flag.
   */
  updateTrending: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid resource ID.', 400);

    const { is_trending } = req.body;
    const trending = is_trending === true || is_trending === 1 || is_trending === 'true';

    const resource = await adminResourceModel.getAdminResourceById(id);
    if (!resource) return sendError(res, 'Resource not found.', 404);

    await adminResourceModel.updateResourceTrending(id, trending, req.user.id);
    await logAdminAction(req, 'resource_trending_update', id, `${trending ? 'Marked trending' : 'Removed trending'} resource "${resource.title}".`);

    return sendSuccess(res, `Resource trending status updated successfully.`);
  })
};

module.exports = adminResourceController;
