'use strict';

/**
 * Quantum Mentor World — Sanitize Utility
 * utils/sanitize.js
 *
 * Input sanitization helpers.
 * Prevents XSS, buffer overflows, and injection attacks.
 */

/**
 * Strip HTML tags from a string.
 * @param {string} str - Input string
 * @returns {string}   - Sanitized string
 */
function stripHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

/**
 * Sanitize a URL — ensure it is http/https only.
 * @param {string} url - Input URL
 * @returns {string|null} - Safe URL or null if invalid
 */
function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Trim and sanitize a plain text field.
 */
function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return stripHtml(str).replace(/\s+/g, ' ').trim();
}

/**
 * Sanitize a basic string (trims whitespace).
 */
function sanitizeString(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

/**
 * Sanitize email input (lowercase and trim).
 */
function sanitizeEmail(value) {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
}

/**
 * Enforce hard length limits on inputs to prevent buffer issues.
 */
function limitLength(value, maxLength) {
  if (typeof value !== 'string') return '';
  if (typeof maxLength !== 'number') return value;
  return value.substring(0, maxLength);
}

module.exports = {
  stripHtml,
  sanitizeUrl,
  sanitizeText,
  sanitizeString,
  sanitizeEmail,
  limitLength
};
