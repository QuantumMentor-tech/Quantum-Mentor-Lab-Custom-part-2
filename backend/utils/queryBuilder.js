'use strict';

/**
 * Quantum Mentor World — SQL Query Builder
 * utils/queryBuilder.js
 *
 * Safe query parsing utility. Uses parameterized values to prevent SQL injection.
 */

const { 
  PUBLIC_RESOURCE_TYPES, 
  ACCESS_TYPES, 
  SOURCE_TYPES 
} = require('./constants');

/**
 * Dynamically builds sql query WHERE conditions and inner joins for categories, tags, types, and keywords.
 *
 * @param {Object} queryParams - Express request query object (req.query)
 * @returns {Object} { joins: string, where: string, params: Array }
 */
function buildResourceFilters(queryParams) {
  let joins = '';
  const whereClauses = [];
  const params = [];

  // 1. Filter by resource type
  if (queryParams.type) {
    if (PUBLIC_RESOURCE_TYPES.includes(queryParams.type)) {
      whereClauses.push('resources.resource_type = ?');
      params.push(queryParams.type);
    } else {
      whereClauses.push('1 = 0');
    }
  }

  // 2. Filter by access type
  if (queryParams.access_type) {
    if (ACCESS_TYPES.includes(queryParams.access_type)) {
      whereClauses.push('resources.access_type = ?');
      params.push(queryParams.access_type);
    } else {
      whereClauses.push('1 = 0');
    }
  }

  // 3. Filter by source origin type
  if (queryParams.source_type) {
    if (SOURCE_TYPES.includes(queryParams.source_type)) {
      whereClauses.push('resources.source_type = ?');
      params.push(queryParams.source_type);
    } else {
      whereClauses.push('1 = 0');
    }
  }

  // 4. Filter by featured content
  if (queryParams.featured === 'true' || queryParams.featured === '1' || queryParams.featured === 1) {
    whereClauses.push('resources.is_featured = 1');
  }

  // 5. Filter by trending content
  if (queryParams.trending === 'true' || queryParams.trending === '1' || queryParams.trending === 1) {
    whereClauses.push('resources.is_trending = 1');
  }

  // 6. Filter by category slug (resolves junction details)
  if (queryParams.category && typeof queryParams.category === 'string') {
    joins += ' INNER JOIN resource_categories AS rc ON rc.resource_id = resources.id INNER JOIN categories AS c ON c.id = rc.category_id';
    whereClauses.push('c.slug = ? AND c.status = "active" AND c.deleted_at IS NULL');
    params.push(queryParams.category);
  }

  // 7. Filter by tag slug (resolves junction details)
  if (queryParams.tag && typeof queryParams.tag === 'string') {
    joins += ' INNER JOIN resource_tags AS rt ON rt.resource_id = resources.id INNER JOIN tags AS t ON t.id = rt.tag_id';
    whereClauses.push('t.slug = ? AND t.status = "active" AND t.deleted_at IS NULL');
    params.push(queryParams.tag);
  }

  // 8. Search query handler (checks title, descriptions, details metadata)
  if (queryParams.q && typeof queryParams.q === 'string' && queryParams.q.trim() !== '') {
    const keyword = `%${queryParams.q.trim()}%`;
    whereClauses.push(`(
      resources.title LIKE ? 
      OR resources.short_description LIKE ? 
      OR resources.full_description LIKE ? 
      OR details.platform LIKE ? 
      OR details.developer LIKE ? 
      OR details.author LIKE ? 
      OR details.language LIKE ? 
      OR details.license_type LIKE ?
    )`);
    // Push parameter value 8 times for the matching SQL placeholders
    for (let i = 0; i < 8; i++) {
      params.push(keyword);
    }
  }

  return {
    joins,
    where: whereClauses.length > 0 ? ' AND ' + whereClauses.join(' AND ') : '',
    params
  };
}

/**
 * Returns safe sorting SQL statement mappings.
 *
 * @param {string} sortKey - Parameter key ('latest', 'oldest', 'title_asc', 'title_desc', 'popular')
 * @returns {string} ORDER BY sql clause
 */
function buildSortClause(sortKey) {
  switch (sortKey) {
    case 'oldest':
      return 'ORDER BY resources.published_at ASC, resources.created_at ASC';
    case 'title_asc':
      return 'ORDER BY resources.title ASC';
    case 'title_desc':
      return 'ORDER BY resources.title DESC';
    case 'popular':
      return 'ORDER BY resources.view_count DESC';
    case 'latest':
    default:
      return 'ORDER BY resources.published_at DESC, resources.created_at DESC';
  }
}

module.exports = {
  buildResourceFilters,
  buildSortClause
};
