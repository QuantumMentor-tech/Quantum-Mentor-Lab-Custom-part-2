'use strict';

/**
 * Quantum Mentor World — Tags Router
 * routes/tags.routes.js
 */

const express = require('express');
const tagsController = require('../controllers/tags.controller');

const router = express.Router();

router.get('/', tagsController.getTags);
router.get('/:slug/resources', tagsController.getTagResources);

module.exports = router;
