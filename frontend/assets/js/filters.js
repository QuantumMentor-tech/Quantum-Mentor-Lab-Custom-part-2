'use strict';

/**
 * Quantum Mentor World
 * filters.js — Universal state manager for searching and filtering.
 *
 * Synchronizes controls to/from URL search params, manages debounced search events,
 * and compiles reusable active filter chip triggers.
 */

/* ─── Read Parameters from URL ───────────────────────────────── */
function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};
  
  const allowedKeys = ['q', 'category', 'tag', 'access_type', 'source_type', 'sort', 'page', 'limit', 'featured', 'trending'];
  
  allowedKeys.forEach(key => {
    const val = urlParams.get(key);
    if (val !== null && val !== '') {
      params[key] = val;
    }
  });

  return params;
}

/* ─── Update Parameters in URL without reloading ───────────── */
function setUrlParams(params) {
  const urlParams = new URLSearchParams();
  for (const key in params) {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      urlParams.set(key, params[key]);
    }
  }
  const str = urlParams.toString();
  const queryPart = str ? `?${str}` : '';
  const newUrl = `${window.location.pathname}${queryPart}`;
  window.history.pushState({ path: newUrl }, '', newUrl);
}

/* ─── Remove Specific Keys from URL ────────────────────────── */
function clearUrlParams(keys = []) {
  const params = getUrlParams();
  keys.forEach(key => {
    delete params[key];
  });
  setUrlParams(params);
}

/* ─── Compile Current UI Controls State ──────────────────────── */
function getFilterState(prefix = 'resource-') {
  const state = {
    q: '',
    category: '',
    tag: '',
    access_type: '',
    source_type: '',
    sort: 'latest',
    page: 1
  };

  const qInput = document.getElementById(`${prefix}search-input`) || document.getElementById('search-input');
  const sortSelect = document.getElementById(`${prefix}sort-select`) || document.getElementById('search-sort-select');
  const catSelect = document.getElementById(`${prefix}category-select`) || document.getElementById('search-category-select');
  const tagSelect = document.getElementById(`${prefix}tag-select`) || document.getElementById('search-tag-select');
  const accessSelect = document.getElementById(`${prefix}access-select`) || document.getElementById('search-access-select');
  const sourceSelect = document.getElementById(`${prefix}source-select`) || document.getElementById('search-source-select');

  if (qInput) state.q = qInput.value.trim();
  if (sortSelect) state.sort = sortSelect.value;
  if (catSelect) state.category = catSelect.value;
  if (tagSelect) state.tag = tagSelect.value;
  if (accessSelect) state.access_type = accessSelect.value;
  if (sourceSelect) state.source_type = sourceSelect.value;

  // Handle URL override
  const urlParams = getUrlParams();
  state.page = parseInt(urlParams.page, 10) || 1;

  return state;
}

/* ─── Synchronize Controls with State ───────────────────────── */
function applyFilterStateToControls(state, prefix = 'resource-') {
  const qInput = document.getElementById(`${prefix}search-input`) || document.getElementById('search-input');
  const sortSelect = document.getElementById(`${prefix}sort-select`) || document.getElementById('search-sort-select');
  const catSelect = document.getElementById(`${prefix}category-select`) || document.getElementById('search-category-select');
  const tagSelect = document.getElementById(`${prefix}tag-select`) || document.getElementById('search-tag-select');
  const accessSelect = document.getElementById(`${prefix}access-select`) || document.getElementById('search-access-select');
  const sourceSelect = document.getElementById(`${prefix}source-select`) || document.getElementById('search-source-select');

  if (qInput) qInput.value = state.q || '';
  if (sortSelect) sortSelect.value = state.sort || 'latest';
  if (catSelect) catSelect.value = state.category || '';
  if (tagSelect) tagSelect.value = state.tag || '';
  if (accessSelect) accessSelect.value = state.access_type || '';
  if (sourceSelect) sourceSelect.value = state.source_type || '';
}

/* ─── Render Active Filter Chips ────────────────────────────── */
function updateActiveFilterChips(prefix = 'resource-', onChipRemove) {
  const container = document.getElementById(`${prefix}active-filters`) || document.getElementById('search-active-filters');
  if (!container) return;

  container.innerHTML = '';
  const params = getUrlParams();
  
  const labelMappings = {
    q: 'Search',
    category: 'Category',
    tag: 'Tag',
    access_type: 'Access',
    source_type: 'Source',
    sort: 'Sort'
  };

  let hasChips = false;

  for (const key in params) {
    if (key === 'page' || key === 'limit' || key === 'type') continue;
    
    // Fallback for sort default value
    if (key === 'sort' && params[key] === 'latest') continue;

    hasChips = true;
    const valueText = params[key].replace(/_/g, ' ');
    const chipLabel = labelMappings[key] || key;

    const chip = document.createElement('span');
    chip.className = 'filter-chip';
    chip.innerHTML = `
      <span class="filter-chip-label">${window.UI.escapeHtml(chipLabel)}:</span>
      <span class="filter-chip-value">${window.UI.escapeHtml(valueText)}</span>
      <button type="button" class="filter-chip-remove" aria-label="Remove filter option">×</button>
    `;

    chip.querySelector('.filter-chip-remove').addEventListener('click', () => {
      if (onChipRemove) {
        onChipRemove(key);
      } else {
        const state = getUrlParams();
        delete state[key];
        state.page = 1; // Reset to page 1
        setUrlParams(state);
        window.location.reload();
      }
    });

    container.appendChild(chip);
  }

  container.style.display = hasChips ? 'flex' : 'none';
}

/* ─── Clear All Filters ──────────────────────────────────────── */
function clearAllFilters(prefix = 'resource-', onClear) {
  const defaultKeys = ['q', 'category', 'tag', 'access_type', 'source_type', 'sort'];
  clearUrlParams(defaultKeys);
  
  const qInput = document.getElementById(`${prefix}search-input`) || document.getElementById('search-input');
  const sortSelect = document.getElementById(`${prefix}sort-select`) || document.getElementById('search-sort-select');
  const catSelect = document.getElementById(`${prefix}category-select`) || document.getElementById('search-category-select');
  const tagSelect = document.getElementById(`${prefix}tag-select`) || document.getElementById('search-tag-select');
  const accessSelect = document.getElementById(`${prefix}access-select`) || document.getElementById('search-access-select');
  const sourceSelect = document.getElementById(`${prefix}source-select`) || document.getElementById('search-source-select');

  if (qInput) qInput.value = '';
  if (sortSelect) sortSelect.value = 'latest';
  if (catSelect) catSelect.value = '';
  if (tagSelect) tagSelect.value = '';
  if (accessSelect) accessSelect.value = '';
  if (sourceSelect) sourceSelect.value = '';

  const params = getUrlParams();
  params.page = 1;
  setUrlParams(params);

  if (onClear) onClear();
}

/* ─── Bind Common Filters Event Handlers ────────────────────── */
function bindCommonFilterEvents(config = {}, prefix = 'resource-') {
  const { onFilterChange } = config;
  
  const qInput = document.getElementById(`${prefix}search-input`) || document.getElementById('search-input');
  const sortSelect = document.getElementById(`${prefix}sort-select`) || document.getElementById('search-sort-select');
  const catSelect = document.getElementById(`${prefix}category-select`) || document.getElementById('search-category-select');
  const tagSelect = document.getElementById(`${prefix}tag-select`) || document.getElementById('search-tag-select');
  const accessSelect = document.getElementById(`${prefix}access-select`) || document.getElementById('search-access-select');
  const sourceSelect = document.getElementById(`${prefix}source-select`) || document.getElementById('search-source-select');
  const clearBtn = document.getElementById(`${prefix}clear-filters`) || document.getElementById('search-clear-filters');
  const searchBtn = document.getElementById('search-button');

  const triggerChange = () => {
    const state = getFilterState(prefix);
    // When any filter changes, reset back to page 1
    state.page = 1;
    setUrlParams(state);
    if (onFilterChange) onFilterChange(state);
  };

  // Attach dropdown change events
  [sortSelect, catSelect, tagSelect, accessSelect, sourceSelect].forEach(select => {
    if (select) select.addEventListener('change', triggerChange);
  });

  // Attach search button trigger
  if (searchBtn && qInput) {
    searchBtn.addEventListener('click', triggerChange);
  }

  // Attach input enter key trigger
  if (qInput) {
    qInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerChange();
      }
    });
  }

  // Attach clear filters trigger
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearAllFilters(prefix, () => {
        if (onFilterChange) onFilterChange(getFilterState(prefix));
      });
    });
  }
}

/* ─── Debounce Helper Utility ────────────────────────────────── */
function debounce(fn, delay) {
  let timeoutId = null;
  return function(...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/* ─── Export Globals ─────────────────────────────────────────── */
window.Filters = {
  getUrlParams,
  setUrlParams,
  clearUrlParams,
  getFilterState,
  applyFilterStateToControls,
  updateActiveFilterChips,
  clearAllFilters,
  bindCommonFilterEvents,
  debounce
};
