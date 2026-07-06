# 14 — Database Index and Search Plan
## Quantum Mentor World | Quantum Mentor Official

---

## Overview

This document defines the indexing strategy and search plan for the `quantum_mentor_world` database. Good index design is critical for performance as the resource library grows.

---

## 1. Index Strategy by Table

### `resources` — Primary Content Table

| Index Name | Column(s) | Type | Reason |
|---|---|---|---|
| `PRIMARY` | `id` | PRIMARY | Row identification |
| `uq_resources_slug` | `slug` | UNIQUE | Fast slug lookups for URLs |
| `idx_resources_type` | `resource_type` | INDEX | Filter by type (software, books, etc.) |
| `idx_resources_status` | `status` | INDEX | Filter published/draft resources |
| `idx_resources_legal` | `legal_status` | INDEX | Filter approved resources |
| `idx_resources_safety` | `safety_status` | INDEX | Filter safe resources |
| `idx_resources_featured` | `is_featured` | INDEX | Homepage featured grid |
| `idx_resources_trending` | `is_trending` | INDEX | Trending/popular section |
| `idx_resources_published_at` | `published_at` | INDEX | Sort by newest |
| `idx_resources_type_status` | `(resource_type, status)` | COMPOSITE | Browse by type + filter by status |
| `idx_resources_type_legal_safety` | `(resource_type, legal_status, safety_status)` | COMPOSITE | Public resource queries |
| `idx_resources_status_published` | `(status, published_at)` | COMPOSITE | Latest published resources |
| `idx_resources_featured_status` | `(is_featured, status)` | COMPOSITE | Featured + published queries |
| `idx_resources_trending_status` | `(is_trending, status)` | COMPOSITE | Trending + published queries |
| `ft_resources_search` | `(title, short_description, full_description)` | FULLTEXT | Full-text search (future upgrade) |
| `idx_resources_deleted_at` | `deleted_at` | INDEX | Soft delete filtering |

---

### `categories`

| Index Name | Column(s) | Type | Reason |
|---|---|---|---|
| `PRIMARY` | `id` | PRIMARY | |
| `uq_categories_slug` | `slug` | UNIQUE | URL routing |
| `idx_categories_parent` | `parent_id` | INDEX | Hierarchical queries |
| `idx_categories_status` | `status` | INDEX | Active/inactive filter |
| `idx_categories_deleted_at` | `deleted_at` | INDEX | Soft delete |

---

### `tags`

| Index Name | Column(s) | Type | Reason |
|---|---|---|---|
| `PRIMARY` | `id` | PRIMARY | |
| `uq_tags_slug` | `slug` | UNIQUE | URL routing |
| `idx_tags_status` | `status` | INDEX | Active tags only |
| `idx_tags_deleted_at` | `deleted_at` | INDEX | Soft delete |

---

### `resource_categories` (Junction)

| Index Name | Column(s) | Type | Reason |
|---|---|---|---|
| `PRIMARY` | `id` | PRIMARY | |
| `uq_rc_pair` | `(resource_id, category_id)` | UNIQUE | Prevent duplicates |
| `idx_rc_resource` | `resource_id` | INDEX | Find categories of a resource |
| `idx_rc_category` | `category_id` | INDEX | Find resources in a category |

---

### `resource_tags` (Junction)

| Index Name | Column(s) | Type | Reason |
|---|---|---|---|
| `PRIMARY` | `id` | PRIMARY | |
| `uq_rt_pair` | `(resource_id, tag_id)` | UNIQUE | Prevent duplicates |
| `idx_rt_resource` | `resource_id` | INDEX | Find tags of a resource |
| `idx_rt_tag` | `tag_id` | INDEX | Find resources with a tag |

---

### `resource_links`

| Index Name | Column(s) | Type | Reason |
|---|---|---|---|
| `PRIMARY` | `id` | PRIMARY | |
| `idx_rl_resource` | `resource_id` | INDEX | Links for a resource |
| `idx_rl_legal` | `legal_status` | INDEX | Approved links only |
| `idx_rl_safety` | `safety_status` | INDEX | Safe links only |
| `idx_rl_primary` | `is_primary` | INDEX | Primary link flag |
| `idx_rl_deleted_at` | `deleted_at` | INDEX | Soft delete |

---

### `watch_episodes`

| Index Name | Column(s) | Type | Reason |
|---|---|---|---|
| `PRIMARY` | `id` | PRIMARY | |
| `uq_episode_slug` | `slug` | UNIQUE | URL routing |
| `idx_we_resource` | `resource_id` | INDEX | Episodes for a resource |
| `idx_we_status` | `status` | INDEX | Published episodes only |
| `idx_we_season_episode` | `(resource_id, season_number, episode_number)` | COMPOSITE | Episode ordering |
| `idx_we_deleted_at` | `deleted_at` | INDEX | Soft delete |

---

### `watch_servers`

| Index Name | Column(s) | Type | Reason |
|---|---|---|---|
| `PRIMARY` | `id` | PRIMARY | |
| `idx_ws_episode` | `episode_id` | INDEX | Servers for an episode |
| `idx_ws_legal` | `legal_status` | INDEX | Approved servers only |
| `idx_ws_safety` | `safety_status` | INDEX | Safe servers only |
| `idx_ws_deleted_at` | `deleted_at` | INDEX | Soft delete |

---

### `users`

| Index Name | Column(s) | Type | Reason |
|---|---|---|---|
| `PRIMARY` | `id` | PRIMARY | |
| `uq_users_email` | `email` | UNIQUE | Login and uniqueness |
| `uq_users_username` | `username` | UNIQUE | Login identifier |
| `idx_users_role` | `role` | INDEX | Filter by role |
| `idx_users_status` | `status` | INDEX | Active users only |
| `idx_users_deleted_at` | `deleted_at` | INDEX | Soft delete |

---

### `contact_messages`

| Index Name | Column(s) | Type | Reason |
|---|---|---|---|
| `PRIMARY` | `id` | PRIMARY | |
| `idx_cm_status` | `status` | INDEX | Filter by admin workflow status |
| `idx_cm_email` | `email` | INDEX | Group messages by sender |
| `idx_cm_created_at` | `created_at` | INDEX | Sort by newest |

---

### `resource_reports`

| Index Name | Column(s) | Type | Reason |
|---|---|---|---|
| `PRIMARY` | `id` | PRIMARY | |
| `idx_rr_resource` | `resource_id` | INDEX | Reports for a resource |
| `idx_rr_status` | `status` | INDEX | Admin review workflow |
| `idx_rr_type` | `report_type` | INDEX | Filter by report type |

---

### `admin_activity_logs`

| Index Name | Column(s) | Type | Reason |
|---|---|---|---|
| `PRIMARY` | `id` | PRIMARY | |
| `idx_aal_user` | `user_id` | INDEX | Logs by admin |
| `idx_aal_action` | `action` | INDEX | Filter by action type |
| `idx_aal_entity` | `entity_type` | INDEX | Filter by entity |
| `idx_aal_created_at` | `created_at` | INDEX | Sort by timestamp |

---

### `site_settings`

| Index Name | Column(s) | Type | Reason |
|---|---|---|---|
| `PRIMARY` | `id` | PRIMARY | |
| `uq_settings_key` | `setting_key` | UNIQUE | Lookup by key |
| `idx_settings_group` | `group_name` | INDEX | Group-based retrieval |
| `idx_settings_public` | `is_public` | INDEX | Public vs private filter |

---

## 2. Composite Index Usage Examples

**Get all published, approved, safe software:**
```sql
-- Uses: idx_resources_type_legal_safety
SELECT * FROM resources
WHERE resource_type = 'software'
  AND legal_status = 'approved'
  AND safety_status = 'safe'
  AND status = 'published'
  AND visibility = 'public'
  AND deleted_at IS NULL
ORDER BY published_at DESC
LIMIT 12 OFFSET 0;
```

**Homepage featured resources:**
```sql
-- Uses: idx_resources_featured_status
SELECT * FROM resources
WHERE is_featured = 1
  AND status = 'published'
  AND legal_status = 'approved'
  AND safety_status = 'safe'
  AND deleted_at IS NULL
ORDER BY published_at DESC
LIMIT 6;
```

**Latest published resources:**
```sql
-- Uses: idx_resources_status_published
SELECT * FROM resources
WHERE status = 'published'
  AND deleted_at IS NULL
ORDER BY published_at DESC
LIMIT 10;
```

---

## 3. Search Strategy

### MVP Phase — LIKE Search

For the MVP (Step 5 and Step 6), search will use `LIKE` queries on indexed columns.

**Search query pattern:**
```sql
SELECT id, title, slug, resource_type, short_description, featured_image
FROM resources
WHERE deleted_at IS NULL
  AND status = 'published'
  AND legal_status = 'approved'
  AND safety_status = 'safe'
  AND visibility = 'public'
  AND (
    title LIKE ?
    OR short_description LIKE ?
    OR full_description LIKE ?
  )
ORDER BY published_at DESC
LIMIT ? OFFSET ?;
```

**Parameter:** `'%<search_term>%'` (passed to all three LIKE positions)

**Minimum search term:** 3 characters (enforced in backend)

**Search across:**
- `resources.title` ✅
- `resources.short_description` ✅
- `resources.full_description` ✅

**Not in MVP (deferred):**
- Searching across tags
- Searching across categories
- Searching across `resource_details` fields

---

### Phase 2 Upgrade — FULLTEXT Search

After the MVP is stable, upgrade to MySQL FULLTEXT indexes for faster and ranked search.

**FULLTEXT index to add:**
```sql
ALTER TABLE resources
  ADD FULLTEXT INDEX ft_resources_search (title, short_description, full_description);
```

**FULLTEXT query pattern:**
```sql
SELECT *,
  MATCH(title, short_description, full_description) AGAINST (? IN BOOLEAN MODE) AS relevance_score
FROM resources
WHERE deleted_at IS NULL
  AND status = 'published'
  AND legal_status = 'approved'
  AND safety_status = 'safe'
  AND MATCH(title, short_description, full_description) AGAINST (? IN BOOLEAN MODE)
ORDER BY relevance_score DESC
LIMIT 12;
```

**Benefits of FULLTEXT over LIKE:**
- Much faster on large datasets
- Relevance ranking built in
- Supports Boolean mode (`+required -excluded "exact phrase"`)
- Ignores common stop words automatically

---

## 4. Pagination Strategy

All list queries must use `LIMIT` and `OFFSET` for pagination.

**Standard pattern:**
```sql
-- Page 1: LIMIT 12 OFFSET 0
-- Page 2: LIMIT 12 OFFSET 12
-- Page 3: LIMIT 12 OFFSET 24

SELECT SQL_CALC_FOUND_ROWS ...
FROM resources
WHERE ...
LIMIT 12 OFFSET 0;

SELECT FOUND_ROWS(); -- Gets total count without a second query
```

**Default page size:** 12 resources per page (configurable via `site_settings.resources_per_page`)

---

## 5. Performance Notes

| Recommendation | Detail |
|---|---|
| Always filter `deleted_at IS NULL` | Include in WHERE clause, not application layer |
| Use `SELECT` specific columns | Avoid `SELECT *` in production queries |
| Pagination on all list endpoints | Never return unbounded result sets |
| Cache category/tag lists | These change rarely — cache at app level later |
| Avoid N+1 queries | Use JOINs or batch queries for related data |
| Monitor slow queries | Enable MySQL slow query log in development |

---

## 6. MySQL EXPLAIN Usage

Before finalizing any complex query in Step 5, run `EXPLAIN` to verify index usage:

```sql
EXPLAIN SELECT * FROM resources
WHERE resource_type = 'software'
  AND status = 'published'
  AND legal_status = 'approved'
  AND deleted_at IS NULL
ORDER BY published_at DESC
LIMIT 12;
```

Check that `key` column shows the expected index name. If it shows `NULL`, the index is not being used and the query needs optimization.

---

*Document created: Step 4 — Quantum Mentor World Database Index and Search Plan*
*Version: 1.0*
