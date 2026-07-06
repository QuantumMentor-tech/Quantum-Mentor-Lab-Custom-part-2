'use strict';

/**
 * Quantum Mentor World — News Section Router
 * routes/news.routes.js
 */

const express = require('express');
const resourcesController = require('../controllers/resources.controller');
const resourceModel = require('../models/resource.model');
const { sendSuccess, sendError } = require('../utils/response');

const router = express.Router();

// List news resources
router.get('/', (req, res, next) => {
  req.params.type = 'news';
  return resourcesController.getResourcesByType(req, res, next);
});

// Single news resource details
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const resource = await resourceModel.getPublicResourceBySlug(slug);

    if (!resource || resource.resource_type !== 'news') {
      return sendError(res, 'Resource not found in News section.', 404);
    }

    // Increment views safely
    await resourceModel.incrementResourceViewCount(resource.id);
    resource.view_count += 1;

    // Fetch related items
    resource.related = await resourceModel.getRelatedResources(resource.id, 'news', 4);

    return sendSuccess(res, 'News resource details fetched successfully.', resource);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
