'use strict';

/**
 * Quantum Mentor World — Admin Tags Controller
 * assets/js/admin-tags.js
 *
 * Handles fetching list of tags, inline/form editing state, creating new tags,
 * and soft-deleting tags through protected REST endpoints.
 */

let localTags = [];
let editTagId = null;

function initAdminTags() {
  const form = document.getElementById('admin-add-tag-form');
  const nameInput = document.getElementById('tag-name');
  const slugInput = document.getElementById('tag-slug');
  const searchInput = document.getElementById('tag-search');

  if (!form) return;

  console.log('[Admin Tags] Initializing tags controller.');

  // Auto-slugify on name input
  if (nameInput && slugInput) {
    nameInput.addEventListener('input', () => {
      if (editTagId === null) {
        slugInput.value = generateTagSlug(nameInput.value);
      }
    });
  }

  // Handle Form Submit (Add or Edit)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleFormSubmit();
  });

  // Search filter
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      const filtered = localTags.filter(tag => 
        tag.name.toLowerCase().includes(query) || 
        tag.slug.toLowerCase().includes(query)
      );
      renderTags(filtered);
    });
  }

  // Load initial list
  loadTags();
}

/**
 * Generates URL safe slug from input string.
 * @param {string} val
 * @returns {string}
 */
function generateTagSlug(val) {
  return val
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Fetches tags list from API.
 */
async function loadTags() {
  const tbody = document.getElementById('tag-tbody');
  if (!tbody) return;

  if (window.AdminUI) {
    window.AdminUI.showAdminLoading(tbody, 'Retrieving tags list...');
  }

  // Use protected admin API
  const response = await window.API.getAdminTags();
  if (response.success && response.data) {
    localTags = response.data;
    renderTags(localTags);
  } else {
    tbody.innerHTML = `<tr><td colspan="4" class="text-danger text-center">${window.AdminUI.escapeAdminHtml(response.message || 'Failed to fetch tags.')}</td></tr>`;
  }
}

/**
 * Renders tags list to the table rows.
 * @param {Array} list
 */
function renderTags(list) {
  const tbody = document.getElementById('tag-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No tags found.</td></tr>`;
    return;
  }

  list.forEach(tag => {
    const tr = document.createElement('tr');
    
    const isDeleted = tag.deleted_at !== null && tag.deleted_at !== undefined;
    if (isDeleted) {
      tr.className = 'admin-row-deleted';
    }

    const statusVal = isDeleted ? 'deleted' : (tag.status || 'active');
    const statusBadge = window.AdminUI.createAdminBadge(statusVal, `status-${statusVal}`);

    tr.innerHTML = `
      <td>
        <strong>#${window.AdminUI.escapeAdminHtml(tag.name)}</strong>
        ${isDeleted ? '<span class="admin-status-trash">Trash</span>' : ''}
      </td>
      <td><code>${window.AdminUI.escapeAdminHtml(tag.slug)}</code></td>
      <td>${statusBadge}</td>
      <td>
        <div class="admin-table-actions" style="justify-content:center;">
          <button class="btn-table btn-edit" onclick="AdminTags.startEditTag(${tag.id})" title="Edit" ${isDeleted ? 'disabled' : ''}>✏️</button>
          <button class="btn-table btn-delete" onclick="AdminTags.deleteTag(${tag.id})" title="Delete" ${isDeleted ? 'disabled' : ''}>🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Initiates the editing state for a tag.
 * @param {number} id
 */
function startEditTag(id) {
  const tag = localTags.find(t => t.id === id);
  if (!tag) return;

  editTagId = id;

  const header = document.querySelector('.add-pane .card-title');
  if (header) header.textContent = `🏷️ Edit Tag: #${tag.name}`;

  document.getElementById('tag-name').value = tag.name;
  document.getElementById('tag-slug').value = tag.slug;
  document.getElementById('tag-description').value = tag.description || '';

  // Modify form button
  const form = document.getElementById('admin-add-tag-form');
  let submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.textContent = '💾 Update Tag';
  submitBtn.className = 'btn btn-primary';

  // Add cancel button if not present
  let cancelBtn = document.getElementById('btn-cancel-tag-edit');
  if (!cancelBtn) {
    cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.id = 'btn-cancel-tag-edit';
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.style = 'margin-top: 8px; width: 100%;';
    cancelBtn.textContent = 'Cancel Edit';
    cancelBtn.addEventListener('click', cancelTagEdit);
    form.appendChild(cancelBtn);
  }
}

/**
 * Resets the editing state back to creation mode.
 */
function cancelTagEdit() {
  editTagId = null;

  const header = document.querySelector('.add-pane .card-title');
  if (header) header.textContent = '🏷️ Add New Tag';

  const form = document.getElementById('admin-add-tag-form');
  form.reset();

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.textContent = '🏷️ Create Tag';

  const cancelBtn = document.getElementById('btn-cancel-tag-edit');
  if (cancelBtn) cancelBtn.remove();
}

/**
 * Handles Form submissions to POST or PATCH endpoint.
 */
async function handleFormSubmit() {
  const name = document.getElementById('tag-name').value.trim();
  const slug = document.getElementById('tag-slug').value.trim();
  const description = document.getElementById('tag-description').value.trim();

  if (!name || !slug) {
    window.AdminUI.showAdminToast('Name and Slug are required.', 'error');
    return;
  }

  const payload = { name, slug, description };

  let response;
  if (editTagId !== null) {
    response = await window.API.updateTag(editTagId, payload);
  } else {
    response = await window.API.createTag(payload);
  }

  if (response.success) {
    window.AdminUI.showAdminToast(response.message || 'Tag saved successfully.', 'success');
    cancelTagEdit();
    loadTags();
  } else {
    window.AdminUI.showAdminToast(response.message || 'Failed to save tag.', 'error');
  }
}

/**
 * Soft deletes a tag.
 * @param {number} id
 */
async function deleteTag(id) {
  const tag = localTags.find(t => t.id === id);
  if (!tag) return;

  if (window.AdminUI && typeof window.AdminUI.openConfirmModal === 'function') {
    window.AdminUI.openConfirmModal({
      title: 'Delete Tag?',
      message: `Are you sure you want to delete tag "#${tag.name}"? This will hide it and its indexing relationships from listings.`,
      onConfirm: async () => {
        const response = await window.API.deleteTag(id);
        if (response.success) {
          window.AdminUI.showAdminToast(response.message || 'Tag deleted successfully.', 'success');
          if (editTagId === id) cancelTagEdit();
          loadTags();
        } else {
          window.AdminUI.showAdminToast(response.message || 'Failed to delete tag.', 'error');
        }
      }
    });
  } else {
    const ok = confirm(`Are you sure you want to delete tag "#${tag.name}"?`);
    if (ok) {
      const response = await window.API.deleteTag(id);
      if (response.success) {
        window.AdminUI.showAdminToast(response.message || 'Tag deleted successfully.', 'success');
        if (editTagId === id) cancelTagEdit();
        loadTags();
      } else {
        window.AdminUI.showAdminToast(response.message || 'Failed to delete tag.', 'error');
      }
    }
  }
}

// Bind load callbacks
document.addEventListener('DOMContentLoaded', initAdminTags);

// Expose globally
window.AdminTags = {
  initAdminTags,
  loadTags,
  renderTags,
  startEditTag,
  cancelTagEdit,
  deleteTag
};
