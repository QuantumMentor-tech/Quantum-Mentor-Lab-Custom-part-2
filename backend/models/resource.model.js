'use strict';

/**
 * Quantum Mentor World — Resource Database Model
 * models/resource.model.js
 */

const { query } = require('../config/db');
const { PUBLIC_RESOURCE_CONDITION } = require('../utils/constants');
const { buildResourceFilters, buildSortClause } = require('../utils/queryBuilder');
const logger = require('../utils/logger');

/**
 * Fetches public resources matching active filters, categories, search strings, and pages.
 *
 * @param {Object} options - Pagination, filter, sort parameters
 * @returns {Promise<Array>} List of matching resource records
 */
async function getPublicResources(options = {}) {
  const { limit = 12, offset = 0, sort = 'latest' } = options;
  const filterData = buildResourceFilters(options);
  const orderClause = buildSortClause(sort);

  const sql = `
    SELECT 
      resources.id, 
      resources.title, 
      resources.slug, 
      resources.resource_type, 
      resources.short_description, 
      resources.featured_image, 
      resources.status, 
      resources.visibility, 
      resources.is_featured, 
      resources.is_trending, 
      resources.legal_status, 
      resources.safety_status, 
      resources.source_type, 
      resources.access_type, 
      resources.view_count, 
      resources.published_at, 
      resources.created_at, 
      resources.updated_at,
      details.platform,
      details.developer,
      details.author,
      details.language,
      details.license_type,
      details.release_year,
      details.official_url,
      details.demo_url,
      details.github_url,
      details.read_online_url
    FROM resources
    LEFT JOIN resource_details AS details ON details.resource_id = resources.id
    ${filterData.joins}
    WHERE ${PUBLIC_RESOURCE_CONDITION} ${filterData.where}
    ${orderClause}
    LIMIT ? OFFSET ?
  `;

  const params = [...filterData.params, limit, offset];
  return await query(sql, params);
}

/**
 * Counts total public resources matching active options filters.
 *
 * @param {Object} options - Filters options
 * @returns {Promise<number>} Total count of matching resources
 */
async function countPublicResources(options = {}) {
  const filterData = buildResourceFilters(options);

  const sql = `
    SELECT COUNT(DISTINCT resources.id) AS count
    FROM resources
    LEFT JOIN resource_details AS details ON details.resource_id = resources.id
    ${filterData.joins}
    WHERE ${PUBLIC_RESOURCE_CONDITION} ${filterData.where}
  `;

  const rows = await query(sql, filterData.params);
  return rows[0] ? rows[0].count : 0;
}

/**
 * Fetches a single public resource by slug, mapping its nested tags, links, and episodes.
 *
 * @param {string} slug - Unique resource slug
 * @returns {Promise<Object|null>} Detailed resource payload, or null if not found
 */
async function getPublicResourceBySlug(slug) {
  const sql = `
    SELECT 
      resources.id, 
      resources.title, 
      resources.slug, 
      resources.resource_type, 
      resources.short_description, 
      resources.full_description,
      resources.featured_image, 
      resources.status, 
      resources.visibility, 
      resources.is_featured, 
      resources.is_trending, 
      resources.legal_status, 
      resources.safety_status, 
      resources.source_type, 
      resources.access_type, 
      resources.view_count, 
      resources.published_at, 
      resources.created_at, 
      resources.updated_at
    FROM resources
    WHERE resources.slug = ? AND ${PUBLIC_RESOURCE_CONDITION}
    LIMIT 1
  `;

  const rows = await query(sql, [slug]);
  if (rows.length === 0) {
    return null;
  }

  const resource = rows[0];
  const resourceId = resource.id;

  // 1. Fetch resource details (1:1 relation)
  const detailsSql = `
    SELECT 
      version, platform, developer, author, publisher, language, 
      file_size, license_type, release_year, requirements, 
      installation_guide, features, limitations, documentation_url, 
      official_url, demo_url, trailer_url, github_url, 
      read_online_url, extra_json
    FROM resource_details
    WHERE resource_id = ?
    LIMIT 1
  `;
  const detailsRows = await query(detailsSql, [resourceId]);
  resource.details = detailsRows[0] || null;

  // 2. Fetch linked categories (M:N relation)
  const categoriesSql = `
    SELECT c.id, c.name, c.slug, c.description, c.icon
    FROM categories AS c
    INNER JOIN resource_categories AS rc ON rc.category_id = c.id
    WHERE rc.resource_id = ? AND c.status = 'active' AND c.deleted_at IS NULL
    ORDER BY c.sort_order ASC, c.name ASC
  `;
  resource.categories = await query(categoriesSql, [resourceId]);

  // 3. Fetch linked tags (M:N relation)
  const tagsSql = `
    SELECT t.id, t.name, t.slug, t.description
    FROM tags AS t
    INNER JOIN resource_tags AS rt ON rt.tag_id = t.id
    WHERE rt.resource_id = ? AND t.status = 'active' AND t.deleted_at IS NULL
    ORDER BY t.name ASC
  `;
  resource.tags = await query(tagsSql, [resourceId]);

  // 4. Fetch safe links (1:N relation)
  const linksSql = `
    SELECT id, label, url, link_type, source_type, legal_status, safety_status, is_primary, click_count
    FROM resource_links
    WHERE resource_id = ? 
      AND legal_status = 'approved'
      AND safety_status IN ('safe', 'warning')
      AND deleted_at IS NULL
    ORDER BY is_primary DESC, label ASC
  `;
  resource.links = await query(linksSql, [resourceId]);

  // 5. Fetch episodes for 'watch' type resources
  if (resource.resource_type === 'watch') {
    const episodesSql = `
      SELECT id, season_number, episode_number, title, slug, description, thumbnail, duration, release_date
      FROM watch_episodes
      WHERE resource_id = ? AND status = 'published' AND deleted_at IS NULL
      ORDER BY season_number ASC, episode_number ASC, sort_order ASC
    `;
    const episodes = await query(episodesSql, [resourceId]);

    // Fetch servers for each episode
    for (const ep of episodes) {
      const serversSql = `
        SELECT id, server_name, embed_url, source_url, source_type, legal_status, safety_status, is_primary
        FROM watch_servers
        WHERE episode_id = ? 
          AND legal_status = 'approved'
          AND safety_status IN ('safe', 'warning')
          AND deleted_at IS NULL
        ORDER BY is_primary DESC, sort_order ASC
      `;
      ep.servers = await query(serversSql, [ep.id]);
    }
    resource.episodes = episodes;
  }

  return resource;
}

/**
 * Fetches public resources matching a specific resource type.
 */
async function getPublicResourcesByType(resourceType, options = {}) {
  return await getPublicResources({ ...options, type: resourceType });
}

/**
 * Counts total public resources of a specific resource type.
 */
async function countPublicResourcesByType(resourceType, options = {}) {
  return await countPublicResources({ ...options, type: resourceType });
}

/**
 * Fetches featured public resources.
 */
async function getFeaturedResources(limit = 8) {
  const cappedLimit = Math.min(limit, 20);
  return await getPublicResources({ featured: true, limit: cappedLimit, sort: 'latest' });
}

/**
 * Fetches trending public resources based on views.
 */
async function getTrendingResources(limit = 8) {
  const cappedLimit = Math.min(limit, 20);
  return await getPublicResources({ trending: true, limit: cappedLimit, sort: 'popular' });
}

/**
 * Fetches the latest published public resources.
 */
async function getLatestResources(limit = 8) {
  const cappedLimit = Math.min(limit, 20);
  return await getPublicResources({ limit: cappedLimit, sort: 'latest' });
}

/**
 * Increments the view count of a resource. Non-fatal.
 */
async function incrementResourceViewCount(resourceId) {
  try {
    const sql = 'UPDATE resources SET view_count = view_count + 1 WHERE id = ?';
    await query(sql, [resourceId]);
    return true;
  } catch (error) {
    logger.error('Failed to increment resource view count:', { resourceId, error: error.message });
    return false;
  }
}

/**
 * Returns related resources of the same type.
 */
async function getRelatedResources(resourceId, resourceType, limit = 4) {
  const cappedLimit = Math.min(limit, 10);
  const sql = `
    SELECT 
      resources.id, resources.title, resources.slug, resources.resource_type, 
      resources.short_description, resources.featured_image, resources.access_type,
      resources.published_at, resources.view_count
    FROM resources
    WHERE resources.id != ? 
      AND resources.resource_type = ? 
      AND ${PUBLIC_RESOURCE_CONDITION}
    ORDER BY resources.published_at DESC, resources.created_at DESC
    LIMIT ?
  `;
  return await query(sql, [resourceId, resourceType, cappedLimit]);
}

module.exports = {
  getPublicResources,
  countPublicResources,
  getPublicResourceBySlug,
  getPublicResourcesByType,
  countPublicResourcesByType,
  getFeaturedResources,
  getTrendingResources,
  getLatestResources,
  incrementResourceViewCount,
  getRelatedResources
};
