'use strict';

/**
 * Quantum Mentor World
 * main.js — Core frontend initialization and shared utilities.
 *
 * Responsibilities:
 *  - DOM ready initialization
 *  - Header and footer injection (future)
 *  - Global event listeners
 *  - Shared utility functions
 */

/* ─── Constants ──────────────────────────────────────────────── */
const APP_NAME = 'Quantum Mentor World';
const API_BASE  = 'http://localhost:5000/api';

/* ─── DOM Ready ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  console.log(`[${APP_NAME}] Frontend initialized.`);
  initPageAnimations();
  initExternalLinkHandler();
  initHomepageSearch();
});

/* ─── Homepage Redirect Search Helper ─────────────────────────── */
function initHomepageSearch() {
  const input = document.getElementById('search-input');
  const button = document.getElementById('search-submit-btn');

  // Verify elements exist and we are on index.html
  if (!input || !button) return;

  const performSearch = () => {
    const query = input.value.trim();
    if (query) {
      window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
  };

  button.addEventListener('click', performSearch);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
}

/* ─── Page Animations ────────────────────────────────────────── */
function initPageAnimations() {
  const animatableEls = document.querySelectorAll('.animate-in');
  if (!animatableEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  animatableEls.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(el);
  });
}

/* ─── External Link Handler ──────────────────────────────────── */
/**
 * Ensures all external links:
 *  1. Open in a new tab (rel="noopener noreferrer")
 *  2. Show the external link notice (future modal)
 */
function initExternalLinkHandler() {
  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    const url = new URL(link.href);
    if (url.hostname !== window.location.hostname) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

/* ─── Utility: Format Date ───────────────────────────────────── */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  });
}

/* ─── Utility: Truncate Text ─────────────────────────────────── */
function truncateText(text, maxLength = 150) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/* ─── Utility: Debounce ──────────────────────────────────────── */
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ─── Utility: Show Toast Notification ──────────────────────── */
function showToast(message, type = 'info') {
  // Placeholder — full implementation in later step
  console.log(`[Toast:${type}] ${message}`);
}

/* ─── Export Utilities (for other JS files) ──────────────────── */
window.QMW = {
  APP_NAME,
  API_BASE,
  formatDate,
  truncateText,
  debounce,
  showToast,
};
