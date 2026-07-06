'use strict';

/**
 * Quantum Mentor World — Auth Endpoints Verification Test Script
 */

const http = require('http');

const API_BASE = 'http://localhost:5000/api';

async function makeRequest(url, method, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('==================================================');
  console.log('      QUANTUM MENTOR WORLD AUTH TEST RUNNER      ');
  console.log('==================================================');

  let passed = 0;
  let failed = 0;
  let token = '';

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ PASSED: ${name}`);
      passed++;
    } catch (err) {
      console.log(`❌ FAILED: ${name}`);
      console.error(err);
      failed++;
    }
  };

  // Test 1: Successful Login
  await test('1. Admin Login (Correct Credentials)', async () => {
    const res = await makeRequest(`${API_BASE}/auth/login`, 'POST', {}, {
      email: 'admin@quantummentor.local',
      password: 'Admin@12345'
    });
    
    if (res.statusCode !== 200) {
      throw new Error(`Expected HTTP 200, got ${res.statusCode}`);
    }
    if (!res.body.success) {
      throw new Error(`Expected success = true, got ${res.body.success}`);
    }
    if (!res.body.data || !res.body.data.token) {
      throw new Error('Response did not contain token');
    }
    if (res.body.data.user.password_hash) {
      throw new Error('Exposed password_hash in response');
    }
    token = res.body.data.token;
  });

  // Test 2: Failed Login (Wrong Password)
  await test('2. Admin Login (Incorrect Password)', async () => {
    const res = await makeRequest(`${API_BASE}/auth/login`, 'POST', {}, {
      email: 'admin@quantummentor.local',
      password: 'WrongPassword@123'
    });
    
    if (res.statusCode !== 401) {
      throw new Error(`Expected HTTP 401, got ${res.statusCode}`);
    }
    if (res.body.success) {
      throw new Error('Expected success = false');
    }
    if (res.body.message !== 'Invalid email or password.') {
      throw new Error(`Expected message "Invalid email or password.", got "${res.body.message}"`);
    }
  });

  // Test 3: Failed Login (Non-existent Email)
  await test('3. Admin Login (Non-existent Email)', async () => {
    const res = await makeRequest(`${API_BASE}/auth/login`, 'POST', {}, {
      email: 'fake_email@quantummentor.local',
      password: 'Admin@12345'
    });
    
    if (res.statusCode !== 401) {
      throw new Error(`Expected HTTP 401, got ${res.statusCode}`);
    }
    if (res.body.success) {
      throw new Error('Expected success = false');
    }
    if (res.body.message !== 'Invalid email or password.') {
      throw new Error(`Expected generic message, got "${res.body.message}"`);
    }
  });

  // Test 4: Current User (Valid Token)
  await test('4. Fetch Current User Profile (Valid Token)', async () => {
    if (!token) throw new Error('Skipping, token not fetched');
    const res = await makeRequest(`${API_BASE}/auth/me`, 'GET', {
      'Authorization': `Bearer ${token}`
    });
    
    if (res.statusCode !== 200) {
      throw new Error(`Expected HTTP 200, got ${res.statusCode}`);
    }
    if (!res.body.success) {
      throw new Error('Expected success = true');
    }
    if (res.body.data.user.email !== 'admin@quantummentor.local') {
      throw new Error(`Expected admin email, got ${res.body.data.user.email}`);
    }
    if (res.body.data.user.password_hash) {
      throw new Error('Exposed password_hash');
    }
  });

  // Test 5: Current User (Invalid Token)
  await test('5. Fetch Current User Profile (Invalid Token)', async () => {
    const res = await makeRequest(`${API_BASE}/auth/me`, 'GET', {
      'Authorization': 'Bearer invalid_signature_token'
    });
    
    if (res.statusCode !== 401) {
      throw new Error(`Expected HTTP 401, got ${res.statusCode}`);
    }
    if (res.body.success) {
      throw new Error('Expected success = false');
    }
  });

  // Test 6: Protected Admin Endpoint (Valid Token)
  await test('6. Access Admin Diagnostics API (Valid Token)', async () => {
    if (!token) throw new Error('Skipping, token not fetched');
    const res = await makeRequest(`${API_BASE}/admin`, 'GET', {
      'Authorization': `Bearer ${token}`
    });
    
    if (res.statusCode !== 200) {
      throw new Error(`Expected HTTP 200, got ${res.statusCode}`);
    }
    if (!res.body.success) {
      throw new Error('Expected success = true');
    }
    if (res.body.data.user.role !== 'admin') {
      throw new Error(`Expected role admin, got ${res.body.data.user.role}`);
    }
  });

  // Test 7: Protected Admin Endpoint (Without Token)
  await test('7. Access Admin Diagnostics API (Without Token)', async () => {
    const res = await makeRequest(`${API_BASE}/admin`, 'GET');
    
    if (res.statusCode !== 401) {
      throw new Error(`Expected HTTP 401, got ${res.statusCode}`);
    }
    if (res.body.success) {
      throw new Error('Expected success = false');
    }
  });

  // Test 8: Logout Endpoint
  await test('8. Logout Endpoint', async () => {
    if (!token) throw new Error('Skipping, token not fetched');
    const res = await makeRequest(`${API_BASE}/auth/logout`, 'POST', {
      'Authorization': `Bearer ${token}`
    });
    
    if (res.statusCode !== 200) {
      throw new Error(`Expected HTTP 200, got ${res.statusCode}`);
    }
    if (!res.body.success) {
      throw new Error('Expected success = true');
    }
  });

  console.log('==================================================');
  console.log('                  TEST SUMMARY                    ');
  console.log('==================================================');
  console.log(` Total Tests : ${passed + failed}`);
  console.log(` Passed      : ${passed}`);
  console.log(` Failed      : ${failed}`);
  console.log('==================================================');
  
  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL AUTH TESTS COMPLETED SUCCESSFULLY!');
    process.exit(0);
  }
}

runTests().catch(console.error);
