'use strict';

/**
 * Quantum Mentor World — File Safety Utility
 * utils/fileSafety.js
 *
 * Implements security checks for uploaded files. Prevents uploads of malicious
 * executables, scripts, archives, and un-sanitized SVGs.
 */

const path = require('path');

const ALLOWED_MIME_TYPES = Object.freeze([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
]);

const ALLOWED_EXTENSIONS = Object.freeze([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif'
]);

const BLOCKED_EXTENSIONS = Object.freeze([
  '.exe', '.bat', '.cmd', '.sh', '.php', '.js', '.html', '.htm', '.svg',
  '.zip', '.rar', '.7z', '.msi', '.dll', '.scr', '.jar'
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function isAllowedMimeType(mimeType) {
  if (!mimeType) return false;
  return ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase());
}

function isAllowedExtension(filename) {
  if (!filename) return false;
  const ext = getSafeFileExtension(filename);
  return ALLOWED_EXTENSIONS.includes(ext);
}

function getSafeFileExtension(filename) {
  if (!filename) return '';
  return path.extname(filename).toLowerCase();
}

function sanitizeFileName(filename) {
  if (!filename) return '';
  const parsed = path.parse(filename);
  // Remove directory traversal characters and restrict to safe set
  const cleanName = parsed.name
    .replace(/[^a-zA-Z0-9\-_]/g, '_')
    .substring(0, 100);
  const cleanExt = parsed.ext.replace(/[^a-zA-Z0-9.]/g, '').toLowerCase();
  return `${cleanName}${cleanExt}`;
}

function generateSafeFileName(originalName) {
  const ext = getSafeFileExtension(originalName);
  const timestamp = Date.now();
  const randomStr = Math.floor(100000 + Math.random() * 900000);
  return `qmw_${timestamp}_${randomStr}${ext}`;
}

function isFileSizeAllowed(size) {
  if (typeof size !== 'number') return false;
  return size <= MAX_FILE_SIZE;
}

function validateUploadedFile(file) {
  if (!file) {
    return { valid: false, reason: 'No file provided.' };
  }

  // 1. Validate File Size
  if (!isFileSizeAllowed(file.size)) {
    return { valid: false, reason: 'File size exceeds maximum limit of 5MB.' };
  }

  // 2. Validate Extension
  const ext = getSafeFileExtension(file.originalname);
  if (BLOCKED_EXTENSIONS.includes(ext)) {
    return { valid: false, reason: `Files with extension ${ext} are blocked for security.` };
  }
  if (!isAllowedExtension(file.originalname)) {
    return { valid: false, reason: `File extension ${ext} is not allowed. Only images are permitted.` };
  }

  // 3. Validate MIME Type
  if (!isAllowedMimeType(file.mimetype)) {
    return { valid: false, reason: `MIME type ${file.mimetype} is not allowed. Only images are permitted.` };
  }

  return { valid: true };
}

module.exports = {
  isAllowedMimeType,
  isAllowedExtension,
  getSafeFileExtension,
  sanitizeFileName,
  generateSafeFileName,
  isFileSizeAllowed,
  validateUploadedFile
};
