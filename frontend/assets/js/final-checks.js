'use strict';

/**
 * Quantum Mentor World — Frontend Runtime Diagnostics & QA
 * assets/js/final-checks.js
 *
 * Runs non-blocking sanity checks in development mode to highlight markup
 * anomalies, duplicate DOM IDs, missing image alt attributes, and empty anchors.
 */

function runFrontendChecks() {
  // Only execute in local development context
  const isLocal = ['localhost', '127.0.0.1'].some(host => window.location.hostname.includes(host));
  if (!isLocal) return;

  console.groupCollapsed('🔍 FRONTEND QUALITY ASSURANCE & SANITY DIAGNOSTICS');

  // 1. Verify critical containers
  const containers = [
    { selector: 'main', label: 'Main Landmark' },
    { selector: 'header', label: 'Header Landmark' },
    { selector: 'footer', label: 'Footer Landmark' }
  ];
  
  containers.forEach(item => {
    const el = document.querySelector(item.selector);
    if (!el) {
      console.warn(`⚠️ [DOM] Missing semantic <${item.selector}> landmark wrapper.`);
    } else {
      console.log(`✅ [DOM] Semantic landmark <${item.selector}> found.`);
    }
  });

  // 2. Validate Image Alt tags
  const images = document.querySelectorAll('img');
  let missingAlts = 0;
  images.forEach(img => {
    if (!img.getAttribute('alt')) {
      missingAlts++;
      console.warn('⚠️ [Alt Text] Missing "alt" attribute on image element:', img);
    }
  });
  if (missingAlts === 0) {
    console.log('✅ [Alt Text] All image tags feature alt descriptions.');
  }

  // 3. Detect duplicate IDs on active page
  const allElements = document.querySelectorAll('[id]');
  const idCounts = {};
  let duplicates = 0;
  allElements.forEach(el => {
    const id = el.id;
    if (idCounts[id]) {
      duplicates++;
      console.error(`❌ [Duplicate ID] ID "${id}" is declared multiple times in DOM!`);
    } else {
      idCounts[id] = true;
    }
  });
  if (duplicates === 0) {
    console.log('✅ [Duplicate ID] No duplicate IDs detected.');
  }

  // 4. Validate links target and unsafe protocol block
  const links = document.querySelectorAll('a[href]');
  let emptyLinks = 0;
  let unsafeLinks = 0;
  links.forEach(a => {
    const href = a.getAttribute('href').trim();
    if (!href || href === '#' || href.toLowerCase() === 'javascript:void(0)') {
      emptyLinks++;
      console.warn('⚠️ [Navigation] Empty/placeholder link discovered:', a);
    }
    if (['javascript:', 'data:', 'file:'].some(p => href.toLowerCase().startsWith(p))) {
      unsafeLinks++;
      console.error('❌ [Security] Unsafe protocol found in link href attribute:', a);
    }
  });
  console.log(`✅ [Navigation] Checked ${links.length} anchor tags. Unsafe: ${unsafeLinks}, Empty/Placeholder: ${emptyLinks}`);

  // 5. Verify Logo Path presence
  // Look for logo elements specifically
  const logoImgs = document.querySelectorAll('img[src*="logo"]');
  logoImgs.forEach(img => {
    const src = img.getAttribute('src');
    if (src && src.includes('PUT_EXISTING_LOGO_HERE')) {
      console.warn('ℹ️ [Logo] Using existing logo text placeholder file reference.');
    }
  });

  console.groupEnd();
}

// Execute checks shortly after load
window.addEventListener('load', () => {
  setTimeout(runFrontendChecks, 1500);
});
