'use strict';

/**
 * Quantum Mentor World — Frontend Auth Helper
 * assets/js/admin-auth.js
 *
 * Implements session storage handlers, auth state verification, redirects,
 * and authenticated fetch calls.
 */

const ADMIN_TOKEN_KEY = 'qmw_admin_token';
const ADMIN_USER_KEY = 'qmw_admin_user';

function getAdminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

function getAdminUser() {
  const userJson = sessionStorage.getItem(ADMIN_USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch (e) {
    return null;
  }
}

function setAdminSession(token, user) {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_USER_KEY);
}

function isAdminLoggedIn() {
  return !!getAdminToken();
}

function redirectToLogin() {
  const path = window.location.pathname;
  if (path.includes('/admin/')) {
    window.location.href = 'login.html';
  } else {
    window.location.href = 'admin/login.html';
  }
}

function redirectToDashboard() {
  const path = window.location.pathname;
  if (path.includes('/admin/')) {
    window.location.href = 'dashboard.html';
  } else {
    window.location.href = 'admin/dashboard.html';
  }
}

/**
 * Performs authenticated GET request to check current login state
 */
async function fetchCurrentAdmin() {
  const token = getAdminToken();
  if (!token) return null;

  try {
    const response = await fetch(`${window.API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    if (result.success && result.data && result.data.user) {
      sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(result.data.user));
      return result.data.user;
    } else {
      clearAdminSession();
      return null;
    }
  } catch (err) {
    console.error('[Auth Helper] Failed to check user session status:', err);
    // If backend is offline, do not clear session immediately to allow offline inspection
    // but return null to trigger page restrictions
    return null;
  }
}

/**
 * Checks authentication on protected admin page loads
 */
async function requireAdminPage() {
  if (!isAdminLoggedIn()) {
    redirectToLogin();
    return;
  }

  const user = await fetchCurrentAdmin();
  if (!user) {
    redirectToLogin();
  } else {
    // Populate username and role if elements exist in DOM
    const nameEl = document.getElementById('admin-user-name');
    const roleEl = document.getElementById('admin-user-role');
    
    if (nameEl) nameEl.textContent = user.full_name || user.username;
    if (roleEl) {
      roleEl.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
      // Give it standard role class
      roleEl.className = `role-badge badge-${user.role}`;
    }
  }
}

/**
 * Performs administrative logout request
 */
async function logoutAdmin() {
  const token = getAdminToken();
  if (token) {
    try {
      await fetch(`${window.API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error('[Auth Helper] Server logout failed:', err);
    }
  }

  clearAdminSession();
  redirectToLogin();
}

/**
 * Performs dynamic authenticated requests
 */
async function authFetch(endpoint, options = {}) {
  const token = getAdminToken();
  const headers = options.headers || {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${window.API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    if (response.status === 401) {
      clearAdminSession();
      redirectToLogin();
      return { success: false, message: 'Session expired. Please log in again.', data: null };
    }
    if (response.status === 403) {
      return { success: false, message: 'Access denied. You do not have permission to perform this action.', data: null };
    }
    
    return await response.json();
  } catch (err) {
    return {
      success: false,
      message: 'Unable to connect to the API. Please make sure the backend server is running.',
      data: null
    };
  }
}

// Expose utilities globally
window.AdminAuth = {
  getAdminToken,
  getAdminUser,
  setAdminSession,
  clearAdminSession,
  isAdminLoggedIn,
  redirectToLogin,
  redirectToDashboard,
  fetchCurrentAdmin,
  requireAdminPage,
  logoutAdmin,
  authFetch
};
