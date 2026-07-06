'use strict';

/**
 * Quantum Mentor World — Admin Settings Model
 * models/adminSettings.model.js
 */

const { query, withTransaction } = require('../config/db');

// List of allowed configuration keys
const ALLOWED_KEYS = [
  'site_name',
  'brand_name',
  'site_tagline',
  'site_email',
  'legal_notice',
  'footer_text',
  'allow_user_reports',
  'maintenance_mode'
];

/**
 * Fetches all settings as a key-value dictionary object.
 * @returns {Promise<Object>} Settings key-value dictionary
 */
async function getAdminSettings() {
  const rows = await query('SELECT setting_key, setting_value FROM site_settings');
  const settings = {};
  
  rows.forEach(row => {
    settings[row.setting_key] = row.setting_value;
  });
  
  return settings;
}

/**
 * Updates site settings in a transaction.
 * Blocks forbidden secret parameters (e.g. database credentials or secret keys).
 * @param {Object} settings - Key-value configurations
 * @param {number} userId - Auditing user ID
 * @returns {Promise<boolean>}
 */
async function updateSettings(settings, userId) {
  return await withTransaction(async (connection) => {
    for (const [key, value] of Object.entries(settings)) {
      if (!ALLOWED_KEYS.includes(key)) {
        throw new Error(`Unauthorized setting key parameter: ${key}`);
      }

      const sql = 'UPDATE site_settings SET setting_value = ? WHERE setting_key = ?';
      // Normalize values to strings or null
      let normalizedValue = value;
      if (value === true || value === 'true') {
        normalizedValue = 'true';
      } else if (value === false || value === 'false') {
        normalizedValue = 'false';
      } else if (value !== null && value !== undefined) {
        normalizedValue = String(value);
      } else {
        normalizedValue = null;
      }

      await connection.execute(sql, [normalizedValue, key]);
    }
    return true;
  });
}

module.exports = {
  getAdminSettings,
  updateSettings,
  ALLOWED_KEYS
};
