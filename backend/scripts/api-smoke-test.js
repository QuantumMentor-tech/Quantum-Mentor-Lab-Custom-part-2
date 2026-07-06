'use strict';

/**
 * Quantum Mentor World — API Smoke Test Script
 * scripts/api-smoke-test.js
 *
 * Verifies key public API endpoints respond successfully (200 status, valid JSON structure,
 * and no database errors) to prevent regression before launch.
 */

const http = require('http');
const env = require('../config/env');

const PORT = env.port || 5000;
const BASE_URL = `http://localhost:${PORT}`;

const targets = [
  { name: 'Health Endpoint', path: '/api/health' },
  { name: 'Database Health', path: '/api/health/database' },
  { name: 'Resources List', path: '/api/resources' },
  { name: 'Categories List', path: '/api/categories' },
  { name: 'Tags List', path: '/api/tags' }
];

console.log('==================================================');
console.log('🔍 QUANTUM MENTOR WORLD API SMOKE TEST');
console.log('==================================================\n');

function pingEndpoint(target) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${target.path}`;
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          resolve({
            success: false,
            message: `Expected 200 OK, got status ${res.statusCode}`
          });
          return;
        }

        try {
          const json = JSON.parse(data);
          if (json.success === false) {
            resolve({
              success: false,
              message: `API returned success=false: "${json.message || 'No details'}"`
            });
            return;
          }

          resolve({
            success: true,
            message: `Responded with 200 OK & valid JSON structure.`
          });
        } catch (err) {
          resolve({
            success: false,
            message: `Invalid JSON response: ${err.message}`
          });
        }
      });
    }).on('error', (err) => {
      resolve({
        success: false,
        message: `Network/Connection Error: ${err.message}`
      });
    });
  });
}

async function runSmokeTests() {
  let failed = 0;
  console.log(`Running smoke tests against base URL: ${BASE_URL}\n`);

  for (const target of targets) {
    process.stdout.write(`Testing ${target.name} (${target.path})... `);
    const result = await pingEndpoint(target);
    if (result.success) {
      console.log('✅ PASSED');
    } else {
      console.log('❌ FAILED');
      console.log(`   └─ Reason: ${result.message}`);
      failed++;
    }
  }

  console.log('\n--------------------------------------------------');
  if (failed > 0) {
    console.error(`❌ SMOKE TEST FAILED: ${failed} endpoints are unreachable or misconfigured.`);
    console.error(`Please ensure the server is running ("npm run dev" or "npm start").`);
    process.exit(1);
  } else {
    console.log('🎉 ALL SMOKE TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  }
}

runSmokeTests();
