'use strict';

/**
 * Quantum Mentor World — Admin Router
 * routes/admin.routes.js
 *
 * Exposes admin dashboard statistics, resources CRUD, categories CRUD,
 * tags CRUD, and site-settings endpoints. All routes require token authentication
 * and admin, editor, or moderator roles.
 */

const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/admin.middleware');

// Import controllers
const adminController = require('../controllers/admin.controller');
const adminResourceController = require('../controllers/adminResource.controller');
const adminCategoryController = require('../controllers/adminCategory.controller');
const adminTagController = require('../controllers/adminTag.controller');
const adminSettingsController = require('../controllers/adminSettings.controller');

const router = express.Router();

// Enforce authentication protection and role checking for all administrative routes
router.use(protect);
router.use(requireRole(['admin', 'editor', 'moderator']));

/* ─── Diagnostics & Overview Stats ──────────────────────────── */
router.get('/', (req, res) => {
  return require('../utils/response').sendSuccess(res, 'Admin API access granted.', {
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  });
});
router.get('/overview', adminController.getOverview);

/* ─── Resources CRUD Endpoints ───────────────────────────────── */
router.get('/resources', adminResourceController.getResources);
router.get('/resources/:id', adminResourceController.getResource);
router.post('/resources', adminResourceController.createResource);
router.patch('/resources/:id', adminResourceController.updateResource);
router.delete('/resources/:id', adminResourceController.deleteResource);

// Quick resource attribute toggles
router.patch('/resources/:id/status', adminResourceController.updateStatus);
router.patch('/resources/:id/feature', adminResourceController.updateFeatured);
router.patch('/resources/:id/trending', adminResourceController.updateTrending);
router.patch('/resources/:id/restore', adminResourceController.restoreResource);

/* ─── Categories CRUD Endpoints ─────────────────────────────── */
router.get('/categories', adminCategoryController.getCategories);
router.get('/categories/:id', adminCategoryController.getCategory);
router.post('/categories', adminCategoryController.createCategory);
router.patch('/categories/:id', adminCategoryController.updateCategory);
router.delete('/categories/:id', adminCategoryController.deleteCategory);

/* ─── Tags CRUD Endpoints ───────────────────────────────────── */
router.get('/tags', adminTagController.getTags);
router.get('/tags/:id', adminTagController.getTag);
router.post('/tags', adminTagController.createTag);
router.patch('/tags/:id', adminTagController.updateTag);
router.delete('/tags/:id', adminTagController.deleteTag);

/* ─── Site Settings Endpoints ───────────────────────────────── */
router.get('/settings', adminSettingsController.getSettings);
router.patch('/settings', adminSettingsController.updateSettings);

module.exports = router;
