'use strict';

/**
 * Quantum Mentor World
 * ui.js — Shared UI rendering and card compilation utilities.
 *
 * Exposes reusable rendering functions to maintain consistency across listing,
 * search, and landing pages. Establishes XSS escaping blocks.
 */

/* ─── HTML escaping utility to prevent XSS ───────────────────── */
function escapeHtml(value) {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ─── Text Truncate Helper ───────────────────────────────────── */
function truncate(text, max = 120) {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + '...';
}

/* ─── Date Formatter Helper ──────────────────────────────────── */
function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return '';
  }
}

/* ─── Format Resource Type Labels ────────────────────────────── */
function formatResourceType(type) {
  const types = {
    software: 'Software',
    book: 'Book',
    tool: 'Tool',
    game: 'Game',
    theme_plugin: 'Theme/Plugin',
    watch: 'Watch',
    news: 'News',
    github_repo: 'GitHub Repo'
  };
  return types[type] || type;
}

/* ─── Map DB values to CSS Badge selectors ──────────────────── */
function getBadgeClass(type, val) {
  const normalVal = String(val).toLowerCase().replace('_', '-');
  if (type === 'type') {
    if (val === 'book') return 'books';
    if (val === 'theme_plugin') return 'themes';
    if (val === 'github_repo') return 'github';
    return val;
  }
  if (type === 'legal') {
    if (val === 'approved') return 'approved';
    if (val === 'pending') return 'pending';
    return 'rejected';
  }
  if (type === 'safety') {
    if (val === 'safe') return 'safe';
    if (val === 'warning') return 'caution';
    return 'rejected';
  }
  return normalVal;
}

/* ─── Generate Badge HTML ────────────────────────────────────── */
function createBadge(text, type) {
  const escapedText = escapeHtml(text);
  const escapedType = escapeHtml(type);
  return `<span class="badge badge-${escapedType}">${escapedText}</span>`;
}

/* ─── Generate Resource Card HTML Markup ─────────────────────── */
function createResourceCard(resource) {
  const title = escapeHtml(resource.title);
  const desc = escapeHtml(truncate(resource.short_description, 120));
  const image = resource.featured_image ? escapeHtml(resource.featured_image) : 'assets/images/placeholder-card.png';
  const typeText = formatResourceType(resource.resource_type);
  const typeClass = getBadgeClass('type', resource.resource_type);
  const legalClass = getBadgeClass('legal', resource.legal_status);
  const safetyClass = getBadgeClass('safety', resource.safety_status);
  
  const publishedDate = formatDate(resource.published_at);
  const dateHtml = publishedDate ? `<span class="card-date" style="font-size: var(--text-xs); color: var(--text-muted);">${publishedDate}</span>` : '';

  return `
    <article class="resource-card card animate-in" data-id="${resource.id}" data-type="${resource.resource_type}">
      <div class="resource-card-image-container" style="position: relative; overflow: hidden; background: var(--bg-tertiary);">
        <img
          class="resource-card-image card-image"
          src="${image}"
          alt="${title}"
          loading="lazy"
          onerror="this.src='assets/images/placeholder-card.png'"
          style="width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block;"
        />
        <div style="position: absolute; top: 12px; left: 12px; display: flex; flex-direction: column; gap: 6px; z-index: 10;">
          ${createBadge(typeText, typeClass)}
        </div>
      </div>
      <div class="resource-card-body card-body" style="padding: var(--space-5);">
        <div class="badges-row" style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;">
          <span class="badge" style="background: rgba(255, 255, 255, 0.05); color: var(--text-muted); text-transform: uppercase;">${escapeHtml(resource.access_type)}</span>
          <span class="badge" style="background: rgba(255, 255, 255, 0.05); color: var(--text-muted); text-transform: uppercase;">${escapeHtml(resource.source_type.replace('_', ' '))}</span>
          ${createBadge(resource.legal_status, legalClass)}
          ${createBadge(resource.safety_status, safetyClass)}
        </div>
        <h3 class="card-title" style="margin-bottom: var(--space-2); font-size: var(--text-lg); line-height: 1.3;">${title}</h3>
        <p class="card-description" style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.6;">${desc}</p>
      </div>
      <div class="card-footer" style="padding: var(--space-4) var(--space-5); border-top: 1px solid var(--border-soft); display: flex; align-items: center; justify-content: space-between;">
        ${dateHtml}
        <a href="resource-detail.html?slug=${encodeURIComponent(resource.slug)}" class="btn btn-secondary btn-sm">View Details</a>
      </div>
    </article>
  `;
}

/* ─── State Message Display Builders ─────────────────────────── */
function showLoading(container, message = 'Loading resources...') {
  if (!container) return;
  container.innerHTML = `
    <div class="loading-state state-message text-center" style="padding: 40px 0; width: 100%;">
      <div class="skeleton" style="width: 100%; height: 180px; margin-bottom: var(--space-4); border-radius: var(--radius-lg);"></div>
      <p style="color: var(--text-muted); font-size: var(--text-base);">${escapeHtml(message)}</p>
    </div>
  `;
}

function showError(container, message = 'An error occurred while loading data.') {
  if (!container) return;
  container.innerHTML = `
    <div class="error-state state-message alert alert-danger" style="margin: 20px 0; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
      <span>⚠️</span>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

function showEmpty(container, message = 'No resources found.') {
  if (!container) return;
  container.innerHTML = `
    <div class="empty-state state-message alert alert-info" style="margin: 20px 0; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
      <span>🔍</span>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

/* ─── Fallback Visual Image Block Builder ────────────────────── */
function getFallbackImageBlock(resourceType) {
  const icons = {
    software: '💻',
    book: '📚',
    tool: '🛠️',
    game: '🎮',
    theme_plugin: '🔌',
    watch: '📺',
    news: '📰',
    github_repo: '🐙'
  };
  const icon = icons[resourceType] || '📁';
  const label = formatResourceType(resourceType);
  return `
    <div class="detail-fallback-image text-center" style="padding: 40px 0; background: var(--bg-secondary); border: 1px dashed var(--border-soft); border-radius: var(--radius-lg); display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
      <span style="font-size: var(--text-5xl); display: block; margin-bottom: 12px;">${icon}</span>
      <span style="color: var(--text-muted); font-size: var(--text-sm); font-weight: 500;">No Preview Image Available for this ${label}</span>
    </div>
  `;
}

/* ─── Expose Globally ────────────────────────────────────────── */
window.UI = {
  escapeHtml,
  truncate,
  formatDate,
  formatResourceType,
  createBadge,
  createResourceCard,
  showLoading,
  showError,
  showEmpty,
  getFallbackImageBlock
};
