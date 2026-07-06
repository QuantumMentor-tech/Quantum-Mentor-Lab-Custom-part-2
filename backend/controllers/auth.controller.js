'use strict';

/**
 * Quantum Mentor World — Auth Controller
 * controllers/auth.controller.js
 *
 * Implements administrative login, current user profiling, and logout actions.
 */

const userModel = require('../models/user.model');
const { comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const authController = {
  /**
   * POST /api/auth/login
   * Authenticates administrator credentials and returns signed JWT token.
   */
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required.', 400);
    }

    const user = await userModel.findUserByEmail(email);

    // Verify user exists and verify password hash
    if (!user || !(await comparePassword(password, user.password_hash))) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    // Verify account status
    if (user.status !== 'active') {
      return sendError(res, 'Your account is inactive or suspended. Please contact support.', 403);
    }

    // Restrict access to administrators, editors, and moderators
    const allowedRoles = ['admin', 'editor', 'moderator'];
    if (!allowedRoles.includes(user.role)) {
      return sendError(res, 'Access denied. Administrator privileges required.', 403);
    }

    // Generate token containing user metadata
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Update login timestamp
    await userModel.updateLastLogin(user.id);

    // Record login in audit trail
    await userModel.createAdminActivityLog({
      user_id: user.id,
      action: 'login',
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.headers['user-agent'],
      description: `Administrator user ${user.username} logged in successfully.`
    });

    // Return safe data and token
    return sendSuccess(res, 'Login successful.', {
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  }),

  /**
   * GET /api/auth/me
   * Returns authenticated administrator profile details.
   */
  getMe: asyncHandler(async (req, res) => {
    const user = await userModel.findUserById(req.user.id);
    if (!user) {
      return sendError(res, 'User session no longer exists.', 401);
    }

    return sendSuccess(res, 'Current user fetched successfully.', { user });
  }),

  /**
   * POST /api/auth/logout
   * Handles server-side administrative logging and invalidates UI token.
   */
  logout: asyncHandler(async (req, res) => {
    if (req.user) {
      await userModel.createAdminActivityLog({
        user_id: req.user.id,
        action: 'logout',
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.headers['user-agent'],
        description: `Administrator ${req.user.username} logged out.`
      });
    }

    return sendSuccess(res, 'Logout successful.');
  })
};

module.exports = authController;
