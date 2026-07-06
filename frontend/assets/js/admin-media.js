'use strict';

/**
 * Quantum Mentor World — Admin Media Library Controller
 * assets/js/admin-media.js
 */

document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('media-upload-form');
  const fileInput = document.getElementById('media-file-input');
  const dropzone = document.getElementById('media-dropzone');
  const selectedName = document.getElementById('selected-file-name');
  const altInput = document.getElementById('media-alt-text');
  const captionInput = document.getElementById('media-caption');
  
  const uploadButton = document.getElementById('media-upload-button');
  const grid = document.getElementById('media-grid');
  const loadingState = document.getElementById('media-loading');
  const emptyState = document.getElementById('media-empty');
  const errorState = document.getElementById('media-error');

  // Edit Modal nodes
  const editModal = document.getElementById('edit-media-modal');
  const editForm = document.getElementById('edit-media-form');
  const editId = document.getElementById('edit-media-id');
  const editAlt = document.getElementById('edit-media-alt');
  const editCaption = document.getElementById('edit-media-caption');
  const editCancel = document.getElementById('edit-media-cancel');

  let selectedFile = null;

  if (!grid) return;

  // 1. Initial Load
  loadMediaItems();

  // 2. Drag & Drop trigger click
  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        selectedFile = fileInput.files[0];
        selectedName.textContent = `Selected: ${selectedFile.name} (${formatBytes(selectedFile.size)})`;
        errorState.style.display = 'none';
      }
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--primary)';
      dropzone.style.backgroundColor = 'rgba(0, 168, 204, 0.05)';
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = 'var(--border-soft)';
      dropzone.style.backgroundColor = 'transparent';
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--border-soft)';
      dropzone.style.backgroundColor = 'transparent';
      
      if (e.dataTransfer.files.length > 0) {
        selectedFile = e.dataTransfer.files[0];
        selectedName.textContent = `Selected: ${selectedFile.name} (${formatBytes(selectedFile.size)})`;
        errorState.style.display = 'none';
      }
    });
  }

  // 3. Form Submit Upload handler
  if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorState.style.display = 'none';
      errorState.textContent = '';

      if (!selectedFile) {
        errorState.textContent = 'Please choose or drag an image file first.';
        errorState.style.display = 'block';
        return;
      }

      try {
        uploadButton.disabled = true;
        uploadButton.textContent = 'Uploading...';

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('alt_text', altInput.value.trim());
        formData.append('caption', captionInput.value.trim());

        const result = await window.API.uploadMedia(formData);
        
        uploadButton.disabled = false;
        uploadButton.textContent = 'Upload Image';

        if (result.success) {
          window.AdminUI.showAdminToast('Image uploaded successfully.', 'success');
          // Reset file fields
          selectedFile = null;
          selectedName.textContent = '';
          altInput.value = '';
          captionInput.value = '';
          fileInput.value = '';
          // Reload library
          loadMediaItems();
        } else {
          errorState.textContent = result.message || 'File upload rejected.';
          errorState.style.display = 'block';
        }
      } catch (err) {
        uploadButton.disabled = false;
        uploadButton.textContent = 'Upload Image';
        errorState.textContent = 'Network connection failed. Upload rejected.';
        errorState.style.display = 'block';
      }
    });
  }

  // 4. Modal Cancel handlers
  if (editCancel) {
    editCancel.addEventListener('click', () => {
      editModal.style.display = 'none';
    });
  }

  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = editId.value;
      const alt = editAlt.value.trim();
      const caption = editCaption.value.trim();

      try {
        const result = await window.API.updateMedia(id, { alt_text: alt, caption: caption });
        if (result.success) {
          window.AdminUI.showAdminToast('Media metadata updated.', 'success');
          editModal.style.display = 'none';
          loadMediaItems();
        } else {
          window.AdminUI.showAdminToast(result.message || 'Update failed.', 'error');
        }
      } catch (err) {
        window.AdminUI.showAdminToast('Network connection failed.', 'error');
      }
    });
  }

  /**
   * Fetches media items list from API and renders elements.
   */
  async function loadMediaItems() {
    loadingState.style.display = 'block';
    emptyState.style.display = 'none';
    grid.innerHTML = '';

    try {
      const response = await window.API.getMedia({ limit: 48, offset: 0 });
      loadingState.style.display = 'none';

      if (response.success && response.data && response.data.length > 0) {
        renderMediaCards(response.data);
      } else {
        emptyState.style.display = 'block';
      }
    } catch (err) {
      loadingState.style.display = 'none';
      emptyState.style.display = 'block';
      console.error('[Media] Fetch items failed:', err);
    }
  }

  /**
   * Renders the cards in the grid container.
   */
  function renderMediaCards(items) {
    grid.innerHTML = '';
    
    items.forEach(file => {
      const card = document.createElement('div');
      card.className = 'media-grid-item admin-media-card';
      card.style.border = '1px solid var(--border-soft)';
      card.style.background = 'var(--card-bg)';
      card.style.borderRadius = 'var(--radius-md)';
      card.style.overflow = 'hidden';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';

      const previewDiv = document.createElement('div');
      previewDiv.className = 'media-preview admin-media-preview';
      previewDiv.style.height = '120px';
      previewDiv.style.backgroundPosition = 'center';
      previewDiv.style.backgroundRepeat = 'no-repeat';
      previewDiv.style.backgroundSize = 'contain';
      previewDiv.style.backgroundColor = '#152238';
      previewDiv.style.backgroundImage = `url("${file.file_url}")`;
      card.appendChild(previewDiv);

      const detailsDiv = document.createElement('div');
      detailsDiv.className = 'media-details';
      detailsDiv.style.padding = '10px';
      detailsDiv.style.flexGrow = '1';
      detailsDiv.innerHTML = `
        <span class="media-name" style="font-weight:600; font-size:var(--text-sm); display:block; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;" title="${file.file_name}">${file.file_name}</span>
        <span class="media-meta" style="font-size:var(--text-xs); color:var(--text-muted); display:block; margin-top:4px;">${formatBytes(file.file_size)} • ${file.mime_type.split('/')[1].toUpperCase()}</span>
      `;
      card.appendChild(detailsDiv);

      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'media-actions';
      actionsDiv.style.padding = '10px';
      actionsDiv.style.borderTop = '1px solid var(--border-soft)';
      actionsDiv.style.display = 'flex';
      actionsDiv.style.justifyContent = 'space-between';
      actionsDiv.style.gap = '6px';

      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn-table admin-copy-button';
      copyBtn.title = 'Copy File URL';
      copyBtn.textContent = '🔗';
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(file.file_url);
        window.AdminUI.showAdminToast('File URL copied to clipboard!', 'success');
      });
      actionsDiv.appendChild(copyBtn);

      const editBtn = document.createElement('button');
      editBtn.className = 'btn-table';
      editBtn.title = 'Edit Title/Caption';
      editBtn.textContent = '✏️';
      editBtn.addEventListener('click', () => {
        editId.value = file.id;
        editAlt.value = file.alt_text || '';
        editCaption.value = file.caption || '';
        editModal.style.display = 'flex';
      });
      actionsDiv.appendChild(editBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-table admin-danger-text';
      deleteBtn.title = 'Delete Media';
      deleteBtn.textContent = '🗑️';
      deleteBtn.addEventListener('click', () => {
        window.AdminUI.openConfirmModal({
          title: 'Delete Media File',
          message: `Are you sure you want to delete this media file "${file.file_name}"? This action cannot be undone.`,
          onConfirm: async () => {
            try {
              const res = await window.API.deleteMedia(file.id);
              if (res.success) {
                window.AdminUI.showAdminToast('Media file deleted.', 'success');
                loadMediaItems();
              } else {
                window.AdminUI.showAdminToast(res.message || 'Deletion failed.', 'error');
              }
            } catch (err) {
              window.AdminUI.showAdminToast('Network connection failed.', 'error');
            }
          }
        });
      });
      actionsDiv.appendChild(deleteBtn);

      card.appendChild(actionsDiv);
      grid.appendChild(card);
    });
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
});
