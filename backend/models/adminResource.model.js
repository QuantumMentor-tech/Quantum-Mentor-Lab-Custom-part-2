'use strict';

/**
 * Quantum Mentor World — Admin Resource Model
 * models/adminResource.model.js
 */

const { query, withTransaction } = require('../config/db');
const { generateUniqueSlug } = require('../utils/slugify');

/**
 * Fetches list of admin resources matching search, filters, types, statuses, etc.
 * Admins can see soft-deleted, private, or rejected records.
 *
 * @param {Object} options - Search and filter choices
 * @returns {Promise<Array>} List of resources matching the criteria
 */
async function getAdminResources(options = {}) {
  const {
    limit = 10,
    offset = 0,
    q = '',
    resource_type = '',
    status = '',
    visibility = '',
    legal_status = '',
    safety_status = '',
    source_type = '',
    access_type = '',
    featured = null,
    trending = null,
    sort = 'latest',
    show_deleted = false
  } = options;

  let sql = `
    SELECT 
      id, title, slug, resource_type, short_description, status, visibility,
      is_featured, is_trending, legal_status, safety_status, source_type,
      access_type, view_count, published_at, created_at, updated_at, deleted_at
    FROM resources
    WHERE 1=1
  `;
  const params = [];

  // Soft delete flag check
  if (!show_deleted) {
    sql += ' AND deleted_at IS NULL';
  }

  // Keywords query search
  if (q) {
    sql += ' AND (title LIKE ? OR short_description LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }

  // Dropdowns filters
  if (resource_type) {
    sql += ' AND resource_type = ?';
    params.push(resource_type);
  }
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  if (visibility) {
    sql += ' AND visibility = ?';
    params.push(visibility);
  }
  if (legal_status) {
    sql += ' AND legal_status = ?';
    params.push(legal_status);
  }
  if (safety_status) {
    sql += ' AND safety_status = ?';
    params.push(safety_status);
  }
  if (source_type) {
    sql += ' AND source_type = ?';
    params.push(source_type);
  }
  if (access_type) {
    sql += ' AND access_type = ?';
    params.push(access_type);
  }

  // Switches toggles
  if (featured !== null) {
    sql += ' AND is_featured = ?';
    params.push(featured ? 1 : 0);
  }
  if (trending !== null) {
    sql += ' AND is_trending = ?';
    params.push(trending ? 1 : 0);
  }

  // Sort orders
  if (sort === 'oldest') {
    sql += ' ORDER BY created_at ASC';
  } else if (sort === 'title_asc') {
    sql += ' ORDER BY title ASC';
  } else if (sort === 'popular') {
    sql += ' ORDER BY view_count DESC';
  } else {
    sql += ' ORDER BY created_at DESC'; // default latest
  }

  sql += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);

  return await query(sql, params);
}

/**
 * Counts total resource records matching the options criteria.
 * @param {Object} options
 * @returns {Promise<number>} Total count
 */
async function countAdminResources(options = {}) {
  const {
    q = '',
    resource_type = '',
    status = '',
    visibility = '',
    legal_status = '',
    safety_status = '',
    source_type = '',
    access_type = '',
    featured = null,
    trending = null,
    show_deleted = false
  } = options;

  let sql = `SELECT COUNT(*) AS count FROM resources WHERE 1=1`;
  const params = [];

  if (!show_deleted) {
    sql += ' AND deleted_at IS NULL';
  }

  if (q) {
    sql += ' AND (title LIKE ? OR short_description LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }
  if (resource_type) {
    sql += ' AND resource_type = ?';
    params.push(resource_type);
  }
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  if (visibility) {
    sql += ' AND visibility = ?';
    params.push(visibility);
  }
  if (legal_status) {
    sql += ' AND legal_status = ?';
    params.push(legal_status);
  }
  if (safety_status) {
    sql += ' AND safety_status = ?';
    params.push(safety_status);
  }
  if (source_type) {
    sql += ' AND source_type = ?';
    params.push(source_type);
  }
  if (access_type) {
    sql += ' AND access_type = ?';
    params.push(access_type);
  }
  if (featured !== null) {
    sql += ' AND is_featured = ?';
    params.push(featured ? 1 : 0);
  }
  if (trending !== null) {
    sql += ' AND is_trending = ?';
    params.push(trending ? 1 : 0);
  }

  const rows = await query(sql, params);
  return rows[0] ? rows[0].count : 0;
}

/**
 * Retrieves full resource fields configuration by ID.
 * @param {number} id
 * @returns {Promise<Object|null>} Detailed resource config
 */
async function getAdminResourceById(id) {
  const sql = 'SELECT * FROM resources WHERE id = ? LIMIT 1';
  const rows = await query(sql, [id]);
  if (rows.length === 0) return null;

  const resource = rows[0];
  const resourceId = resource.id;

  // 1. Fetch details
  const detailsRows = await query('SELECT * FROM resource_details WHERE resource_id = ? LIMIT 1', [resourceId]);
  resource.details = detailsRows[0] || null;

  // 2. Fetch categories
  const categoriesSql = `
    SELECT c.id, c.name, c.slug 
    FROM categories c
    INNER JOIN resource_categories rc ON rc.category_id = c.id
    WHERE rc.resource_id = ? AND c.deleted_at IS NULL
  `;
  resource.categories = await query(categoriesSql, [resourceId]);

  // 3. Fetch tags
  const tagsSql = `
    SELECT t.id, t.name, t.slug 
    FROM tags t
    INNER JOIN resource_tags rt ON rt.tag_id = t.id
    WHERE rt.resource_id = ? AND t.deleted_at IS NULL
  `;
  resource.tags = await query(tagsSql, [resourceId]);

  // 4. Fetch links
  resource.links = await query('SELECT * FROM resource_links WHERE resource_id = ? AND deleted_at IS NULL', [resourceId]);

  return resource;
}

/**
 * Retrieves resource fields config by slug.
 */
async function getAdminResourceBySlug(slug) {
  const sql = 'SELECT id FROM resources WHERE slug = ? AND deleted_at IS NULL LIMIT 1';
  const rows = await query(sql, [slug]);
  if (rows.length === 0) return null;
  return await getAdminResourceById(rows[0].id);
}

/**
 * Inserts a new resource record, detailed specs, categories, tags, and links in a transaction.
 * @param {Object} data - Form fields data
 * @param {number} userId - Auditing creator ID
 * @returns {Promise<number>} New resource ID
 */
async function createResource(data, userId) {
  return await withTransaction(async (connection) => {
    // Generate unique slug
    const slug = await generateUniqueSlug('resources', data.title);
    
    // Set published_at timestamp
    const publishedAt = (data.status === 'published') ? new Date() : null;

    const resourceSql = `
      INSERT INTO resources (
        title, slug, resource_type, short_description, full_description,
        featured_image, status, visibility, is_featured, is_trending,
        legal_status, safety_status, source_type, access_type,
        created_by, updated_by, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const resourceParams = [
      data.title, slug, data.resource_type, data.short_description, data.full_description || null,
      data.featured_image || null, data.status || 'draft', data.visibility || 'public',
      data.is_featured ? 1 : 0, data.is_trending ? 1 : 0,
      data.legal_status || 'pending', data.safety_status || 'unchecked',
      data.source_type || 'other', data.access_type || 'free',
      userId, userId, publishedAt
    ];

    const [resourceResult] = await connection.execute(resourceSql, resourceParams);
    const resourceId = resourceResult.insertId;

    // Insert details if provided
    if (data.details) {
      await upsertResourceDetails(resourceId, data.details, connection);
    }

    // Insert categories if provided
    if (data.category_ids && Array.isArray(data.category_ids)) {
      await replaceResourceCategories(resourceId, data.category_ids, connection);
    }

    // Insert tags if provided
    if (data.tag_ids && Array.isArray(data.tag_ids)) {
      await replaceResourceTags(resourceId, data.tag_ids, connection);
    }

    // Insert links if provided
    if (data.links && Array.isArray(data.links)) {
      await replaceResourceLinks(resourceId, data.links, userId, connection);
    }

    return resourceId;
  });
}

/**
 * Updates an existing resource configuration dynamically in a transaction.
 */
async function updateResource(id, data, userId) {
  return await withTransaction(async (connection) => {
    // Check if resource exists
    const [existing] = await connection.execute('SELECT slug, status, published_at FROM resources WHERE id = ? AND deleted_at IS NULL LIMIT 1', [id]);
    if (existing.length === 0) {
      throw new Error(`Resource with ID ${id} not found.`);
    }

    // Handle slug change if title is updated
    let slug = existing[0].slug;
    if (data.title) {
      slug = await generateUniqueSlug('resources', data.title, id);
    }

    // Handle published_at timestamp
    let publishedAt = existing[0].published_at;
    if (data.status === 'published' && !publishedAt) {
      publishedAt = new Date();
    } else if (data.status !== 'published') {
      publishedAt = null;
    }

    const updateFields = [];
    const updateParams = [];

    const fieldMap = {
      title: 'title',
      resource_type: 'resource_type',
      short_description: 'short_description',
      full_description: 'full_description',
      featured_image: 'featured_image',
      status: 'status',
      visibility: 'visibility',
      is_featured: 'is_featured',
      is_trending: 'is_trending',
      legal_status: 'legal_status',
      safety_status: 'safety_status',
      source_type: 'source_type',
      access_type: 'access_type'
    };

    // Build query dynamically based on parameters
    for (const [apiKey, dbKey] of Object.entries(fieldMap)) {
      if (data[apiKey] !== undefined) {
        updateFields.push(`${dbKey} = ?`);
        
        // Handle boolean parsing
        if (dbKey === 'is_featured' || dbKey === 'is_trending') {
          updateParams.push(data[apiKey] ? 1 : 0);
        } else {
          updateParams.push(data[apiKey]);
        }
      }
    }

    // Always update auditing meta and slug
    updateFields.push('slug = ?', 'published_at = ?', 'updated_by = ?');
    updateParams.push(slug, publishedAt, userId);

    const updateSql = `UPDATE resources SET ${updateFields.join(', ')} WHERE id = ?`;
    updateParams.push(id);

    await connection.execute(updateSql, updateParams);

    // Update specs details
    if (data.details) {
      await upsertResourceDetails(id, data.details, connection);
    }

    // Update categories
    if (data.category_ids && Array.isArray(data.category_ids)) {
      await replaceResourceCategories(id, data.category_ids, connection);
    }

    // Update tags
    if (data.tag_ids && Array.isArray(data.tag_ids)) {
      await replaceResourceTags(id, data.tag_ids, connection);
    }

    // Update links
    if (data.links && Array.isArray(data.links)) {
      await replaceResourceLinks(id, data.links, userId, connection);
    }

    return id;
  });
}

/**
 * Sets a soft delete timestamp on a resource.
 */
async function softDeleteResource(id, userId) {
  const sql = 'UPDATE resources SET deleted_at = CURRENT_TIMESTAMP, updated_by = ? WHERE id = ?';
  return await query(sql, [userId, id]);
}

/**
 * Restores a soft deleted resource.
 */
async function restoreResource(id, userId) {
  const sql = 'UPDATE resources SET deleted_at = NULL, updated_by = ? WHERE id = ?';
  return await query(sql, [userId, id]);
}

/**
 * Quick patches resource status.
 */
async function updateResourceStatus(id, status, userId) {
  const sql = 'UPDATE resources SET status = ?, updated_by = ? WHERE id = ? AND deleted_at IS NULL';
  return await query(sql, [status, userId, id]);
}

/**
 * Quick patches resource featured status.
 */
async function updateResourceFeatured(id, isFeatured, userId) {
  const sql = 'UPDATE resources SET is_featured = ?, updated_by = ? WHERE id = ? AND deleted_at IS NULL';
  return await query(sql, [isFeatured ? 1 : 0, userId, id]);
}

/**
 * Quick patches resource trending status.
 */
async function updateResourceTrending(id, isTrending, userId) {
  const sql = 'UPDATE resources SET is_trending = ?, updated_by = ? WHERE id = ? AND deleted_at IS NULL';
  return await query(sql, [isTrending ? 1 : 0, userId, id]);
}

/* ─── Transaction Junction Sub-Helpers ───────────────────────── */

async function upsertResourceDetails(resourceId, details, connection) {
  // First check if details exist
  const [rows] = await connection.execute('SELECT id FROM resource_details WHERE resource_id = ? LIMIT 1', [resourceId]);
  
  const specFields = [
    'version', 'platform', 'developer', 'author', 'publisher', 'language',
    'file_size', 'license_type', 'release_year', 'requirements',
    'installation_guide', 'features', 'limitations', 'documentation_url',
    'official_url', 'demo_url', 'trailer_url', 'github_url', 'read_online_url'
  ];

  const params = [];
  const fields = [];
  
  specFields.forEach(f => {
    fields.push(f);
    params.push(details[f] !== undefined ? details[f] : null);
  });

  if (rows.length > 0) {
    // Run UPDATE
    const updateClauses = fields.map(f => `${f} = ?`).join(', ');
    const updateSql = `UPDATE resource_details SET ${updateClauses} WHERE resource_id = ?`;
    params.push(resourceId);
    await connection.execute(updateSql, params);
  } else {
    // Run INSERT
    const placeholders = fields.map(() => '?').join(', ');
    const insertSql = `INSERT INTO resource_details (resource_id, ${fields.join(', ')}) VALUES (?, ${placeholders})`;
    await connection.execute(insertSql, [resourceId, ...params]);
  }
}

async function replaceResourceCategories(resourceId, categoryIds, connection) {
  // Delete old categories junctions
  await connection.execute('DELETE FROM resource_categories WHERE resource_id = ?', [resourceId]);

  if (categoryIds.length === 0) return;

  // Insert categories junctions
  const insertSql = 'INSERT INTO resource_categories (resource_id, category_id) VALUES (?, ?)';
  for (const catId of categoryIds) {
    await connection.execute(insertSql, [resourceId, catId]);
  }
}

async function replaceResourceTags(resourceId, tagIds, connection) {
  // Delete old tags junctions
  await connection.execute('DELETE FROM resource_tags WHERE resource_id = ?', [resourceId]);

  if (tagIds.length === 0) return;

  // Insert tags junctions
  const insertSql = 'INSERT INTO resource_tags (resource_id, tag_id) VALUES (?, ?)';
  for (const tagId of tagIds) {
    await connection.execute(insertSql, [resourceId, tagId]);
  }
}

async function replaceResourceLinks(resourceId, links, userId, connection) {
  // Soft-delete old links
  await connection.execute('UPDATE resource_links SET deleted_at = CURRENT_TIMESTAMP WHERE resource_id = ?', [resourceId]);

  if (links.length === 0) return;

  // Insert links
  const insertSql = `
    INSERT INTO resource_links (
      resource_id, label, url, link_type, source_type,
      legal_status, safety_status, is_primary, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  for (const link of links) {
    const params = [
      resourceId,
      link.label,
      link.url,
      link.link_type || 'other',
      link.source_type || 'official',
      link.legal_status || 'pending',
      link.safety_status || 'unchecked',
      link.is_primary ? 1 : 0,
      userId
    ];
    await connection.execute(insertSql, params);
  }
}

module.exports = {
  getAdminResources,
  countAdminResources,
  getAdminResourceById,
  getAdminResourceBySlug,
  createResource,
  updateResource,
  softDeleteResource,
  restoreResource,
  updateResourceStatus,
  updateResourceFeatured,
  updateResourceTrending
};
