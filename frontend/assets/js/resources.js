'use strict';

/**
 * Quantum Mentor World
 * resources.js — Public resource listing controller.
 *
 * Drives software, books, tools, games, templates, videos, and repository index pages.
 * Handles dropdown options seeding, state synchronization, active chips, and pagination bindings.
 */

/* ─── DOM Initializer ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const config = getPageConfig();
  if (config) {
    loadFilterOptions();
    bindListingEvents();
    loadResourceListing();
  }
});

/* ─── Determine Page Parameters Mappings ────────────────────── */
function getPageConfig() {
  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf('/') + 1);

  const mappings = {
    'software.html': { type: 'software', endpoint: '/software', title: 'Software' },
    'books.html': { type: 'book', endpoint: '/books', title: 'Books' },
    'tools.html': { type: 'tool', endpoint: '/tools', title: 'Tools' },
    'games.html': { type: 'game', endpoint: '/games', title: 'Games' },
    'themes-plugins.html': { type: 'theme_plugin', endpoint: '/themes', title: 'Themes & Plugins' },
    'watch.html': { type: 'watch', endpoint: '/watch', title: 'Watch' },
    'news.html': { type: 'news', endpoint: '/news', title: 'News' },
    'github-repos.html': { type: 'github_repo', endpoint: '/github', title: 'GitHub Repositories' }
  };

  return mappings[filename] || null;
}

/* ─── Fetch Categories & Tags dropdown elements ────────────── */
async function loadFilterOptions() {
  try {
    const [categoriesResponse, tagsResponse] = await Promise.all([
      window.API.getCategories(),
      window.API.getTags()
    ]);

    if (categoriesResponse.success) {
      populateCategoryDropdown(categoriesResponse.data || []);
    }
    if (tagsResponse.success) {
      populateTagDropdown(tagsResponse.data || []);
    }

    // After loading dropdown options, sync dropdown selections to URL state
    const params = window.Filters.getUrlParams();
    window.Filters.applyFilterStateToControls(params, 'resource-');
  } catch (error) {
    console.error('[Resources] Failed to load filter options:', error);
  }
}

/* ─── Populate Category Dropdown select ─────────────────────── */
function populateCategoryDropdown(categories) {
  const select = document.getElementById('resource-category-select');
  if (!select) return;

  // Clear existing items except default
  select.innerHTML = '<option value="">All Categories</option>';
  
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.slug;
    opt.textContent = cat.name;
    select.appendChild(opt);
  });
}

/* ─── Populate Tag Dropdown select ────────────────────────── */
function populateTagDropdown(tags) {
  const select = document.getElementById('resource-tag-select');
  if (!select) return;

  // Clear existing items except default
  select.innerHTML = '<option value="">All Tags</option>';

  tags.forEach(tag => {
    const opt = document.createElement('option');
    opt.value = tag.slug;
    opt.textContent = tag.name;
    select.appendChild(opt);
  });
}

/* ─── Fetch & Render Listing Resources Grid ─────────────────── */
async function loadResourceListing() {
  const config = getPageConfig();
  if (!config) return;

  const grid = document.getElementById('resource-grid');
  const loading = document.getElementById('resource-loading');
  const errorEl = document.getElementById('resource-error');
  const empty = document.getElementById('resource-empty');

  if (loading) loading.style.display = 'block';
  if (errorEl) errorEl.style.display = 'none';
  if (empty) empty.style.display = 'none';
  if (grid) {
    grid.style.display = 'none';
    grid.innerHTML = '';
  }

  const params = buildListingQuery();

  try {
    const section = config.endpoint.substring(1); // strip leading slash
    const response = await window.API.getSectionFeed(section, params);

    if (loading) loading.style.display = 'none';

    if (!response.success) {
      if (errorEl) {
        window.UI.showError(errorEl, response.message || 'Failed to load directory resources.');
        errorEl.style.display = 'block';
      }
      return;
    }

    const resources = response.data || [];
    const meta = response.meta || {};

    renderListingStatus(meta, resources.length);

    if (resources.length === 0) {
      if (empty) empty.style.display = 'block';
      const paginationEl = document.getElementById('resource-pagination');
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }

    renderResourceGrid(resources);

    // Coordinate generic pagination renderer
    const paginationEl = document.getElementById('resource-pagination');
    if (paginationEl) {
      window.Pagination.renderPaginationControls(paginationEl, meta, handleListingPagination);
    }

    // Refresh active chips list
    window.Filters.updateActiveFilterChips('resource-', (removedKey) => {
      const state = window.Filters.getUrlParams();
      delete state[removedKey];
      state.page = 1;
      window.Filters.setUrlParams(state);
      // Synchronize input elements
      window.Filters.applyFilterStateToControls(state, 'resource-');
      loadResourceListing();
    });

    // Hide or show clear filters button depending on values
    const clearBtn = document.getElementById('resource-clear-filters');
    if (clearBtn) {
      const activeKeys = Object.keys(window.Filters.getUrlParams()).filter(k => k !== 'page' && k !== 'limit');
      clearBtn.style.display = activeKeys.length > 0 ? 'block' : 'none';
    }

  } catch (error) {
    if (loading) loading.style.display = 'none';
    if (errorEl) {
      window.UI.showError(errorEl, 'Unable to connect to the backend server. Please verify the API is online.');
      errorEl.style.display = 'block';
    }
    console.error('[Resources] Listing fetch error:', error);
  }
}

/* ─── Compile Listing query parameters ──────────────────────── */
function buildListingQuery() {
  const config = getPageConfig();
  const state = window.Filters.getUrlParams();
  
  // Enforce types based on the page configurations
  if (config && config.type) {
    state.type = config.type;
  }

  return state;
}

/* ─── Render Listing count description status ──────────────── */
function renderListingStatus(meta, count) {
  const statusEl = document.getElementById('resource-status-text');
  if (!statusEl) return;

  const total = meta.total || count;
  const start = total === 0 ? 0 : (((meta.page - 1) * meta.limit) + 1);
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

/* ─── Render Grid Cards nodes ───────────────────────────────── */
function renderResourceGrid(resources) {
  const grid = document.getElementById('resource-grid');
  if (!grid) return;
  grid.innerHTML = resources.map(window.UI.createResourceCard).join('');
  grid.style.display = 'grid';
}

/* ─── Filter Events coordinations handlers ─────────────────── */
function handleListingSearch() {
  const state = window.Filters.getFilterState('resource-');
  state.page = 1;
  window.Filters.setUrlParams(state);
  loadResourceListing();
}

function handleListingSort() {
  const state = window.Filters.getFilterState('resource-');
  state.page = 1;
  window.Filters.setUrlParams(state);
  loadResourceListing();
}

function handleListingFilters() {
  const state = window.Filters.getFilterState('resource-');
  state.page = 1;
  window.Filters.setUrlParams(state);
  loadResourceListing();
}

function handleListingPagination(page) {
  const state = window.Filters.getUrlParams();
  state.page = page;
  window.Filters.setUrlParams(state);
  loadResourceListing();
}

/* ─── Bind Listing events ───────────────────────────────────── */
function bindListingEvents() {
  window.Filters.bindCommonFilterEvents({
    onFilterChange: (state) => {
      loadResourceListing();
    }
  }, 'resource-');
}

/* ─── Export Globals ─────────────────────────────────────────── */
window.ResourcesPage = {
  getPageConfig,
  loadFilterOptions,
  populateCategoryDropdown,
  populateTagDropdown,
  loadResourceListing,
  buildListingQuery,
  renderListingStatus,
  renderResourceGrid,
  handleListingSearch,
  handleListingSort,
  handleListingFilters,
  handleListingPagination,
  bindListingEvents
};
