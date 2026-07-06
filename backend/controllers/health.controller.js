'use strict';

/**
 * Quantum Mentor World — Health Check Controller
 * controllers/health.controller.js
 */

const { testDatabaseConnection } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');

/**
 * GET /api/health
 * Returns API running status and environment info.
 */
const getApiHealth = asyncHandler(async (req, res) => {
  return sendSuccess(res, 'Quantum Mentor World API is running.', {
    project: 'Quantum Mentor World',
    brand: 'Quantum Mentor Official',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/health/database
 * Runs query and returns MySQL status and table counts.
 */
const getDatabaseHealth = asyncHandler(async (req, res) => {
  const dbHealth = await testDatabaseConnection();

  if (dbHealth.connected) {
    return sendSuccess(res, 'Database connection is healthy.', {
      connected: true,
      database: dbHealth.database,
      tableCount: dbHealth.tableCount
    });
  }

  return sendError(
    res, 
    'Database connection failed. Check XAMPP MySQL and backend .env settings.', 
    503
  );
});

module.exports = {
  getApiHealth,
  getDatabaseHealth
};
