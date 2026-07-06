'use strict';

/**
 * Quantum Mentor World
 * home.js — Root landing page logic.
 *
 * Concurrently queries featured, trending, and latest resources,
 * and lists active categories with counts. Maps slugs to correct static pages.
 */

/* ─── DOM Trigger ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHomepage();
});

/* ─── Initialize Homepage sections ──────────────────────────── */
function initHomepage() {
  loadFeaturedSection();
  loadTrendingSection();
  loadLatestSection();
  loadCategoriesSection();
}

/* ─── Featured Section Loader ────────────────────────────────── */
async function loadFeaturedSection() {
  const container = document.getElementById('featured-resources');
  if (!container) return;

  window.UI.showLoading(container, 'Loading featured resources...');

  try {
    const response = await window.API.getFeatured(8);
    if (!response.success) {
      window.UI.showError(container, response.message || 'Failed to load featured resources.');
      return;
    }

    const resources = response.data || [];
    if (resources.length === 0) {
      window.UI.showEmpty(container, 'No featured resources available.');
      return;
    }

    container.innerHTML = resources.map(window.UI.createResourceCard).join('');
  } catch (error) {
    window.UI.showError(container, 'Unable to connect to the API server.');
    console.error('[Home] Featured load error:', error);
  }
}

/* ─── Trending Section Loader ────────────────────────────────── */
async function loadTrendingSection() {
  const container = document.getElementById('trending-resources');
  if (!container) return;

  window.UI.showLoading(container, 'Loading trending resources...');

  try {
    const response = await window.API.getTrending(8);
    if (!response.success) {
      window.UI.showError(container, response.message || 'Failed to load trending resources.');
      return;
    }

    const resources = response.data || [];
    if (resources.length === 0) {
      window.UI.showEmpty(container, 'No trending resources available.');
      return;
    }

    container.innerHTML = resources.map(window.UI.createResourceCard).join('');
  } catch (error) {
    window.UI.showError(container, 'Unable to connect to the API server.');
    console.error('[Home] Trending load error:', error);
  }
}

/* ─── Latest Section Loader ──────────────────────────────────── */
async function loadLatestSection() {
  const container = document.getElementById('latest-resources');
  if (!container) return;

  window.UI.showLoading(container, 'Loading latest resources...');

  try {
    const response = await window.API.getLatest(8);
    if (!response.success) {
      window.UI.showError(container, response.message || 'Failed to load latest resources.');
      return;
    }

    const resources = response.data || [];
    if (resources.length === 0) {
      window.UI.showEmpty(container, 'No latest resources available.');
      return;
    }

    container.innerHTML = resources.map(window.UI.createResourceCard).join('');
  } catch (error) {
    window.UI.showError(container, 'Unable to connect to the API server.');
    console.error('[Home] Latest load error:', error);
  }
}

/* ─── Browse Categories Loader ───────────────────────────────── */
async function loadCategoriesSection() {
  const container = document.getElementById('category-list');
  if (!container) return;

  container.innerHTML = `
    <div class="skeleton" style="width: 100%; height: 60px;"></div>
  `;

  try {
    const response = await window.API.getCategories();
    if (!response.success) {
      container.innerHTML = '<p class="text-muted">Failed to load categories.</p>';
      return;
    }

    const categories = response.data || [];
    if (categories.length === 0) {
      container.innerHTML = '<p class="text-muted">No categories found.</p>';
      return;
    }

    // Map Category slugs to matching frontend filenames
    const fileMapping = {
      'software': 'software.html',
      'books': 'books.html',
      'tools': 'tools.html',
      'games': 'games.html',
      'themes-plugins': 'themes-plugins.html',
      'watch': 'watch.html',
      'news': 'news.html',
      'github-repositories': 'github-repos.html'
    };

    container.innerHTML = categories.map(cat => {
      const href = fileMapping[cat.slug] || '#';
      const name = window.UI.escapeHtml(cat.name);
      return `
        <a href="${href}" class="category-card animate-in" style="display: flex; flex-direction: column; padding: 16px; background: var(--bg-secondary); border: 1px solid var(--border-soft); border-radius: var(--radius-md); text-decoration: none; transition: border-color var(--transition-fast), transform var(--transition-fast);">
          <span class="category-card-name" style="font-family: var(--font-primary); font-weight: 600; font-size: var(--text-base); color: var(--primary); margin-bottom: 4px;">${name}</span>
          <span class="category-card-count" style="font-size: var(--text-xs); color: var(--text-muted);">${cat.resource_count || 0} Resource${cat.resource_count !== 1 ? 's' : ''}</span>
        </a>
      `;
    }).join('');
  } catch (error) {
    container.innerHTML = '<p class="text-muted">Categories unavailable.</p>';
    console.error('[Home] Categories load error:', error);
  }
}

/* ─── Export Globals ─────────────────────────────────────────── */
window.Home = {
  loadFeaturedSection,
  loadTrendingSection,
  loadLatestSection,
  loadCategoriesSection
};
