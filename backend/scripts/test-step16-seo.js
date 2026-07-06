'use strict';

/**
 * Quantum Mentor World — Step 16 SEO & Legal Verification Test Script
 * backend/scripts/test-step16-seo.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:5000/api';
const FRONTEND_DIR = path.join(__dirname, '../../frontend');
const ADMIN_DIR = path.join(FRONTEND_DIR, 'admin');

async function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = new URL(url);
    const req = http.request({
      hostname: options.hostname,
      port: options.port,
      path: options.pathname + options.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    }, (res) => {
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
    req.end();
  });
}

async function runTests() {
  console.log('==================================================');
  console.log('    QUANTUM MENTOR WORLD - STEP 16 TEST RUNNER    ');
  console.log('==================================================');

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ PASSED: ${name}`);
      passed++;
    } catch (err) {
      console.log(`❌ FAILED: ${name}`);
      console.error('   ', err.message || err);
      failed++;
    }
  };

  // --- TEST 1: Backend Dynamic Sitemap API ---
  await test('1. GET /api/seo/sitemap-data (Dynamic Sitemap API)', async () => {
    const res = await makeRequest(`${API_BASE}/seo/sitemap-data`);

    if (res.statusCode !== 200) {
      throw new Error(`Expected HTTP 200, got ${res.statusCode}`);
    }
    if (!res.body.success || !res.body.data) {
      throw new Error('Response is missing sitemap dataset payload');
    }

    const { resources, categories, tags } = res.body.data;
    if (!Array.isArray(resources) || !Array.isArray(categories) || !Array.isArray(tags)) {
      throw new Error('Sitemap response properties are not arrays');
    }

    console.log(`     - Dynamic sitemap queries returned:`);
    console.log(`       * ${resources.length} active resources`);
    console.log(`       * ${categories.length} active categories`);
    console.log(`       * ${tags.length} active tags`);
  });

  // --- TEST 2: Robots.txt existence and verification ---
  await test('2. Robots.txt structure & directives check', async () => {
    const robotsPath = path.join(FRONTEND_DIR, 'robots.txt');
    if (!fs.existsSync(robotsPath)) {
      throw new Error('robots.txt does not exist in frontend directory');
    }

    const robots = fs.readFileSync(robotsPath, 'utf8');
    if (!robots.includes('User-agent: *')) {
      throw new Error('robots.txt is missing User-agent definition');
    }
    if (!robots.includes('Allow: /')) {
      throw new Error('robots.txt is missing Allow: / definition');
    }
    if (!robots.includes('Disallow: /admin/')) {
      throw new Error('robots.txt is missing Disallow: /admin/ block');
    }
    if (!robots.includes('Sitemap: https://quantummentorworld.com/sitemap.xml')) {
      throw new Error('robots.txt is missing Sitemap canonical link pointer');
    }
  });

  // --- TEST 3: Sitemap.xml XML structure check ---
  await test('3. Sitemap.xml format & priority weights check', async () => {
    const sitemapPath = path.join(FRONTEND_DIR, 'sitemap.xml');
    if (!fs.existsSync(sitemapPath)) {
      throw new Error('sitemap.xml does not exist in frontend directory');
    }

    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    if (!sitemap.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
      throw new Error('sitemap.xml is missing XML declaration tag');
    }
    if (!sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
      throw new Error('sitemap.xml is missing schema urlset tag');
    }
    if (!sitemap.includes('<loc>https://quantummentorworld.com/</loc>')) {
      throw new Error('sitemap.xml is missing home page loc declaration');
    }
    if (sitemap.includes('/admin/')) {
      throw new Error('sitemap.xml incorrectly indexes administrative dashboard page');
    }
  });

  // --- TEST 4: Admin pages noindex checks ---
  await test('4. Admin Pages Noindex, nofollow, noarchive checks', async () => {
    if (!fs.existsSync(ADMIN_DIR)) {
      throw new Error(`Admin directory missing at ${ADMIN_DIR}`);
    }

    const files = fs.readdirSync(ADMIN_DIR).filter(f => f.endsWith('.html'));
    if (files.length === 0) {
      throw new Error('No admin HTML files found to inspect');
    }

    for (const filename of files) {
      const filePath = path.join(ADMIN_DIR, filename);
      const html = fs.readFileSync(filePath, 'utf8');
      
      const noindexTag = '<meta name="robots" content="noindex, nofollow, noarchive" />';
      if (!html.includes(noindexTag)) {
        throw new Error(`Admin page "admin/${filename}" is missing strict noindex meta tag: ${noindexTag}`);
      }
    }
  });

  // --- TEST 5: Public pages SEO validation & anti-piracy notice check ---
  await test('5. Public Page SEO tags & DMCA Policy Notice check', async () => {
    // 1. Check index page has required head elements
    const indexPath = path.join(FRONTEND_DIR, 'index.html');
    const indexHtml = fs.readFileSync(indexPath, 'utf8');

    if (!indexHtml.includes('<title>')) throw new Error('index.html missing page title tag');
    if (!indexHtml.includes('name="description"')) throw new Error('index.html missing meta description tag');
    if (!indexHtml.includes('rel="canonical"')) throw new Error('index.html missing canonical URL link tag');
    if (!indexHtml.includes('property="og:title"')) throw new Error('index.html missing Open Graph tags');
    if (!indexHtml.includes('name="twitter:card"')) throw new Error('index.html missing Twitter card tags');

    // 2. Check disclaimer page anti-piracy statement compliance
    const disclaimerPath = path.join(FRONTEND_DIR, 'disclaimer.html');
    if (!fs.existsSync(disclaimerPath)) throw new Error('disclaimer.html is missing');
    
    const disclaimerHtml = fs.readFileSync(disclaimerPath, 'utf8');
    const antiPiracyStatement = 'Quantum Mentor World does not intentionally store, promote, or distribute pirated, cracked, nulled, leaked, malware-related, or illegal copyrighted content. The platform is intended for legal educational discovery only.';
    
    if (!disclaimerHtml.includes(antiPiracyStatement)) {
      throw new Error('disclaimer.html is missing the mandatory legal anti-piracy statement');
    }
  });

  // --- TEST 6: Check Javascript helpers references exist ---
  await test('6. Dynamic SEO helpers references validation', async () => {
    // Dynamic pages must load assets/js/seo.js
    const detailPath = path.join(FRONTEND_DIR, 'resource-detail.html');
    const detailHtml = fs.readFileSync(detailPath, 'utf8');
    if (!detailHtml.includes('src="assets/js/seo.js"')) {
      throw new Error('resource-detail.html is missing dynamic SEO script loader: assets/js/seo.js');
    }

    // Static pages must load assets/js/static-pages.js
    const aboutPath = path.join(FRONTEND_DIR, 'about.html');
    const aboutHtml = fs.readFileSync(aboutPath, 'utf8');
    if (!aboutHtml.includes('src="assets/js/static-pages.js"')) {
      throw new Error('about.html is missing static page shared helper: assets/js/static-pages.js');
    }
  });

  console.log('==================================================');
  console.log(`TEST RUN COMPLETE: ${passed} passed, ${failed} failed`);
  console.log('==================================================');
}

runTests().catch(err => {
  console.error('SEO Validation Script failed to run:', err);
  process.exit(1);
});
