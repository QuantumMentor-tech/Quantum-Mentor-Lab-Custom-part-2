'use strict';

/**
 * Quantum Mentor World
 * safe-links.js — Safe Link Redirection Interceptor.
 *
 * Implements security checks, protocol whitelist validations, XSS blocks,
 * and handles confirm/cancel behaviors on warning modals.
 */

let currentTargetUrl = '';

/* ─── Validate URL Protocols ─────────────────────────────────── */
function isAllowedPublicUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim().toLowerCase();

  // Enforce secure protocol schemes
  if (!clean.startsWith('https://') && !clean.startsWith('http://')) {
    return false;
  }

  // Explicitly block injection scripts or file access
  if (clean.includes('javascript:') || clean.includes('data:') || clean.includes('file:')) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch (e) {
    return false;
  }
}

/* ─── Extract Hostname for Safe Display ─────────────────────── */
function sanitizeDisplayUrl(url) {
  if (!url || typeof url !== 'string') return '';
  try {
    const parsed = new URL(url);
    return parsed.hostname; // Display domain to avoid phishing/spoofing
  } catch (e) {
    const div = document.createElement('div');
    div.textContent = url;
    const safeStr = div.innerHTML;
    return safeStr.length > 50 ? safeStr.substring(0, 50) + '...' : safeStr;
  }
}

/* ─── Open Redirection Modal ────────────────────────────────── */
function openSafeLinkModal(link) {
  const { url, label } = link;

  if (!isAllowedPublicUrl(url)) {
    console.warn('[Link Blocked]: Unallowed protocol scheme or script in target URL:', url);
    alert('This URL is blocked for safety. Only secure web protocols are permitted.');
    return;
  }

  currentTargetUrl = url;

  const modal = document.getElementById('safe-link-modal');
  const modalTitle = document.getElementById('safe-link-modal-title');
  const modalUrl = document.getElementById('safe-link-modal-url');

  if (!modal) {
    console.warn('[SafeLinks] Missing redirection modal container: #safe-link-modal');
    return;
  }

  if (modalTitle) modalTitle.textContent = label || 'External Resource';
  if (modalUrl) modalUrl.textContent = sanitizeDisplayUrl(url);

  modal.style.display = 'flex';
}

/* ─── Close Redirection Modal ───────────────────────────────── */
function closeSafeLinkModal() {
  currentTargetUrl = '';
  const modal = document.getElementById('safe-link-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

/* ─── Confirm & Open Link ───────────────────────────────────── */
function confirmSafeLink() {
  if (currentTargetUrl && isAllowedPublicUrl(currentTargetUrl)) {
    window.open(currentTargetUrl, '_blank', 'noopener,noreferrer');
  }
  closeSafeLinkModal();
}

/* ─── Bind Modal Controls ───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('safe-link-modal');
  const confirmBtn = document.getElementById('safe-link-confirm');
  const cancelBtn = document.getElementById('safe-link-cancel');

  if (confirmBtn) {
    confirmBtn.addEventListener('click', confirmSafeLink);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeSafeLinkModal);
  }

  if (modal) {
    // Close modal if background backdrop is clicked
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeSafeLinkModal();
      }
    });
  }

  // Close modal if user presses Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSafeLinkModal();
    }
  });
});

/* ─── Export Globals ─────────────────────────────────────────── */
window.SafeLinks = {
  isAllowedPublicUrl,
  sanitizeDisplayUrl,
  openSafeLinkModal,
  closeSafeLinkModal,
  confirmSafeLink
};
