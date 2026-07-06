'use strict';

/**
 * Quantum Mentor World — Categories Router
 * routes/categories.routes.js
 */

const express = require('express');
const categoriesController = require('../controllers/categories.controller');

const router = express.Router();

router.get('/', categoriesController.getCategories);
router.get('/:slug/resources', categoriesController.getCategoryResources);

module.exports = router;
