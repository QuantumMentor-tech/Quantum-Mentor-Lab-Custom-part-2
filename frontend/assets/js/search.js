'use strict';

/**
 * Quantum Mentor World
 * search.js — Public search results driver.
 *
 * Captures text queries, type filters, access types, source structures, category,
 * and tag dropdown parameters to render paginated cards.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSearchPage();
});

/* ─── Initialize Search Page Lifecycle ───────────────────────── */
async function initSearchPage() {
  await loadSearchFilterOptions();
  bindSearchEvents();
  executeSearch();
}

/* ─── Fetch Categories & Tags for Search Filters ────────────── */
async function loadSearchFilterOptions() {
  try {
    const [categoriesResponse, tagsResponse] = await Promise.all([
      window.API.getCategories(),
      window.API.getTags()
    ]);

    if (categoriesResponse.success) {
      populateSearchCategoryDropdown(categoriesResponse.data || []);
    }
    if (tagsResponse.success) {
      populateSearchTagDropdown(tagsResponse.data || []);
    }

    // Populate Access & Source Types in Search Dropdowns
    populateSearchAccessDropdown();
    populateSearchSourceDropdown();

    // After loading dropdown options, sync dropdown selections to URL state
    const params = window.Filters.getUrlParams();
    syncControlsFromUrlParams(params);
  } catch (error) {
    console.error('[Search] Failed to load filter options:', error);
  }
}

/* ─── Dropdown Populations Helpers ───────────────────────────── */
function populateSearchCategoryDropdown(categories) {
  const select = document.getElementById('search-category-select');
  if (!select) return;
  select.innerHTML = '<option value="">All Categories</option>';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.slug;
    opt.textContent = cat.name;
    select.appendChild(opt);
  });
}

function populateSearchTagDropdown(tags) {
  const select = document.getElementById('search-tag-select');
  if (!select) return;
  select.innerHTML = '<option value="">All Tags</option>';
  tags.forEach(tag => {
    const opt = document.createElement('option');
    opt.value = tag.slug;
    opt.textContent = tag.name;
    select.appendChild(opt);
  });
}

function populateSearchAccessDropdown() {
  const select = document.getElementById('search-access-select');
  if (!select) return;
  select.innerHTML = `
    <option value="">All Access Types</option>
    <option value="free">Free</option>
    <option value="paid">Paid</option>
    <option value="freemium">Freemium</option>
    <option value="open_source">Open Source</option>
    <option value="public_domain">Public Domain</option>
    <option value="external">External</option>
  `;
}

function populateSearchSourceDropdown() {
  const select = document.getElementById('search-source-select');
  if (!select) return;
  select.innerHTML = `
    <option value="">All Source Types</option>
    <option value="official">Official</option>
    <option value="open_source">Open Source</option>
    <option value="public_domain">Public Domain</option>
    <option value="freeware">Freeware</option>
    <option value="creator_approved">Creator Approved</option>
    <option value="licensed">Licensed</option>
    <option value="educational">Educational</option>
  `;
}

/* ─── Sync Input Controls to Param State ─────────────────────── */
function syncControlsFromUrlParams(params) {
  const qInput = document.getElementById('search-input');
  const typeSelect = document.getElementById('search-type-select');
  const catSelect = document.getElementById('search-category-select');
  const tagSelect = document.getElementById('search-tag-select');
  const accessSelect = document.getElementById('search-access-select');
  const sourceSelect = document.getElementById('search-source-select');
  const sortSelect = document.getElementById('search-sort-select');

  if (qInput) qInput.value = params.q || '';
  if (typeSelect) typeSelect.value = params.type || '';
  if (catSelect) catSelect.value = params.category || '';
  if (tagSelect) tagSelect.value = params.tag || '';
  if (accessSelect) accessSelect.value = params.access_type || '';
  if (sourceSelect) sourceSelect.value = params.source_type || '';
  if (sortSelect) sortSelect.value = params.sort || 'latest';
}

/* ─── Compile Search Query State from DOM ────────────────────── */
function getSearchQueryState() {
  const state = {
    q: '',
    type: '',
    category: '',
    tag: '',
    access_type: '',
    source_type: '',
    sort: 'latest',
    page: 1
  };

  const qInput = document.getElementById('search-input');
  const typeSelect = document.getElementById('search-type-select');
  const catSelect = document.getElementById('search-category-select');
  const tagSelect = document.getElementById('search-tag-select');
  const accessSelect = document.getElementById('search-access-select');
  const sourceSelect = document.getElementById('search-source-select');
  const sortSelect = document.getElementById('search-sort-select');

  if (qInput) state.q = qInput.value.trim();
  if (typeSelect) state.type = typeSelect.value;
  if (catSelect) state.category = catSelect.value;
  if (tagSelect) state.tag = tagSelect.value;
  if (accessSelect) state.access_type = accessSelect.value;
  if (sourceSelect) state.source_type = sourceSelect.value;
  if (sortSelect) state.sort = sortSelect.value;

  const urlParams = window.Filters.getUrlParams();
  state.page = parseInt(urlParams.page, 10) || 1;

  return state;
}

/* ─── Execute Fetch Request against Search Endpoint ───────────── */
async function executeSearch() {
  const grid = document.getElementById('search-results');
  const status = document.getElementById('search-status');
  const loading = document.getElementById('search-loading');
  const errorEl = document.getElementById('search-error');
  const empty = document.getElementById('search-empty');
  const pagination = document.getElementById('search-pagination');

  if (!grid) return;

  if (loading) loading.style.display = 'block';
  if (errorEl) errorEl.style.display = 'none';
  if (empty) empty.style.display = 'none';
  grid.style.display = 'none';
  grid.innerHTML = '';
  if (status) status.textContent = '';
  if (pagination) pagination.innerHTML = '';

  const params = window.Filters.getUrlParams();

  // Dynamic SEO Integration
  if (window.SEO) {
    if (params.q) {
      window.SEO.updatePageTitle(`Search Results for "${params.q}"`);
    } else {
      window.SEO.updatePageTitle('Search Legal Educational Resources');
    }
    window.SEO.setNoIndex(); // Enforce noindex on queries
  }

  try {
    const response = await window.API.getResources(params);

    if (loading) loading.style.display = 'none';

    if (!response.success) {
      if (errorEl) {
        errorEl.innerHTML = `
          <div class="error-state state-message alert alert-danger text-center" style="display: block; width: 100%;">
            <span style="font-size: var(--text-2xl); display: block; margin-bottom: 8px;">⚠️</span>
            <p>${window.UI.escapeHtml(response.message || 'An error occurred.')}</p>
          </div>
        `;
        errorEl.style.display = 'block';
      }
      return;
    }

    const resources = response.data || [];
    const meta = response.meta || {};

    renderSearchStatus(meta, resources.length);

    if (resources.length === 0) {
      if (empty) {
        empty.innerHTML = `
          <div class="empty-state state-message alert alert-info text-center" style="display: block; width: 100%;">
            <span style="font-size: var(--text-2xl); display: block; margin-bottom: 8px;">🔍</span>
            <p>No resources found matching the specified search criteria.</p>
          </div>
        `;
        empty.style.display = 'block';
      }
      return;
    }

    // Render results
    grid.innerHTML = resources.map(window.UI.createResourceCard).join('');
    grid.style.display = 'grid';

    // Render pagination
    if (pagination && meta.totalPages > 1) {
      window.Pagination.renderPaginationControls(pagination, meta, handleSearchPagination);
    }

    // Update active filter chips
    window.Filters.updateActiveFilterChips('search-', (removedKey) => {
      const state = window.Filters.getUrlParams();
      delete state[removedKey];
      state.page = 1;
      window.Filters.setUrlParams(state);
      syncControlsFromUrlParams(state);
      executeSearch();
    });

    // Toggle reset filters visibility
    const clearBtn = document.getElementById('search-clear-filters');
    if (clearBtn) {
      const activeKeys = Object.keys(params).filter(k => k !== 'page' && k !== 'limit');
      clearBtn.style.display = activeKeys.length > 0 ? 'block' : 'none';
    }

  } catch (error) {
    if (loading) loading.style.display = 'none';
    if (errorEl) {
      errorEl.innerHTML = `
        <div class="error-state state-message alert alert-danger text-center" style="display: block; width: 100%;">
          <span style="font-size: var(--text-2xl); display: block; margin-bottom: 8px;">⚠️</span>
          <p>Unable to connect to the backend server. Please verify the API is online.</p>
        </div>
      `;
      errorEl.style.display = 'block';
    }
    console.error('[Search] Execution error:', error);
  }
}

/* ─── Render Search result status ────────────────────────────── */
function renderSearchStatus(meta, count) {
  const statusEl = document.getElementById('search-status');
  if (!statusEl) return;

  const total = meta.total || count;
  const start = total === 0 ? 0 : (((meta.page - 1) * meta.limit) + 1);
  const end = Math.min(start + meta.limit - 1, total);

  const query = window.Filters.getUrlParams().q;
  const activeFilters = Object.keys(window.Filters.getUrlParams()).filter(k => k !== 'page' && k !== 'limit');

  if (total === 0) {
    statusEl.textContent = 'No resources found';
  } else if (query) {
    statusEl.textContent = `Showing ${start}-${end} of ${total} results for "${query}"`;
  } else if (activeFilters.length > 0) {
    statusEl.textContent = `Showing ${start}-${end} of ${total} filtered resources`;
  } else {
    statusEl.textContent = `Browse all public resources (${total} total)`;
  }
}

/* ─── Page Index Navigate handler ────────────────────────────── */
function handleSearchPagination(page) {
  const state = window.Filters.getUrlParams();
  state.page = page;
  window.Filters.setUrlParams(state);
  executeSearch();
}

/* ─── Bind Search input controls events ─────────────────────── */
function bindSearchEvents() {
  const qInput = document.getElementById('search-input');
  const typeSelect = document.getElementById('search-type-select');
  const catSelect = document.getElementById('search-category-select');
  const tagSelect = document.getElementById('search-tag-select');
  const accessSelect = document.getElementById('search-access-select');
  const sourceSelect = document.getElementById('search-source-select');
  const sortSelect = document.getElementById('search-sort-select');
  const searchBtn = document.getElementById('search-button');
  const clearBtn = document.getElementById('search-clear-filters');

  const triggerChange = () => {
    const state = getSearchQueryState();
    state.page = 1; // Reset to page 1
    window.Filters.setUrlParams(state);
    executeSearch();
  };

  // Dropdown listeners
  [typeSelect, catSelect, tagSelect, accessSelect, sourceSelect, sortSelect].forEach(select => {
    if (select) select.addEventListener('change', triggerChange);
  });

  // Input triggers
  if (qInput) {
    qInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerChange();
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', triggerChange);
  }

  // Clear filters triggers
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      window.Filters.clearUrlParams(['q', 'type', 'category', 'tag', 'access_type', 'source_type', 'sort']);
      const state = { page: 1 };
      window.Filters.setUrlParams(state);
      syncControlsFromUrlParams(state);
      executeSearch();
    });
  }
}

/* ─── Export Globals ─────────────────────────────────────────── */
window.SearchPage = {
  initSearchPage,
  loadSearchFilterOptions,
  syncControlsFromUrlParams,
  getSearchQueryState,
  executeSearch,
  renderSearchStatus,
  handleSearchPagination,
  bindSearchEvents
};
