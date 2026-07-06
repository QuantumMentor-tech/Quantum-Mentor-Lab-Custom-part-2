'use strict';

/**
 * Quantum Mentor World — Admin UI Helpers
 * assets/js/admin-ui.js
 *
 * Implements global view renderer helpers, toast notifications,
 * status badges, XSS text escape, confirm modal dialogs, and coming-soon alerts.
 */

/**
 * Escapes HTML characters to prevent XSS injection.
 * @param {string} value
 * @returns {string}
 */
function escapeAdminHtml(value) {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Renders a loading state spinner inside a container element.
 * @param {HTMLElement|string} container
 * @param {string} message
 */
function showAdminLoading(container, message = 'Loading details...') {
  const el = typeof container === 'string' ? document.getElementById(container) : container;
  if (!el) return;
  el.innerHTML = `
    <div class="admin-loading-state">
      <div class="admin-spinner"></div>
      <p>${escapeAdminHtml(message)}</p>
    </div>
  `;
}

/**
 * Renders an error message state inside a container element.
 * @param {HTMLElement|string} container
 * @param {string} message
 */
function showAdminError(container, message = 'Failed to load details. Please try again.') {
  const el = typeof container === 'string' ? document.getElementById(container) : container;
  if (!el) return;
  el.innerHTML = `
    <div class="admin-error-state">
      <div class="admin-error-icon">⚠️</div>
      <p>${escapeAdminHtml(message)}</p>
    </div>
  `;
}

/**
 * Renders an empty state banner inside a container element.
 * @param {HTMLElement|string} container
 * @param {string} message
 */
function showAdminEmpty(container, message = 'No items found matching the selection.') {
  const el = typeof container === 'string' ? document.getElementById(container) : container;
  if (!el) return;
  el.innerHTML = `
    <div class="admin-empty-state">
      <div class="admin-empty-icon">📁</div>
      <p>${escapeAdminHtml(message)}</p>
    </div>
  `;
}

/**
 * Displays a floating notification toast.
 * @param {string} message
 * @param {string} type - 'success', 'warning', 'error', 'info'
 */
function showAdminToast(message, type = 'info') {
  // Ensure toast container exists
  let container = document.getElementById('admin-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'admin-toast-container';
    container.className = 'admin-toast-container';
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `admin-toast toast-${type}`;
  
  // Icon based on type
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'warning') icon = '⚠️';
  if (type === 'error') icon = '❌';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${escapeAdminHtml(message)}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;

  container.appendChild(toast);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * Returns a styled HTML badge string for statuses or roles.
 * @param {string} text
 * @param {string} type
 * @returns {string} HTML markup
 */
function createAdminBadge(text, type = 'neutral') {
  const safeText = escapeAdminHtml(text);
  const cleanType = type.toLowerCase().replace(/[^a-z0-9-_]/g, '');
  return `<span class="admin-badge badge-${cleanType}">${safeText}</span>`;
}

/**
 * Formats database date strings to local readable strings.
 * @param {string} dateString
 * @returns {string} Formatted date
 */
function formatAdminDate(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return '—';
  }
}

/**
 * Displays a custom confirmation modal window.
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.message
 * @param {Function} options.onConfirm
 */
function openConfirmModal(options) {
  const { title, message, onConfirm } = options;

  // Create modal backdrop overlay
  const backdrop = document.createElement('div');
  backdrop.className = 'admin-modal-backdrop';

  // Create modal card dialog container
  const card = document.createElement('div');
  card.className = 'admin-modal-card';

  card.innerHTML = `
    <h3 class="modal-title" style="margin-top:0; font-size: 18px; font-weight:700; color:var(--primary-accent);">${escapeAdminHtml(title)}</h3>
    <p class="modal-message" style="font-size:14px; margin: 12px 0 24px 0; color:var(--admin-text-muted); line-height:1.5;">${escapeAdminHtml(message)}</p>
    <div class="modal-buttons" style="display:flex; justify-content:flex-end; gap:12px;">
      <button class="btn btn-secondary" id="btn-modal-cancel">Cancel</button>
      <button class="btn btn-primary" id="btn-modal-confirm">Confirm</button>
    </div>
  `;

  backdrop.appendChild(card);
  document.body.appendChild(backdrop);

  const cancelBtn = card.querySelector('#btn-modal-cancel');
  const confirmBtn = card.querySelector('#btn-modal-confirm');

  const close = () => backdrop.remove();

  cancelBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  confirmBtn.addEventListener('click', () => {
    close();
    if (typeof onConfirm === 'function') onConfirm();
  });
}

/**
 * Helper to alert users that an action is a placeholder for Step 14 CRUD integration.
 * @param {string} actionName
 */
function confirmComingSoon(actionName) {
  showAdminToast(`${actionName} API will be connected in Step 14.`, 'warning');
}

// Expose functions globally
window.AdminUI = {
  escapeAdminHtml,
  showAdminLoading,
  showAdminError,
  showAdminEmpty,
  showAdminToast,
  createAdminBadge,
  formatAdminDate,
  openConfirmModal,
  confirmComingSoon
};
