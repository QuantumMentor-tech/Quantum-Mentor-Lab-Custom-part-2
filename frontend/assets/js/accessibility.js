'use strict';

/**
 * Quantum Mentor World — Accessibility Helpers
 * assets/js/accessibility.js
 *
 * Implements modal focus-traps, Escape-key listeners, visual keyboard focus tracking,
 * and semantic checklist warnings in development mode.
 */

/**
 * Traps focus within a given container element (usually a modal overlay).
 * Useful for screen readers and keyboard navigation users.
 * @param {HTMLElement} container 
 */
function trapFocus(container) {
  if (!container) return;

  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusableElements = container.querySelectorAll(focusableSelectors);
  
  if (focusableElements.length === 0) return;
  
  const firstFocusableEl = focusableElements[0];
  const lastFocusableEl = focusableElements[focusableElements.length - 1];

  // Set initial focus
  firstFocusableEl.focus();

  container.addEventListener('keydown', function(e) {
    const isTabPressed = (e.key === 'Tab' || e.keyCode === 9);

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) { // Shift + Tab
      if (document.activeElement === firstFocusableEl) {
        lastFocusableEl.focus();
        e.preventDefault();
      }
    } else { // Tab
      if (document.activeElement === lastFocusableEl) {
        firstFocusableEl.focus();
        e.preventDefault();
      }
    }
  });
}

/**
 * Setup keyboard listener to close open modals/overlays when Escape is pressed.
 */
function setupEscapeKeyListener() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.keyCode === 27) {
      // Find open modal or warning dialog
      const activeBackdrop = document.querySelector('.modal-backdrop, .admin-modal-backdrop, #link-modal-backdrop');
      if (activeBackdrop) {
        activeBackdrop.remove();
        console.log('♿ Accessibility: Closed active modal using Escape key.');
      }
    }
  });
}

/**
 * Adds dynamic visually-hidden screen reader announcer.
 * @param {string} text 
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(text, priority = 'polite') {
  let announcer = document.getElementById('sr-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.position = 'absolute';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.padding = '0';
    announcer.style.margin = '-1px';
    announcer.style.overflow = 'hidden';
    announcer.style.clip = 'rect(0, 0, 0, 0)';
    announcer.style.whiteSpace = 'nowrap';
    announcer.style.border = '0';
    document.body.appendChild(announcer);
  }
  announcer.textContent = text;
}

/**
 * Initialize accessibility adjustments
 */
function initAccessibilityHelpers() {
  setupEscapeKeyListener();
  
  // Apply ARIA attributes to search form if it exists
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.setAttribute('aria-label', 'Search Resources');
    searchInput.setAttribute('placeholder', 'Type tags, categories, or names...');
  }

  console.log('♿ Accessibility optimization helpers initialized.');
}

// Auto-run accessibility tools
document.addEventListener('DOMContentLoaded', initAccessibilityHelpers);

// Expose tools
window.AccessibilityUtils = {
  trapFocus,
  announceToScreenReader,
  initAccessibilityHelpers
};
