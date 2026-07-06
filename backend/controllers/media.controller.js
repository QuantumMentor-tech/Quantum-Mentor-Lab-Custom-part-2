'use strict';

/**
 * Quantum Mentor World — Media Controller
 * controllers/media.controller.js
 */

const mediaModel = require('../models/media.model');
const userModel = require('../models/user.model');
const { sendSuccess, sendError } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');
const { normalizeString } = require('../utils/validators');

/**
 * Helper to log admin activity for media operations.
 */
async function logMediaAction(req, action, entityId, description, oldValues = null, newValues = null) {
  try {
    await userModel.createAdminActivityLog({
      user_id: req.user.id,
      action,
      entity_type: 'media',
      entity_id: entityId,
      description,
      old_values: oldValues,
      new_values: newValues,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.headers['user-agent']
    });
  } catch (err) {
    console.error('[Activity Log Error] Media log failed:', err.message);
  }
}

const mediaController = {
  /**
   * GET /api/media
   * Lists uploaded media files (paginated).
   */
  getMedia: asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 24;
    const offset = parseInt(req.query.offset, 10) || 0;

    const total = await mediaModel.countMediaFiles();
    const media = await mediaModel.getMediaFiles({ limit, offset });

    // Consistent parameter sequence: sendSuccess(res, message, data, statusCode, meta)
    return sendSuccess(res, 'Media files fetched successfully.', media, 200, {
      total,
      limit,
      offset
    });
  }),

  /**
   * GET /api/media/:id
   * Fetches details of a single media item.
   */
  getMediaById: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid media ID.', 400);

    const file = await mediaModel.getMediaById(id);
    if (!file) return sendError(res, 'Media file not found.', 404);

    return sendSuccess(res, 'Media details fetched successfully.', file);
  }),

  /**
   * POST /api/media/upload
   * Handles safe single-file image uploads.
   */
  uploadMedia: asyncHandler(async (req, res) => {
    if (!req.file) {
      return sendError(res, 'No image file uploaded or file rejected by validation filters.', 400);
    }

    const file_name = req.file.filename;
    const file_url = `${req.protocol}://${req.get('host')}/api/uploads/images/${file_name}`;

    const mediaData = {
      file_name,
      original_name: req.file.originalname,
      file_path: req.file.path,
      file_url,
      mime_type: req.file.mimetype,
      file_size: req.file.size,
      alt_text: normalizeString(req.body.alt_text),
      caption: normalizeString(req.body.caption)
    };

    const mediaId = await mediaModel.createMedia(mediaData, req.user.id);
    const createdMedia = {
      id: mediaId,
      file_name: mediaData.file_name,
      file_url: mediaData.file_url,
      mime_type: mediaData.mime_type,
      file_size: mediaData.file_size,
      alt_text: mediaData.alt_text,
      caption: mediaData.caption
    };

    await logMediaAction(
      req,
      'media_upload',
      mediaId,
      `Uploaded image "${mediaData.original_name}" as "${mediaData.file_name}"`,
      null,
      createdMedia
    );

    return sendSuccess(res, 'Image uploaded successfully.', createdMedia, 201);
  }),

  /**
   * PATCH /api/media/:id
   * Updates alt text and captions for a media file.
   */
  updateMedia: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid media ID.', 400);

    const file = await mediaModel.getMediaById(id);
    if (!file) return sendError(res, 'Media file not found.', 404);

    const data = {
      alt_text: req.body.alt_text !== undefined ? normalizeString(req.body.alt_text) : file.alt_text,
      caption: req.body.caption !== undefined ? normalizeString(req.body.caption) : file.caption
    };

    await mediaModel.updateMedia(id, data);
    const updatedFile = await mediaModel.getMediaById(id);

    await logMediaAction(
      req,
      'media_update',
      id,
      `Updated alt/caption metadata for media ID ${id}`,
      { alt_text: file.alt_text, caption: file.caption },
      { alt_text: updatedFile.alt_text, caption: updatedFile.caption }
    );

    return sendSuccess(res, 'Media metadata updated successfully.', updatedFile);
  }),

  /**
   * DELETE /api/media/:id
   * Soft deletes a media file.
   */
  deleteMedia: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid media ID.', 400);

    const file = await mediaModel.getMediaById(id);
    if (!file) return sendError(res, 'Media file not found.', 404);

    await mediaModel.softDeleteMedia(id);

    await logMediaAction(
      req,
      'media_delete',
      id,
      `Soft-deleted media file "${file.file_name}" (ID ${id})`
    );

    return sendSuccess(res, 'Media file deleted successfully.');
  })
};

module.exports = mediaController;
