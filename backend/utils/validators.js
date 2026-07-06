'use strict';

/**
 * Quantum Mentor World — Validators Utility
 * utils/validators.js
 *
 * Implements input validation checks for resource fields, settings, URLs, contact form, and reports.
 */

const {
  RESOURCE_TYPES,
  RESOURCE_STATUS,
  LEGAL_STATUS,
  SAFETY_STATUS,
  VISIBILITY,
  SOURCE_TYPES,
  ACCESS_TYPES,
  CONTACT_STATUS,
  REPORT_TYPES,
  REPORT_STATUS
} = require('./constants');

const { isSafeUrl } = require('./urlSafety');

/**
 * Verifies standard email formats.
 */
function isValidEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Verifies standard URL syntax.
 */
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Verifies a URL is safe for public visibility (blocks loopback/private ranges).
 */
function isSafePublicUrl(url) {
  return isSafeUrl(url);
}

/**
 * Checks string is non-empty.
 */
function isNonEmpty(str) {
  return typeof str === 'string' && str.trim().length > 0;
}

/**
 * Checks SEO slug format (lowercase alphanumeric and hyphens).
 */
function isValidSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Verifies valid resource type enum option.
 */
function isValidResourceType(type) {
  return RESOURCE_TYPES.includes(type);
}

/**
 * Verifies valid status enum option.
 */
function isValidResourceStatus(status) {
  return RESOURCE_STATUS.includes(status);
}

/**
 * Verifies valid visibility option.
 */
function isValidVisibility(visibility) {
  return VISIBILITY.includes(visibility);
}

/**
 * Verifies valid legal review status option.
 */
function isValidLegalStatus(status) {
  return LEGAL_STATUS.includes(status);
}

/**
 * Verifies valid safety scan status option.
 */
function isValidSafetyStatus(status) {
  return SAFETY_STATUS.includes(status);
}

/**
 * Verifies valid licensing source category option.
 */
function isValidSourceType(type) {
  return SOURCE_TYPES.includes(type);
}

/**
 * Verifies valid cost access option.
 */
function isValidAccessType(type) {
  return ACCESS_TYPES.includes(type);
}

/**
 * Verifies valid contact message status.
 */
function isValidContactStatus(status) {
  return CONTACT_STATUS.includes(status);
}

/**
 * Verifies valid report type.
 */
function isValidReportType(type) {
  return REPORT_TYPES.includes(type);
}

/**
 * Verifies valid report status.
 */
function isValidReportStatus(status) {
  return REPORT_STATUS.includes(status);
}

/**
 * Normalizes boolean values to 1 or 0 integers.
 */
function normalizeBoolean(value) {
  if (value === true || value === 'true' || value === 1 || value === '1') {
    return 1;
  }
  return 0;
}

/**
 * Sanitizes and trims strings.
 */
function normalizeString(value) {
  if (value === undefined || value === null) return '';
  return String(value).trim();
}

module.exports = {
  isValidEmail,
  isValidUrl,
  isSafePublicUrl,
  isNonEmpty,
  isValidSlug,
  isValidResourceType,
  isValidResourceStatus,
  isValidVisibility,
  isValidLegalStatus,
  isValidSafetyStatus,
  isValidSourceType,
  isValidAccessType,
  isValidContactStatus,
  isValidReportType,
  isValidReportStatus,
  normalizeBoolean,
  normalizeString
};
