'use strict';

/**
 * Quantum Mentor World — Tags Controller
 * controllers/tags.controller.js
 */

const tagModel = require('../models/tag.model');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');
const { sendSuccess, sendError } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

/**
 * GET /api/tags
 * Returns active tags with resource counts.
 */
const getTags = asyncHandler(async (req, res) => {
  const tags = await tagModel.getActiveTags();
  return sendSuccess(res, 'Tags fetched successfully.', tags);
});

/**
 * GET /api/tags/:slug/resources
 * Returns paginated resources for a specific active tag.
 */
const getTagResources = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const tag = await tagModel.getTagBySlug(slug);

  if (!tag) {
    return sendError(res, 'Tag not found.', 404);
  }

  const { page, limit, offset } = getPaginationParams(req.query);
  const options = { ...req.query, limit, offset };

  const resources = await tagModel.getResourcesByTagSlug(slug, options);
  const total = await tagModel.countResourcesByTagSlug(slug, options);

  const paginationMeta = getPaginationMeta(total, page, limit);

  // Return list with pagination metadata and tag info
  return sendSuccess(
    res, 
    `Resources for tag '${tag.name}' fetched successfully.`, 
    resources, 
    200, 
    {
      ...paginationMeta,
      tag: {
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        description: tag.description
      }
    }
  );
});

module.exports = {
  getTags,
  getTagResources
};
