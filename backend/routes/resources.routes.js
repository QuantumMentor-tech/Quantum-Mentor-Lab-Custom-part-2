'use strict';

/**
 * Quantum Mentor World — Resources Router
 * routes/resources.routes.js
 */

const express = require('express');
const resourcesController = require('../controllers/resources.controller');

const router = express.Router();

// Define specific routes first to avoid slug conflicts
router.get('/featured', resourcesController.getFeaturedResources);
router.get('/trending', resourcesController.getTrendingResources);
router.get('/latest', resourcesController.getLatestResources);
router.get('/type/:type', resourcesController.getResourcesByType);

// Route for all resources with paginated search/filters
router.get('/', resourcesController.getResources);

// Route for detailed resource search by slug
router.get('/:slug', resourcesController.getResourceBySlug);

module.exports = router;
