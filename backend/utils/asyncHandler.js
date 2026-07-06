'use strict';

/**
 * Quantum Mentor World — Async Handler Wrapper
 * utils/asyncHandler.js
 *
 * Wraps asynchronous controller functions to catch and pass errors to next().
 */

function asyncHandler(fn) {
  return function wrappedAsyncHandler(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
