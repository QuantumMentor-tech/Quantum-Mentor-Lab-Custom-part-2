'use strict';

/**
 * Quantum Mentor World — Admin Contact Messages Controller
 * assets/js/admin-contact-messages.js
 */

document.addEventListener('DOMContentLoaded', () => {
  const statusFilter = document.getElementById('message-status-filter');
  const searchInput = document.getElementById('message-search-input');
  
  const tableBody = document.getElementById('messages-table-body');
  const tableWrapper = document.getElementById('messages-table-wrapper');
  const loadingState = document.getElementById('messages-loading');
  const emptyState = document.getElementById('messages-empty');
  
  // Pagination
  const pageInfo = document.getElementById('messages-page-info');
  const prevBtn = document.getElementById('messages-prev-btn');
  const nextBtn = document.getElementById('messages-next-btn');

  // Modal
  const modal = document.getElementById('view-message-modal');
  const modalContent = document.getElementById('message-detail-content');
  const modalStatusSelect = document.getElementById('modal-status-select');
  const modalCloseX = document.getElementById('view-message-close-x');
  const modalCloseBtn = document.getElementById('view-message-close-btn');

  let currentLimit = 20;
  let currentOffset = 0;
  let activeMessageId = null;
  let debounceTimeout = null;

  if (!tableBody) return;

  // 1. Initial load
  loadMessages();

  // 2. Filter & Search listeners
  statusFilter.addEventListener('change', () => {
    currentOffset = 0;
    loadMessages();
  });

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      currentOffset = 0;
      loadMessages();
    }, 400);
  });

  // 3. Pagination listeners
  prevBtn.addEventListener('click', () => {
    if (currentOffset >= currentLimit) {
      currentOffset -= currentLimit;
      loadMessages();
    }
  });

  nextBtn.addEventListener('click', () => {
    currentOffset += currentLimit;
    loadMessages();
  });

  // 4. Modal listeners
  const hideModal = () => {
    modal.style.display = 'none';
    activeMessageId = null;
  };
  modalCloseX.addEventListener('click', hideModal);
  modalCloseBtn.addEventListener('click', hideModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
  });

  modalStatusSelect.addEventListener('change', async () => {
    if (!activeMessageId) return;
    const newStatus = modalStatusSelect.value;
    try {
      const result = await window.API.updateMessageStatus(activeMessageId, newStatus);
      if (result.success) {
        window.AdminUI.showAdminToast('Message status updated successfully.', 'success');
        loadMessages();
      } else {
        window.AdminUI.showAdminToast(result.message || 'Failed to update status.', 'error');
      }
    } catch (err) {
      window.AdminUI.showAdminToast('Network connection failed.', 'error');
    }
  });

  /**
   * Fetches messages from API.
   */
  async function loadMessages() {
    loadingState.style.display = 'block';
    emptyState.style.display = 'none';
    tableWrapper.style.display = 'none';
    
    prevBtn.disabled = true;
    nextBtn.disabled = true;

    try {
      const filters = {
        limit: currentLimit,
        offset: currentOffset,
        status: statusFilter.value,
        search: searchInput.value.trim()
      };

      const res = await window.API.getAdminMessages(filters);
      loadingState.style.display = 'none';

      if (res.success && res.data && res.data.length > 0) {
        renderTable(res.data);
        tableWrapper.style.display = 'block';
        
        // Handle pagination state
        const total = res.meta ? res.meta.total : res.data.length;
        const from = currentOffset + 1;
        const to = Math.min(currentOffset + currentLimit, total);
        pageInfo.textContent = `Showing ${from} to ${to} of ${total} entries`;
        
        prevBtn.disabled = (currentOffset === 0);
        nextBtn.disabled = (to >= total);
      } else {
        emptyState.style.display = 'block';
        pageInfo.textContent = 'Showing 0 to 0 of 0 entries';
      }
    } catch (err) {
      loadingState.style.display = 'none';
      emptyState.style.display = 'block';
      console.error('[Admin Messages] Fetch error:', err);
    }
  }

  /**
   * Builds the message list table.
   */
  function renderTable(items) {
    tableBody.innerHTML = '';
    
    items.forEach(msg => {
      const row = document.createElement('tr');
      
      const statusBadge = getStatusBadge(msg.status);
      const dateStr = window.UI ? window.UI.formatDate(msg.created_at) : new Date(msg.created_at).toLocaleDateString();

      row.innerHTML = `
        <td style="font-weight:600; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${window.AdminUI.escapeAdminHtml(msg.full_name)}</td>
        <td style="text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${window.AdminUI.escapeAdminHtml(msg.email)}</td>
        <td style="text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${window.AdminUI.escapeAdminHtml(msg.subject)}</td>
        <td>${statusBadge}</td>
        <td style="font-size:var(--text-xs); color:var(--text-muted);">${dateStr}</td>
        <td style="text-align: right; white-space:nowrap; display:flex; justify-content:flex-end; gap:6px;">
          <button class="btn-table btn-view" title="Read Message">👁️</button>
          <button class="btn-table btn-delete admin-danger-text" title="Delete Message">🗑️</button>
        </td>
      `;

      // Event listener for reading details
      row.querySelector('.btn-view').addEventListener('click', () => openMessageDetailModal(msg.id));

      // Event listener for delete
      row.querySelector('.btn-delete').addEventListener('click', () => {
        window.AdminUI.openConfirmModal({
          title: 'Delete Contact Message',
          message: `Are you sure you want to delete the message from "${msg.full_name}"? This action moves it to trash.`,
          onConfirm: async () => {
            try {
              const res = await window.API.deleteMessage(msg.id);
              if (res.success) {
                window.AdminUI.showAdminToast('Message soft-deleted successfully.', 'success');
                loadMessages();
              } else {
                window.AdminUI.showAdminToast(res.message || 'Failed to delete message.', 'error');
              }
            } catch (err) {
              window.AdminUI.showAdminToast('Network connection failed.', 'error');
            }
          }
        });
      });

      tableBody.appendChild(row);
    });
  }

  /**
   * Opens the detail modal and fetches full body.
   */
  async function openMessageDetailModal(id) {
    modalContent.innerHTML = '⏳ Loading message content details...';
    modal.style.display = 'flex';
    activeMessageId = id;

    try {
      const res = await window.API.getAdminMessageById(id);
      if (res.success && res.data) {
        const msg = res.data;
        const dateStr = window.UI ? window.UI.formatDate(msg.created_at) : new Date(msg.created_at).toLocaleString();

        modalContent.innerHTML = `
          <div class="admin-message-view">
            <div style="display:grid; grid-template-columns: 80px 1fr; gap:8px; font-size:var(--text-sm); border-bottom:1px solid var(--border-soft); padding-bottom:12px; margin-bottom:12px;">
              <strong style="color:var(--text-muted);">From:</strong>
              <div>
                <strong>${window.AdminUI.escapeAdminHtml(msg.full_name)}</strong> 
                <span style="color:var(--text-muted); font-size:var(--text-xs); margin-left:8px;">&lt;${window.AdminUI.escapeAdminHtml(msg.email)}&gt;</span>
              </div>
              <strong style="color:var(--text-muted);">Date:</strong>
              <div>${dateStr}</div>
              <strong style="color:var(--text-muted);">Subject:</strong>
              <div style="font-weight:600; color:var(--primary);">${window.AdminUI.escapeAdminHtml(msg.subject)}</div>
            </div>
            
            <div style="background:var(--bg-main); border:1px solid var(--border-soft); border-radius:var(--radius-md); padding:16px; min-height:120px; white-space:pre-wrap; font-size:var(--text-sm); line-height:1.6; word-break:break-all;">${window.AdminUI.escapeAdminHtml(msg.message)}</div>
            
            <div style="margin-top:16px; padding:10px 12px; border-radius:4px; background:rgba(255,255,255,0.02); font-size:var(--text-xs); color:var(--text-muted); display:flex; flex-direction:column; gap:4px;">
              <span>🖥️ <strong>User Agent:</strong> ${window.AdminUI.escapeAdminHtml(msg.user_agent || 'Unknown')}</span>
              <span>🌐 <strong>IP Address:</strong> ${window.AdminUI.escapeAdminHtml(msg.ip_address || 'Unknown')}</span>
            </div>
          </div>
        `;
        
        modalStatusSelect.value = msg.status;
        
        // If status was new, mark it read automatically on opening
        if (msg.status === 'new') {
          modalStatusSelect.value = 'read';
          modalStatusSelect.dispatchEvent(new Event('change'));
        }
      } else {
        modalContent.innerHTML = `<span class="text-danger">${res.message || 'Failed to fetch details.'}</span>`;
      }
    } catch (err) {
      modalContent.innerHTML = '<span class="text-danger">Unable to connect to the API.</span>';
    }
  }

  function getStatusBadge(status) {
    let style = '';
    let label = status.charAt(0).toUpperCase() + status.slice(1);
    
    switch (status) {
      case 'new':
        style = 'background: rgba(0, 168, 204, 0.15); color: #00d4ff; border: 1px solid rgba(0, 168, 204, 0.25);';
        break;
      case 'read':
        style = 'background: rgba(255, 255, 255, 0.05); color: var(--text-muted); border: 1px solid var(--border-soft);';
        break;
      case 'replied':
        style = 'background: rgba(46, 204, 113, 0.15); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.25);';
        break;
      case 'archived':
        style = 'background: rgba(241, 196, 15, 0.1); color: #f1c40f; border: 1px solid rgba(241, 196, 15, 0.2);';
        break;
      case 'spam':
        style = 'background: rgba(231, 76, 60, 0.15); color: #e74c3c; border: 1px solid rgba(231, 76, 60, 0.25);';
        break;
    }
    
    return `<span class="badge" style="display:inline-block; font-size:10px; padding:3px 8px; border-radius:12px; font-weight:600; ${style}">${label}</span>`;
  }
});
