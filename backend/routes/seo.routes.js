'use strict';

/**
 * Quantum Mentor World — SEO Routes
 * routes/seo.routes.js
 */

const express = require('express');
const seoController = require('../controllers/seo.controller');

const router = express.Router();

// Public endpoint for crawling/sitemap generation utilities
router.get('/sitemap-data', seoController.getSitemapData);

module.exports = router;
