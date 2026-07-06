'use strict';

/**
 * Quantum Mentor World
 * admin.js — Admin login, logout, and dashboard coordinator.
 *
 * Coordinates login form submissions and loads stats overview data.
 */

/* ─── DOM Ready ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Admin] Core Coordinator loaded.');
  initAdminLoginPage();
  initAdminDashboardPage();
});

/* ─── Login Page Handler ──────────────────────────────────────── */
function initAdminLoginPage() {
  const form = document.getElementById('admin-login-form');
  if (!form) return;

  // If already logged in, redirect to dashboard
  if (window.AdminAuth && window.AdminAuth.isAdminLoggedIn()) {
    window.AdminAuth.redirectToDashboard();
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('admin-email');
    const passwordInput = document.getElementById('admin-password');
    const errorEl = document.getElementById('admin-login-error');
    const loadingEl = document.getElementById('admin-login-loading');
    const submitBtn = document.getElementById('admin-login-button');

    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Reset errors
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }

    // Frontend validations
    if (!email || !password) {
      showError('Please enter both your email address and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Please provide a valid email address.');
      return;
    }

    if (password.length < 8) {
      showError('Password must be at least 8 characters long.');
      return;
    }

    // Show loading spinner, disable button
    if (loadingEl) loadingEl.style.display = 'block';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';
    }

    try {
      const response = await fetch(`${window.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      // Reset loading states
      if (loadingEl) loadingEl.style.display = 'none';
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }

      if (response.ok && result.success && result.data && result.data.token) {
        // Save auth details and redirect
        window.AdminAuth.setAdminSession(result.data.token, result.data.user);
        
        if (window.AdminUI) {
          window.AdminUI.showAdminToast('Login successful! Redirecting...', 'success');
        }
        
        setTimeout(() => {
          window.AdminAuth.redirectToDashboard();
        }, 1000);
      } else {
        showError(result.message || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('[Admin Login] Connection error:', err);
      if (loadingEl) loadingEl.style.display = 'none';
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }
      showError('Unable to connect to the backend server. Please verify the API is online.');
    }

    function showError(msg) {
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
      }
    }
  });
}

/* ─── Dashboard Stats Loader ─────────────────────────────────── */
function initAdminDashboardPage() {
  const isDashboard = window.location.pathname.includes('dashboard.html') || 
                      (window.location.pathname.endsWith('/admin/') && !window.location.pathname.includes('login.html'));
  if (!isDashboard) return;

  console.log('[Admin Dashboard] Initializing stats overview card loader.');
  loadDashboardStats();
}

async function loadDashboardStats() {
  const statsContainer = document.getElementById('dashboard-stats');
  if (!statsContainer) return;

  try {
    // Perform authenticated GET request to protected overview route
    const token = window.AdminAuth ? window.AdminAuth.getAdminToken() : null;
    if (!token) return;

    const response = await fetch(`${window.API_BASE_URL}/admin/overview`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    
    if (response.ok && result.success && result.data) {
      const stats = result.data;
      
      // Update DOM values
      updateStatVal('stat-total', stats.resources.total);
      updateStatVal('stat-published', stats.resources.published);
      updateStatVal('stat-draft', stats.resources.draft);
      updateStatVal('stat-pending', stats.resources.pendingReview);
      updateStatVal('stat-categories', stats.categories.total);
      updateStatVal('stat-tags', stats.tags.total);
      updateStatVal('stat-media', stats.media.total);
      updateStatVal('stat-messages', stats.contactMessages ? stats.contactMessages.newCount : 0);
      updateStatVal('stat-reports', stats.reports ? stats.reports.newCount : 0);
      
    } else {
      console.warn('[Admin Stats] Failed to fetch overview counts:', result.message);
      loadPlaceholderStats();
    }
  } catch (err) {
    console.error('[Admin Stats] Connection error loading overview:', err);
    loadPlaceholderStats();
  }
}

function updateStatVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val !== undefined ? val : '—';
}

function loadPlaceholderStats() {
  console.log('[Admin Stats] Loading fallback statistics indicators.');
  // Fall back to clean placeholders
  updateStatVal('stat-total', 'Coming soon');
  updateStatVal('stat-published', 'Coming soon');
  updateStatVal('stat-draft', 'Coming soon');
  updateStatVal('stat-pending', 'Coming soon');
  updateStatVal('stat-categories', 'Coming soon');
  updateStatVal('stat-tags', 'Coming soon');
  updateStatVal('stat-media', 'Coming soon');
  updateStatVal('stat-messages', 'Coming soon');
  updateStatVal('stat-reports', 'Coming soon');
}

// Expose core admin coordinator
window.Admin = {
  loadDashboardStats
};
