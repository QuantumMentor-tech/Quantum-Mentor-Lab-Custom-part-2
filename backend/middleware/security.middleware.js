'use strict';

/**
 * Quantum Mentor World — Security Middleware Configurator
 * middleware/security.middleware.js
 *
 * Configures Helmet headers, CORS parameters, and global Rate Limiting.
 */

const cors = require('cors');
const helmet = require('helmet');
const env = require('../config/env');
const { sendError } = require('../utils/response');

/**
 * Configures Helmet headers, CORS origins on the Express app.
 *
 * @param {Object} app - Express application instance
 */
function applySecurityMiddleware(app) {
  // Disable X-Powered-By header to obscure server technology
  app.disable('x-powered-by');

  // 1. Helmet security headers
  app.use(helmet({
    // Standard Cross-Origin Resource Policy
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    // Frameguard to prevent clickjacking
    frameguard: { action: 'deny' },
    // Strict referrer policy
    referrerPolicy: { policy: 'same-origin' }
  }));

  // 2. CORS configuration using dynamic allowedOrigins whitelists from env
  const allowedOrigins = [
    ...env.allowedOrigins,
    env.frontendUrl,
    'http://localhost:5500',   // VS Code Live Server
    'http://127.0.0.1:5500',
    'null'                     // Local file queries (MVP support)
  ];

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server, command line, backend tests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200
  }));
}

module.exports = applySecurityMiddleware;
