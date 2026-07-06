'use strict';

/**
 * Quantum Mentor World — Admin Settings Controller
 * assets/js/admin-settings.js
 *
 * Coordinates loading and saving site-wide configuration parameters
 * using the protected admin Settings API.
 */

function initAdminSettings() {
  const form = document.getElementById('admin-settings-form');
  if (!form) return;

  console.log('[Admin Settings] Initializing site configuration manager.');

  // Load existing settings
  loadSiteSettings();

  // Handle Form Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveSiteSettings();
  });
}

/**
 * Loads current settings from the backend and populates the form fields.
 */
async function loadSiteSettings() {
  const form = document.getElementById('admin-settings-form');
  if (!form) return;

  if (window.AdminUI) {
    window.AdminUI.showAdminLoading(form.parentElement, 'Retrieving site configuration...');
  }

  const response = await window.API.getAdminSettings();

  // Clean loading screen
  const loadingState = form.parentElement.querySelector('.admin-loading-state');
  if (loadingState) loadingState.remove();

  if (response.success && response.data) {
    const settings = response.data;
    
    // Map values to fields
    document.getElementById('set-site-name').value = settings.site_name || '';
    document.getElementById('set-brand-name').value = settings.brand_name || '';
    document.getElementById('set-tagline').value = settings.site_tagline || '';
    document.getElementById('set-email').value = settings.site_email || '';
    document.getElementById('set-footer').value = settings.footer_text || '';
    document.getElementById('set-legal-disclaimer').value = settings.legal_notice || '';
    
    // Switch checkboxes
    document.getElementById('set-allow-reports').checked = (settings.allow_user_reports === 'true' || settings.allow_user_reports === true || settings.allow_user_reports === '1');
    document.getElementById('set-maintenance').checked = (settings.maintenance_mode === 'true' || settings.maintenance_mode === true || settings.maintenance_mode === '1');
  } else {
    window.AdminUI.showAdminToast(response.message || 'Failed to retrieve settings.', 'error');
  }
}

/**
 * Collects form inputs and submits updates to the protected API.
 */
async function saveSiteSettings() {
  const site_name = document.getElementById('set-site-name').value.trim();
  const brand_name = document.getElementById('set-brand-name').value.trim();
  const site_tagline = document.getElementById('set-tagline').value.trim();
  const site_email = document.getElementById('set-email').value.trim();
  const footer_text = document.getElementById('set-footer').value.trim();
  const legal_notice = document.getElementById('set-legal-disclaimer').value.trim();
  const allow_user_reports = document.getElementById('set-allow-reports').checked;
  const maintenance_mode = document.getElementById('set-maintenance').checked;

  // Frontend email validator
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (site_email && !emailRegex.test(site_email)) {
    window.AdminUI.showAdminToast('Please provide a valid support email address.', 'error');
    return;
  }

  const payload = {
    site_name,
    brand_name,
    site_tagline,
    site_email,
    footer_text,
    legal_notice,
    allow_user_reports: allow_user_reports ? 'true' : 'false',
    maintenance_mode: maintenance_mode ? 'true' : 'false'
  };

  const response = await window.API.updateSettings(payload);
  if (response.success) {
    window.AdminUI.showAdminToast(response.message || 'Site settings updated successfully.', 'success');
    // Reload fields with return data
    loadSiteSettings();
  } else {
    window.AdminUI.showAdminToast(response.message || 'Failed to update settings.', 'error');
  }
}

// Bind load callbacks
document.addEventListener('DOMContentLoaded', initAdminSettings);

// Expose globally
window.AdminSettings = {
  initAdminSettings,
  loadSiteSettings,
  saveSiteSettings
};
