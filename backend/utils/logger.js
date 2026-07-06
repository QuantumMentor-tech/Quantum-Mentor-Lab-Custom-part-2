'use strict';

/**
 * Quantum Mentor World — Logger Utility
 * utils/logger.js
 *
 * Simple console logger with log levels and timestamp prefixing.
 * Strictly avoids printing passwords or sensitive JWT parameters.
 */

const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL] ?? LOG_LEVELS.info;

function timestamp() {
  return new Date().toISOString();
}

/**
 * Cleanly formats log inputs, converting objects/meta parameters to JSON.
 */
function formatLog(message, meta) {
  let output = `[${timestamp()}] ${message}`;
  
  if (meta !== undefined && meta !== null) {
    if (typeof meta === 'object') {
      try {
        // Prevent logging passwords or secrets
        const cleanMeta = JSON.parse(JSON.stringify(meta));
        const sensitiveKeys = ['password', 'password_hash', 'token', 'jwt', 'secret', 'db_password'];
        
        const sanitizeObject = (obj) => {
          for (const key in obj) {
            if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
              obj[key] = '[REDACTED]';
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
              sanitizeObject(obj[key]);
            }
          }
        };
        
        sanitizeObject(cleanMeta);
        output += ` | Meta: ${JSON.stringify(cleanMeta)}`;
      } catch (err) {
        output += ` | Meta: [Unserializable Object]`;
      }
    } else {
      output += ` | Meta: ${meta}`;
    }
  }
  return output;
}

const logger = {
  error: (message, meta) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.error) {
      console.error(`[ERROR] ${formatLog(message, meta)}`);
    }
  },
  warn: (message, meta) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.warn) {
      console.warn(`[WARN]  ${formatLog(message, meta)}`);
    }
  },
  info: (message, meta) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.info) {
      console.log(`[INFO]  ${formatLog(message, meta)}`);
    }
  },
  debug: (message, meta) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.debug) {
      console.log(`[DEBUG] ${formatLog(message, meta)}`);
    }
  }
};

module.exports = logger;
