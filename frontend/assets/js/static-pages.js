'use strict';

/**
 * Quantum Mentor World — Static Pages Script
 * assets/js/static-pages.js
 *
 * Implements common dynamic enhancements, warning banners highlighting,
 * and link triggers for disclaimer, privacy, contact, and about views.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStaticPage();
});

function initStaticPage() {
  // Highlight important caution/disclaimer boxes
  highlightLegalWarnings();

  // Setup smooth scrolls and links
  bindStaticPageLinks();
}

function highlightLegalWarnings() {
  const warningBoxes = document.querySelectorAll('.static-warning-box');
  warningBoxes.forEach(box => {
    // Add dynamic micro-animation class on mount
    box.style.opacity = '0';
    box.style.transform = 'translateY(10px)';
    box.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    setTimeout(() => {
      box.style.opacity = '1';
      box.style.transform = 'translateY(0)';
    }, 100);
  });
}

function bindStaticPageLinks() {
  const links = document.querySelectorAll('.static-link-grid a');
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateY(-2px)';
    });
    link.addEventListener('mouseleave', () => {
      link.style.transform = 'translateY(0)';
    });
  });
}
