'use strict';

/**
 * Quantum Mentor World — Media Routes
 * routes/media.routes.js
 */

const express = require('express');
const mediaController = require('../controllers/media.controller');
const { protect } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/admin.middleware');
const { uploadImage, handleMulterError } = require('../middleware/upload.middleware');
const { uploadLimiter } = require('../middleware/rate-limit.middleware');

const router = express.Router();

// Apply auth protection & editor/moderator/admin role checks globally to media routes
router.use(protect);
router.use(requireRole(['admin', 'editor', 'moderator']));

// Media endpoints mapping
router.get('/', mediaController.getMedia);
router.post('/upload', uploadLimiter, uploadImage, handleMulterError, mediaController.uploadMedia);
router.get('/:id', mediaController.getMediaById);
router.patch('/:id', mediaController.updateMedia);
router.delete('/:id', mediaController.deleteMedia);

module.exports = router;
