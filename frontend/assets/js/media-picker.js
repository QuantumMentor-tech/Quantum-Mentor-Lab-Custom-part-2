'use strict';

/**
 * Quantum Mentor World — Admin Media Picker Modal Helper
 * assets/js/media-picker.js
 */

/**
 * Opens a media picker modal overlay to select an uploaded image file.
 *
 * @param {Function} onSelect - Callback receiving selected image URL
 */
function openMediaPicker(onSelect) {
  let backdrop = document.getElementById('admin-media-picker-modal');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'admin-media-picker-modal';
    backdrop.className = 'admin-modal-backdrop';
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--bg-overlay);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3000;
      padding: 16px;
      backdrop-filter: blur(4px);
    `;

    const card = document.createElement('div');
    card.className = 'admin-modal-card admin-media-picker';
    card.style.cssText = `
      background: var(--bg-secondary);
      border: 1px solid var(--border-primary);
      max-width: 600px;
      width: 100%;
      border-radius: var(--radius-lg);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: 80vh;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
      padding: 15px 20px;
      background: rgba(0, 168, 204, 0.05);
      border-bottom: 1px solid var(--border-soft);
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    header.innerHTML = `
      <h3 style="color:var(--primary); margin:0; font-family:var(--font-primary); font-size:var(--text-lg);">Select cover image</h3>
      <button type="button" id="media-picker-close-x" style="background:none; border:none; color:var(--text-muted); font-size:24px; cursor:pointer; padding:0; line-height:1;">&times;</button>
    `;
    card.appendChild(header);

    const body = document.createElement('div');
    body.id = 'media-picker-body';
    body.style.cssText = `
      padding: 20px;
      overflow-y: auto;
      flex-grow: 1;
    `;
    body.innerHTML = `
      <div id="media-picker-loading" style="text-align:center; color:var(--text-muted); padding:20px 0;">⏳ Loading library images...</div>
      <div id="media-picker-empty" style="display:none; text-align:center; color:var(--text-muted); padding:20px 0;">No media library files found. Upload images in the Media Library page first.</div>
      <div id="media-picker-grid" class="admin-media-picker-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap:12px;"></div>
    `;
    card.appendChild(body);

    const footer = document.createElement('div');
    footer.style.cssText = `
      padding: 12px 20px;
      background: rgba(255,255,255,0.01);
      border-top: 1px solid var(--border-soft);
      display: flex;
      justify-content: flex-end;
    `;
    footer.innerHTML = `<button type="button" id="media-picker-close-btn" class="btn btn-ghost btn-sm">Cancel</button>`;
    card.appendChild(footer);

    backdrop.appendChild(card);
    document.body.appendChild(backdrop);

    const closeHandler = () => closeMediaPicker();
    document.getElementById('media-picker-close-x').addEventListener('click', closeHandler);
    document.getElementById('media-picker-close-btn').addEventListener('click', closeHandler);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeHandler();
    });
  }

  // Stash target selection hook function
  backdrop.onSelectCallback = onSelect;
  backdrop.style.display = 'flex';

  loadMediaPickerItems();
}

/**
 * Closes the active media picker dialog.
 */
function closeMediaPicker() {
  const backdrop = document.getElementById('admin-media-picker-modal');
  if (backdrop) {
    backdrop.style.display = 'none';
  }
}

/**
 * Queries the backend for active media files.
 */
async function loadMediaPickerItems() {
  const grid = document.getElementById('media-picker-grid');
  const loading = document.getElementById('media-picker-loading');
  const empty = document.getElementById('media-picker-empty');

  if (!grid) return;

  grid.innerHTML = '';
  loading.style.display = 'block';
  empty.style.display = 'none';

  try {
    const res = await window.API.getMedia({ limit: 100, offset: 0 });
    loading.style.display = 'none';

    if (res.success && res.data && res.data.length > 0) {
      renderMediaPickerGrid(res.data);
    } else {
      empty.style.display = 'block';
    }
  } catch (err) {
    loading.style.display = 'none';
    empty.style.display = 'block';
    console.error('[Media Picker] Fetch fail:', err);
  }
}

/**
 * Selection action helper.
 */
function selectMediaItem(media) {
  const backdrop = document.getElementById('admin-media-picker-modal');
  if (backdrop && typeof backdrop.onSelectCallback === 'function') {
    backdrop.onSelectCallback(media);
  }
  closeMediaPicker();
}

/**
 * Builds structural markup inside picker modal.
 */
function renderMediaPickerGrid(items) {
  const grid = document.getElementById('media-picker-grid');
  if (!grid) return;

  items.forEach(media => {
    const cell = document.createElement('div');
    cell.className = 'admin-media-picker-card';
    cell.style.cssText = `
      cursor: pointer;
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-md);
      overflow: hidden;
      background: var(--card-bg);
      display: flex;
      flex-direction: column;
      transition: border-color 0.2s ease;
    `;
    cell.addEventListener('mouseover', () => {
      cell.style.borderColor = 'var(--primary)';
    });
    cell.addEventListener('mouseout', () => {
      cell.style.borderColor = 'var(--border-soft)';
    });

    const preview = document.createElement('div');
    preview.style.cssText = `
      height: 80px;
      background-image: url("${media.file_url}");
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      background-color: #152238;
    `;
    cell.appendChild(preview);

    const name = document.createElement('span');
    name.style.cssText = `
      font-size: 10px;
      padding: 4px 6px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      color: var(--text-muted);
      text-align: center;
    `;
    name.textContent = media.file_name;
    cell.appendChild(name);

    cell.addEventListener('click', () => selectMediaItem(media));
    grid.appendChild(cell);
  });
}

// Expose utilities globally
window.openMediaPicker = openMediaPicker;
window.closeMediaPicker = closeMediaPicker;
window.loadMediaPickerItems = loadMediaPickerItems;
window.selectMediaItem = selectMediaItem;
window.renderMediaPickerGrid = renderMediaPickerGrid;
