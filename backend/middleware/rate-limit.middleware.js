'use strict';

/**
 * Quantum Mentor World — Rate Limit Middlewares
 * middleware/rate-limit.middleware.js
 *
 * Exposes rate limit settings for sensitive routes, protecting
 * against brute-force and DDoS spam vectors.
 */

const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const standardHeadersConfig = {
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  }
};

/**
 * General API Limiter: Standard route protections
 */
const generalLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.maxRequests,
  ...standardHeadersConfig
});

/**
 * Login Rate Limiter: Blocks brute-force login attempts
 */
const loginLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.loginMax,
  ...standardHeadersConfig,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.'
  }
});

/**
 * Contact Limiter: Limits contact messages submission rate
 */
const contactLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.contactMax,
  ...standardHeadersConfig,
  message: {
    success: false,
    message: 'Too many contact messages submitted. Please try again later.'
  }
});

/**
 * Report Limiter: Limits resource reports submission rate
 */
const reportLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.reportMax,
  ...standardHeadersConfig,
  message: {
    success: false,
    message: 'Too many reports submitted. Please try again later.'
  }
});

/**
 * Upload Limiter: Limits media upload submission rate
 */
const uploadLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.uploadMax,
  ...standardHeadersConfig,
  message: {
    success: false,
    message: 'Too many image upload attempts. Please try again later.'
  }
});

module.exports = {
  generalLimiter,
  loginLimiter,
  contactLimiter,
  reportLimiter,
  uploadLimiter
};
