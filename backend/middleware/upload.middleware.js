'use strict';

/**
 * Quantum Mentor World — File Upload Middleware
 * middleware/upload.middleware.js
 *
 * Configures multer for image uploads, enforcing Whitelist validation checks.
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sendError } = require('../utils/response');
const {
  validateUploadedFile,
  generateSafeFileName
} = require('../utils/fileSafety');

const UPLOAD_DIR = path.join(__dirname, '../uploads/images');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const safeName = generateSafeFileName(file.originalname);
    cb(null, safeName);
  }
});

function fileFilter(req, file, cb) {
  // Wrap into dummy object structure expected by validatesUploadedFile
  const dummyFile = {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: 0 // Size check is handled by multer limits, filter checks MIME & ext
  };

  const check = validateUploadedFile({
    ...dummyFile,
    size: 1 // dummy size to bypass size validation in filter (multer handles size limit natively)
  });

  if (check.valid) {
    cb(null, true);
  } else {
    cb(new Error(check.reason), false);
  }
}

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter
});

const uploadImage = upload.single('image');

function handleMulterError(err, req, res, next) {
  if (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return sendError(res, 'File is too large. Maximum size allowed is 5MB.', 400);
      }
      return sendError(res, `Upload error: ${err.message}`, 400);
    }
    return sendError(res, err.message, 400);
  }
  next();
}

module.exports = {
  uploadImage,
  handleMulterError
};
