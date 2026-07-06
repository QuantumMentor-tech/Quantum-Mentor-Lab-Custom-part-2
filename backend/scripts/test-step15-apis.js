'use strict';

/**
 * Quantum Mentor World — Step 15 Endpoints Integration & Security Test Script
 * backend/scripts/test-step15-apis.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

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
        ...headers
      }
    };

    if (body && !headers['Content-Type']) {
      options.headers['Content-Type'] = 'application/json';
    }

    const req = http.request(options, (res) => {
      let data = [];
      res.on('data', (chunk) => { data.push(chunk); });
      res.on('end', () => {
        const buffer = Buffer.concat(data);
        const dataStr = buffer.toString('utf8');
        try {
          resolve({
            statusCode: res.statusCode,
            body: JSON.parse(dataStr)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: dataStr
          });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      if (Buffer.isBuffer(body)) {
        req.write(body);
      } else if (typeof body === 'object') {
        req.write(JSON.stringify(body));
      } else {
        req.write(body);
      }
    }
    req.end();
  });
}

async function runTests() {
  console.log('==================================================');
  console.log('    QUANTUM MENTOR WORLD - STEP 15 TEST RUNNER    ');
  console.log('==================================================');

  let passed = 0;
  let failed = 0;
  let adminToken = '';
  let uploadedMediaId = null;
  let contactMessageId = null;
  let reportId = null;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ PASSED: ${name}`);
      passed++;
    } catch (err) {
      console.log(`❌ FAILED: ${name}`);
      console.error(err.message || err);
      failed++;
    }
  };

  // --- SECTION A: ADMIN LOGIN & PROTECTION ---
  await test('1. Admin Login (Retrieve JWT Token)', async () => {
    const res = await makeRequest(`${API_BASE}/auth/login`, 'POST', {}, {
      email: 'admin@quantummentor.local',
      password: 'Admin@12345'
    });

    if (res.statusCode !== 200) {
      throw new Error(`Expected HTTP 200, got ${res.statusCode}`);
    }
    if (!res.body.success || !res.body.data || !res.body.data.token) {
      throw new Error('Login failed or did not return token');
    }
    adminToken = res.body.data.token;
  });

  await test('2. Endpoint Access Control (Unauthorized Rejection)', async () => {
    // Media List
    let res = await makeRequest(`${API_BASE}/media`, 'GET');
    if (res.statusCode !== 401) throw new Error(`Media list without auth should be 401, got ${res.statusCode}`);

    // Contact Messages List
    res = await makeRequest(`${API_BASE}/contact/admin/messages`, 'GET');
    if (res.statusCode !== 401) throw new Error(`Contact list without auth should be 401, got ${res.statusCode}`);

    // Reports List
    res = await makeRequest(`${API_BASE}/reports/admin`, 'GET');
    if (res.statusCode !== 401) throw new Error(`Reports list without auth should be 401, got ${res.statusCode}`);
  });

  // --- SECTION B: PUBLIC CONTACT FORM SUBMISSIONS & VALIDATIONS ---
  await test('3. Submit Contact Message (Valid Input)', async () => {
    const res = await makeRequest(`${API_BASE}/contact`, 'POST', {}, {
      full_name: 'Test Submitter',
      email: 'test@example.com',
      subject: 'Integration Testing',
      message: 'Hello, this is a clean automated integration test message body.'
    });

    if (res.statusCode !== 201) throw new Error(`Expected HTTP 201, got ${res.statusCode}`);
    if (!res.body.success || !res.body.data || !res.body.data.id) {
      throw new Error('Message submission response is invalid');
    }
    contactMessageId = res.body.data.id;
  });

  await test('4. Contact Message Validation Checks', async () => {
    // Invalid Email
    let res = await makeRequest(`${API_BASE}/contact`, 'POST', {}, {
      full_name: 'Test Submitter',
      email: 'not-an-email',
      subject: 'Integration Testing',
      message: 'Hello world.'
    });
    if (res.statusCode !== 400) throw new Error(`Expected HTTP 400 for invalid email, got ${res.statusCode}`);

    // Empty fields
    res = await makeRequest(`${API_BASE}/contact`, 'POST', {}, {
      full_name: '',
      email: 'test@example.com',
      subject: 'Integration Testing',
      message: 'Hello world.'
    });
    if (res.statusCode !== 400) throw new Error(`Expected HTTP 400 for empty name, got ${res.statusCode}`);

    res = await makeRequest(`${API_BASE}/contact`, 'POST', {}, {
      full_name: 'Test Submitter',
      email: 'test@example.com',
      subject: 'Integration Testing',
      message: ''
    });
    if (res.statusCode !== 400) throw new Error(`Expected HTTP 400 for empty message, got ${res.statusCode}`);
  });

  // --- SECTION C: PUBLIC RESOURCE REPORTS & VALIDATIONS ---
  await test('5. Submit Resource Report (Valid Input)', async () => {
    const res = await makeRequest(`${API_BASE}/reports`, 'POST', {}, {
      resource_id: 1,
      report_type: 'broken_link',
      message: 'The link number 1 is returning a 404 error.',
      reporter_name: 'Link Auditor',
      reporter_email: 'auditor@example.com'
    });

    if (res.statusCode !== 201) throw new Error(`Expected HTTP 201, got ${res.statusCode}`);
    if (!res.body.success || !res.body.data || !res.body.data.id) {
      throw new Error('Report submission response is invalid');
    }
    reportId = res.body.data.id;
  });

  await test('6. Resource Report Validation Checks', async () => {
    // Invalid Resource ID
    let res = await makeRequest(`${API_BASE}/reports`, 'POST', {}, {
      resource_id: 'not-a-number',
      report_type: 'broken_link',
      message: 'Clean message'
    });
    if (res.statusCode !== 400) throw new Error(`Expected HTTP 400 for invalid resource ID, got ${res.statusCode}`);

    // Invalid Report Type
    res = await makeRequest(`${API_BASE}/reports`, 'POST', {}, {
      resource_id: 1,
      report_type: 'illegal_report_type',
      message: 'Clean message'
    });
    if (res.statusCode !== 400) throw new Error(`Expected HTTP 400 for invalid report type, got ${res.statusCode}`);
  });

  // --- SECTION D: MEDIA UPLOADING & SECURITY CHECKS ---
  await test('7. Media Upload (Valid Image File)', async () => {
    if (!adminToken) throw new Error('Skipping, admin token missing');

    const boundary = '----WebKitFormBoundaryIntegrationTest';
    const fileContent = Buffer.from('GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;'); // Valid 1x1 transparent pixel gif
    
    const multipartBody = Buffer.concat([
      Buffer.from(`--${boundary}\r\n`),
      Buffer.from(`Content-Disposition: form-data; name="image"; filename="integration-test.gif"\r\n`),
      Buffer.from(`Content-Type: image/gif\r\n\r\n`),
      fileContent,
      Buffer.from(`\r\n--${boundary}\r\n`),
      Buffer.from(`Content-Disposition: form-data; name="alt_text"\r\n\r\n`),
      Buffer.from(`Integration Test Alt`),
      Buffer.from(`\r\n--${boundary}\r\n`),
      Buffer.from(`Content-Disposition: form-data; name="caption"\r\n\r\n`),
      Buffer.from(`Integration Test Caption`),
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);

    const res = await makeRequest(`${API_BASE}/media/upload`, 'POST', {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': multipartBody.length,
      'Authorization': `Bearer ${adminToken}`
    }, multipartBody);

    if (res.statusCode !== 201) {
      throw new Error(`Expected HTTP 201, got ${res.statusCode}. Body: ${JSON.stringify(res.body)}`);
    }
    if (!res.body.success || !res.body.data || !res.body.data.id) {
      throw new Error('Upload succeeded but did not return media details');
    }

    uploadedMediaId = res.body.data.id;

    // Check if the uploaded image actually exists in uploads/images folder
    const finalFilePath = path.join(__dirname, '../uploads/images', res.body.data.file_name);
    if (!fs.existsSync(finalFilePath)) {
      throw new Error(`File was not found on server disk at ${finalFilePath}`);
    }
  });

  await test('8. Media Upload Security: Reject Executables', async () => {
    if (!adminToken) throw new Error('Skipping, admin token missing');

    const boundary = '----WebKitFormBoundaryIntegrationTest';
    const fileContent = Buffer.from('echo "malicious executable script"');
    
    const multipartBody = Buffer.concat([
      Buffer.from(`--${boundary}\r\n`),
      Buffer.from(`Content-Disposition: form-data; name="image"; filename="exploit.exe"\r\n`),
      Buffer.from(`Content-Type: application/octet-stream\r\n\r\n`),
      fileContent,
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);

    const res = await makeRequest(`${API_BASE}/media/upload`, 'POST', {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': multipartBody.length,
      'Authorization': `Bearer ${adminToken}`
    }, multipartBody);

    if (res.statusCode !== 400) {
      throw new Error(`Expected HTTP 400 for .exe file, got ${res.statusCode}. Body: ${JSON.stringify(res.body)}`);
    }
  });

  await test('9. Media Upload Security: Reject Oversized Files', async () => {
    if (!adminToken) throw new Error('Skipping, admin token missing');

    const boundary = '----WebKitFormBoundaryIntegrationTest';
    const fileContent = Buffer.alloc(6 * 1024 * 1024); // 6MB of zeroes
    
    const multipartBody = Buffer.concat([
      Buffer.from(`--${boundary}\r\n`),
      Buffer.from(`Content-Disposition: form-data; name="image"; filename="oversized.jpg"\r\n`),
      Buffer.from(`Content-Type: image/jpeg\r\n\r\n`),
      fileContent,
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);

    const res = await makeRequest(`${API_BASE}/media/upload`, 'POST', {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': multipartBody.length,
      'Authorization': `Bearer ${adminToken}`
    }, multipartBody);

    if (res.statusCode !== 400) {
      throw new Error(`Expected HTTP 400 for 6MB file, got ${res.statusCode}`);
    }
  });

  // --- SECTION E: ADMIN MANAGEMENT OPERATIONS (CRUD) ---
  await test('10. Admin Media Operations: Read, Update Alt, and Soft Delete', async () => {
    if (!adminToken || !uploadedMediaId) throw new Error('Skipping, token or media missing');

    // 1. Read
    let res = await makeRequest(`${API_BASE}/media/${uploadedMediaId}`, 'GET', {
      'Authorization': `Bearer ${adminToken}`
    });
    if (res.statusCode !== 200) throw new Error(`Fetch single media failed: ${res.statusCode}`);
    if (res.body.data.alt_text !== 'Integration Test Alt') {
      throw new Error(`Expected alt_text "Integration Test Alt", got "${res.body.data.alt_text}"`);
    }

    // 2. Update Alt Text/Caption
    res = await makeRequest(`${API_BASE}/media/${uploadedMediaId}`, 'PATCH', {
      'Authorization': `Bearer ${adminToken}`
    }, {
      alt_text: 'Updated Alt Text',
      caption: 'Updated Caption'
    });
    if (res.statusCode !== 200) throw new Error(`Update media metadata failed: ${res.statusCode}`);

    // Verify update
    res = await makeRequest(`${API_BASE}/media/${uploadedMediaId}`, 'GET', {
      'Authorization': `Bearer ${adminToken}`
    });
    if (res.body.data.alt_text !== 'Updated Alt Text') {
      throw new Error(`Expected alt_text "Updated Alt Text", got "${res.body.data.alt_text}"`);
    }

    // 3. Deletion (Soft delete)
    res = await makeRequest(`${API_BASE}/media/${uploadedMediaId}`, 'DELETE', {
      'Authorization': `Bearer ${adminToken}`
    });
    if (res.statusCode !== 200) throw new Error(`Delete media failed: ${res.statusCode}`);

    // Check retrieved details returns 404 since it is soft deleted
    res = await makeRequest(`${API_BASE}/media/${uploadedMediaId}`, 'GET', {
      'Authorization': `Bearer ${adminToken}`
    });
    if (res.statusCode !== 404) throw new Error(`Deleted media should return 404, got ${res.statusCode}`);
  });

  await test('11. Admin Contact Inbox Operations: Read, Status Update, and Soft Delete', async () => {
    if (!adminToken || !contactMessageId) throw new Error('Skipping, token or message missing');

    // 1. Read list
    let res = await makeRequest(`${API_BASE}/contact/admin/messages`, 'GET', {
      'Authorization': `Bearer ${adminToken}`
    });
    if (res.statusCode !== 200) throw new Error(`Fetch contact list failed: ${res.statusCode}`);
    
    // Find our message in the list
    const found = res.body.data.some(m => m.id === contactMessageId);
    if (!found) throw new Error(`Submitted message ID ${contactMessageId} not found in contact list`);

    // 2. Read single message detail
    res = await makeRequest(`${API_BASE}/contact/admin/messages/${contactMessageId}`, 'GET', {
      'Authorization': `Bearer ${adminToken}`
    });
    if (res.statusCode !== 200) throw new Error(`Fetch single message failed: ${res.statusCode}`);
    if (res.body.data.full_name !== 'Test Submitter') {
      throw new Error(`Expected name "Test Submitter", got "${res.body.data.full_name}"`);
    }

    // 3. Update status to 'read'
    res = await makeRequest(`${API_BASE}/contact/admin/messages/${contactMessageId}/status`, 'PATCH', {
      'Authorization': `Bearer ${adminToken}`
    }, {
      status: 'read'
    });
    if (res.statusCode !== 200) throw new Error(`Update status failed: ${res.statusCode}`);

    // Verify status update
    res = await makeRequest(`${API_BASE}/contact/admin/messages/${contactMessageId}`, 'GET', {
      'Authorization': `Bearer ${adminToken}`
    });
    if (res.body.data.status !== 'read') {
      throw new Error(`Expected status to be "read", got "${res.body.data.status}"`);
    }

    // 4. Soft Delete
    res = await makeRequest(`${API_BASE}/contact/admin/messages/${contactMessageId}`, 'DELETE', {
      'Authorization': `Bearer ${adminToken}`
    });
    if (res.statusCode !== 200) throw new Error(`Delete contact message failed: ${res.statusCode}`);

    // Check fetch single message details returns 404 since it is soft deleted
    res = await makeRequest(`${API_BASE}/contact/admin/messages/${contactMessageId}`, 'GET', {
      'Authorization': `Bearer ${adminToken}`
    });
    if (res.statusCode !== 404) throw new Error(`Deleted message should return 404, got ${res.statusCode}`);
  });

  await test('12. Admin Resource Report Operations: Read, Status Update, and Soft Delete', async () => {
    if (!adminToken || !reportId) throw new Error('Skipping, token or report missing');

    // 1. Read list
    let res = await makeRequest(`${API_BASE}/reports/admin`, 'GET', {
      'Authorization': `Bearer ${adminToken}`
    });
    if (res.statusCode !== 200) throw new Error(`Fetch report list failed: ${res.statusCode}`);
    
    // Find our report
    const found = res.body.data.some(r => r.id === reportId);
    if (!found) throw new Error(`Submitted report ID ${reportId} not found in reports list`);

    // 2. Read details
    res = await makeRequest(`${API_BASE}/reports/admin/${reportId}`, 'GET', {
      'Authorization': `Bearer ${adminToken}`
    });
    if (res.statusCode !== 200) throw new Error(`Fetch single report failed: ${res.statusCode}`);
    if (res.body.data.report_type !== 'broken_link') {
      throw new Error(`Expected type "broken_link", got "${res.body.data.report_type}"`);
    }

    // 3. Update status to 'reviewing'
    res = await makeRequest(`${API_BASE}/reports/admin/${reportId}/status`, 'PATCH', {
      'Authorization': `Bearer ${adminToken}`
    }, {
      status: 'reviewing'
    });
    if (res.statusCode !== 200) throw new Error(`Update report status failed: ${res.statusCode}`);

    // Verify
    res = await makeRequest(`${API_BASE}/reports/admin/${reportId}`, 'GET', {
      'Authorization': `Bearer ${adminToken}`
    });
    if (res.body.data.status !== 'reviewing') {
      throw new Error(`Expected status "reviewing", got "${res.body.data.status}"`);
    }

    // 4. Soft Delete
    res = await makeRequest(`${API_BASE}/reports/admin/${reportId}`, 'DELETE', {
      'Authorization': `Bearer ${adminToken}`
    });
    if (res.statusCode !== 200) throw new Error(`Delete report failed: ${res.statusCode}`);

    // Check fetch details returns 404
    res = await makeRequest(`${API_BASE}/reports/admin/${reportId}`, 'GET', {
      'Authorization': `Bearer ${adminToken}`
    });
    if (res.statusCode !== 404) throw new Error(`Deleted report should return 404, got ${res.statusCode}`);
  });

  // --- SECTION F: DASHBOARD OVERVIEW ---
  await test('13. Admin Dashboard Overview stats structure', async () => {
    if (!adminToken) throw new Error('Skipping, admin token missing');

    const res = await makeRequest(`${API_BASE}/admin/overview`, 'GET', {
      'Authorization': `Bearer ${adminToken}`
    });

    if (res.statusCode !== 200) {
      throw new Error(`Expected HTTP 200, got ${res.statusCode}`);
    }
    const data = res.body.data;
    if (!data.resources || data.resources.total === undefined) {
      throw new Error('Overview data is missing resource stats counts');
    }
    if (data.contactMessages === undefined || data.contactMessages.newCount === undefined) {
      throw new Error('Overview data is missing contact messages stats counts');
    }
    if (data.reports === undefined || data.reports.newCount === undefined) {
      throw new Error('Overview data is missing reports stats counts');
    }
    console.log(`     - Total resources: ${data.resources.total}`);
    console.log(`     - Categories total: ${data.categories.total}`);
    console.log(`     - Tags total: ${data.tags.total}`);
    console.log(`     - Media total: ${data.media.total}`);
    console.log(`     - New Messages count: ${data.contactMessages.newCount}`);
    console.log(`     - New Reports count: ${data.reports.newCount}`);
  });

  // --- SECTION G: PUBLIC RATE LIMITS ---
  await test('14. Public Submissions Rate Limiter: Contact Form (5 max / 15 mins)', async () => {
    // We already submitted 1 successful message, and 3 failed validation ones.
    // Let's submit enough messages to trigger rate limiting.
    console.log('     - Triggering rate limiter for contact submissions...');
    let rateLimited = false;

    // Submit up to 10 times
    for (let i = 0; i < 10; i++) {
      const res = await makeRequest(`${API_BASE}/contact`, 'POST', {}, {
        full_name: `Rate Limit Test ${i}`,
        email: `ratelimit${i}@example.com`,
        subject: 'Rate Limit testing',
        message: 'A duplicate test message.'
      });
      if (res.statusCode === 429) {
        rateLimited = true;
        break;
      }
    }

    if (!rateLimited) {
      throw new Error('Contact rate limiter did not trigger after multiple attempts');
    }
  });

  await test('15. Public Submissions Rate Limiter: Resource Reports (10 max / 15 mins)', async () => {
    console.log('     - Triggering rate limiter for report submissions...');
    let rateLimited = false;

    // Submit up to 15 times
    for (let i = 0; i < 15; i++) {
      const res = await makeRequest(`${API_BASE}/reports`, 'POST', {}, {
        resource_id: 1,
        report_type: 'wrong_information',
        message: `Rate limit test report message number ${i}`
      });
      if (res.statusCode === 429) {
        rateLimited = true;
        break;
      }
    }

    if (!rateLimited) {
      throw new Error('Reports rate limiter did not trigger after multiple attempts');
    }
  });

  console.log('==================================================');
  console.log(`TEST RUN COMPLETE: ${passed} passed, ${failed} failed`);
  console.log('==================================================');
}

runTests().catch(err => {
  console.error('Fatal test execution error:', err);
  process.exit(1);
});
