'use strict';

/**
 * Quantum Mentor World — Environment Hardening Check Script
 * scripts/check-env.js
 *
 * Checks if .env exists, required keys are set, alerts if default JWT secret
 * is used in production, and verifies configurations without exposing secrets.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '../.env');
const envExamplePath = path.join(__dirname, '../.env.example');

console.log('==================================================');
console.log('🔍 ENVIRONMENT CONFIGURATION SECURITY CHECK');
console.log('==================================================\n');

// 1. Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.error('❌ ERROR: .env file does not exist in the backend root directory!');
  console.error(`Please copy .env.example to .env and configure the variables.\n`);
  process.exit(1);
}
console.log('✅ .env file exists.');

// Load environment variables directly from .env
const envConfig = dotenv.parse(fs.readFileSync(envPath));

// Read .env.example keys for comparison
let exampleKeys = [];
if (fs.existsSync(envExamplePath)) {
  const exampleConfig = dotenv.parse(fs.readFileSync(envExamplePath));
  exampleKeys = Object.keys(exampleConfig);
}

// 2. Define required variables
const requiredKeys = [
  'NODE_ENV',
  'PORT',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'FRONTEND_URL',
  'ALLOWED_ORIGINS'
];

let hasErrors = false;
let hasWarnings = false;

// Check each required key
console.log('\nChecking required configuration keys:');
requiredKeys.forEach(key => {
  if (!envConfig[key]) {
    console.error(`❌ MISSING: "${key}" is not set in your .env file.`);
    hasErrors = true;
  } else {
    // Show masked value if relevant, or just status
    if (key === 'JWT_SECRET' || key === 'DB_PASSWORD') {
      console.log(`✅ ${key}: [REDACTED/SECURED]`);
    } else {
      console.log(`✅ ${key}: "${envConfig[key]}"`);
    }
  }
});

// Compare against .env.example
exampleKeys.forEach(key => {
  if (!(key in envConfig)) {
    console.warn(`⚠️ WARNING: Key "${key}" in .env.example is missing from .env (will fall back to code default).`);
    hasWarnings = true;
  }
});

// 3. Security checks
console.log('\nEvaluating security parameters:');
const nodeEnv = envConfig.NODE_ENV || 'development';
const jwtSecret = envConfig.JWT_SECRET || '';
const dbPassword = envConfig.DB_PASSWORD || '';
const allowedOrigins = envConfig.ALLOWED_ORIGINS || '';

// JWT Secret safety check
const isDefaultSecret = [
  'change_this_secret_before_production',
  'change_this_secret_in_real_project',
  'secret',
  'supersecret',
  '12345678',
  'admin'
].some(sec => jwtSecret.toLowerCase().includes(sec) || jwtSecret.length < 12);

if (nodeEnv === 'production') {
  if (isDefaultSecret) {
    console.error('❌ CRITICAL SECURITY RISK: Node environment is set to production but JWT_SECRET is weak, short (<12 chars), or using a default placeholder!');
    hasErrors = true;
  } else {
    console.log('✅ JWT_SECRET security strength is validated.');
  }

  if (!dbPassword || dbPassword === '') {
    console.warn('⚠️ WARNING: DB_PASSWORD is empty in production mode. It is highly recommended to secure MySQL access with a strong password.');
    hasWarnings = true;
  } else {
    console.log('✅ Database credentials set.');
  }

  if (allowedOrigins.includes('*')) {
    console.error('❌ CRITICAL SECURITY RISK: ALLOWED_ORIGINS contains wildcard "*" in production! Limit this to specific domain origins.');
    hasErrors = true;
  } else {
    console.log('✅ Production CORS Allowed Origins are validated.');
  }
} else {
  console.log(`ℹ️ Node environment is "${nodeEnv}".`);
  if (isDefaultSecret) {
    console.warn('⚠️ WARNING: JWT_SECRET is weak/default. This is acceptable for local development but MUST be changed before production release.');
    hasWarnings = true;
  } else {
    console.log('✅ JWT_SECRET security strength is acceptable.');
  }
}

// Allowed origins format validation
if (allowedOrigins) {
  const originsList = allowedOrigins.split(',').map(o => o.trim()).filter(Boolean);
  console.log(`✅ CORS Allowed Origins (${originsList.length} configured):`);
  originsList.forEach(origin => console.log(`   - ${origin}`));
} else {
  console.warn('⚠️ WARNING: ALLOWED_ORIGINS is not defined. Defaults will apply.');
  hasWarnings = true;
}

// Upload parameters
const maxUploadSizeMb = Number(envConfig.MAX_UPLOAD_SIZE_MB) || 5;
console.log(`✅ Max Upload Size: ${maxUploadSizeMb} MB`);

console.log('\n--------------------------------------------------');
if (hasErrors) {
  console.error('❌ ENVIRONMENT CHECK FAILED: Resolve critical security/configuration errors.');
  console.log('--------------------------------------------------');
  process.exit(1);
} else if (hasWarnings) {
  console.warn('⚠️ ENVIRONMENT CHECK PASSED WITH WARNINGS: Review security alerts above.');
  console.log('--------------------------------------------------');
  process.exit(0);
} else {
  console.log('✅ ENVIRONMENT CHECK SUCCESSFUL: Ready for production.');
  console.log('--------------------------------------------------');
  process.exit(0);
}
