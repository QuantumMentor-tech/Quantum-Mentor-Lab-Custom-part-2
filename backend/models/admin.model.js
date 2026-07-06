'use strict';

/**
 * Quantum Mentor World — Admin Database Model
 * models/admin.model.js
 */

const { query } = require('../config/db');

/**
 * Fetches stats overview count metrics from database tables.
 *
 * @returns {Promise<Object>} Statistics payload
 */
async function getOverviewStats() {
  // Fetch resource counts by status
  const resourceSql = `
    SELECT 
      COUNT(*) AS total,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) AS published,
      SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draft,
      SUM(CASE WHEN status = 'pending_review' THEN 1 ELSE 0 END) AS pendingReview
    FROM resources
    WHERE deleted_at IS NULL
  `;
  const resourceRows = await query(resourceSql);
  const resourceStats = resourceRows[0] || { total: 0, published: 0, draft: 0, pendingReview: 0 };

  // Fetch category counts
  const categorySql = `
    SELECT COUNT(*) AS total
    FROM categories
    WHERE status = 'active' AND deleted_at IS NULL
  `;
  const categoryRows = await query(categorySql);
  const categoryCount = categoryRows[0] ? categoryRows[0].total : 0;

  // Fetch tag counts
  const tagSql = `
    SELECT COUNT(*) AS total
    FROM tags
    WHERE status = 'active' AND deleted_at IS NULL
  `;
  const tagRows = await query(tagSql);
  const tagCount = tagRows[0] ? tagRows[0].total : 0;

  // Fetch media counts
  const mediaSql = `
    SELECT COUNT(*) AS total
    FROM media
    WHERE deleted_at IS NULL
  `;
  const mediaRows = await query(mediaSql);
  const mediaCount = mediaRows[0] ? mediaRows[0].total : 0;

  // Fetch new contact messages counts
  const messagesSql = `
    SELECT COUNT(*) AS total
    FROM contact_messages
    WHERE status = 'new' AND deleted_at IS NULL
  `;
  const messagesRows = await query(messagesSql);
  const newMessagesCount = messagesRows[0] ? messagesRows[0].total : 0;

  // Fetch new resource reports counts
  const reportsSql = `
    SELECT COUNT(*) AS total
    FROM resource_reports
    WHERE status = 'new' AND deleted_at IS NULL
  `;
  const reportsRows = await query(reportsSql);
  const newReportsCount = reportsRows[0] ? reportsRows[0].total : 0;

  return {
    resources: {
      total: Number(resourceStats.total || 0),
      published: Number(resourceStats.published || 0),
      draft: Number(resourceStats.draft || 0),
      pendingReview: Number(resourceStats.pendingReview || 0)
    },
    categories: {
      total: Number(categoryCount || 0)
    },
    tags: {
      total: Number(tagCount || 0)
    },
    media: {
      total: Number(mediaCount || 0)
    },
    contactMessages: {
      newCount: Number(newMessagesCount || 0)
    },
    reports: {
      newCount: Number(newReportsCount || 0)
    }
  };
}

module.exports = {
  getOverviewStats
};
