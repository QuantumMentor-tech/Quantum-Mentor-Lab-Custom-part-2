'use strict';

/**
 * Quantum Mentor World
 * pagination.js — Universal UI pagination renderer.
 *
 * Automatically displays page indices, handles next/prev shortcuts, handles ellipsis bounds
 * for large page sets, and hooks navigation callbacks.
 */

/* ─── Determine Pagination Range ────────────────────────────── */
function getPaginationRange(currentPage, totalPages) {
  const current = currentPage || 1;
  const total = totalPages || 1;
  const pages = [];
  
  const maxNeighbours = 1; // page offsets around current (e.g. current-1, current+1)

  if (total <= 5) {
    // Show all pages if total pages <= 5
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // Always include page 1
    pages.push(1);

    const leftBound = Math.max(2, current - maxNeighbours);
    const rightBound = Math.min(total - 1, current + maxNeighbours);

    if (leftBound > 2) {
      pages.push('...');
    }

    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(i);
    }

    if (rightBound < total - 1) {
      pages.push('...');
    }

    // Always include last page
    pages.push(total);
  }

  return pages;
}

/* ─── Create Single Pagination Button Node ────────────────────── */
function createPaginationButton(label, page, isActive = false, isDisabled = false) {
  const btn = document.createElement('button');
  btn.className = `pagination-button${isActive ? ' active' : ''}`;
  btn.type = 'button';
  btn.textContent = label;
  btn.disabled = isDisabled;
  
  if (page !== null && !isActive && !isDisabled) {
    btn.dataset.page = page;
  }
  
  return btn;
}

/* ─── Render Complete Pagination Controls ────────────────────── */
function renderPaginationControls(container, meta, onPageChange) {
  if (!container) return;
  container.innerHTML = '';

  if (!meta || meta.totalPages <= 1) {
    // Hide container if there is only 1 page
    return;
  }

  const { page, totalPages } = meta;

  // 1. Previous Page button
  const prevBtn = createPaginationButton('‹ Prev', page - 1, false, page === 1);
  if (page > 1) {
    prevBtn.addEventListener('click', () => onPageChange(page - 1));
  }
  container.appendChild(prevBtn);

  // 2. Mid Range pages and ellipses
  const range = getPaginationRange(page, totalPages);
  range.forEach(item => {
    if (item === '...') {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'pagination-ellipsis';
      ellipsis.textContent = '...';
      container.appendChild(ellipsis);
    } else {
      const pageBtn = createPaginationButton(item, item, item === page, false);
      if (item !== page) {
        pageBtn.addEventListener('click', () => onPageChange(item));
      }
      container.appendChild(pageBtn);
    }
  });

  // 3. Next Page button
  const nextBtn = createPaginationButton('Next ›', page + 1, false, page === totalPages);
  if (page < totalPages) {
    nextBtn.addEventListener('click', () => onPageChange(page + 1));
  }
  container.appendChild(nextBtn);
}

/* ─── Export Globals ─────────────────────────────────────────── */
window.Pagination = {
  getPaginationRange,
  createPaginationButton,
  renderPaginationControls
};
