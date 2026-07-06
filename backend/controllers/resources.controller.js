'use strict';

/**
 * Quantum Mentor World — Resources API Controller
 * controllers/resources.controller.js
 */

const resourceModel = require('../models/resource.model');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');
const { sendSuccess, sendError } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');
const { PUBLIC_RESOURCE_TYPES } = require('../utils/constants');

/**
 * GET /api/resources
 * Fetches all public resources matching query filters, sorted and paginated.
 */
const getResources = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPaginationParams(req.query);
  const options = { ...req.query, limit, offset };

  const resources = await resourceModel.getPublicResources(options);
  const total = await resourceModel.countPublicResources(options);
  
  const meta = getPaginationMeta(total, page, limit);

  return sendSuccess(res, 'Resources fetched successfully.', resources, 200, meta);
});

/**
 * GET /api/resources/:slug
 * Fetches a single public resource by slug, increments view count, and loads related items.
 */
const getResourceBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const resource = await resourceModel.getPublicResourceBySlug(slug);

  if (!resource) {
    return sendError(res, 'Resource not found.', 404);
  }

  // Safely increment view count in the background
  await resourceModel.incrementResourceViewCount(resource.id);
  resource.view_count += 1; // Increment locally for current response consistency

  // Load related resources of the same type
  resource.related = await resourceModel.getRelatedResources(resource.id, resource.resource_type, 4);

  return sendSuccess(res, 'Resource fetched successfully.', resource);
});

/**
 * GET /api/resources/type/:type
 * Fetches public resources of a specific type.
 */
const getResourcesByType = asyncHandler(async (req, res) => {
  let { type } = req.params;

  // Handle standard plural/singular aliases
  if (type === 'books') type = 'book';
  if (type === 'themes') type = 'theme_plugin';
  if (type === 'github') type = 'github_repo';

  if (!PUBLIC_RESOURCE_TYPES.includes(type)) {
    return sendError(res, `Invalid resource type: '${type}'`, 400);
  }

  const { page, limit, offset } = getPaginationParams(req.query);
  const options = { ...req.query, limit, offset };

  const resources = await resourceModel.getPublicResourcesByType(type, options);
  const total = await resourceModel.countPublicResourcesByType(type, options);
  
  const meta = getPaginationMeta(total, page, limit);

  return sendSuccess(res, `${type} resources fetched successfully.`, resources, 200, meta);
});

/**
 * GET /api/resources/featured
 * Fetches featured resources.
 */
const getFeaturedResources = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 8;
  const resources = await resourceModel.getFeaturedResources(limit);
  return sendSuccess(res, 'Featured resources fetched successfully.', resources);
});

/**
 * GET /api/resources/trending
 * Fetches trending resources (ordered by views).
 */
const getTrendingResources = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 8;
  const resources = await resourceModel.getTrendingResources(limit);
  return sendSuccess(res, 'Trending resources fetched successfully.', resources);
});

/**
 * GET /api/resources/latest
 * Fetches latest published resources.
 */
const getLatestResources = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 8;
  const resources = await resourceModel.getLatestResources(limit);
  return sendSuccess(res, 'Latest resources fetched successfully.', resources);
});

module.exports = {
  getResources,
  getResourceBySlug,
  getResourcesByType,
  getFeaturedResources,
  getTrendingResources,
  getLatestResources
};
