'use strict';

/**
 * Quantum Mentor World
 * categories.js — Public category index and detailed resource directory coordinator.
 */

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf('/') + 1);

  if (filename === 'categories.html') {
    loadCategoriesIndex();
  } else if (filename === 'category.html') {
    loadCategoryDetailListing();
  }
});

/* ─── Fetch and Render Category Index Cards ─────────────────── */
async function loadCategoriesIndex() {
  const loading = document.getElementById('categories-loading');
  const errorEl = document.getElementById('categories-error');
  const grid = document.getElementById('categories-grid');

  if (loading) loading.style.display = 'block';
  if (errorEl) errorEl.style.display = 'none';
  if (grid) {
    grid.style.display = 'none';
    grid.innerHTML = '';
  }

  try {
    const response = await window.API.getCategories();

    if (loading) loading.style.display = 'none';

    if (!response.success) {
      showIndexError('Failed to retrieve categories. Please try again.');
      return;
    }

    const categories = response.data || [];
    if (categories.length === 0) {
      showIndexEmpty();
      return;
    }

    renderCategoriesIndex(categories);
  } catch (error) {
    if (loading) loading.style.display = 'none';
    showIndexError('Unable to load categories. Please check if the API server is online.');
    console.error('[Categories] Load error:', error);
  }
}

function renderCategoriesIndex(categories) {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;

  grid.innerHTML = categories.map(cat => {
    const name = window.UI.escapeHtml(cat.name);
    const desc = window.UI.escapeHtml(cat.description || 'No description provided.');
    const slug = encodeURIComponent(cat.slug);
    const countText = cat.resource_count !== undefined ? `${cat.resource_count} resources` : '';
    
    // Choose icons based on categories slug
    const icons = {
      software: '💻',
      books: '📚',
      tools: '🛠️',
      games: '🎮',
      'themes-plugins': '🔌',
      watch: '📺',
      news: '📰',
      'github-repositories': '🐙',
      'ai-tools': '🧠'
    };
    const icon = icons[cat.slug] || '📁';

    return `
      <a href="category.html?slug=${slug}" class="category-card card" style="text-decoration: none; padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-3); height: 100%;">
        <div style="font-size: var(--text-4xl);">${icon}</div>
        <h3 class="category-card-name" style="font-family: var(--font-primary); font-size: var(--text-lg); color: var(--primary); margin: 0;">${name}</h3>
        <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin: 0; flex: 1;">${desc}</p>
        ${countText ? `<span style="font-size: var(--text-xs); color: var(--text-subtle); align-self: flex-start; background: rgba(255,255,255,0.03); padding: 4px 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-soft);">${countText}</span>` : ''}
      </a>
    `;
  }).join('');

  grid.style.display = 'grid';
}

function showIndexError(message) {
  const errorEl = document.getElementById('categories-error');
  if (errorEl) {
    errorEl.innerHTML = `
      <div class="error-state state-message alert alert-danger text-center" style="display: block; width: 100%;">
        <span style="font-size: var(--text-2xl); display: block; margin-bottom: 8px;">⚠️</span>
        <p style="margin-bottom: 16px; color: var(--accent-danger); font-weight: 500;">${window.UI.escapeHtml(message)}</p>
        <button onclick="loadCategoriesIndex()" class="btn btn-primary btn-sm">Try Again</button>
      </div>
    `;
    errorEl.style.display = 'block';
  }
}

function showIndexEmpty() {
  const errorEl = document.getElementById('categories-error');
  if (errorEl) {
    errorEl.innerHTML = `
      <div class="empty-state state-message alert alert-info text-center" style="display: block; width: 100%;">
        <span style="font-size: var(--text-2xl); display: block; margin-bottom: 8px;">📁</span>
        <h3 style="margin-bottom: 8px;">No Categories Available</h3>
        <p style="color: var(--text-muted);">There are no active category listings registered in the directory.</p>
      </div>
    `;
    errorEl.style.display = 'block';
  }
}


/* ─── Fetch and Render Category Resource Listings ───────────── */
async function loadCategoryDetailListing() {
  const slug = getSlugFromUrl();
  if (!slug) {
    showDetailError('Category slug is missing in URL parameter (?slug=...).');
    return;
  }

  const grid = document.getElementById('category-grid');
  const loading = document.getElementById('category-loading');
  const errorEl = document.getElementById('category-error');
  const empty = document.getElementById('category-empty');

  if (loading) loading.style.display = 'block';
  if (errorEl) errorEl.style.display = 'none';
  if (empty) empty.style.display = 'none';
  if (grid) grid.style.display = 'none';

  const params = window.Filters.getUrlParams();

  // Populate search & sorting state inputs
  const qInput = document.getElementById('category-search-input');
  const sortSelect = document.getElementById('category-sort-select');
  if (qInput && qInput.value !== (params.q || '')) qInput.value = params.q || '';
  if (sortSelect && sortSelect.value !== (params.sort || 'latest')) sortSelect.value = params.sort || 'latest';

  try {
    const response = await window.API.getCategoryResources(slug, params);

    if (loading) loading.style.display = 'none';

    if (!response.success) {
      if (response.status === 404 || response.message === 'Category not found.') {
        showDetailError('Category not found. The category may have been renamed or deleted.');
      } else {
        showDetailError(response.message || 'Failed to retrieve category resources.');
      }
      return;
    }

    const resources = response.data || [];
    const meta = response.meta || {};
    
    // Render Title & Description from backend payload
    if (meta.category) {
      const titleEl = document.getElementById('category-title');
      const descEl = document.getElementById('category-description');
      if (titleEl) titleEl.textContent = meta.category.name;
      if (descEl) descEl.textContent = meta.category.description || 'Verified resources for study and development.';
      
      // Dynamic SEO override
      if (window.SEO) {
        window.SEO.updatePageTitle(meta.category.name);
        window.SEO.updateMetaDescription(meta.category.description || 'Verified resources for study and development.');
        window.SEO.updateCanonicalUrl(`category.html?slug=${meta.category.slug}`);
        window.SEO.updateOpenGraphTags({
          title: `${meta.category.name} | Quantum Mentor World`,
          description: meta.category.description || 'Verified resources for study and development.',
          path: `category.html?slug=${meta.category.slug}`
        });
        window.SEO.updateTwitterCardTags({
          title: `${meta.category.name} | Quantum Mentor World`,
          description: meta.category.description || 'Verified resources for study and development.'
        });
      }
    }

    // Render result count state
    renderStatusCount(meta, resources.length);

    if (resources.length === 0) {
      if (empty) {
        empty.innerHTML = `
          <div class="empty-state state-message alert alert-info text-center" style="display: block; width: 100%;">
            <span style="font-size: var(--text-2xl); display: block; margin-bottom: 8px;">🔍</span>
            <p>No resources found in this category matching your keyword search.</p>
          </div>
        `;
        empty.style.display = 'block';
      }
      const paginationEl = document.getElementById('category-pagination');
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }

    // Bind cards and paginator
    if (grid) {
      grid.innerHTML = resources.map(window.UI.createResourceCard).join('');
      grid.style.display = 'grid';
    }

    const paginationEl = document.getElementById('category-pagination');
    if (paginationEl) {
      window.Pagination.renderPaginationControls(paginationEl, meta, (pageIndex) => {
        const nextParams = window.Filters.getUrlParams();
        nextParams.page = pageIndex;
        window.Filters.setUrlParams(nextParams);
        loadCategoryDetailListing();
      });
    }

    // Render filter chips
    window.Filters.updateActiveFilterChips('category-', (removedKey) => {
      const current = window.Filters.getUrlParams();
      delete current[removedKey];
      current.page = 1;
      window.Filters.setUrlParams(current);
      loadCategoryDetailListing();
    });

    // Toggle reset filters button visibility
    const clearBtn = document.getElementById('category-clear-filters');
    if (clearBtn) {
      const activeKeys = Object.keys(params).filter(k => k !== 'page' && k !== 'limit' && k !== 'slug');
      clearBtn.style.display = activeKeys.length > 0 ? 'block' : 'none';
    }

  } catch (error) {
    if (loading) loading.style.display = 'none';
    showDetailError('Unable to load resource cards. Please verify if the API is online.');
    console.error('[Category Details] Fetch error:', error);
  }
}

function renderStatusCount(meta, count) {
  const statusEl = document.getElementById('category-status-text');
  if (!statusEl) return;

  const total = meta.total || count;
  const start = ((meta.page - 1) * meta.limit) + 1;
  const end = Math.min(start + meta.limit - 1, total);

  const query = window.Filters.getUrlParams().q;

  if (total === 0) {
    statusEl.textContent = 'No resources found';
  } else if (query) {
    statusEl.textContent = `Showing ${count} results matching "${query}"`;
  } else {
    statusEl.textContent = `Showing ${start}-${end} of ${total} resources`;
  }
}

function showDetailError(message) {
  const errorEl = document.getElementById('category-error');
  if (errorEl) {
    errorEl.innerHTML = `
      <div class="error-state state-message alert alert-danger text-center" style="display: block; width: 100%;">
        <span style="font-size: var(--text-2xl); display: block; margin-bottom: 8px;">⚠️</span>
        <p style="margin-bottom: 16px; color: var(--accent-danger); font-weight: 500;">${window.UI.escapeHtml(message)}</p>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button onclick="loadCategoryDetailListing()" class="btn btn-primary btn-sm">Try Again</button>
          <a href="categories.html" class="btn btn-secondary btn-sm">Back to Categories</a>
        </div>
      </div>
    `;
    errorEl.style.display = 'block';
  }
}

function getSlugFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug') || '';
}

/* ─── Bind Category Event triggers ────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const qInput = document.getElementById('category-search-input');
  const sortSelect = document.getElementById('category-sort-select');
  const clearBtn = document.getElementById('category-clear-filters');

  if (qInput) {
    qInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const params = window.Filters.getUrlParams();
        params.q = qInput.value.trim();
        params.page = 1;
        window.Filters.setUrlParams(params);
        loadCategoryDetailListing();
      }
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const params = window.Filters.getUrlParams();
      params.sort = sortSelect.value;
      params.page = 1;
      window.Filters.setUrlParams(params);
      loadCategoryDetailListing();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const params = { page: 1 };
      const slug = getSlugFromUrl();
      if (slug) params.slug = slug;
      window.Filters.setUrlParams(params);
      if (qInput) qInput.value = '';
      if (sortSelect) sortSelect.value = 'latest';
      loadCategoryDetailListing();
    });
  }
});
