'use strict';

/**
 * Quantum Mentor World
 * tags.js — Public tag index and detailed resource directory coordinator.
 */

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf('/') + 1);

  if (filename === 'tags.html') {
    loadTagsIndex();
  } else if (filename === 'tag.html') {
    loadTagDetailListing();
  }
});

/* ─── Fetch and Render Tags Cloud List ──────────────────────── */
async function loadTagsIndex() {
  const loading = document.getElementById('tags-loading');
  const errorEl = document.getElementById('tags-error');
  const list = document.getElementById('tags-list');

  if (loading) loading.style.display = 'block';
  if (errorEl) errorEl.style.display = 'none';
  if (list) {
    list.style.display = 'none';
    list.innerHTML = '';
  }

  try {
    const response = await window.API.getTags();

    if (loading) loading.style.display = 'none';

    if (!response.success) {
      showIndexError('Failed to retrieve tags. Please try again.');
      return;
    }

    const tags = response.data || [];
    if (tags.length === 0) {
      showIndexEmpty();
      return;
    }

    renderTagsIndex(tags);
  } catch (error) {
    if (loading) loading.style.display = 'none';
    showIndexError('Unable to load tags. Please verify if the API is online.');
    console.error('[Tags] Load error:', error);
  }
}

function renderTagsIndex(tags) {
  const list = document.getElementById('tags-list');
  if (!list) return;

  list.innerHTML = tags.map(tag => {
    const name = window.UI.escapeHtml(tag.name);
    const desc = tag.description ? window.UI.escapeHtml(tag.description) : '';
    const slug = encodeURIComponent(tag.slug);
    const count = tag.resource_count || 0;
    
    // Dynamically calculate font-size or weight based on counts (tag cloud weight)
    const sizeVal = count > 5 ? 'var(--text-lg)' : (count > 2 ? 'var(--text-base)' : 'var(--text-sm)');
    const countBadge = `<span style="font-size: 10px; opacity: 0.6; margin-left: 6px; background: rgba(0,212,255,0.15); padding: 1px 4px; border-radius: var(--radius-sm); color: var(--primary);">${count}</span>`;

    return `
      <a href="tag.html?slug=${slug}" class="tag-card card" title="${desc}" style="text-decoration: none; padding: 10px 18px; border-radius: var(--radius-full); border: 1px solid var(--border-soft); display: flex; align-items: center; justify-content: center; font-size: ${sizeVal}; font-weight: 500; background: var(--bg-secondary); color: var(--text-main); transition: border-color var(--transition-fast);">
        <span>🏷️ ${name}</span>
        ${countBadge}
      </a>
    `;
  }).join('');

  list.style.display = 'flex';
}

function showIndexError(message) {
  const errorEl = document.getElementById('tags-error');
  if (errorEl) {
    errorEl.innerHTML = `
      <div class="error-state state-message alert alert-danger text-center" style="display: block; width: 100%;">
        <span style="font-size: var(--text-2xl); display: block; margin-bottom: 8px;">⚠️</span>
        <p style="margin-bottom: 16px; color: var(--accent-danger); font-weight: 500;">${window.UI.escapeHtml(message)}</p>
        <button onclick="loadTagsIndex()" class="btn btn-primary btn-sm">Try Again</button>
      </div>
    `;
    errorEl.style.display = 'block';
  }
}

function showIndexEmpty() {
  const errorEl = document.getElementById('tags-error');
  if (errorEl) {
    errorEl.innerHTML = `
      <div class="empty-state state-message alert alert-info text-center" style="display: block; width: 100%;">
        <span style="font-size: var(--text-2xl); display: block; margin-bottom: 8px;">🏷️</span>
        <h3 style="margin-bottom: 8px;">No Tags Available</h3>
        <p style="color: var(--text-muted);">There are no active tag listings registered in the directory.</p>
      </div>
    `;
    errorEl.style.display = 'block';
  }
}


/* ─── Fetch and Render Tag Resource Listings ────────────────── */
async function loadTagDetailListing() {
  const slug = getSlugFromUrl();
  if (!slug) {
    showDetailError('Tag slug is missing in URL parameter (?slug=...).');
    return;
  }

  const grid = document.getElementById('tag-grid');
  const loading = document.getElementById('tag-loading');
  const errorEl = document.getElementById('tag-error');
  const empty = document.getElementById('tag-empty');

  if (loading) loading.style.display = 'block';
  if (errorEl) errorEl.style.display = 'none';
  if (empty) empty.style.display = 'none';
  if (grid) grid.style.display = 'none';

  const params = window.Filters.getUrlParams();

  // Populate search & sorting inputs
  const qInput = document.getElementById('tag-search-input');
  const sortSelect = document.getElementById('tag-sort-select');
  if (qInput && qInput.value !== (params.q || '')) qInput.value = params.q || '';
  if (sortSelect && sortSelect.value !== (params.sort || 'latest')) sortSelect.value = params.sort || 'latest';

  try {
    const response = await window.API.getTagResources(slug, params);

    if (loading) loading.style.display = 'none';

    if (!response.success) {
      if (response.status === 404 || response.message === 'Tag not found.') {
        showDetailError('Tag not found. The tag may have been renamed or deleted.');
      } else {
        showDetailError(response.message || 'Failed to retrieve tag resources.');
      }
      return;
    }

    const resources = response.data || [];
    const meta = response.meta || {};
    
    // Render Title & Description from backend payload
    if (meta.tag) {
      const titleEl = document.getElementById('tag-title');
      const descEl = document.getElementById('tag-description');
      if (titleEl) titleEl.textContent = `Resources Tagged: ${meta.tag.name}`;
      if (descEl) descEl.textContent = meta.tag.description || 'Verified resources for study and development.';
      
      // Dynamic SEO override
      if (window.SEO) {
        window.SEO.updatePageTitle(meta.tag.name);
        window.SEO.updateMetaDescription(meta.tag.description || 'Verified resources for study and development.');
        window.SEO.updateCanonicalUrl(`tag.html?slug=${meta.tag.slug}`);
        window.SEO.updateOpenGraphTags({
          title: `${meta.tag.name} | Quantum Mentor World`,
          description: meta.tag.description || 'Verified resources for study and development.',
          path: `tag.html?slug=${meta.tag.slug}`
        });
        window.SEO.updateTwitterCardTags({
          title: `${meta.tag.name} | Quantum Mentor World`,
          description: meta.tag.description || 'Verified resources for study and development.'
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
            <p>No resources found with this tag matching your keyword search.</p>
          </div>
        `;
        empty.style.display = 'block';
      }
      const paginationEl = document.getElementById('tag-pagination');
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }

    // Bind cards and paginator
    if (grid) {
      grid.innerHTML = resources.map(window.UI.createResourceCard).join('');
      grid.style.display = 'grid';
    }

    const paginationEl = document.getElementById('tag-pagination');
    if (paginationEl) {
      window.Pagination.renderPaginationControls(paginationEl, meta, (pageIndex) => {
        const nextParams = window.Filters.getUrlParams();
        nextParams.page = pageIndex;
        window.Filters.setUrlParams(nextParams);
        loadTagDetailListing();
      });
    }

    // Render filter chips
    window.Filters.updateActiveFilterChips('tag-', (removedKey) => {
      const current = window.Filters.getUrlParams();
      delete current[removedKey];
      current.page = 1;
      window.Filters.setUrlParams(current);
      loadTagDetailListing();
    });

    // Toggle reset filters button visibility
    const clearBtn = document.getElementById('tag-clear-filters');
    if (clearBtn) {
      const activeKeys = Object.keys(params).filter(k => k !== 'page' && k !== 'limit' && k !== 'slug');
      clearBtn.style.display = activeKeys.length > 0 ? 'block' : 'none';
    }

  } catch (error) {
    if (loading) loading.style.display = 'none';
    showDetailError('Unable to load tag resources. Please check if the API server is online.');
    console.error('[Tag Details] Fetch error:', error);
  }
}

function renderStatusCount(meta, count) {
  const statusEl = document.getElementById('tag-status-text');
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
  const errorEl = document.getElementById('tag-error');
  if (errorEl) {
    errorEl.innerHTML = `
      <div class="error-state state-message alert alert-danger text-center" style="display: block; width: 100%;">
        <span style="font-size: var(--text-2xl); display: block; margin-bottom: 8px;">⚠️</span>
        <p style="margin-bottom: 16px; color: var(--accent-danger); font-weight: 500;">${window.UI.escapeHtml(message)}</p>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button onclick="loadTagDetailListing()" class="btn btn-primary btn-sm">Try Again</button>
          <a href="tags.html" class="btn btn-secondary btn-sm">Back to Tags</a>
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

/* ─── Bind Tag Event triggers ────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const qInput = document.getElementById('tag-search-input');
  const sortSelect = document.getElementById('tag-sort-select');
  const clearBtn = document.getElementById('tag-clear-filters');

  if (qInput) {
    qInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const params = window.Filters.getUrlParams();
        params.q = qInput.value.trim();
        params.page = 1;
        window.Filters.setUrlParams(params);
        loadTagDetailListing();
      }
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const params = window.Filters.getUrlParams();
      params.sort = sortSelect.value;
      params.page = 1;
      window.Filters.setUrlParams(params);
      loadTagDetailListing();
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
      loadTagDetailListing();
    });
  }
});
