'use strict';

/**
 * Quantum Mentor World — Health Check Routes
 * routes/health.routes.js
 */

const express = require('express');
const { getApiHealth, getDatabaseHealth } = require('../controllers/health.controller');

const router = express.Router();

router.get('/health', getApiHealth);
router.get('/health/database', getDatabaseHealth);

module.exports = router;
