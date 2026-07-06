'use strict';

/**
 * Quantum Mentor World — Contact Controller
 * controllers/contact.controller.js
 */

const contactModel = require('../models/contact.model');
const userModel = require('../models/user.model');
const { sendSuccess, sendError } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');
const {
  isNonEmpty,
  isValidEmail,
  isValidContactStatus,
  normalizeString
} = require('../utils/validators');

/**
 * Helper to log admin actions for contact messages.
 */
async function logContactAction(req, action, entityId, description, oldValues = null, newValues = null) {
  try {
    await userModel.createAdminActivityLog({
      user_id: req.user.id,
      action,
      entity_type: 'contact_message',
      entity_id: entityId,
      description,
      old_values: oldValues,
      new_values: newValues,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.headers['user-agent']
    });
  } catch (err) {
    console.error('[Activity Log Error] Contact log failed:', err.message);
  }
}

const contactController = {
  /**
   * POST /api/contact
   * Handles public submissions to the contact form.
   */
  submitMessage: asyncHandler(async (req, res) => {
    const { full_name, email, subject, message } = req.body;

    // 1. Validation checks
    if (!isNonEmpty(full_name)) {
      return sendError(res, 'Full Name is required.', 400);
    }
    if (!isNonEmpty(email) || !isValidEmail(email)) {
      return sendError(res, 'A valid Email address is required.', 400);
    }
    if (!isNonEmpty(subject)) {
      return sendError(res, 'Subject is required.', 400);
    }
    if (!isNonEmpty(message)) {
      return sendError(res, 'Message content is required.', 400);
    }
    if (message.length > 5000) {
      return sendError(res, 'Message content cannot exceed 5000 characters.', 400);
    }

    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.headers['user-agent'] || null;

    const data = {
      full_name: normalizeString(full_name),
      email: normalizeString(email),
      subject: normalizeString(subject),
      message: normalizeString(message),
      ip_address,
      user_agent
    };

    const messageId = await contactModel.createMessage(data);

    return sendSuccess(res, 'Thank you! Your message has been submitted successfully.', { id: messageId }, 201);
  }),

  /**
   * GET /api/contact/admin/messages
   * Lists messages for administration (paginated & filterable).
   */
  getMessages: asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;
    const status = req.query.status || null;
    const search = req.query.search || null;

    const total = await contactModel.countMessages({ status, search });
    const messages = await contactModel.getMessages({ limit, offset, status, search });

    // Consistent sendSuccess syntax
    return sendSuccess(res, 'Contact messages fetched successfully.', messages, 200, {
      total,
      limit,
      offset
    });
  }),

  /**
   * GET /api/contact/admin/messages/:id
   * Fetches full detail of a single contact message.
   */
  getMessageById: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid message ID.', 400);

    const message = await contactModel.getMessageById(id);
    if (!message) return sendError(res, 'Contact message not found.', 404);

    return sendSuccess(res, 'Message fetched successfully.', message);
  }),

  /**
   * PATCH /api/contact/admin/messages/:id/status
   * Updates contact message status.
   */
  updateMessageStatus: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid message ID.', 400);

    const { status } = req.body;
    if (!isValidContactStatus(status)) {
      return sendError(res, 'Invalid message status value.', 400);
    }

    const message = await contactModel.getMessageById(id);
    if (!message) return sendError(res, 'Contact message not found.', 404);

    await contactModel.updateMessageStatus(id, status);

    await logContactAction(
      req,
      'contact_status_update',
      id,
      `Updated status of contact message from "${message.full_name}" to "${status}"`,
      { status: message.status },
      { status }
    );

    return sendSuccess(res, 'Message status updated successfully.', { id, status });
  }),

  /**
   * DELETE /api/contact/admin/messages/:id
   * Soft deletes a contact message.
   */
  deleteMessage: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid message ID.', 400);

    const message = await contactModel.getMessageById(id);
    if (!message) return sendError(res, 'Contact message not found.', 404);

    await contactModel.softDeleteMessage(id);

    await logContactAction(
      req,
      'contact_delete',
      id,
      `Soft-deleted contact message from "${message.full_name}" (ID ${id})`
    );

    return sendSuccess(res, 'Contact message moved to trash successfully.');
  })
};

module.exports = contactController;
