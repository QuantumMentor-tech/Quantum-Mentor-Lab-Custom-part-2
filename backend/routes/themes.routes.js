'use strict';

/**
 * Quantum Mentor World — Themes & Plugins Section Router
 * routes/themes.routes.js
 */

const express = require('express');
const resourcesController = require('../controllers/resources.controller');
const resourceModel = require('../models/resource.model');
const { sendSuccess, sendError } = require('../utils/response');

const router = express.Router();

// List themes and plugins resources
router.get('/', (req, res, next) => {
  req.params.type = 'theme_plugin';
  return resourcesController.getResourcesByType(req, res, next);
});

// Single theme/plugin resource details
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const resource = await resourceModel.getPublicResourceBySlug(slug);

    if (!resource || resource.resource_type !== 'theme_plugin') {
      return sendError(res, 'Resource not found in Themes & Plugins section.', 404);
    }

    // Increment views safely
    await resourceModel.incrementResourceViewCount(resource.id);
    resource.view_count += 1;

    // Fetch related items
    resource.related = await resourceModel.getRelatedResources(resource.id, 'theme_plugin', 4);

    return sendSuccess(res, 'Theme/Plugin resource details fetched successfully.', resource);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
