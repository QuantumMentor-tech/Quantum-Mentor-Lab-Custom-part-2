'use strict';

/**
 * Quantum Mentor World — Contact Message Routes
 * routes/contact.routes.js
 */

const express = require('express');
const contactController = require('../controllers/contact.controller');
const { protect } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/admin.middleware');
const { contactLimiter } = require('../middleware/rate-limit.middleware');

const router = express.Router();

// Public Endpoint with rate limiter
router.post('/', contactLimiter, contactController.submitMessage);

// Protected Admin/Editor/Moderator Endpoints
router.get('/admin/messages', protect, requireRole(['admin', 'editor', 'moderator']), contactController.getMessages);
router.get('/admin/messages/:id', protect, requireRole(['admin', 'editor', 'moderator']), contactController.getMessageById);
router.patch('/admin/messages/:id/status', protect, requireRole(['admin', 'editor', 'moderator']), contactController.updateMessageStatus);
router.delete('/admin/messages/:id', protect, requireRole(['admin', 'editor', 'moderator']), contactController.deleteMessage);

module.exports = router;
