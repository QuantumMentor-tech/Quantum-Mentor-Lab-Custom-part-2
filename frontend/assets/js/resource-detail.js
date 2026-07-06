'use strict';

/**
 * Quantum Mentor World
 * resource-detail.js — Public detailed resource page logic controller.
 *
 * Extracts slugs from the URL parameter list, queries the public detail endpoint,
 * coordinates skeleton loaders, and populates layouts recursively.
 */

let currentResourceId = null;

/* ─── DOM Trigger ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadResourceDetail();
  initReportModal();
});

/* ─── Extract Slug Parameter from query URL ─────────────────── */
function getSlugFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug') || '';
}

/* ─── Toggle loading states ──────────────────────────────────── */
function showDetailLoading() {
  const loading = document.getElementById('detail-loading');
  const errorEl = document.getElementById('detail-error');
  const content = document.getElementById('detail-content');

  if (loading) loading.style.display = 'block';
  if (errorEl) errorEl.style.display = 'none';
  if (content) content.style.display = 'none';
}

/* ─── Toggle error connection alerts ────────────────────────── */
function showDetailError(message) {
  const loading = document.getElementById('detail-loading');
  const errorEl = document.getElementById('detail-error');
  const content = document.getElementById('detail-content');

  if (loading) loading.style.display = 'none';
  if (content) content.style.display = 'none';
  
  if (errorEl) {
    errorEl.innerHTML = `
      <div class="error-state state-message alert alert-danger" style="margin: 20px 0; text-align: center; display: block; width: 100%;">
        <span style="font-size: var(--text-2xl); display: block; margin-bottom: 8px;">⚠️</span>
        <p style="margin-bottom: 16px; color: var(--accent-danger); font-weight: 500;">${window.UI.escapeHtml(message)}</p>
        <button onclick="loadResourceDetail()" class="btn btn-primary btn-sm">Try Again</button>
      </div>
    `;
    errorEl.style.display = 'block';
  }
}

/* ─── Toggle Not Found templates ────────────────────────────── */
function showDetailNotFound() {
  const loading = document.getElementById('detail-loading');
  const errorEl = document.getElementById('detail-error');
  const content = document.getElementById('detail-content');

  if (loading) loading.style.display = 'none';
  if (content) content.style.display = 'none';

  if (errorEl) {
    errorEl.innerHTML = `
      <div class="empty-state state-message alert alert-info" style="margin: 20px 0; text-align: center; display: block; width: 100%;">
        <span style="font-size: var(--text-2xl); display: block; margin-bottom: 8px;">🔍</span>
        <h3 style="margin-bottom: 8px; font-family: var(--font-primary);">Resource Not Found</h3>
        <p style="margin-bottom: 20px; color: var(--text-muted);">The resource may have been removed, renamed, or is not publicly available.</p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <a href="index.html" class="btn btn-primary btn-sm">Back to Home</a>
          <a href="software.html" class="btn btn-secondary btn-sm">Browse Software</a>
          <a href="books.html" class="btn btn-secondary btn-sm">Browse Books</a>
          <a href="tools.html" class="btn btn-secondary btn-sm">Browse Tools</a>
        </div>
      </div>
    `;
    errorEl.style.display = 'block';
  }
}

/* ─── Fetch Detailed resource payload from API ────────────────── */
async function loadResourceDetail() {
  const slug = getSlugFromUrl();
  
  if (!slug) {
    showDetailError('Resource slug is missing in URL parameter (?slug=...).');
    return;
  }

  showDetailLoading();

  try {
    const response = await window.API.getResourceBySlug(slug);

    if (!response.success) {
      if (response.message === 'Resource not found.' || response.status === 404) {
        showDetailNotFound();
      } else {
        showDetailError(response.message || 'Failed to load resource details.');
      }
      return;
    }

    const resource = response.data;
    if (!resource) {
      showDetailNotFound();
      return;
    }

    renderResourceDetail(resource);
  } catch (error) {
    showDetailError('Unable to load this resource. Please make sure the API server is running.');
    console.error('[Detail] Dynamic load error:', error);
  }
}

/* ─── Populate detail page nodes ──────────────────────────────── */
function renderResourceDetail(resource) {
  const loading = document.getElementById('detail-loading');
  const errorEl = document.getElementById('detail-error');
  const content = document.getElementById('detail-content');

  if (loading) loading.style.display = 'none';
  if (errorEl) errorEl.style.display = 'none';

  // Dynamic SEO Integration
  if (window.SEO) {
    window.SEO.updatePageTitle(resource.title);
    window.SEO.updateMetaDescription(resource.short_description || resource.full_description);
    window.SEO.updateCanonicalUrl(`resource-detail.html?slug=${resource.slug}`);
    window.SEO.updateOpenGraphTags({
      title: `${resource.title} | Quantum Mentor World`,
      description: resource.short_description,
      path: `resource-detail.html?slug=${resource.slug}`,
      image: resource.featured_image,
      type: 'article'
    });
    window.SEO.updateTwitterCardTags({
      title: `${resource.title} | Quantum Mentor World`,
      description: resource.short_description,
      image: resource.featured_image
    });

    const getJSONLDType = (type) => {
      switch (type) {
        case 'software': return 'SoftwareApplication';
        case 'books': return 'Book';
        case 'watch': return 'VideoObject';
        case 'news': return 'Article';
        default: return 'CreativeWork';
      }
    };

    const schema = {
      "@context": "https://schema.org",
      "@type": getJSONLDType(resource.resource_type),
      "name": resource.title,
      "description": resource.short_description || "",
      "url": `${window.SEO.BASE_URL}/resource-detail.html?slug=${resource.slug}`
    };

    if (resource.featured_image) {
      schema.image = resource.featured_image;
    }

    if (resource.details) {
      if (resource.resource_type === 'software') {
        if (resource.details.operating_system) {
          schema.operatingSystem = resource.details.operating_system;
        }
        schema.applicationCategory = "EducationalApplication";
      } else if (resource.resource_type === 'books') {
        if (resource.details.isbn) {
          schema.isbn = resource.details.isbn;
        }
        if (resource.details.pages) {
          schema.numberOfPages = parseInt(resource.details.pages, 10);
        }
      } else if (resource.resource_type === 'watch') {
        if (resource.details.duration) {
          schema.duration = resource.details.duration;
        }
        schema.uploadDate = resource.created_at || new Date().toISOString();
      } else if (resource.resource_type === 'news') {
        schema.headline = resource.title;
        schema.datePublished = resource.created_at || new Date().toISOString();
        schema.dateModified = resource.updated_at || new Date().toISOString();
      }
    }

    window.SEO.injectJSONLD(schema);
  }

  currentResourceId = resource.id;

  renderDetailHero(resource);
  
  // Render image containers
  const imageContainer = document.getElementById('detail-image-container');
  if (imageContainer) {
    const title = window.UI.escapeHtml(resource.title);
    if (resource.featured_image) {
      imageContainer.innerHTML = `
        <img class="detail-image" src="${window.UI.escapeHtml(resource.featured_image)}" alt="${title}" onerror="this.style.display='none'" style="width:100%; border-radius: var(--radius-lg); border: 1px solid var(--border-soft);" />
      `;
    } else {
      const typeText = window.UI.formatResourceType(resource.resource_type);
      imageContainer.innerHTML = `
        <div class="detail-fallback-image text-center" style="padding: var(--space-12) 0; background: var(--bg-secondary); border: 1px dashed var(--border-soft); border-radius: var(--radius-lg); display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <span style="font-size: var(--text-5xl); display: block; margin-bottom: 12px;">📁</span>
          <span style="color: var(--text-muted); font-size: var(--text-sm); font-weight: 500;">No Preview Image Available for this ${typeText}</span>
        </div>
      `;
    }
  }

  // Escape descriptions safely
  const descEl = document.getElementById('detail-description');
  if (descEl) {
    descEl.textContent = resource.full_description || resource.short_description || '';
  }

  renderDetailInfo(resource.details);
  renderCategories(resource.categories);
  renderTags(resource.tags);
  renderSafeLinks(resource.links);

  if (content) content.style.display = 'block';
}

/* ─── Populate Hero Title & Metadata Badges ─────────────────── */
function renderDetailHero(resource) {
  const titleEl = document.getElementById('detail-title');
  const descEl = document.getElementById('detail-short-description');
  const badgesRow = document.getElementById('detail-badges-row');

  if (titleEl) titleEl.textContent = resource.title;
  if (descEl) descEl.textContent = resource.short_description;

  if (badgesRow) {
    const typeLabel = window.UI.formatResourceType(resource.resource_type);
    
    // Map CSS badges mappings
    const typeClass = resource.resource_type === 'book' ? 'books' : (resource.resource_type === 'theme_plugin' ? 'themes' : (resource.resource_type === 'github_repo' ? 'github' : resource.resource_type));
    const legalClass = resource.legal_status === 'approved' ? 'approved' : 'rejected';
    const safetyClass = resource.safety_status === 'safe' ? 'safe' : 'caution';
    const dateStr = window.UI.formatDate(resource.published_at);

    badgesRow.innerHTML = `
      ${window.UI.createBadge(typeLabel, typeClass)}
      ${window.UI.createBadge(resource.access_type, 'ghost')}
      ${window.UI.createBadge(resource.source_type.replace('_', ' '), 'ghost')}
      ${window.UI.createBadge(resource.legal_status, legalClass)}
      ${window.UI.createBadge(resource.safety_status, safetyClass)}
      ${dateStr ? `<span style="font-size: var(--text-xs); color: var(--text-muted); margin-left: 8px;">Published: ${dateStr}</span>` : ''}
    `;
  }
}

/* ─── Populate Sidebar Metadata Grid ────────────────────────── */
function renderDetailInfo(details) {
  const grid = document.getElementById('detail-info-grid');
  if (!grid) return;

  grid.innerHTML = '';
  if (!details) {
    grid.innerHTML = '<p class="text-muted">No additional system properties documented.</p>';
    return;
  }

  // Label configuration list
  const fields = [
    { key: 'platform', label: 'Platform' },
    { key: 'version', label: 'Version' },
    { key: 'developer', label: 'Developer' },
    { key: 'author', label: 'Author' },
    { key: 'publisher', label: 'Publisher' },
    { key: 'language', label: 'Language' },
    { key: 'license_type', label: 'License' },
    { key: 'file_size', label: 'File Size' },
    { key: 'release_year', label: 'Release Year' },
    { key: 'requirements', label: 'Requirements' },
    { key: 'installation_guide', label: 'Installation Guide' },
    { key: 'features', label: 'Features' },
    { key: 'limitations', label: 'Limitations' }
  ];

  let hasContent = false;
  fields.forEach(field => {
    const value = details[field.key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      hasContent = true;
      const card = document.createElement('div');
      card.className = 'detail-info-item';
      card.style.padding = '12px 16px';
      card.style.background = 'var(--bg-secondary)';
      card.style.border = '1px solid var(--border-soft)';
      card.style.borderRadius = 'var(--radius-md)';
      card.innerHTML = `
        <span style="font-size: var(--text-xs); color: var(--text-subtle); display: block; text-transform: uppercase; font-weight: 600;">${window.UI.escapeHtml(field.label)}</span>
        <span style="font-size: var(--text-sm); font-weight: 500; display: block; margin-top: 4px; word-break: break-word;">${window.UI.escapeHtml(value)}</span>
      `;
      grid.appendChild(card);
    }
  });

  if (!hasContent) {
    grid.innerHTML = '<p class="text-muted">No additional system properties documented.</p>';
  }
}

/* ─── Populate Category Badges ──────────────────────────────── */
function renderCategories(categories) {
  const container = document.getElementById('detail-categories');
  if (!container) return;

  container.innerHTML = '';
  if (!categories || categories.length === 0) {
    container.innerHTML = '<span class="text-muted" style="font-size: var(--text-xs);">Uncategorized</span>';
    return;
  }

  categories.forEach(cat => {
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.style.background = 'rgba(255,255,255,0.05)';
    badge.style.border = '1px solid var(--border-soft)';
    badge.style.color = 'var(--text-main)';
    badge.style.marginRight = '6px';
    badge.style.marginBottom = '6px';
    badge.textContent = cat.name;
    container.appendChild(badge);
  });
}

/* ─── Populate Tag Badges ───────────────────────────────────── */
function renderTags(tags) {
  const container = document.getElementById('detail-tags');
  if (!container) return;

  container.innerHTML = '';
  if (!tags || tags.length === 0) {
    container.innerHTML = '<span class="text-muted" style="font-size: var(--text-xs);">No tags linked</span>';
    return;
  }

  tags.forEach(tag => {
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.style.background = 'rgba(255,255,255,0.05)';
    badge.style.border = '1px solid var(--border-soft)';
    badge.style.color = 'var(--primary)';
    badge.style.marginRight = '6px';
    badge.style.marginBottom = '6px';
    badge.textContent = tag.name;
    container.appendChild(badge);
  });
}

/* ─── Populate Safe External Action Links ───────────────────── */
function renderSafeLinks(links) {
  const container = document.getElementById('detail-safe-links');
  if (!container) return;

  container.innerHTML = '';
  if (!links || links.length === 0) {
    container.innerHTML = '<p class="text-muted" style="font-size: var(--text-sm);">No active links documented for this resource.</p>';
    return;
  }

  links.forEach(link => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary safe-link-button';
    btn.style.padding = '10px 16px';
    btn.style.fontSize = 'var(--text-sm)';
    btn.style.marginRight = '8px';
    btn.style.marginBottom = '8px';
    btn.innerHTML = `<span>🔗</span> ${window.UI.escapeHtml(link.label || 'Visit Resource')}`;
    btn.addEventListener('click', () => {
      window.SafeLinks.openSafeLinkModal(link);
    });
    container.appendChild(btn);
  });
}

/* ─── Initialize Resource Report Modal ──────────────────────── */
function initReportModal() {
  const openBtn = document.getElementById('open-report-button');
  const modal = document.getElementById('report-modal');
  const form = document.getElementById('report-form');
  const cancelBtn = document.getElementById('report-cancel');
  
  const typeSelect = document.getElementById('report-type');
  const nameInput = document.getElementById('reporter-name');
  const emailInput = document.getElementById('reporter-email');
  const messageInput = document.getElementById('report-message');
  const submitBtn = document.getElementById('report-submit');
  
  const successAlert = document.getElementById('report-success');
  const errorAlert = document.getElementById('report-error');

  if (!openBtn || !modal) return;

  openBtn.addEventListener('click', () => {
    successAlert.style.display = 'none';
    errorAlert.style.display = 'none';
    successAlert.textContent = '';
    errorAlert.textContent = '';
    form.reset();
    modal.style.display = 'flex';
  });

  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    successAlert.style.display = 'none';
    errorAlert.style.display = 'none';
    successAlert.textContent = '';
    errorAlert.textContent = '';

    const message = messageInput.value.trim();
    if (!message) {
      errorAlert.textContent = 'Please enter a description of the issue.';
      errorAlert.style.display = 'block';
      return;
    }

    const email = emailInput.value.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorAlert.textContent = 'Please enter a valid email address.';
      errorAlert.style.display = 'block';
      return;
    }

    if (!currentResourceId) {
      errorAlert.textContent = 'Resource details are still loading. Please wait.';
      errorAlert.style.display = 'block';
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      const payload = {
        resource_id: currentResourceId,
        report_type: typeSelect.value,
        reporter_name: nameInput.value.trim(),
        reporter_email: email,
        message: message
      };

      const result = await window.API.submitReport(payload);
      
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Report';

      if (result.success) {
        successAlert.textContent = result.message || 'Report submitted successfully.';
        successAlert.style.display = 'block';
        setTimeout(() => {
          modal.style.display = 'none';
        }, 1500);
      } else {
        errorAlert.textContent = result.message || 'Failed to submit report.';
        errorAlert.style.display = 'block';
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Report';
      errorAlert.textContent = 'Unable to connect to the server. Please try again.';
      errorAlert.style.display = 'block';
    }
  });
}

/* ─── Export Globals ─────────────────────────────────────────── */
window.ResourceDetail = {
  loadResourceDetail,
  renderResourceDetail,
  renderDetailHero,
  renderDetailInfo,
  renderCategories,
  renderTags,
  renderSafeLinks,
  showDetailLoading,
  showDetailError,
  showDetailNotFound
};
