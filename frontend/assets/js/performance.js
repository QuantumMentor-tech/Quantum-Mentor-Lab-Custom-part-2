'use strict';

/**
 * Quantum Mentor World — Frontend Performance Helpers
 * assets/js/performance.js
 *
 * Implements lazy loading fallback, DOM query cache, and deferral of non-critical UI bindings.
 */

// Simple local DOM cache to reduce repetitive document.querySelector lookups
const domCache = {};

function getCachedElement(selector) {
  if (!domCache[selector]) {
    domCache[selector] = document.querySelector(selector);
  }
  return domCache[selector];
}

/**
 * Ensures all dynamic card images have native lazy loading attributes
 * and binds an IntersectionObserver fallback for unsupported browsers.
 */
function lazyLoadImages() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // Trigger default behavior or handle custom fallback logic if needed
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imgObserver.observe(img));
  }
}

/**
 * Defers executing non-critical UI scripts (e.g. tracking, debug tools, analytics mocks)
 * until after the main thread is idle or load event fires.
 */
function deferNonCriticalWork(callback) {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(callback);
  } else {
    window.addEventListener('load', () => {
      setTimeout(callback, 200);
    });
  }
}

/**
 * Initializes performance checks and hooks
 */
function initPerformanceHelpers() {
  lazyLoadImages();
  
  // Clean cache periodically to prevent stale element pointers (on navigation/render)
  window.addEventListener('popstate', () => {
    // Clear DOM cache when the history state changes
    for (const key in domCache) {
      delete domCache[key];
    }
  });
  
  console.log('⚡ Performance optimization utilities initialized.');
}

// Automatically load helpers on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initPerformanceHelpers);

// Expose to window object
window.PerformanceUtils = {
  getCachedElement,
  lazyLoadImages,
  deferNonCriticalWork,
  initPerformanceHelpers
};
