'use strict';

/**
 * Quantum Mentor World — Games Section Router
 * routes/games.routes.js
 */

const express = require('express');
const resourcesController = require('../controllers/resources.controller');
const resourceModel = require('../models/resource.model');
const { sendSuccess, sendError } = require('../utils/response');

const router = express.Router();

// List game resources
router.get('/', (req, res, next) => {
  req.params.type = 'game';
  return resourcesController.getResourcesByType(req, res, next);
});

// Single game resource details
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const resource = await resourceModel.getPublicResourceBySlug(slug);

    if (!resource || resource.resource_type !== 'game') {
      return sendError(res, 'Resource not found in Games section.', 404);
    }

    // Increment views safely
    await resourceModel.incrementResourceViewCount(resource.id);
    resource.view_count += 1;

    // Fetch related items
    resource.related = await resourceModel.getRelatedResources(resource.id, 'game', 4);

    return sendSuccess(res, 'Game resource details fetched successfully.', resource);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
