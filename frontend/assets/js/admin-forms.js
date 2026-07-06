'use strict';

/**
 * Quantum Mentor World — Admin Forms Controller
 * assets/js/admin-forms.js
 *
 * Implements form validation, slug auto-generation, public categories/tags lists
 * mapping, detail population, dynamic repeatable link rows, and compliance security rules.
 */

// Track active edit ID if available
let editResourceId = null;

/**
 * Initializes the Add Resource Form page.
 */
function initAddResourceForm() {
  const form = document.getElementById('admin-resource-form');
  if (!form || window.location.pathname.includes('edit-resource.html')) return;

  console.log('[Admin Forms] Initializing add-resource form.');
  
  // Bind slug generator
  bindSlugGenerator();
  
  // Fetch categories & tags
  loadFormCategories();
  loadFormTags();
  
  // Bind legal & safety reviews rules
  bindLegalSafetyRules();

  // Setup add link button listener
  const addLinkBtn = document.getElementById('btn-add-link');
  if (addLinkBtn) {
    addLinkBtn.addEventListener('click', () => addLinkRow());
  }

  // Pre-populate with one default official link row
  addLinkRow({
    label: 'Official Website',
    url: '',
    link_type: 'official',
    source_type: 'official',
    legal_status: 'pending',
    safety_status: 'unchecked',
    is_primary: true
  });

  // Handle Form Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Separate Save Draft vs Publish if user submits
    const submitter = e.submitter;
    let targetStatus = 'draft';
    if (submitter && submitter.id === 'btn-publish-form') {
      targetStatus = 'published';
    } else {
      // Find what status select or buttons represent
      const statusSelect = document.getElementById('res-status');
      if (statusSelect) targetStatus = statusSelect.value;
    }

    const data = collectResourceFormData(targetStatus);
    if (!validateResourceForm(data)) return;
    
    // Show loading
    if (window.AdminUI) window.AdminUI.showAdminLoading(form.parentElement, 'Saving resource...');

    const response = await window.API.createResource(data);

    if (response.success && response.data) {
      window.AdminUI.showAdminToast(response.message || 'Resource created successfully.', 'success');
      setTimeout(() => {
        window.location.href = 'resources.html';
      }, 1000);
    } else {
      // Reload form content state or display error
      window.AdminUI.showAdminToast(response.message || 'Failed to create resource.', 'error');
      // If we replaced form HTML, we reload/reset page to allow user correction
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  });
}

/**
 * Initializes the Edit Resource Form page.
 */
async function initEditResourceForm() {
  const form = document.getElementById('admin-resource-form');
  if (!form || !window.location.pathname.includes('edit-resource.html')) return;

  console.log('[Admin Forms] Initializing edit-resource form.');
  
  // Bind slug generator
  bindSlugGenerator();
  
  // Fetch categories & tags
  await Promise.all([loadFormCategories(), loadFormTags()]);
  
  // Bind legal & safety reviews rules
  bindLegalSafetyRules();

  // Setup add link button listener
  const addLinkBtn = document.getElementById('btn-add-link');
  if (addLinkBtn) {
    addLinkBtn.addEventListener('click', () => addLinkRow());
  }

  // Read ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (!id) {
    window.AdminUI.showAdminToast('Resource ID is missing in URL.', 'error');
    const container = document.querySelector('.admin-content');
    if (container) {
      container.innerHTML = `
        <div class="admin-error-state">
          <div class="admin-error-icon">❌</div>
          <h2>Resource ID is missing.</h2>
          <p>Please return to the Resource Management page and select a resource to edit.</p>
          <a href="resources.html" class="btn btn-secondary" style="margin-top: 16px;">Back to Resources</a>
        </div>
      `;
    }
    return;
  }

  editResourceId = parseInt(id, 10);

  // Load resource details from API
  const tbody = document.getElementById('admin-links-container');
  if (window.AdminUI) {
    window.AdminUI.showAdminLoading(tbody, 'Loading resource details...');
  }
  
  const response = await window.API.getAdminResource(editResourceId);

  if (response.success && response.data) {
    tbody.innerHTML = '';
    populateResourceForm(response.data);
  } else {
    const container = document.querySelector('.admin-content');
    if (container) {
      container.innerHTML = `
        <div class="admin-error-state">
          <div class="admin-error-icon">❌</div>
          <h2>Resource not found or error loading configuration.</h2>
          <p>${window.AdminUI.escapeAdminHtml(response.message || 'Failed to retrieve configuration.')}</p>
          <a href="resources.html" class="btn btn-secondary" style="margin-top: 16px;">Back to Resources</a>
        </div>
      `;
    }
  }

  // Handle Form Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitter = e.submitter;
    let targetStatus = 'draft';
    if (submitter && submitter.id === 'btn-publish-form') {
      targetStatus = 'published';
    } else {
      const statusSelect = document.getElementById('res-status');
      if (statusSelect) targetStatus = statusSelect.value;
    }

    const data = collectResourceFormData(targetStatus);
    if (!validateResourceForm(data)) return;
    
    // Show loading
    if (window.AdminUI) window.AdminUI.showAdminLoading(form.parentElement, 'Updating resource...');

    const updateResponse = await window.API.updateResource(editResourceId, data);

    if (updateResponse.success) {
      window.AdminUI.showAdminToast(updateResponse.message || 'Resource updated successfully.', 'success');
      setTimeout(() => {
        window.location.href = 'resources.html';
      }, 1000);
    } else {
      window.AdminUI.showAdminToast(updateResponse.message || 'Failed to update resource.', 'error');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  });
}

/**
 * Automates URL Slug generation as user inputs title text.
 */
function bindSlugGenerator() {
  const titleInput = document.getElementById('res-title');
  const slugInput = document.getElementById('res-slug');

  if (!titleInput || !slugInput) return;

  titleInput.addEventListener('input', () => {
    // Only auto-generate if we are creating new (not editing)
    if (!editResourceId) {
      slugInput.value = generateSlugFromTitle(titleInput.value);
    }
  });
}

/**
 * Normalizes title string into a clean lowercase slug.
 * @param {string} title
 * @returns {string}
 */
function generateSlugFromTitle(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word characters
    .replace(/[\s_-]+/g, '-') // replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // remove leading/trailing hyphens
}

/**
 * Fetches and injects categories checklist checkboxes into the form.
 */
async function loadFormCategories() {
  const container = document.getElementById('res-categories-container');
  if (!container) return;

  container.innerHTML = '<span class="text-muted">Loading categories...</span>';
  const response = await window.API.getCategories();
  
  if (response.success && response.data) {
    const categories = response.data;
    container.innerHTML = '';
    categories.forEach(cat => {
      const label = document.createElement('label');
      label.className = 'admin-checkbox-label';
      label.innerHTML = `
        <input type="checkbox" name="categories" value="${cat.id}">
        <span>${window.AdminUI.escapeAdminHtml(cat.name)}</span>
      `;
      container.appendChild(label);
    });
  } else {
    container.innerHTML = '<span class="text-danger">Failed to load categories.</span>';
  }
}

/**
 * Fetches and injects tags checklist checkboxes into the form.
 */
async function loadFormTags() {
  const container = document.getElementById('res-tags-container');
  if (!container) return;

  container.innerHTML = '<span class="text-muted">Loading tags...</span>';
  const response = await window.API.getTags();
  
  if (response.success && response.data) {
    const tags = response.data;
    container.innerHTML = '';
    tags.forEach(tag => {
      const label = document.createElement('label');
      label.className = 'admin-checkbox-label';
      label.innerHTML = `
        <input type="checkbox" name="tags" value="${tag.id}">
        <span>${window.AdminUI.escapeAdminHtml(tag.name)}</span>
      `;
      container.appendChild(label);
    });
  } else {
    container.innerHTML = '<span class="text-danger">Failed to load tags.</span>';
  }
}

/**
 * Dynamically appends a new link mirror row to the links grid container.
 * @param {Object} link
 */
function addLinkRow(link = {}) {
  const container = document.getElementById('admin-links-container');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'admin-link-row';
  row.style = 'display: grid; grid-template-columns: 1.5fr 2fr 1.2fr 1.2fr 1fr 1fr 0.6fr 0.5fr; gap: 8px; align-items: center; margin-bottom: 8px; border-bottom: 1px solid var(--admin-border); padding-bottom: 8px;';

  const labelVal = link.label || '';
  const urlVal = link.url || '';
  const linkTypeVal = link.link_type || 'official';
  const sourceTypeVal = link.source_type || 'official';
  const legalStatusVal = link.legal_status || 'pending';
  const safetyStatusVal = link.safety_status || 'unchecked';
  const isPrimaryChecked = link.is_primary ? 'checked' : '';

  row.innerHTML = `
    <div>
      <input type="text" class="admin-input link-label" placeholder="Label (e.g. Official Site)" value="${window.AdminUI.escapeAdminHtml(labelVal)}" required />
    </div>
    <div>
      <input type="url" class="admin-input link-url" placeholder="https://example.com" value="${window.AdminUI.escapeAdminHtml(urlVal)}" required />
    </div>
    <div>
      <select class="admin-select link-type">
        <option value="official" ${linkTypeVal === 'official' ? 'selected' : ''}>Official</option>
        <option value="download" ${linkTypeVal === 'download' ? 'selected' : ''}>Download</option>
        <option value="github" ${linkTypeVal === 'github' ? 'selected' : ''}>GitHub</option>
        <option value="documentation" ${linkTypeVal === 'documentation' ? 'selected' : ''}>Documentation</option>
        <option value="demo" ${linkTypeVal === 'demo' ? 'selected' : ''}>Demo</option>
        <option value="read_online" ${linkTypeVal === 'read_online' ? 'selected' : ''}>Read Online</option>
        <option value="launch_tool" ${linkTypeVal === 'launch_tool' ? 'selected' : ''}>Launch Tool</option>
        <option value="source" ${linkTypeVal === 'source' ? 'selected' : ''}>Source</option>
        <option value="other" ${linkTypeVal === 'other' ? 'selected' : ''}>Other</option>
      </select>
    </div>
    <div>
      <select class="admin-select link-source-type">
        <option value="official" ${sourceTypeVal === 'official' ? 'selected' : ''}>Official</option>
        <option value="open_source" ${sourceTypeVal === 'open_source' ? 'selected' : ''}>Open Source</option>
        <option value="public_domain" ${sourceTypeVal === 'public_domain' ? 'selected' : ''}>Public Domain</option>
        <option value="freeware" ${sourceTypeVal === 'freeware' ? 'selected' : ''}>Freeware</option>
        <option value="creator_approved" ${sourceTypeVal === 'creator_approved' ? 'selected' : ''}>Creator Approved</option>
        <option value="licensed" ${sourceTypeVal === 'licensed' ? 'selected' : ''}>Licensed</option>
        <option value="educational" ${sourceTypeVal === 'educational' ? 'selected' : ''}>Educational</option>
        <option value="other" ${sourceTypeVal === 'other' ? 'selected' : ''}>Other</option>
      </select>
    </div>
    <div>
      <select class="admin-select link-legal-status">
        <option value="pending" ${legalStatusVal === 'pending' ? 'selected' : ''}>Pending</option>
        <option value="approved" ${legalStatusVal === 'approved' ? 'selected' : ''}>Approved</option>
        <option value="rejected" ${legalStatusVal === 'rejected' ? 'selected' : ''}>Rejected</option>
      </select>
    </div>
    <div>
      <select class="admin-select link-safety-status">
        <option value="unchecked" ${safetyStatusVal === 'unchecked' ? 'selected' : ''}>Unchecked</option>
        <option value="safe" ${safetyStatusVal === 'safe' ? 'selected' : ''}>Safe</option>
        <option value="warning" ${safetyStatusVal === 'warning' ? 'selected' : ''}>Warning</option>
        <option value="unsafe" ${safetyStatusVal === 'unsafe' ? 'selected' : ''}>Unsafe</option>
      </select>
    </div>
    <div style="text-align: center;">
      <input type="checkbox" class="admin-checkbox link-primary" ${isPrimaryChecked} />
    </div>
    <div>
      <button type="button" class="btn btn-secondary btn-sm btn-remove-link" style="padding: 4px 8px; color: var(--admin-danger); font-size:12px;">❌</button>
    </div>
  `;

  // Bind remove button action
  row.querySelector('.btn-remove-link').addEventListener('click', () => {
    row.remove();
    evaluateLinksWarnings();
  });

  // Bind validation and warnings checks on input change
  row.querySelector('.link-url').addEventListener('input', evaluateLinksWarnings);
  row.querySelector('.link-type').addEventListener('change', evaluateLinksWarnings);
  row.querySelector('.link-legal-status').addEventListener('change', evaluateLinksWarnings);

  container.appendChild(row);
}

/**
 * Iterates through dynamic link rows to fetch their values.
 * @returns {Array} List of links objects
 */
function collectLinks() {
  const links = [];
  const container = document.getElementById('admin-links-container');
  if (!container) return links;

  const rows = container.querySelectorAll('.admin-link-row');
  rows.forEach(row => {
    const label = row.querySelector('.link-label').value.trim();
    const url = row.querySelector('.link-url').value.trim();
    const link_type = row.querySelector('.link-type').value;
    const source_type = row.querySelector('.link-source-type').value;
    const legal_status = row.querySelector('.link-legal-status').value;
    const safety_status = row.querySelector('.link-safety-status').value;
    const is_primary = row.querySelector('.link-primary').checked;

    if (label || url) {
      links.push({
        label,
        url,
        link_type,
        source_type,
        legal_status,
        safety_status,
        is_primary
      });
    }
  });

  return links;
}

/**
 * Scans all links URLs and reviews statuses to raise safety concerns.
 */
function evaluateLinksWarnings() {
  const links = collectLinks();
  const warningBox = document.getElementById('download-warning-box');
  if (!warningBox) return;

  let warningMessage = '';

  // Block unsafe URL protocols
  const unsafeProtocols = ['javascript:', 'data:', 'file:', 'ftp:', 'vbscript:'];
  const unsafeLocalHosts = ['localhost', '127.0.0.1', '0.0.0.0', '192.168.', '10.'];

  for (const lnk of links) {
    const lowerUrl = lnk.url.toLowerCase();
    
    // Protocol checks
    const hasUnsafeProtocol = unsafeProtocols.some(proto => lowerUrl.startsWith(proto));
    if (hasUnsafeProtocol) {
      warningMessage += `⚠️ Danger: Unsafe protocol detected in URL: "${window.AdminUI.escapeAdminHtml(lnk.url)}". Unsafe protocols will be rejected by backend.<br/>`;
    }

    // IP / localhost checks
    const hasUnsafeHost = unsafeLocalHosts.some(host => lowerUrl.includes(host));
    if (hasUnsafeHost) {
      warningMessage += `⚠️ Warning: Local loopback or intranet address detected: "${window.AdminUI.escapeAdminHtml(lnk.url)}".<br/>`;
    }

    // Download legal checklist
    if (lnk.link_type === 'download' && lnk.legal_status !== 'approved') {
      warningMessage += `⚠️ Note: Download URL is configured but not marked approved for legal compliance! Do not publish unverified binaries.<br/>`;
    }
  }

  if (warningMessage) {
    warningBox.innerHTML = warningMessage;
    warningBox.style.display = 'block';
  } else {
    warningBox.style.display = 'none';
  }
}

/**
 * Populates form inputs with attributes of a loaded resource.
 * @param {Object} res
 */
function populateResourceForm(res) {
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };

  const setCheckbox = (id, isChecked) => {
    const el = document.getElementById(id);
    if (el) el.checked = !!isChecked;
  };

  // Base details
  setVal('res-title', res.title);
  setVal('res-slug', res.slug);
  setVal('res-type', res.resource_type);
  setVal('res-short-desc', res.short_description);
  setVal('res-full-desc', res.full_description);
  setVal('res-featured-image', res.featured_image);
  setVal('res-status', res.status);
  setVal('res-visibility', res.visibility);
  setCheckbox('res-is-featured', res.is_featured);
  setCheckbox('res-is-trending', res.is_trending);

  // Legal safety
  setVal('res-legal-status', res.legal_status);
  setVal('res-safety-status', res.safety_status);
  setVal('res-source-type', res.source_type);
  setVal('res-access-type', res.access_type);

  // Specifications
  if (res.details) {
    setVal('res-version', res.details.version);
    setVal('res-platform', res.details.platform);
    setVal('res-developer', res.details.developer);
    setVal('res-author', res.details.author);
    setVal('res-publisher', res.details.publisher);
    setVal('res-language', res.details.language);
    setVal('res-file-size', res.details.file_size);
    setVal('res-license-type', res.details.license_type);
    setVal('res-release-year', res.details.release_year);
    setVal('res-requirements', res.details.requirements);
    setVal('res-install-guide', res.details.installation_guide);
    setVal('res-features', res.details.features);
    setVal('res-limitations', res.details.limitations);
  }

  // Links list population
  const linksContainer = document.getElementById('admin-links-container');
  if (linksContainer) {
    linksContainer.innerHTML = '';
    if (res.links && res.links.length > 0) {
      res.links.forEach(lnk => addLinkRow(lnk));
    } else {
      addLinkRow({
        label: 'Official Website',
        url: '',
        link_type: 'official',
        source_type: 'official',
        legal_status: 'pending',
        safety_status: 'unchecked',
        is_primary: true
      });
    }
  }

  // Pre-check categories checkboxes
  if (res.categories) {
    res.categories.forEach(cat => {
      const chk = document.querySelector(`input[name="categories"][value="${cat.id}"]`);
      if (chk) chk.checked = true;
    });
  }

  // Pre-check tags checkboxes
  if (res.tags) {
    res.tags.forEach(tag => {
      const chk = document.querySelector(`input[name="tags"][value="${tag.id}"]`);
      if (chk) chk.checked = true;
    });
  }

  // Trigger compliance validation checks once fields are populated
  evaluateLegalSafetyPublishRules();
  evaluateLinksWarnings();
}

/**
 * Extracts form field inputs into a structured javascript object.
 * @param {string} overrideStatus - Publication status override
 * @returns {Object} Form fields payload
 */
function collectResourceFormData(overrideStatus) {
  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  const getCheckbox = (id) => {
    const el = document.getElementById(id);
    return el ? (el.checked ? 1 : 0) : 0;
  };

  // Get categories checked values (ids list)
  const categoryIds = [];
  document.querySelectorAll('input[name="categories"]:checked').forEach(chk => {
    categoryIds.push(parseInt(chk.value, 10));
  });

  // Get tags checked values (ids list)
  const tagIds = [];
  document.querySelectorAll('input[name="tags"]:checked').forEach(chk => {
    tagIds.push(parseInt(chk.value, 10));
  });

  // Collect links from repeatable rows
  const links = collectLinks();

  return {
    title: getVal('res-title'),
    slug: getVal('res-slug'),
    resource_type: getVal('res-type'),
    short_description: getVal('res-short-desc'),
    full_description: getVal('res-full-desc'),
    featured_image: getVal('res-featured-image'),
    status: overrideStatus || getVal('res-status'),
    visibility: getVal('res-visibility'),
    is_featured: getCheckbox('res-is-featured'),
    is_trending: getCheckbox('res-is-trending'),
    legal_status: getVal('res-legal-status'),
    safety_status: getVal('res-safety-status'),
    source_type: getVal('res-source-type'),
    access_type: getVal('res-access-type'),
    category_ids: categoryIds,
    tag_ids: tagIds,
    links: links,
    details: {
      version: getVal('res-version'),
      platform: getVal('res-platform'),
      developer: getVal('res-developer'),
      author: getVal('res-author'),
      publisher: getVal('res-publisher'),
      language: getVal('res-language'),
      file_size: getVal('res-file-size'),
      license_type: getVal('res-license-type'),
      release_year: getVal('res-release-year') ? parseInt(getVal('res-release-year'), 10) : null,
      requirements: getVal('res-requirements'),
      installation_guide: getVal('res-install-guide'),
      features: getVal('res-features'),
      limitations: getVal('res-limitations')
    }
  };
}

/**
 * Performs frontend fields validation.
 * @param {Object} data - Structured fields payload
 * @returns {boolean} True if passes validation
 */
function validateResourceForm(data) {
  const showErr = (msg) => {
    if (window.AdminUI) {
      window.AdminUI.showAdminToast(msg, 'error');
    } else {
      alert(`[Validation Error] ${msg}`);
    }
    return false;
  };

  // 1. Required fields checks
  if (!data.title) return showErr('Title is required.');
  if (!data.resource_type) return showErr('Resource Type is required.');
  if (!data.short_description) return showErr('Short Description is required.');
  if (!data.legal_status) return showErr('Legal Status is required.');
  if (!data.safety_status) return showErr('Safety Status is required.');
  if (!data.source_type) return showErr('Source Type is required.');
  if (!data.access_type) return showErr('Access Type is required.');

  // 2. URL formats validations & strict safety
  const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/\S*)?$/;
  
  if (data.featured_image && !urlRegex.test(data.featured_image)) {
    return showErr('Please enter a valid cover image URL.');
  }

  // Safety check on links
  const unsafeProtocols = ['javascript:', 'data:', 'file:', 'ftp:', 'vbscript:'];
  for (const lnk of data.links) {
    if (!lnk.label) {
      return showErr('All link rows must have labels.');
    }
    if (!lnk.url) {
      return showErr('All link rows must have URLs.');
    }
    if (!urlRegex.test(lnk.url)) {
      return showErr(`Invalid URL format in link row: "${lnk.label}"`);
    }

    const lowerUrl = lnk.url.toLowerCase();
    const hasUnsafe = unsafeProtocols.some(proto => lowerUrl.startsWith(proto));
    if (hasUnsafe) {
      return showErr(`Unsafe protocol blocked in link URL: "${lnk.url}"`);
    }
  }

  // 3. Legal/Safety Publish conditions check
  if (data.status === 'published') {
    if (data.legal_status !== 'approved') {
      return showErr('Resource cannot be published until Legal Status is approved.');
    }
    if (data.safety_status !== 'safe' && data.safety_status !== 'warning') {
      return showErr('Resource cannot be published until Safety Status is verified safe or warning.');
    }
  }

  return true;
}

/**
 * Monitors changes to legal review variables to toggle Publish option limits.
 */
function bindLegalSafetyRules() {
  const legalSelect = document.getElementById('res-legal-status');
  const safetySelect = document.getElementById('res-safety-status');

  if (legalSelect) {
    legalSelect.addEventListener('change', evaluateLegalSafetyPublishRules);
  }
  if (safetySelect) {
    safetySelect.addEventListener('change', evaluateLegalSafetyPublishRules);
  }
}

/**
 * Handles toggling publish option buttons depending on compliance checks.
 */
function evaluateLegalSafetyPublishRules() {
  const legalSelect = document.getElementById('res-legal-status');
  const safetySelect = document.getElementById('res-safety-status');
  const publishBtn = document.getElementById('btn-publish-form');
  
  if (!legalSelect || !safetySelect || !publishBtn) return;

  const legalVal = legalSelect.value;
  const safetyVal = safetySelect.value;

  const isLegalApproved = (legalVal === 'approved');
  const isSafetyClear = (safetyVal === 'safe' || safetyVal === 'warning');

  const complianceAlert = document.getElementById('compliance-alert-box');

  if (isLegalApproved && isSafetyClear) {
    publishBtn.removeAttribute('disabled');
    publishBtn.style.opacity = '1';
    publishBtn.style.cursor = 'pointer';
    if (complianceAlert) complianceAlert.style.display = 'none';
  } else {
    publishBtn.setAttribute('disabled', 'true');
    publishBtn.style.opacity = '0.5';
    publishBtn.style.cursor = 'not-allowed';
    
    if (complianceAlert) {
      complianceAlert.style.display = 'block';
      let message = '⚠️ Publishing is disabled. ';
      if (!isLegalApproved) message += 'Legal Status must be approved. ';
      if (!isSafetyClear) message += 'Safety Status must be marked Safe or Warning.';
      complianceAlert.textContent = message;
    }
  }
}

/**
 * Binds the Select Media library button to open picker modal.
 */
function bindMediaPickerButton() {
  const btn = document.getElementById('btn-select-media');
  const input = document.getElementById('res-featured-image');
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    if (typeof window.openMediaPicker === 'function') {
      window.openMediaPicker((media) => {
        input.value = media.file_url;
        input.dispatchEvent(new Event('input'));
      });
    } else {
      console.error('[Admin Forms] openMediaPicker utility not loaded.');
    }
  });
}

// Bind load callbacks
document.addEventListener('DOMContentLoaded', () => {
  initAddResourceForm();
  initEditResourceForm();
  bindMediaPickerButton();
});

// Expose functions globally
window.AdminForms = {
  initAddResourceForm,
  initEditResourceForm,
  generateSlugFromTitle,
  loadFormCategories,
  loadFormTags,
  addLinkRow,
  collectLinks,
  evaluateLinksWarnings,
  populateResourceForm,
  collectResourceFormData,
  validateResourceForm,
  bindLegalSafetyRules,
  evaluateLegalSafetyPublishRules,
  bindMediaPickerButton
};
