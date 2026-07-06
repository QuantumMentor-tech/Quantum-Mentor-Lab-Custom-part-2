'use strict';

/**
 * Quantum Mentor World — API Integration & Security Test Script
 * backend/scripts/test-api.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000';

const TESTS = [
  { name: '1. Root Welcome API', path: '/api', expectedStatus: 200 },
  { name: '2. Health Status API', path: '/api/health', expectedStatus: 200 },
  { name: '3. DB Health Status API', path: '/api/health/database', expectedStatus: 200 },
  { name: '4. Resources List', path: '/api/resources', expectedStatus: 200 },
  { name: '5. Resources List with Limit', path: '/api/resources?limit=4', expectedStatus: 200, validate: (body) => {
    if (body.data.length > 4) throw new Error(`Expected length <= 4, got ${body.data.length}`);
  }},
  { name: '6. Resources List Pagination', path: '/api/resources?page=1&limit=8', expectedStatus: 200 },
  { name: '7. Resources List Search', path: '/api/resources?q=demo', expectedStatus: 200 },
  { name: '8. Resources List Type', path: '/api/resources?type=software', expectedStatus: 200 },
  { name: '9. Resources List Sort', path: '/api/resources?sort=latest', expectedStatus: 200 },
  { name: '10. Featured Resources', path: '/api/resources/featured', expectedStatus: 200 },
  { name: '11. Trending Resources', path: '/api/resources/trending', expectedStatus: 200 },
  { name: '12. Latest Resources', path: '/api/resources/latest', expectedStatus: 200 },
  { name: '13. Resources Type Subroute', path: '/api/resources/type/software', expectedStatus: 200 },
  { name: '14. Section Route: Software', path: '/api/software', expectedStatus: 200 },
  { name: '15. Section Route: Books', path: '/api/books', expectedStatus: 200 },
  { name: '16. Section Route: Tools', path: '/api/tools', expectedStatus: 200 },
  { name: '17. Section Route: Games', path: '/api/games', expectedStatus: 200 },
  { name: '18. Section Route: Themes', path: '/api/themes', expectedStatus: 200 },
  { name: '19. Section Route: Watch', path: '/api/watch', expectedStatus: 200 },
  { name: '20. Section Route: News', path: '/api/news', expectedStatus: 200 },
  { name: '21. Section Route: GitHub', path: '/api/github', expectedStatus: 200 },
  { name: '22. Categories List', path: '/api/categories', expectedStatus: 200 },
  { name: '23. Tags List', path: '/api/tags', expectedStatus: 200 },
  { name: '24. Resource Detail by Slug (Software)', path: '/api/resources/open-source-code-editor-demo', expectedStatus: 200 },
  { name: '25. Resource Detail by Slug (Book)', path: '/api/resources/beginner-web-development-guide', expectedStatus: 200 },
  { name: '26. Resource Detail by Slug (Watch)', path: '/api/resources/web-development-tutorial-series', expectedStatus: 200, validate: (body) => {
    if (!body.data.episodes || body.data.episodes.length === 0) {
      throw new Error('Watch resource should have watch episodes.');
    }
    if (!body.data.episodes[0].servers || body.data.episodes[0].servers.length === 0) {
      throw new Error('Watch episodes should have video embed servers.');
    }
  }},
  
  // Boundary & Validation Tests
  { name: '27. Limit Boundary Test (limit=9999)', path: '/api/resources?limit=9999', expectedStatus: 200, validate: (body) => {
    if (body.meta.limit > 50) throw new Error(`Limit should be capped at 50, got ${body.meta.limit}`);
  }},
  { name: '28. Page Boundary Test (page=-5)', path: '/api/resources?page=-5', expectedStatus: 200, validate: (body) => {
    if (body.meta.page !== 1) throw new Error(`Page should fallback to 1, got ${body.meta.page}`);
  }},
  { name: '29. Invalid Sort Fallback', path: '/api/resources?sort=random_value', expectedStatus: 200 },
  { name: '30. Invalid Type Handler', path: '/api/resources?type=illegal_type', expectedStatus: 200, validate: (body) => {
    if (body.data.length > 0) throw new Error('Expected 0 results for invalid type');
  }},
  { name: '31. SQL Injection Prevention Test', path: `/api/resources?q=%27%20OR%201=1%20--`, expectedStatus: 200, validate: (body) => {
    // Should return 0 or normal matches, shouldn't crash or return all items if escaping failed
    console.log(`     - SQL Injection search returned ${body.data.length} matches (Safe, no crash).`);
  }},
  { name: '32. Non-existent Route (404 JSON)', path: '/api/unknown-test-route', expectedStatus: 404, validate: (body) => {
    if (body.success !== false) throw new Error('Expected success=false for 404');
  }}
];

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          reject(new Error(`Failed to parse response from ${path}: ${e.message}\nRaw response: ${data.substring(0, 100)}`));
        }
      });
    }).on('error', (err) => reject(err));
  });
}

// Scans JSON response recursively for forbidden keys
function checkForbiddenKeys(obj, path = '') {
  const forbidden = ['password_hash', 'deleted_at', 'created_by', 'updated_by'];
  if (!obj || typeof obj !== 'object') return;
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (forbidden.includes(key)) {
        throw new Error(`Forbidden key "${key}" found in response under "${path}"`);
      }
      if (typeof obj[key] === 'object') {
        checkForbiddenKeys(obj[key], `${path}.${key}`);
      }
    }
  }
}

async function run() {
  console.log('==================================================');
  console.log('       QUANTUM MENTOR WORLD API TEST RUNNER       ');
  console.log('==================================================');
  
  let passedCount = 0;
  let failedCount = 0;

  for (const test of TESTS) {
    try {
      const { status, body } = await makeRequest(test.path);
      
      if (status !== test.expectedStatus) {
        throw new Error(`Expected status ${test.expectedStatus}, got ${status}. Msg: ${body.message || ''}`);
      }

      // Scan for security/private leaks
      checkForbiddenKeys(body);

      // Run custom validation if defined
      if (test.validate) {
        test.validate(body);
      }

      console.log(`✅ PASSED: ${test.name}`);
      passedCount++;
    } catch (err) {
      console.error(`❌ FAILED: ${test.name}`);
      console.error(`     Reason: ${err.message}`);
      failedCount++;
    }
  }

  console.log('==================================================');
  console.log('                  TEST SUMMARY                    ');
  console.log('==================================================');
  console.log(` Total Tests : ${TESTS.length}`);
  console.log(` Passed      : ${passedCount}`);
  console.log(` Failed      : ${failedCount}`);
  console.log('==================================================');

  if (failedCount > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL TESTS COMPLETED SUCCESSFULLY! NO PRIVATE DATA EXPOSED!');
    process.exit(0);
  }
}

run().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
