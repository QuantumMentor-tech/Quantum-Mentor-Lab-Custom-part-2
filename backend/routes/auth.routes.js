'use strict';

/**
 * Quantum Mentor World — Auth Router
 * routes/auth.routes.js
 *
 * Exposes admin credential validation, profile queries, and session destruction routes.
 */

const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validation.middleware');
const { protect } = require('../middleware/auth.middleware');
const { loginLimiter } = require('../middleware/rate-limit.middleware');

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Log in administrator and return JWT token
 * @access  Public (Rate limited)
 */
router.post('/login', loginLimiter, [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
], validate, authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Fetch authenticated administrator profile
 * @access  Private
 */
router.get('/me', protect, authController.getMe);

/**
 * @route   POST /api/auth/logout
 * @desc    Log out administrator session
 * @access  Private
 */
router.post('/logout', protect, authController.logout);

module.exports = router;
