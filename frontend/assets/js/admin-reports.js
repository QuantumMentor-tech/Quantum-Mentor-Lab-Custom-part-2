'use strict';

/**
 * Quantum Mentor World — Admin Resource Reports Controller
 * assets/js/admin-reports.js
 */

document.addEventListener('DOMContentLoaded', () => {
  const statusFilter = document.getElementById('report-status-filter');
  const typeFilter = document.getElementById('report-type-filter');
  
  const tableBody = document.getElementById('reports-table-body');
  const tableWrapper = document.getElementById('reports-table-wrapper');
  const loadingState = document.getElementById('reports-loading');
  const emptyState = document.getElementById('reports-empty');
  
  // Pagination
  const pageInfo = document.getElementById('reports-page-info');
  const prevBtn = document.getElementById('reports-prev-btn');
  const nextBtn = document.getElementById('reports-next-btn');

  // Modal
  const modal = document.getElementById('view-report-modal');
  const modalContent = document.getElementById('report-detail-content');
  const modalStatusSelect = document.getElementById('modal-report-status-select');
  const modalCloseX = document.getElementById('view-report-close-x');
  const modalCloseBtn = document.getElementById('view-report-close-btn');

  let currentLimit = 20;
  let currentOffset = 0;
  let activeReportId = null;

  if (!tableBody) return;

  // 1. Initial load
  loadReports();

  // 2. Filter change listeners
  statusFilter.addEventListener('change', () => {
    currentOffset = 0;
    loadReports();
  });

  typeFilter.addEventListener('change', () => {
    currentOffset = 0;
    loadReports();
  });

  // 3. Pagination listeners
  prevBtn.addEventListener('click', () => {
    if (currentOffset >= currentLimit) {
      currentOffset -= currentLimit;
      loadReports();
    }
  });

  nextBtn.addEventListener('click', () => {
    currentOffset += currentLimit;
    loadReports();
  });

  // 4. Modal listeners
  const hideModal = () => {
    modal.style.display = 'none';
    activeReportId = null;
  };
  modalCloseX.addEventListener('click', hideModal);
  modalCloseBtn.addEventListener('click', hideModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
  });

  modalStatusSelect.addEventListener('change', async () => {
    if (!activeReportId) return;
    const newStatus = modalStatusSelect.value;
    try {
      const result = await window.API.updateReportStatus(activeReportId, newStatus);
      if (result.success) {
        window.AdminUI.showAdminToast('Report status updated successfully.', 'success');
        loadReports();
      } else {
        window.AdminUI.showAdminToast(result.message || 'Failed to update status.', 'error');
      }
    } catch (err) {
      window.AdminUI.showAdminToast('Network connection failed.', 'error');
    }
  });

  /**
   * Fetches reports list from API.
   */
  async function loadReports() {
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
        report_type: typeFilter.value
      };

      const res = await window.API.getAdminReports(filters);
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
      console.error('[Admin Reports] Fetch error:', err);
    }
  }

  /**
   * Renders rows inside table body.
   */
  function renderTable(items) {
    tableBody.innerHTML = '';
    
    items.forEach(rep => {
      const row = document.createElement('tr');
      
      const typeLabel = formatReportType(rep.report_type);
      const statusBadge = getStatusBadge(rep.status);
      const dateStr = window.UI ? window.UI.formatDate(rep.created_at) : new Date(rep.created_at).toLocaleDateString();
      const reporterInfo = rep.reporter_name || rep.reporter_email || 'Anonymous';

      row.innerHTML = `
        <td style="font-weight:600; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;" title="${rep.resource_title || 'Unknown'}">${window.AdminUI.escapeAdminHtml(rep.resource_title || 'Unknown')}</td>
        <td><span class="badge badge-secondary" style="font-size:10px;">${typeLabel}</span></td>
        <td style="text-overflow:ellipsis; overflow:hidden; white-space:nowrap;" title="${reporterInfo}">${window.AdminUI.escapeAdminHtml(reporterInfo)}</td>
        <td>${statusBadge}</td>
        <td style="font-size:var(--text-xs); color:var(--text-muted);">${dateStr}</td>
        <td style="text-align: right; white-space:nowrap; display:flex; justify-content:flex-end; gap:6px;">
          <button class="btn-table btn-view" title="View Report Details">👁️</button>
          <button class="btn-table btn-delete admin-danger-text" title="Delete Report">🗑️</button>
        </td>
      `;

      // Event listener for reading details
      row.querySelector('.btn-view').addEventListener('click', () => openReportDetailModal(rep.id));

      // Event listener for delete
      row.querySelector('.btn-delete').addEventListener('click', () => {
        window.AdminUI.openConfirmModal({
          title: 'Delete Resource Report',
          message: `Are you sure you want to delete report ID ${rep.id} on resource "${rep.resource_title}"? This moves it to trash.`,
          onConfirm: async () => {
            try {
              const res = await window.API.deleteReport(rep.id);
              if (res.success) {
                window.AdminUI.showAdminToast('Report soft-deleted successfully.', 'success');
                loadReports();
              } else {
                window.AdminUI.showAdminToast(res.message || 'Failed to delete report.', 'error');
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
   * Opens the report detail modal and pulls full body.
   */
  async function openReportDetailModal(id) {
    modalContent.innerHTML = '⏳ Loading report details...';
    modal.style.display = 'flex';
    activeReportId = id;

    try {
      const res = await window.API.getAdminReportById(id);
      if (res.success && res.data) {
        const rep = res.data;
        const dateStr = window.UI ? window.UI.formatDate(rep.created_at) : new Date(rep.created_at).toLocaleString();
        
        let linkSection = '';
        if (rep.link_id) {
          linkSection = `
            <div style="background:rgba(231,76,60,0.05); border:1px dashed rgba(231,76,60,0.2); border-radius:4px; padding:10px 12px; margin-top:8px;">
              <span style="display:block; font-size:var(--text-xs); color:var(--text-muted); font-weight:600; text-transform:uppercase;">Reported link URL:</span>
              <span style="font-size:var(--text-sm); font-weight:600;">${window.AdminUI.escapeAdminHtml(rep.link_label || 'Direct Link')}</span>
              <a href="${rep.link_url}" target="_blank" style="display:block; font-size:var(--text-xs); color:var(--primary); word-break:break-all; margin-top:4px;">${window.AdminUI.escapeAdminHtml(rep.link_url)}</a>
            </div>
          `;
        }

        modalContent.innerHTML = `
          <div class="admin-report-view">
            <div style="display:grid; grid-template-columns: 100px 1fr; gap:8px; font-size:var(--text-sm); border-bottom:1px solid var(--border-soft); padding-bottom:12px; margin-bottom:12px;">
              <strong style="color:var(--text-muted);">Resource:</strong>
              <div style="font-weight:600; color:var(--primary);">${window.AdminUI.escapeAdminHtml(rep.resource_title || 'Unknown')}</div>
              <strong style="color:var(--text-muted);">Report Type:</strong>
              <div><span class="badge badge-secondary">${formatReportType(rep.report_type)}</span></div>
              <strong style="color:var(--text-muted);">Reporter:</strong>
              <div>
                <strong>${window.AdminUI.escapeAdminHtml(rep.reporter_name || 'Anonymous')}</strong>
                ${rep.reporter_email ? `<span style="color:var(--text-muted); font-size:var(--text-xs); margin-left:8px;">&lt;${window.AdminUI.escapeAdminHtml(rep.reporter_email)}&gt;</span>` : ''}
              </div>
              <strong style="color:var(--text-muted);">Date Received:</strong>
              <div>${dateStr}</div>
            </div>

            ${linkSection}

            <div style="margin-top:12px;">
              <span style="display:block; font-size:var(--text-xs); color:var(--text-muted); font-weight:600; text-transform:uppercase; margin-bottom:6px;">Reporter Message:</span>
              <div style="background:var(--bg-main); border:1px solid var(--border-soft); border-radius:var(--radius-md); padding:16px; min-height:80px; white-space:pre-wrap; font-size:var(--text-sm); line-height:1.6; word-break:break-all;">${window.AdminUI.escapeAdminHtml(rep.message)}</div>
            </div>
            
            <div style="margin-top:16px; padding:8px 12px; border-radius:4px; background:rgba(255,255,255,0.02); font-size:var(--text-xs); color:var(--text-muted);">
              🌐 <strong>IP Address:</strong> ${window.AdminUI.escapeAdminHtml(rep.ip_address || 'Unknown')}
            </div>
          </div>
        `;
        
        modalStatusSelect.value = rep.status;
        
        // If status was new, automatically transition to reviewing on open
        if (rep.status === 'new') {
          modalStatusSelect.value = 'reviewing';
          modalStatusSelect.dispatchEvent(new Event('change'));
        }
      } else {
        modalContent.innerHTML = `<span class="text-danger">${res.message || 'Failed to fetch details.'}</span>`;
      }
    } catch (err) {
      modalContent.innerHTML = '<span class="text-danger">Unable to connect to the API.</span>';
    }
  }

  function formatReportType(type) {
    switch (type) {
      case 'broken_link': return 'Broken Link';
      case 'unsafe_link': return 'Unsafe Link';
      case 'copyright_issue': return 'Copyright Issue';
      case 'wrong_information': return 'Wrong Info';
      default: return 'Other';
    }
  }

  function getStatusBadge(status) {
    let style = '';
    let label = status.charAt(0).toUpperCase() + status.slice(1);
    
    switch (status) {
      case 'new':
        style = 'background: rgba(0, 168, 204, 0.15); color: #00d4ff; border: 1px solid rgba(0, 168, 204, 0.25);';
        break;
      case 'reviewing':
        style = 'background: rgba(241, 196, 15, 0.15); color: #f1c40f; border: 1px solid rgba(241, 196, 15, 0.25);';
        break;
      case 'resolved':
        style = 'background: rgba(46, 204, 113, 0.15); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.25);';
        break;
      case 'rejected':
        style = 'background: rgba(149, 165, 166, 0.15); color: #95a5a6; border: 1px solid rgba(149, 165, 166, 0.25);';
        break;
      case 'spam':
        style = 'background: rgba(231, 76, 60, 0.15); color: #e74c3c; border: 1px solid rgba(231, 76, 60, 0.25);';
        break;
    }
    
    return `<span class="badge" style="display:inline-block; font-size:10px; padding:3px 8px; border-radius:12px; font-weight:600; ${style}">${label}</span>`;
  }
});
