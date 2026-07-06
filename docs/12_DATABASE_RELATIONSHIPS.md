# 12 — Database Relationships
## Quantum Mentor World | Quantum Mentor Official

---

## Overview

This document describes all relationships between the 15 database tables in the `quantum_mentor_world` database. Understanding these relationships is essential before writing SQL schema in Step 5.

---

## Entity Relationship Summary

```
users
  ├──< resources (created_by, updated_by)
  ├──< media (uploaded_by)
  └──< admin_activity_logs (user_id)

resources
  ├──  resource_details (one-to-one)
  ├──< resource_links (one-to-many)
  ├──< resource_categories (many-to-many via junction)
  ├──< resource_tags (many-to-many via junction)
  ├──< watch_episodes (one-to-many, type=watch only)
  └──< resource_reports (one-to-many)

categories
  ├──< resource_categories (many-to-many via junction)
  └──  categories (self-referencing parent_id)

tags
  └──< resource_tags (many-to-many via junction)

resource_links
  └──< resource_reports (one-to-many, optional)

watch_episodes
  └──< watch_servers (one-to-many)
```

---

## Relationship Details

### 1. users → resources
**Type:** One-to-Many (as creator and editor)

| users | | resources |
|---|---|---|
| `id` | → | `created_by` |
| `id` | → | `updated_by` |

- One admin user can create many resources
- One admin user can edit many resources
- If a user is soft-deleted, resources remain with the `created_by` reference intact
- `SET NULL` on user delete to preserve resource history

---

### 2. users → media
**Type:** One-to-Many

| users | | media |
|---|---|---|
| `id` | → | `uploaded_by` |

- One admin can upload many media files
- `SET NULL` on user delete — media files remain

---

### 3. users → admin_activity_logs
**Type:** One-to-Many

| users | | admin_activity_logs |
|---|---|---|
| `id` | → | `user_id` |

- Every admin action is recorded against a user
- `SET NULL` on user delete — logs are preserved for audit integrity

---

### 4. resources → resource_details
**Type:** One-to-One (enforced by UNIQUE constraint on `resource_id`)

| resources | | resource_details |
|---|---|---|
| `id` | → | `resource_id` |

- Each resource has exactly one detail record
- The detail row is created when the resource is created
- `CASCADE DELETE` — deleting a resource also deletes its details

---

### 5. resources → resource_links
**Type:** One-to-Many

| resources | | resource_links |
|---|---|---|
| `id` | → | `resource_id` |

- One resource can have many external links (official, download, GitHub, docs, demo, etc.)
- Each link has its own `legal_status` and `safety_status`
- `CASCADE DELETE` — deleting resource removes its links
- Soft delete on links is independent of resource soft delete

---

### 6. resources ↔ categories
**Type:** Many-to-Many (via `resource_categories` junction table)

| resources | | resource_categories | | categories |
|---|---|---|---|---|
| `id` | → | `resource_id` | ← | `category_id` | ← | `id` |

- One resource can belong to many categories
- One category can contain many resources
- Duplicate pairs `(resource_id, category_id)` are prevented by a UNIQUE constraint
- `CASCADE DELETE` on both sides — removing a resource or category cleans up the junction

---

### 7. resources ↔ tags
**Type:** Many-to-Many (via `resource_tags` junction table)

| resources | | resource_tags | | tags |
|---|---|---|---|---|
| `id` | → | `resource_id` | ← | `tag_id` | ← | `id` |

- One resource can have many tags
- One tag can be applied to many resources
- Duplicate pairs `(resource_id, tag_id)` are prevented by a UNIQUE constraint
- `CASCADE DELETE` on both sides

---

### 8. resources → watch_episodes
**Type:** One-to-Many (watch resource type only)

| resources | | watch_episodes |
|---|---|---|
| `id` | → | `resource_id` |

- One watch resource can have many episodes
- Only resources where `resource_type = 'watch'` should create episode records
- Backend must validate resource type before allowing episode creation
- `CASCADE DELETE` — deleting a watch resource removes all its episodes

---

### 9. watch_episodes → watch_servers
**Type:** One-to-Many

| watch_episodes | | watch_servers |
|---|---|---|
| `id` | → | `episode_id` |

- One episode can have multiple embed servers (YouTube primary, Vimeo backup, etc.)
- Each server entry has independent `legal_status` and `safety_status`
- Only servers with `legal_status = 'approved'` and `safety_status = 'safe'` are shown publicly
- `CASCADE DELETE` — deleting an episode removes all its server entries

---

### 10. resource_links → resource_reports
**Type:** One-to-Many (optional link)

| resource_links | | resource_reports |
|---|---|---|
| `id` | → | `link_id` (nullable) |

- A report can optionally target a specific link within a resource
- `link_id` is nullable — reports can be about the resource in general
- `SET NULL` on link delete — report preserved even if link is removed

---

### 11. resources → resource_reports
**Type:** One-to-Many

| resources | | resource_reports |
|---|---|---|
| `id` | → | `resource_id` |

- One resource can receive many reports from users
- Reports are admin-only — never shown publicly
- Soft delete on reports

---

### 12. categories → categories (Self-referencing)
**Type:** One-to-Many (self)

| categories | | categories |
|---|---|---|
| `id` | → | `parent_id` |

- A category can have a parent category (for hierarchical organization)
- Example: "Programming" → parent of "Python", "JavaScript"
- `parent_id` is nullable — top-level categories have `parent_id = NULL`

---

## Full Relationship Map (Text Diagram)

```
┌─────────────────────────────────────────────────────────────────┐
│                     quantum_mentor_world                        │
└─────────────────────────────────────────────────────────────────┘

[users]
  id ─────┬──────────────────► [resources].created_by
          ├──────────────────► [resources].updated_by
          ├──────────────────► [media].uploaded_by
          └──────────────────► [admin_activity_logs].user_id

[resources]
  id ─────┬──── (1:1) ───────► [resource_details].resource_id
          ├──── (1:N) ───────► [resource_links].resource_id
          ├──── (M:N via) ───► [resource_categories].resource_id
          ├──── (M:N via) ───► [resource_tags].resource_id
          ├──── (1:N) ───────► [watch_episodes].resource_id
          └──── (1:N) ───────► [resource_reports].resource_id

[categories]
  id ─────┬──── (M:N via) ───► [resource_categories].category_id
          └──── (self) ──────► [categories].parent_id

[tags]
  id ──────────────────────► [resource_tags].tag_id

[watch_episodes]
  id ──────────────────────► [watch_servers].episode_id

[resource_links]
  id ──────────────────────► [resource_reports].link_id (nullable)
```

---

## Foreign Key Cascade Rules

| FK | On DELETE | On UPDATE | Reason |
|---|---|---|---|
| `resources.created_by → users.id` | SET NULL | CASCADE | Preserve resources if user deleted |
| `resources.updated_by → users.id` | SET NULL | CASCADE | Preserve update history |
| `resource_details.resource_id → resources.id` | CASCADE | CASCADE | Details are part of the resource |
| `resource_links.resource_id → resources.id` | CASCADE | CASCADE | Links belong to resource |
| `resource_categories.resource_id → resources.id` | CASCADE | CASCADE | Junction cleanup |
| `resource_categories.category_id → categories.id` | CASCADE | CASCADE | Junction cleanup |
| `resource_tags.resource_id → resources.id` | CASCADE | CASCADE | Junction cleanup |
| `resource_tags.tag_id → tags.id` | CASCADE | CASCADE | Junction cleanup |
| `media.uploaded_by → users.id` | SET NULL | CASCADE | Keep media files even if uploader deleted |
| `watch_episodes.resource_id → resources.id` | CASCADE | CASCADE | Episodes belong to resource |
| `watch_servers.episode_id → watch_episodes.id` | CASCADE | CASCADE | Servers belong to episode |
| `resource_reports.resource_id → resources.id` | CASCADE | CASCADE | Reports target resource |
| `resource_reports.link_id → resource_links.id` | SET NULL | CASCADE | Report survives if link is removed |
| `admin_activity_logs.user_id → users.id` | SET NULL | CASCADE | Preserve audit trail |
| `categories.parent_id → categories.id` | SET NULL | CASCADE | Parent deleted → children become top-level |

---

## Data Integrity Rules

1. **Slug uniqueness** — `resources.slug`, `categories.slug`, `tags.slug`, `watch_episodes.slug` must all be globally unique within their table
2. **Email uniqueness** — `users.email` must be globally unique
3. **Username uniqueness** — `users.username` must be globally unique
4. **Setting key uniqueness** — `site_settings.setting_key` must be unique
5. **Junction uniqueness** — `(resource_id, category_id)` and `(resource_id, tag_id)` pairs must be unique
6. **Resource details** — only one `resource_details` row per `resource_id`
7. **Public visibility rule** — a resource is only publicly visible when ALL of these are true:
   - `status = 'published'`
   - `legal_status = 'approved'`
   - `safety_status = 'safe'`
   - `visibility = 'public'`
   - `deleted_at IS NULL`

---

*Document created: Step 4 — Quantum Mentor World Database Relationships*
*Version: 1.0*
