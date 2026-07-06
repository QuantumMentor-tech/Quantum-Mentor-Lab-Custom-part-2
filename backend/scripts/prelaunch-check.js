'use strict';

/**
 * Quantum Mentor World — Pre-Launch Readiness Auditor
 * scripts/prelaunch-check.js
 *
 * Runs health diagnostics on active databases, environments, public APIs,
 * upload folders, and whitelists, returning PASS/WARN/FAIL statuses.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const env = require('../config/env');
const mysql = require('mysql2/promise');

console.log('==================================================');
console.log('🔍 PRE-LAUNCH DIAGNOSTICS & READINESS AUDIT');
console.log('==================================================\n');

const requiredTables = [
  'users',
  'resources',
  'resource_details',
  'categories',
  'tags',
  'resource_links',
  'media',
  'contact_messages',
  'resource_reports',
  'site_settings',
  'admin_activity_logs'
];

function printStatus(checkName, status, details = '') {
  const pad = 40;
  const dots = '.'.repeat(Math.max(2, pad - checkName.length));
  let statusText = '';
  
  if (status === 'PASS') {
    statusText = '🟢 PASS';
  } else if (status === 'WARN') {
    statusText = '🟡 WARN';
  } else {
    statusText = '🔴 FAIL';
  }
  
  console.log(`${checkName}${dots}${statusText} ${details ? `(${details})` : ''}`);
}

async function runAudit() {
  let failCount = 0;
  let warnCount = 0;

  // 1. Environment mode
  const nodeEnv = env.nodeEnv;
  if (nodeEnv === 'production') {
    printStatus('Environment Mode (NODE_ENV)', 'PASS', 'production');
  } else {
    printStatus('Environment Mode (NODE_ENV)', 'WARN', `using "${nodeEnv}" - change to production for launch`);
    warnCount++;
  }

  // 2. JWT Secret checks
  const secret = env.jwt.secret;
  const isDefaultSecret = [
    'change_this_secret_before_production',
    'change_this_secret_in_real_project',
    'secret',
    'supersecret',
    '12345678',
    'admin'
  ].some(sec => secret.toLowerCase().includes(sec) || secret.length < 12);

  if (isDefaultSecret) {
    if (nodeEnv === 'production') {
      printStatus('JWT Secret Strength', 'FAIL', 'default or weak key in production!');
      failCount++;
    } else {
      printStatus('JWT Secret Strength', 'WARN', 'weak key detected - change before launching');
      warnCount++;
    }
  } else {
    printStatus('JWT Secret Strength', 'PASS', 'high-entropy password verified');
  }

  // 3. Database Check
  let connection;
  let dbConnected = false;
  try {
    connection = await mysql.createConnection({
      host: env.db.host,
      port: env.db.port,
      database: env.db.name,
      user: env.db.user,
      password: env.db.password
    });
    printStatus('Database Connection', 'PASS', `${env.db.host}:${env.db.port}`);
    dbConnected = true;
  } catch (err) {
    printStatus('Database Connection', 'FAIL', err.message);
    failCount++;
  }

  // 4. Tables check
  if (dbConnected && connection) {
    try {
      const [rows] = await connection.execute('SHOW TABLES');
      const existingTables = rows.map(row => Object.values(row)[0]);
      let missing = [];
      requiredTables.forEach(t => {
        if (!existingTables.includes(t)) {
          missing.push(t);
        }
      });
      if (missing.length === 0) {
        printStatus('Database Table Integrity', 'PASS', 'all 11 required tables exist');
      } else {
        printStatus('Database Table Integrity', 'FAIL', `missing: ${missing.join(', ')}`);
        failCount++;
      }
    } catch (err) {
      printStatus('Database Table Integrity', 'FAIL', err.message);
      failCount++;
    } finally {
      await connection.end();
    }
  } else {
    printStatus('Database Table Integrity', 'FAIL', 'skipping due to database connection failure');
    failCount++;
  }

  // 5. Uploads storage
  const uploadPath = path.join(__dirname, '../', env.uploadDir);
  if (fs.existsSync(uploadPath)) {
    printStatus('Uploads Storage Folder', 'PASS', `exists at ${env.uploadDir}`);
  } else {
    try {
      fs.mkdirSync(uploadPath, { recursive: true });
      printStatus('Uploads Storage Folder', 'PASS', `created automatically at ${env.uploadDir}`);
    } catch (err) {
      printStatus('Uploads Storage Folder', 'FAIL', `missing and cannot create: ${err.message}`);
      failCount++;
    }
  }

  // 6. Frontend variables configuration
  if (env.frontendUrl) {
    printStatus('Frontend Host Configuration', 'PASS', env.frontendUrl);
  } else {
    printStatus('Frontend Host Configuration', 'FAIL', 'FRONTEND_URL is empty');
    failCount++;
  }

  // 7. CORS Origins whitelist config
  if (env.allowedOrigins && env.allowedOrigins.length > 0) {
    const list = env.allowedOrigins.join(', ');
    if (env.allowedOrigins.includes('*') && nodeEnv === 'production') {
      printStatus('CORS Allowed Origins', 'FAIL', 'wildcard "*" disallowed in production!');
      failCount++;
    } else {
      printStatus('CORS Allowed Origins', 'PASS', `${env.allowedOrigins.length} whitelist domains configured`);
    }
  } else {
    printStatus('CORS Allowed Origins', 'WARN', 'no origins set, will fallback to localhost defaults');
    warnCount++;
  }

  // 8. Public API Server Active Check
  const pingUrl = `http://localhost:${env.port}/api/health`;
  const pingPromise = new Promise((resolve) => {
    http.get(pingUrl, (res) => {
      resolve({ status: res.statusCode });
    }).on('error', (err) => {
      resolve({ status: 0, error: err.message });
    });
  });

  const apiStatus = await pingPromise;
  if (apiStatus.status === 200) {
    printStatus('Running API Server Check', 'PASS', 'local backend server active and responding');
  } else {
    printStatus('Running API Server Check', 'WARN', `local backend inactive (is node server running?)`);
    warnCount++;
  }

  console.log('\n--------------------------------------------------');
  console.log('READY FOR DEPLOYMENT AUDIT RESULT:');
  console.log(`- Failures : ${failCount}`);
  console.log(`- Warnings : ${warnCount}`);
  console.log('--------------------------------------------------');

  if (failCount > 0) {
    console.error('\n❌ READINESS FAILED: Critical configuration blockers detected. Fix before deployment.');
    process.exit(1);
  } else if (warnCount > 0) {
    console.warn('\n⚠️ READINESS VERIFIED WITH WARNINGS: Review warning points before production release.');
    process.exit(0);
  } else {
    console.log('\n🎉 READY FOR LAUNCH! All deployment readiness checks passed successfully!');
    process.exit(0);
  }
}

runAudit();
