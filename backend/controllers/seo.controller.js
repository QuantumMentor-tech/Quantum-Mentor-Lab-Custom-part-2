'use strict';

/**
 * Quantum Mentor World — SEO Controller
 * controllers/seo.controller.js
 */

const seoModel = require('../models/seo.model');
const { sendSuccess } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const seoController = {
  /**
   * GET /api/seo/sitemap-data
   * Fetches published public slugs for resources, categories, and tags.
   */
  getSitemapData: asyncHandler(async (req, res) => {
    const resources = await seoModel.getSitemapResources();
    const categories = await seoModel.getSitemapCategories();
    const tags = await seoModel.getSitemapTags();

    return sendSuccess(res, 'Sitemap data fetched successfully.', {
      resources,
      categories,
      tags
    });
  })
};

module.exports = seoController;
