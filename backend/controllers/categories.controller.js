'use strict';

/**
 * Quantum Mentor World — Categories Controller
 * controllers/categories.controller.js
 */

const categoryModel = require('../models/category.model');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');
const { sendSuccess, sendError } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

/**
 * GET /api/categories
 * Returns active categories with resource counts.
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryModel.getActiveCategories();
  return sendSuccess(res, 'Categories fetched successfully.', categories);
});

/**
 * GET /api/categories/:slug/resources
 * Returns paginated resources for a specific active category.
 */
const getCategoryResources = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const category = await categoryModel.getCategoryBySlug(slug);

  if (!category) {
    return sendError(res, 'Category not found.', 404);
  }

  const { page, limit, offset } = getPaginationParams(req.query);
  const options = { ...req.query, limit, offset };

  const resources = await categoryModel.getResourcesByCategorySlug(slug, options);
  const total = await categoryModel.countResourcesByCategorySlug(slug, options);

  const paginationMeta = getPaginationMeta(total, page, limit);

  // Return list with pagination metadata and category info
  return sendSuccess(
    res, 
    `Resources for category '${category.name}' fetched successfully.`, 
    resources, 
    200, 
    {
      ...paginationMeta,
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon
      }
    }
  );
});

module.exports = {
  getCategories,
  getCategoryResources
};
