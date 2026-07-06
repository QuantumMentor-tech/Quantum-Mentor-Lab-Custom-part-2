'use strict';

/**
 * Quantum Mentor World — Backend Server Entry Point
 * server.js
 *
 * Configures process environment variables, boots the Express HTTP listener,
 * establishes database test checks, and handles graceful exits.
 */

const env = require('./config/env');
const app = require('./app');
const logger = require('./utils/logger');
const { testDatabaseConnection } = require('./config/db');

/* ─── Start HTTP Listener ────────────────────────────────────── */
const server = app.listen(env.port, async () => {
  logger.info('==================================================');
  logger.info('       QUANTUM MENTOR WORLD — BACKEND API        ');
  logger.info('==================================================');
  logger.info(`Status      : ✅ Running`);
  logger.info(`Port        : ${env.port}`);
  logger.info(`Mode        : ${env.nodeEnv}`);
  logger.info(`API Base URL: http://localhost:${env.port}`);
  logger.info(`Health URL  : http://localhost:${env.port}/api/health`);
  logger.info('==================================================');

  // Test database connection on server bootstrap
  await testDatabaseConnection();
});

/* ─── Handle Port-in-Use / Startup Errors ────────────────────── */
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(`Port ${env.port} is already in use.`);
    logger.error(`→ Stop the conflicting process or update PORT in backend/.env.`);
  } else {
    logger.error(`Server bootstrap error: ${error.message}`);
  }
  process.exit(1);
});

/* ─── Handle Unhandled Promise Rejections ─────────────────────── */
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection intercepted:', reason);
});

/* ─── Handle Uncaught Exceptions ────────────────────────────── */
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception encountered: ${error.message}`, { stack: error.stack });
  process.exit(1);
});

/* ─── Graceful Server Shutdowns ───────────────────────────────── */
const handleGracefulShutdown = (signal) => {
  logger.info(`${signal} received — initiating graceful server shutdown...`);
  server.close(() => {
    logger.info('HTTP server successfully closed. Process terminated. Goodbye.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
