'use strict';

/**
 * Quantum Mentor World — Admin Resources List Manager
 * assets/js/admin-resources.js
 *
 * Coordinates data fetches from the protected admin API, filter event handling,
 * table row rendering, and resource status / metadata mutations.
 */

// Filter state
let resourceFilters = {
  search: '',
  type: '',
  status: '',
  legal: '',
  safety: '',
  sort: 'latest',
  limit: 10,
  page: 1
};

/**
 * Initializes the Resource Management Page UI logic.
 */
function initAdminResourcesPage() {
  const isResourcesPage = window.location.pathname.includes('resources.html');
  if (!isResourcesPage) return;

  console.log('[Admin Resources] Initializing list view.');
  bindAdminResourceFilters();
  loadAdminResourceList();
}

/**
 * Fetches resource list matching the active filter criteria.
 */
async function loadAdminResourceList() {
  const tbody = document.getElementById('admin-resource-tbody');
  if (!tbody) return;

  if (window.AdminUI) {
    window.AdminUI.showAdminLoading(tbody, 'Loading resource directory...');
  }

  // Construct query parameters
  const params = {
    q: resourceFilters.search,
    resource_type: resourceFilters.type,
    status: resourceFilters.status,
    legal_status: resourceFilters.legal,
    safety_status: resourceFilters.safety,
    sort: resourceFilters.sort,
    limit: resourceFilters.limit,
    page: resourceFilters.page,
    show_deleted: 'true' // Show deleted items for admin trash review
  };

  const response = await window.API.getAdminResources(params);

  if (response.success && response.data) {
    const resources = response.data;
    const meta = response.meta || { page: resourceFilters.page, limit: resourceFilters.limit, total: resources.length, totalPages: 1 };

    if (resources.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 32px 0;">
            <div class="admin-empty-state">
              <span class="admin-empty-icon">📂</span>
              <p>No resources found matching the criteria.</p>
            </div>
          </td>
        </tr>
      `;
    } else {
      renderAdminResourceTable(resources);
    }
    
    renderAdminResourcePagination(meta);
  } else {
    if (window.AdminUI) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 32px 0;">
            <div class="admin-error-state">
              <span class="admin-error-icon">⚠️</span>
              <p>${window.AdminUI.escapeAdminHtml(response.message || 'Failed to retrieve resources from server.')}</p>
            </div>
          </td>
        </tr>
      `;
    }
  }
}

/**
 * Assembles resource rows and appends them to the table DOM body.
 * @param {Array} resources
 */
function renderAdminResourceTable(resources) {
  const tbody = document.getElementById('admin-resource-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  resources.forEach(res => {
    const tr = document.createElement('tr');
    
    // Check if soft deleted
    const isDeleted = res.deleted_at !== null && res.deleted_at !== undefined;
    if (isDeleted) {
      tr.className = 'admin-row-deleted';
    }
    
    // Styling tags based on values
    const typeBadge = window.AdminUI.createAdminBadge(res.resource_type, `type-${res.resource_type}`);
    const statusBadge = window.AdminUI.createAdminBadge(res.status, `status-${res.status}`);
    const legalBadge = window.AdminUI.createAdminBadge(res.legal_status, `legal-${res.legal_status}`);
    const safetyBadge = window.AdminUI.createAdminBadge(res.safety_status, `safety-${res.safety_status}`);

    const featuredBadge = `
      <button class="admin-badge-toggle toggle-featured ${res.is_featured ? 'active' : ''}" 
              onclick="AdminResources.toggleFeatured(${res.id}, ${res.is_featured})" 
              title="Toggle Featured Status">
        ${res.is_featured ? '⭐ Yes' : '⚪ No'}
      </button>
    `;
    
    const trendingBadge = `
      <button class="admin-badge-toggle toggle-trending ${res.is_trending ? 'active' : ''}" 
              onclick="AdminResources.toggleTrending(${res.id}, ${res.is_trending})" 
              title="Toggle Trending Status">
        ${res.is_trending ? '🔥 Yes' : '⚪ No'}
      </button>
    `;

    const updatedDate = window.AdminUI.formatAdminDate(res.updated_at || res.created_at);
    
    // Build actions buttons
    let actionsHtml = '';
    
    // View
    if (!isDeleted && res.status === 'published' && res.legal_status === 'approved' && (res.safety_status === 'safe' || res.safety_status === 'warning')) {
      actionsHtml += `<a href="../resource-detail.html?slug=${res.slug}" class="btn-table btn-view" target="_blank" title="View Public Resource">👁️</a>`;
    } else {
      actionsHtml += `<span class="btn-table btn-view disabled" title="Resource is private or review not completed">👁️</span>`;
    }
    
    // Edit (must link via id)
    actionsHtml += `<a href="edit-resource.html?id=${res.id}" class="btn-table btn-edit" title="Edit Resource">✏️</a>`;
    
    // Publish / Revert
    if (res.status === 'published') {
      actionsHtml += `<button class="btn-table btn-draft" onclick="AdminResources.updateResourceStatus(${res.id}, 'draft')" title="Revert to Draft">📝</button>`;
    } else {
      actionsHtml += `<button class="btn-table btn-publish" onclick="AdminResources.updateResourceStatus(${res.id}, 'published')" title="Publish Resource">📤</button>`;
    }

    // Archive / Revert
    if (res.status === 'archived') {
      actionsHtml += `<button class="btn-table btn-draft" onclick="AdminResources.updateResourceStatus(${res.id}, 'draft')" title="Revert to Draft">📝</button>`;
    } else {
      actionsHtml += `<button class="btn-table btn-archive" onclick="AdminResources.updateResourceStatus(${res.id}, 'archived')" title="Archive Resource">📦</button>`;
    }
    
    // Delete / Restore
    if (isDeleted) {
      actionsHtml += `<button class="btn-table btn-restore" onclick="AdminResources.restoreResource(${res.id})" title="Restore Resource">🔄</button>`;
    } else {
      actionsHtml += `<button class="btn-table btn-delete" onclick="AdminResources.deleteResource(${res.id})" title="Delete Resource">🗑️</button>`;
    }
    
    tr.innerHTML = `
      <td>
        <div class="admin-resource-title-wrapper">
          <strong>${window.AdminUI.escapeAdminHtml(res.title)}</strong>
          ${isDeleted ? '<span class="admin-status-trash">Trash</span>' : ''}
        </div>
      </td>
      <td>${typeBadge}</td>
      <td>${statusBadge}</td>
      <td>${legalBadge}</td>
      <td>${safetyBadge}</td>
      <td>${featuredBadge}</td>
      <td>${trendingBadge}</td>
      <td><span class="text-muted text-sm">${updatedDate}</span></td>
      <td>
        <div class="admin-table-actions">
          ${actionsHtml}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Renders pagination page links.
 * @param {Object} meta
 */
function renderAdminResourcePagination(meta) {
  const container = document.getElementById('admin-pagination');
  if (!container) return;

  const totalCount = meta.total || 0;
  const totalPages = meta.totalPages || 1;
  const currentPage = meta.page || 1;
  
  container.innerHTML = `
    <span class="pagination-info">Showing page ${currentPage} of ${totalPages} (Total: ${totalCount})</span>
    <div class="pagination-buttons">
      <button class="btn btn-sm btn-secondary" ${currentPage === 1 ? 'disabled' : ''} onclick="AdminResources.changePage(${currentPage - 1})">◀ Prev</button>
      <button class="btn btn-sm btn-secondary" ${currentPage === totalPages ? 'disabled' : ''} onclick="AdminResources.changePage(${currentPage + 1})">Next ▶</button>
    </div>
  `;
}

/**
 * Changes page number and triggers reload.
 * @param {number} page
 */
function changePage(page) {
  resourceFilters.page = page;
  loadAdminResourceList();
}

/**
 * Sets up listeners on input filters.
 */
function bindAdminResourceFilters() {
  const searchInput = document.getElementById('admin-resource-search');
  const typeFilter = document.getElementById('admin-resource-type');
  const statusFilter = document.getElementById('admin-resource-status');
  const legalFilter = document.getElementById('admin-resource-legal');
  const safetyFilter = document.getElementById('admin-resource-safety');
  const sortFilter = document.getElementById('admin-resource-sort');

  // Search input with debounce
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        resourceFilters.search = searchInput.value.trim();
        resourceFilters.page = 1;
        loadAdminResourceList();
      }, 300);
    });
  }

  // Dropdowns
  const selectFilters = [
    { el: typeFilter, key: 'type' },
    { el: statusFilter, key: 'status' },
    { el: legalFilter, key: 'legal' },
    { el: safetyFilter, key: 'safety' },
    { el: sortFilter, key: 'sort' }
  ];

  selectFilters.forEach(item => {
    if (item.el) {
      item.el.addEventListener('change', () => {
        resourceFilters[item.key] = item.el.value;
        resourceFilters.page = 1;
        loadAdminResourceList();
      });
    }
  });
}

/**
 * Soft deletes resource after admin confirmation.
 * @param {number} id
 */
async function deleteResource(id) {
  openConfirmModal({
    title: 'Delete Resource?',
    message: 'Are you sure you want to move this resource to trash? This will hide it from public pages.',
    onConfirm: async () => {
      const response = await window.API.deleteResource(id);
      if (response.success) {
        window.AdminUI.showAdminToast(response.message || 'Resource moved to trash successfully.', 'success');
        loadAdminResourceList();
      } else {
        window.AdminUI.showAdminToast(response.message || 'Failed to delete resource.', 'error');
      }
    }
  });
}

/**
 * Restores a soft-deleted resource.
 * @param {number} id
 */
async function restoreResource(id) {
  openConfirmModal({
    title: 'Restore Resource?',
    message: 'Are you sure you want to restore this resource from trash?',
    onConfirm: async () => {
      const response = await window.API.restoreResource(id);
      if (response.success) {
        window.AdminUI.showAdminToast(response.message || 'Resource restored successfully.', 'success');
        loadAdminResourceList();
      } else {
        window.AdminUI.showAdminToast(response.message || 'Failed to restore resource.', 'error');
      }
    }
  });
}

/**
 * Patches resource status (published, draft, pending_review, rejected, archived).
 * @param {number} id
 * @param {string} status
 */
async function updateResourceStatus(id, status) {
  const response = await window.API.updateResourceStatus(id, status);
  if (response.success) {
    window.AdminUI.showAdminToast(response.message || `Resource status set to ${status} successfully.`, 'success');
    loadAdminResourceList();
  } else {
    window.AdminUI.showAdminToast(response.message || 'Failed to update resource status.', 'error');
  }
}

/**
 * Toggles resource featured status.
 * @param {number} id
 * @param {boolean} currentValue
 */
async function toggleFeatured(id, currentValue) {
  const nextValue = !currentValue;
  const response = await window.API.updateResourceFeatured(id, nextValue);
  if (response.success) {
    window.AdminUI.showAdminToast(response.message || `Resource featured status set to ${nextValue ? 'Yes' : 'No'}.`, 'success');
    loadAdminResourceList();
  } else {
    window.AdminUI.showAdminToast(response.message || 'Failed to update featured status.', 'error');
  }
}

/**
 * Toggles resource trending status.
 * @param {number} id
 * @param {boolean} currentValue
 */
async function toggleTrending(id, currentValue) {
  const nextValue = !currentValue;
  const response = await window.API.updateResourceTrending(id, nextValue);
  if (response.success) {
    window.AdminUI.showAdminToast(response.message || `Resource trending status set to ${nextValue ? 'Yes' : 'No'}.`, 'success');
    loadAdminResourceList();
  } else {
    window.AdminUI.showAdminToast(response.message || 'Failed to update trending status.', 'error');
  }
}

/**
 * Wrapper for AdminUI confirm modal
 * @param {Object} options
 */
function openConfirmModal(options) {
  if (window.AdminUI && typeof window.AdminUI.openConfirmModal === 'function') {
    window.AdminUI.openConfirmModal(options);
  } else {
    const ok = confirm(`${options.title}\n\n${options.message}`);
    if (ok && typeof options.onConfirm === 'function') {
      options.onConfirm();
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initAdminResourcesPage);

// Expose functions globally
window.AdminResources = {
  initAdminResourcesPage,
  loadAdminResourceList,
  renderAdminResourceTable,
  renderAdminResourcePagination,
  bindAdminResourceFilters,
  deleteResource,
  restoreResource,
  updateResourceStatus,
  toggleFeatured,
  toggleTrending,
  openConfirmModal,
  changePage
};
