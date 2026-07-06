'use strict';

/**
 * Quantum Mentor World — Environment Configuration
 * config/env.js
 *
 * Loads environment variables from .env and provides defaults for local development.
 * Never logs raw secrets (like JWT_SECRET or DB_PASSWORD).
 */

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    name: process.env.DB_NAME || 'quantum_mentor_world',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'change_this_secret_before_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5500',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5500,http://127.0.0.1:5500')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean),

  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxUploadSizeMb: Number(process.env.MAX_UPLOAD_SIZE_MB) || 5,

  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 mins default
    maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    loginMax: Number(process.env.LOGIN_RATE_LIMIT_MAX) || 10,
    contactMax: Number(process.env.CONTACT_RATE_LIMIT_MAX) || 5,
    reportMax: Number(process.env.REPORT_RATE_LIMIT_MAX) || 10,
    uploadMax: Number(process.env.UPLOAD_RATE_LIMIT_MAX) || 30
  }
};

// Validate important environment variables
if (env.nodeEnv === 'production') {
  const isDefaultSecret = [
    'change_this_secret_before_production',
    'change_this_secret_in_real_project',
    'secret',
    'supersecret',
    '12345678',
    'admin'
  ].some(sec => env.jwt.secret.toLowerCase().includes(sec) || env.jwt.secret.length < 12);

  if (isDefaultSecret) {
    console.error('❌ CRITICAL SECURITY ERROR: Cannot start backend in production with a default, weak, or short JWT_SECRET!');
    process.exit(1);
  }
  if (env.db.password === '') {
    console.warn('⚠️ WARNING: Database password is empty in production mode! Set a strong password.');
  }
}

module.exports = env;
