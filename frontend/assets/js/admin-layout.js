'use strict';

/**
 * Quantum Mentor World — Admin Layout Controller
 * assets/js/admin-layout.js
 *
 * Coordinates header state updates, navigation highlights,
 * responsive mobile drawers, and logout clicks.
 */

/**
 * Bootstraps the layout components on DOM Ready.
 */
function initAdminLayout() {
  setActiveAdminNav();
  bindAdminSidebarToggle();
  bindAdminLogout();
  
  // Render user info if session user is available
  const user = window.AdminAuth ? window.AdminAuth.getAdminUser() : null;
  if (user) {
    renderAdminUserInfo(user);
  }
}

/**
 * Highlights the active menu item in the admin sidebar.
 */
function setActiveAdminNav() {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1) || 'dashboard.html';
  const navLinks = document.querySelectorAll('.admin-nav-item');

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'dashboard.html')) {
      link.classList.add('active');
    }
  });
}

/**
 * Renders user credentials in the topbar header.
 * @param {Object} user - Decoded profile metadata
 */
function renderAdminUserInfo(user) {
  const nameEl = document.getElementById('admin-user-name');
  const roleEl = document.getElementById('admin-user-role');
  const avatarEl = document.querySelector('.admin-avatar');

  if (nameEl) {
    nameEl.textContent = window.AdminUI ? window.AdminUI.escapeAdminHtml(user.full_name || user.username) : (user.full_name || user.username);
  }
  if (roleEl) {
    const roleText = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    roleEl.textContent = roleText;
    
    // Add classes
    roleEl.className = `role-badge badge-${user.role.toLowerCase()}`;
  }
  if (avatarEl) {
    const initial = (user.full_name || user.username || 'A').charAt(0).toUpperCase();
    avatarEl.textContent = initial;
  }
}

/**
 * Toggles responsive sidebar visibility drawer on small screens.
 */
function bindAdminSidebarToggle() {
  const toggleBtn = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('admin-sidebar');
  
  if (!toggleBtn || !sidebar) return;

  // Create overlay if not present
  let overlay = document.getElementById('admin-sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'admin-sidebar-overlay';
    overlay.className = 'admin-sidebar-overlay';
    document.body.appendChild(overlay);
  }

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });
}

/**
 * Binds click handler to administrative logout actions.
 */
function bindAdminLogout() {
  const logoutButtons = document.querySelectorAll('#admin-logout-button, .btn-logout');
  
  logoutButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      if (window.AdminUI) {
        window.AdminUI.showAdminToast('Signing out...', 'info');
      }

      if (window.AdminAuth && typeof window.AdminAuth.logoutAdmin === 'function') {
        await window.AdminAuth.logoutAdmin();
      } else {
        sessionStorage.removeItem('qmw_admin_token');
        sessionStorage.removeItem('qmw_admin_user');
        window.location.href = 'login.html';
      }
    });
  });
}

/**
 * Wrapper for displaying toast messages.
 */
function showAdminToast(message, type) {
  if (window.AdminUI && typeof window.AdminUI.showAdminToast === 'function') {
    window.AdminUI.showAdminToast(message, type);
  } else {
    alert(`[${type}] ${message}`);
  }
}

/**
 * Spawns a fullscreen page loader panel.
 * @param {string} message
 */
function showAdminPageLoading(message = 'Processing request...') {
  let loader = document.getElementById('admin-page-loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'admin-page-loader';
    loader.className = 'admin-page-loader';
    loader.innerHTML = `
      <div class="loader-content">
        <div class="admin-spinner"></div>
        <p class="loader-message">${window.AdminUI ? window.AdminUI.escapeAdminHtml(message) : message}</p>
      </div>
    `;
    document.body.appendChild(loader);
  } else {
    const msgEl = loader.querySelector('.loader-message');
    if (msgEl) {
      msgEl.textContent = message;
    }
    loader.style.display = 'flex';
  }
}

/**
 * Removes the fullscreen page loader panel.
 */
function hideAdminPageLoading() {
  const loader = document.getElementById('admin-page-loader');
  if (loader) {
    loader.style.display = 'none';
  }
}

// Initialize layout on load
document.addEventListener('DOMContentLoaded', initAdminLayout);

// Expose layout utilities
window.AdminLayout = {
  initAdminLayout,
  setActiveAdminNav,
  renderAdminUserInfo,
  bindAdminSidebarToggle,
  bindAdminLogout,
  showAdminToast,
  showAdminPageLoading,
  hideAdminPageLoading
};
