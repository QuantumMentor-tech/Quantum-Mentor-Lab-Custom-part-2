'use strict';

/**
 * Quantum Mentor World — Github Repositories Section Router
 * routes/github.routes.js
 */

const express = require('express');
const resourcesController = require('../controllers/resources.controller');
const resourceModel = require('../models/resource.model');
const { sendSuccess, sendError } = require('../utils/response');

const router = express.Router();

// List github repositories resources
router.get('/', (req, res, next) => {
  req.params.type = 'github_repo';
  return resourcesController.getResourcesByType(req, res, next);
});

// Single github repository resource details
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const resource = await resourceModel.getPublicResourceBySlug(slug);

    if (!resource || resource.resource_type !== 'github_repo') {
      return sendError(res, 'Resource not found in Github Repositories section.', 404);
    }

    // Increment views safely
    await resourceModel.incrementResourceViewCount(resource.id);
    resource.view_count += 1;

    // Fetch related items
    resource.related = await resourceModel.getRelatedResources(resource.id, 'github_repo', 4);

    return sendSuccess(res, 'Github repository details fetched successfully.', resource);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
