'use strict';

/**
 * Quantum Mentor World — Resource Report Routes
 * routes/reports.routes.js
 */

const express = require('express');
const reportController = require('../controllers/report.controller');
const { protect } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/admin.middleware');
const { reportLimiter } = require('../middleware/rate-limit.middleware');

const router = express.Router();

// Public submission path with rate limiter
router.post('/', reportLimiter, reportController.submitReport);

// Protected Admin dashboard review paths
router.get('/admin', protect, requireRole(['admin', 'editor', 'moderator']), reportController.getReports);
router.get('/admin/:id', protect, requireRole(['admin', 'editor', 'moderator']), reportController.getReportById);
router.patch('/admin/:id/status', protect, requireRole(['admin', 'editor', 'moderator']), reportController.updateReportStatus);
router.delete('/admin/:id', protect, requireRole(['admin', 'editor', 'moderator']), reportController.deleteReport);

module.exports = router;
