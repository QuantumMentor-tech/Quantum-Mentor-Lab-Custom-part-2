'use strict';

/**
 * Quantum Mentor World — Admin Categories Controller
 * assets/js/admin-categories.js
 *
 * Handles fetching list of categories, inline/form editing state, creating new categories,
 * and soft-deleting categories through protected REST endpoints.
 */

let localCategories = [];
let editCategoryId = null;

function initAdminCategories() {
  const form = document.getElementById('admin-add-category-form');
  const nameInput = document.getElementById('cat-name');
  const slugInput = document.getElementById('cat-slug');
  const searchInput = document.getElementById('category-search');

  if (!form) return;

  console.log('[Admin Categories] Initializing categories controller.');

  // Auto-slugify on title input
  if (nameInput && slugInput) {
    nameInput.addEventListener('input', () => {
      if (editCategoryId === null) {
        slugInput.value = generateCategorySlug(nameInput.value);
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
      const filtered = localCategories.filter(cat => 
        cat.name.toLowerCase().includes(query) || 
        cat.slug.toLowerCase().includes(query)
      );
      renderCategories(filtered);
    });
  }

  // Load initial list
  loadCategories();
}

/**
 * Generates URL safe slug from input string.
 * @param {string} val
 * @returns {string}
 */
function generateCategorySlug(val) {
  return val
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Fetches categories list from API.
 */
async function loadCategories() {
  const tbody = document.getElementById('category-tbody');
  if (!tbody) return;

  if (window.AdminUI) {
    window.AdminUI.showAdminLoading(tbody, 'Retrieving categories list...');
  }

  // Use protected admin API
  const response = await window.API.getAdminCategories();
  if (response.success && response.data) {
    localCategories = response.data;
    renderCategories(localCategories);
  } else {
    tbody.innerHTML = `<tr><td colspan="5" class="text-danger text-center">${window.AdminUI.escapeAdminHtml(response.message || 'Failed to fetch categories.')}</td></tr>`;
  }
}

/**
 * Renders categories list to the table rows.
 * @param {Array} list
 */
function renderCategories(list) {
  const tbody = document.getElementById('category-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No categories found.</td></tr>`;
    return;
  }

  list.forEach(cat => {
    const tr = document.createElement('tr');
    
    const isDeleted = cat.deleted_at !== null && cat.deleted_at !== undefined;
    if (isDeleted) {
      tr.className = 'admin-row-deleted';
    }

    const iconVal = cat.icon || '📁';
    const statusVal = isDeleted ? 'deleted' : (cat.status || 'active');
    const statusBadge = window.AdminUI.createAdminBadge(statusVal, `status-${statusVal}`);

    tr.innerHTML = `
      <td style="font-size:20px; text-align:center;">${window.AdminUI.escapeAdminHtml(iconVal)}</td>
      <td>
        <strong>${window.AdminUI.escapeAdminHtml(cat.name)}</strong>
        ${isDeleted ? '<span class="admin-status-trash">Trash</span>' : ''}
      </td>
      <td><code>${window.AdminUI.escapeAdminHtml(cat.slug)}</code></td>
      <td>${statusBadge}</td>
      <td>
        <div class="admin-table-actions" style="justify-content:center;">
          <button class="btn-table btn-edit" onclick="AdminCategories.startEditCategory(${cat.id})" title="Edit" ${isDeleted ? 'disabled' : ''}>✏️</button>
          <button class="btn-table btn-delete" onclick="AdminCategories.deleteCategory(${cat.id})" title="Delete" ${isDeleted ? 'disabled' : ''}>🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Initiates the editing state for a category.
 * @param {number} id
 */
function startEditCategory(id) {
  const cat = localCategories.find(c => c.id === id);
  if (!cat) return;

  editCategoryId = id;

  const header = document.querySelector('.add-pane .card-title');
  if (header) header.textContent = `📂 Edit Category: ${cat.name}`;

  document.getElementById('cat-name').value = cat.name;
  document.getElementById('cat-slug').value = cat.slug;
  document.getElementById('cat-icon').value = cat.icon || '';
  document.getElementById('cat-description').value = cat.description || '';
  document.getElementById('cat-status').value = cat.status || 'active';

  // Modify form button
  const form = document.getElementById('admin-add-category-form');
  let submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.textContent = '💾 Update Category';
  submitBtn.className = 'btn btn-primary';

  // Add cancel button if not present
  let cancelBtn = document.getElementById('btn-cancel-cat-edit');
  if (!cancelBtn) {
    cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.id = 'btn-cancel-cat-edit';
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.style = 'margin-top: 8px; width: 100%;';
    cancelBtn.textContent = 'Cancel Edit';
    cancelBtn.addEventListener('click', cancelCategoryEdit);
    form.appendChild(cancelBtn);
  }
}

/**
 * Resets the editing state back to creation mode.
 */
function cancelCategoryEdit() {
  editCategoryId = null;

  const header = document.querySelector('.add-pane .card-title');
  if (header) header.textContent = '📂 Add New Category';

  const form = document.getElementById('admin-add-category-form');
  form.reset();

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.textContent = '📂 Create Category';

  const cancelBtn = document.getElementById('btn-cancel-cat-edit');
  if (cancelBtn) cancelBtn.remove();
}

/**
 * Handles Form submissions to POST or PATCH endpoint.
 */
async function handleFormSubmit() {
  const name = document.getElementById('cat-name').value.trim();
  const slug = document.getElementById('cat-slug').value.trim();
  const icon = document.getElementById('cat-icon').value.trim();
  const description = document.getElementById('cat-description').value.trim();
  const status = document.getElementById('cat-status').value;

  if (!name || !slug) {
    window.AdminUI.showAdminToast('Name and Slug are required.', 'error');
    return;
  }

  const payload = { name, slug, icon, description, status };

  let response;
  if (editCategoryId !== null) {
    response = await window.API.updateCategory(editCategoryId, payload);
  } else {
    response = await window.API.createCategory(payload);
  }

  if (response.success) {
    window.AdminUI.showAdminToast(response.message || 'Category saved successfully.', 'success');
    cancelCategoryEdit();
    loadCategories();
  } else {
    window.AdminUI.showAdminToast(response.message || 'Failed to save category.', 'error');
  }
}

/**
 * Soft deletes a category.
 * @param {number} id
 */
async function deleteCategory(id) {
  const cat = localCategories.find(c => c.id === id);
  if (!cat) return;

  if (window.AdminUI && typeof window.AdminUI.openConfirmModal === 'function') {
    window.AdminUI.openConfirmModal({
      title: 'Delete Category?',
      message: `Are you sure you want to delete category "${cat.name}"? This will hide it and its classification links from the portal.`,
      onConfirm: async () => {
        const response = await window.API.deleteCategory(id);
        if (response.success) {
          window.AdminUI.showAdminToast(response.message || 'Category deleted successfully.', 'success');
          if (editCategoryId === id) cancelCategoryEdit();
          loadCategories();
        } else {
          window.AdminUI.showAdminToast(response.message || 'Failed to delete category.', 'error');
        }
      }
    });
  } else {
    const ok = confirm(`Are you sure you want to delete category "${cat.name}"?`);
    if (ok) {
      const response = await window.API.deleteCategory(id);
      if (response.success) {
        window.AdminUI.showAdminToast(response.message || 'Category deleted successfully.', 'success');
        if (editCategoryId === id) cancelCategoryEdit();
        loadCategories();
      } else {
        window.AdminUI.showAdminToast(response.message || 'Failed to delete category.', 'error');
      }
    }
  }
}

// Bind load callbacks
document.addEventListener('DOMContentLoaded', initAdminCategories);

// Expose globally
window.AdminCategories = {
  initAdminCategories,
  loadCategories,
  renderCategories,
  startEditCategory,
  cancelCategoryEdit,
  deleteCategory
};
