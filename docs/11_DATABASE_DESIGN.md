# 11 — Database Design
## Quantum Mentor World | Quantum Mentor Official

---

## Overview

| Property | Value |
|---|---|
| **Database Name** | `quantum_mentor_world` |
| **Engine** | MySQL / MariaDB |
| **Character Set** | `utf8mb4` |
| **Collation** | `utf8mb4_general_ci` |
| **Local Tool** | XAMPP + phpMyAdmin |
| **Total Tables** | 15 |

---

## Table Index

| # | Table | Purpose |
|---|---|---|
| 1 | `users` | Admin and future user accounts |
| 2 | `resources` | All resource entries (base table) |
| 3 | `resource_details` | Type-specific resource metadata |
| 4 | `categories` | Resource categories |
| 5 | `tags` | Resource tags |
| 6 | `resource_categories` | Resources ↔ Categories (many-to-many) |
| 7 | `resource_tags` | Resources ↔ Tags (many-to-many) |
| 8 | `resource_links` | Safe external links per resource |
| 9 | `media` | Uploaded images and files |
| 10 | `watch_episodes` | Episodes for watch content |
| 11 | `watch_servers` | Embed servers per watch episode |
| 12 | `contact_messages` | Contact form submissions |
| 13 | `site_settings` | Global key-value site configuration |
| 14 | `admin_activity_logs` | Admin action audit trail |
| 15 | `resource_reports` | User reports for broken/unsafe resources |

---

## Table 1 — `users`

**Purpose:** Stores admin users and future website user accounts. Passwords are always hashed and never stored as plain text.

| Field | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `full_name` | VARCHAR(150) | NO | — | Display name |
| `username` | VARCHAR(80) | NO | — | UNIQUE — login identifier |
| `email` | VARCHAR(190) | NO | — | UNIQUE — must be validated format |
| `password_hash` | VARCHAR(255) | NO | — | bcrypt hash only — never plain text |
| `role` | ENUM('admin','editor','moderator','user') | NO | 'user' | Access level |
| `status` | ENUM('active','inactive','suspended') | NO | 'active' | Account status |
| `avatar` | VARCHAR(500) | YES | NULL | Path to avatar image |
| `last_login_at` | DATETIME | YES | NULL | Timestamp of last successful login |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | DATETIME | NO | CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |
| `deleted_at` | DATETIME | YES | NULL | Soft delete — NULL = not deleted |

**Primary Key:** `id`
**Unique Keys:** `username`, `email`
**Indexes:** `email`, `username`, `role`, `status`
**Soft Delete:** YES — filter `WHERE deleted_at IS NULL`

---

## Table 2 — `resources`

**Purpose:** The main base table for all resource types. Every piece of content on the platform starts here. Type-specific details are stored in `resource_details`.

| Field | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `title` | VARCHAR(255) | NO | — | Resource title |
| `slug` | VARCHAR(280) | NO | — | UNIQUE — URL-friendly identifier |
| `resource_type` | ENUM('software','book','tool','game','theme_plugin','watch','news','github_repo') | NO | — | Resource classification |
| `short_description` | TEXT | YES | NULL | Brief summary (max ~300 chars recommended) |
| `full_description` | LONGTEXT | YES | NULL | Full rich-text description |
| `featured_image` | VARCHAR(500) | YES | NULL | Path or URL to featured image |
| `status` | ENUM('draft','pending_review','published','rejected','archived') | NO | 'draft' | Workflow status |
| `visibility` | ENUM('public','private') | NO | 'public' | Audience visibility |
| `is_featured` | TINYINT(1) | NO | 0 | Featured on homepage |
| `is_trending` | TINYINT(1) | NO | 0 | Trending/highlighted |
| `legal_status` | ENUM('pending','approved','rejected') | NO | 'pending' | Legal compliance status |
| `safety_status` | ENUM('unchecked','safe','warning','unsafe') | NO | 'unchecked' | Safety verification |
| `source_type` | ENUM('official','open_source','public_domain','freeware','creator_approved','licensed','educational','other') | YES | 'other' | Origin type |
| `access_type` | ENUM('free','paid','freemium','open_source','public_domain','external') | YES | 'free' | How users access it |
| `published_at` | DATETIME | YES | NULL | When resource was published |
| `created_by` | BIGINT UNSIGNED | YES | NULL | FK → users.id |
| `updated_by` | BIGINT UNSIGNED | YES | NULL | FK → users.id (last editor) |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | DATETIME | NO | CURRENT_TIMESTAMP ON UPDATE | Last update |
| `deleted_at` | DATETIME | YES | NULL | Soft delete |

**Primary Key:** `id`
**Unique Keys:** `slug`
**Foreign Keys:** `created_by → users.id`, `updated_by → users.id`
**Indexes:** `slug`, `resource_type`, `status`, `legal_status`, `safety_status`, `is_featured`, `is_trending`, `published_at`
**Composite Indexes:** `(resource_type, status)`, `(resource_type, legal_status, safety_status)`, `(status, published_at)`, `(is_featured, status)`, `(is_trending, status)`
**Soft Delete:** YES
**Public Query Rule:** `WHERE status = 'published' AND legal_status = 'approved' AND safety_status = 'safe' AND visibility = 'public' AND deleted_at IS NULL`

---

## Table 3 — `resource_details`

**Purpose:** Stores type-specific metadata for each resource. One-to-one with `resources`. All URL fields must be validated before saving.

| Field | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `resource_id` | BIGINT UNSIGNED | NO | — | UNIQUE FK → resources.id |
| `version` | VARCHAR(50) | YES | NULL | Software/theme version |
| `platform` | VARCHAR(255) | YES | NULL | OS/platform (Windows, macOS, Linux, Web) |
| `developer` | VARCHAR(255) | YES | NULL | Developer or studio name |
| `author` | VARCHAR(255) | YES | NULL | Book or content author |
| `publisher` | VARCHAR(255) | YES | NULL | Publisher name |
| `language` | VARCHAR(100) | YES | NULL | Primary language |
| `file_size` | VARCHAR(50) | YES | NULL | Human-readable size (e.g., "45 MB") |
| `license_type` | VARCHAR(100) | YES | NULL | MIT, GPL-2.0, CC0, Freeware, etc. |
| `release_year` | YEAR | YES | NULL | Year released |
| `requirements` | TEXT | YES | NULL | System/browser requirements |
| `installation_guide` | TEXT | YES | NULL | Step-by-step install instructions |
| `features` | TEXT | YES | NULL | Comma-separated or paragraph list |
| `limitations` | TEXT | YES | NULL | Free plan limits or restrictions |
| `documentation_url` | VARCHAR(500) | YES | NULL | Official docs link — must be https:// |
| `official_url` | VARCHAR(500) | YES | NULL | Official website — must be https:// |
| `demo_url` | VARCHAR(500) | YES | NULL | Live demo link |
| `trailer_url` | VARCHAR(500) | YES | NULL | YouTube/Vimeo trailer embed URL |
| `github_url` | VARCHAR(500) | YES | NULL | GitHub repo URL |
| `read_online_url` | VARCHAR(500) | YES | NULL | Online reader link (books) |
| `extra_json` | JSON | YES | NULL | Future flexible fields |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | |
| `updated_at` | DATETIME | NO | CURRENT_TIMESTAMP ON UPDATE | |

**Primary Key:** `id`
**Unique Keys:** `resource_id`
**Foreign Keys:** `resource_id → resources.id` (CASCADE DELETE)
**URL Validation Rule:** All `*_url` fields must begin with `https://` — backend must reject `javascript:`, `data:`, `file:`, `http://localhost`, or private IP addresses.

---

## Table 4 — `categories`

**Purpose:** Stores content categories for organizing resources. Supports parent-child hierarchy.

| Field | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `name` | VARCHAR(100) | NO | — | Category display name |
| `slug` | VARCHAR(120) | NO | — | UNIQUE URL-friendly identifier |
| `description` | TEXT | YES | NULL | Category description |
| `icon` | VARCHAR(100) | YES | NULL | Icon name or emoji |
| `parent_id` | BIGINT UNSIGNED | YES | NULL | Self-referencing FK → categories.id |
| `sort_order` | INT | NO | 0 | Display sort priority |
| `status` | ENUM('active','inactive') | NO | 'active' | Active/inactive |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | |
| `updated_at` | DATETIME | NO | CURRENT_TIMESTAMP ON UPDATE | |
| `deleted_at` | DATETIME | YES | NULL | Soft delete |

**Primary Key:** `id`
**Unique Keys:** `slug`
**Foreign Keys:** `parent_id → categories.id`
**Soft Delete:** YES

---

## Table 5 — `tags`

**Purpose:** Stores searchable tags for filtering and organizing resources.

| Field | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `name` | VARCHAR(80) | NO | — | Tag display name |
| `slug` | VARCHAR(100) | NO | — | UNIQUE URL-friendly identifier |
| `description` | TEXT | YES | NULL | Optional tag description |
| `status` | ENUM('active','inactive') | NO | 'active' | |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | |
| `updated_at` | DATETIME | NO | CURRENT_TIMESTAMP ON UPDATE | |
| `deleted_at` | DATETIME | YES | NULL | Soft delete |

**Primary Key:** `id`
**Unique Keys:** `slug`
**Soft Delete:** YES

---

## Table 6 — `resource_categories`

**Purpose:** Junction table for the many-to-many relationship between resources and categories.

| Field | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `resource_id` | BIGINT UNSIGNED | NO | — | FK → resources.id |
| `category_id` | BIGINT UNSIGNED | NO | — | FK → categories.id |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | |

**Primary Key:** `id`
**Unique Keys:** `(resource_id, category_id)` — prevents duplicates
**Foreign Keys:** `resource_id → resources.id` (CASCADE DELETE), `category_id → categories.id` (CASCADE DELETE)
**Indexes:** `resource_id`, `category_id`

---

## Table 7 — `resource_tags`

**Purpose:** Junction table for the many-to-many relationship between resources and tags.

| Field | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `resource_id` | BIGINT UNSIGNED | NO | — | FK → resources.id |
| `tag_id` | BIGINT UNSIGNED | NO | — | FK → tags.id |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | |

**Primary Key:** `id`
**Unique Keys:** `(resource_id, tag_id)` — prevents duplicates
**Foreign Keys:** `resource_id → resources.id` (CASCADE DELETE), `tag_id → tags.id` (CASCADE DELETE)
**Indexes:** `resource_id`, `tag_id`

---

## Table 8 — `resource_links`

**Purpose:** Stores verified safe external links (official site, download, GitHub, etc.) for each resource.

| Field | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `resource_id` | BIGINT UNSIGNED | NO | — | FK → resources.id |
| `label` | VARCHAR(150) | NO | — | Button label (e.g., "Download", "Official Site") |
| `url` | VARCHAR(500) | NO | — | External URL — validated by backend |
| `link_type` | ENUM('official','download','github','documentation','demo','read_online','launch_tool','source','trailer','other') | NO | 'other' | Link classification |
| `source_type` | ENUM('official','open_source','public_domain','freeware','creator_approved','licensed','educational','other') | YES | 'official' | Origin type |
| `legal_status` | ENUM('pending','approved','rejected') | NO | 'pending' | Legal check status |
| `safety_status` | ENUM('unchecked','safe','warning','unsafe') | NO | 'unchecked' | Safety check status |
| `is_primary` | TINYINT(1) | NO | 0 | Primary/featured link flag |
| `click_count` | INT UNSIGNED | NO | 0 | Link click analytics (optional) |
| `created_by` | BIGINT UNSIGNED | YES | NULL | FK → users.id |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | |
| `updated_at` | DATETIME | NO | CURRENT_TIMESTAMP ON UPDATE | |
| `deleted_at` | DATETIME | YES | NULL | Soft delete |

**Primary Key:** `id`
**Foreign Keys:** `resource_id → resources.id` (CASCADE DELETE), `created_by → users.id`
**Indexes:** `resource_id`, `legal_status`, `safety_status`, `is_primary`
**Soft Delete:** YES
**Public Query Rule:** `WHERE legal_status = 'approved' AND safety_status = 'safe' AND deleted_at IS NULL`
**Blocked Protocols:** `javascript:`, `data:`, `file:`, `ftp:`, `telnet:`, private IP ranges

---

## Table 9 — `media`

**Purpose:** Tracks uploaded media files (images, thumbnails) stored on the server.

| Field | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `file_name` | VARCHAR(255) | NO | — | Stored file name (renamed for safety) |
| `original_name` | VARCHAR(255) | YES | NULL | Original upload filename |
| `file_path` | VARCHAR(500) | NO | — | Server path to file |
| `file_url` | VARCHAR(500) | NO | — | Public URL for the file |
| `mime_type` | VARCHAR(100) | NO | — | e.g., image/jpeg, image/png |
| `file_size` | INT UNSIGNED | NO | 0 | File size in bytes |
| `alt_text` | VARCHAR(255) | YES | NULL | Accessibility alt text |
| `caption` | TEXT | YES | NULL | Optional caption |
| `uploaded_by` | BIGINT UNSIGNED | YES | NULL | FK → users.id |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | |
| `updated_at` | DATETIME | NO | CURRENT_TIMESTAMP ON UPDATE | |
| `deleted_at` | DATETIME | YES | NULL | Soft delete |

**Primary Key:** `id`
**Foreign Keys:** `uploaded_by → users.id`
**Allowed MIME Types:** `image/jpeg`, `image/jpg`, `image/png`, `image/webp`, `image/gif`
**Blocked Types:** All executables, scripts, PDFs (until explicitly needed), `.exe`, `.php`, `.js`, `.bat`, `.sh`
**Soft Delete:** YES

---

## Table 10 — `watch_episodes`

**Purpose:** Stores individual episode data for legal watch content resources.

| Field | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `resource_id` | BIGINT UNSIGNED | NO | — | FK → resources.id (type must be 'watch') |
| `season_number` | TINYINT UNSIGNED | NO | 1 | Season number (1 for single-season) |
| `episode_number` | SMALLINT UNSIGNED | NO | 1 | Episode sequence number |
| `title` | VARCHAR(255) | NO | — | Episode title |
| `slug` | VARCHAR(280) | NO | — | UNIQUE URL-friendly identifier |
| `description` | TEXT | YES | NULL | Episode description |
| `thumbnail` | VARCHAR(500) | YES | NULL | Episode thumbnail image path |
| `duration` | VARCHAR(20) | YES | NULL | Duration string (e.g., "45:30") |
| `release_date` | DATE | YES | NULL | Original release date |
| `status` | ENUM('draft','published','pending_review','rejected') | NO | 'draft' | |
| `sort_order` | INT | NO | 0 | Display order within season |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | |
| `updated_at` | DATETIME | NO | CURRENT_TIMESTAMP ON UPDATE | |
| `deleted_at` | DATETIME | YES | NULL | Soft delete |

**Primary Key:** `id`
**Unique Keys:** `slug`
**Foreign Keys:** `resource_id → resources.id` (CASCADE DELETE)
**Indexes:** `resource_id`, `status`, `(resource_id, season_number, episode_number)`
**Soft Delete:** YES

---

## Table 11 — `watch_servers`

**Purpose:** Stores legal embed server URLs per watch episode. Only verified safe sources allowed.

| Field | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `episode_id` | BIGINT UNSIGNED | NO | — | FK → watch_episodes.id |
| `server_name` | VARCHAR(100) | NO | — | e.g., "YouTube", "Vimeo", "Archive.org" |
| `embed_url` | VARCHAR(500) | NO | — | Legal embed URL (YouTube /embed/, Vimeo player, etc.) |
| `source_url` | VARCHAR(500) | YES | NULL | Original content source page URL |
| `source_type` | ENUM('youtube','vimeo','archive_org','official','creator_approved','public_domain','educational','other') | NO | 'other' | Embed source classification |
| `legal_status` | ENUM('pending','approved','rejected') | NO | 'pending' | Legal review status |
| `safety_status` | ENUM('unchecked','safe','warning','unsafe') | NO | 'unchecked' | Safety check status |
| `is_primary` | TINYINT(1) | NO | 0 | Primary server flag |
| `sort_order` | INT | NO | 0 | Display order |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | |
| `updated_at` | DATETIME | NO | CURRENT_TIMESTAMP ON UPDATE | |
| `deleted_at` | DATETIME | YES | NULL | Soft delete |

**Primary Key:** `id`
**Foreign Keys:** `episode_id → watch_episodes.id` (CASCADE DELETE)
**Indexes:** `episode_id`, `legal_status`, `safety_status`
**Soft Delete:** YES
**Allowed Sources:** YouTube (`youtube.com/embed/`), Vimeo (`player.vimeo.com`), Archive.org, Official platform, Creator-approved, Public domain
**Strictly Blocked:** Illegal streaming hosts, unlicensed servers, raw iframe code without URL validation

---

## Table 12 — `contact_messages`

**Purpose:** Stores submissions from the public contact form. Admin-only access.

| Field | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `full_name` | VARCHAR(150) | NO | — | Sender name |
| `email` | VARCHAR(190) | NO | — | Sender email — validated format |
| `subject` | VARCHAR(255) | NO | — | Message subject |
| `message` | TEXT | NO | — | Message body — sanitized before storage |
| `status` | ENUM('new','read','replied','archived','spam') | NO | 'new' | Admin workflow status |
| `ip_address` | VARCHAR(45) | YES | NULL | Sender IP (IPv4/IPv6) |
| `user_agent` | VARCHAR(500) | YES | NULL | Browser/client user agent |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | |
| `updated_at` | DATETIME | NO | CURRENT_TIMESTAMP ON UPDATE | |
| `deleted_at` | DATETIME | YES | NULL | Soft delete |

**Primary Key:** `id`
**Indexes:** `status`, `email`, `created_at`
**Access:** Admin only — never exposed via public API
**Soft Delete:** YES
**Sanitization:** All message text must be sanitized (strip HTML) before storage

---

## Table 13 — `site_settings`

**Purpose:** Stores editable global website configuration as key-value pairs. Managed by admin via dashboard.

| Field | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `setting_key` | VARCHAR(100) | NO | — | UNIQUE setting identifier (e.g., `site_name`) |
| `setting_value` | TEXT | YES | NULL | Setting value |
| `setting_type` | ENUM('string','number','boolean','json','text') | NO | 'string' | Value data type hint |
| `group_name` | VARCHAR(80) | NO | 'general' | Logical grouping (general, social, email, seo) |
| `description` | VARCHAR(255) | YES | NULL | Human-readable description for admin |
| `is_public` | TINYINT(1) | NO | 0 | 1 = safe to expose on frontend, 0 = admin only |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | |
| `updated_at` | DATETIME | NO | CURRENT_TIMESTAMP ON UPDATE | |

**Primary Key:** `id`
**Unique Keys:** `setting_key`
**Indexes:** `group_name`, `is_public`
**Rules:** Never store passwords, API secrets, or JWT keys here. Public settings (`is_public = 1`) may be returned to frontend. Private settings stay server-side only.

**Planned Default Settings:**

| Key | Example Value | Group | Public |
|---|---|---|---|
| `site_name` | Quantum Mentor World | general | Yes |
| `site_tagline` | Legal Resources for Everyone | general | Yes |
| `contact_email` | admin@example.com | general | No |
| `resources_per_page` | 12 | general | Yes |
| `social_twitter` | https://twitter.com/... | social | Yes |
| `social_github` | https://github.com/... | social | Yes |
| `meta_description` | Discover legal resources... | seo | Yes |

---

## Table 14 — `admin_activity_logs`

**Purpose:** Immutable audit trail of all significant admin actions. No soft delete — logs are permanent.

| Field | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `user_id` | BIGINT UNSIGNED | YES | NULL | FK → users.id (NULL if user deleted) |
| `action` | VARCHAR(80) | NO | — | Action type (see allowed values) |
| `entity_type` | VARCHAR(80) | YES | NULL | e.g., 'resource', 'category', 'user' |
| `entity_id` | BIGINT UNSIGNED | YES | NULL | ID of affected record |
| `description` | TEXT | YES | NULL | Human-readable action description |
| `old_values` | JSON | YES | NULL | Previous field values (for updates) |
| `new_values` | JSON | YES | NULL | New field values (for updates) |
| `ip_address` | VARCHAR(45) | YES | NULL | Admin IP address |
| `user_agent` | VARCHAR(500) | YES | NULL | Admin browser info |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | |

**Primary Key:** `id`
**Foreign Keys:** `user_id → users.id` (SET NULL on delete — preserve log integrity)
**Indexes:** `user_id`, `action`, `entity_type`, `created_at`
**No Soft Delete** — audit logs are permanent records
**Tracked Actions:** `login`, `logout`, `create`, `update`, `delete`, `restore`, `publish`, `unpublish`, `approve`, `reject`, `upload`, `settings_update`, `password_change`
**Forbidden:** Never store `password_hash`, JWT secrets, or API keys in log values

---

## Table 15 — `resource_reports`

**Purpose:** Allows public users to flag resources with broken links, unsafe content, or incorrect information. Admin-only visibility.

| Field | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `resource_id` | BIGINT UNSIGNED | NO | — | FK → resources.id |
| `link_id` | BIGINT UNSIGNED | YES | NULL | FK → resource_links.id (optional) |
| `report_type` | ENUM('broken_link','unsafe_link','copyright_issue','wrong_information','piracy_concern','other') | NO | 'other' | Report classification |
| `reporter_name` | VARCHAR(150) | YES | NULL | Reporter's name (optional) |
| `reporter_email` | VARCHAR(190) | YES | NULL | Reporter's email (optional) |
| `message` | TEXT | NO | — | Report details — sanitized before storage |
| `status` | ENUM('new','reviewing','resolved','rejected','spam') | NO | 'new' | Admin review status |
| `ip_address` | VARCHAR(45) | YES | NULL | Reporter IP for spam detection |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | |
| `updated_at` | DATETIME | NO | CURRENT_TIMESTAMP ON UPDATE | |
| `deleted_at` | DATETIME | YES | NULL | Soft delete |

**Primary Key:** `id`
**Foreign Keys:** `resource_id → resources.id`, `link_id → resource_links.id`
**Indexes:** `resource_id`, `status`, `report_type`
**Access:** Admin only — never exposed publicly
**Soft Delete:** YES

---

## ENUM / Controlled Value Reference

| Context | Field | Allowed Values |
|---|---|---|
| Resource | `resource_type` | software, book, tool, game, theme_plugin, watch, news, github_repo |
| Resource | `status` | draft, pending_review, published, rejected, archived |
| Resource | `visibility` | public, private |
| Resource | `legal_status` | pending, approved, rejected |
| Resource | `safety_status` | unchecked, safe, warning, unsafe |
| Resource | `source_type` | official, open_source, public_domain, freeware, creator_approved, licensed, educational, other |
| Resource | `access_type` | free, paid, freemium, open_source, public_domain, external |
| User | `role` | admin, editor, moderator, user |
| User | `status` | active, inactive, suspended |
| Link | `link_type` | official, download, github, documentation, demo, read_online, launch_tool, source, trailer, other |
| Watch Server | `source_type` | youtube, vimeo, archive_org, official, creator_approved, public_domain, educational, other |
| Contact | `status` | new, read, replied, archived, spam |
| Report | `report_type` | broken_link, unsafe_link, copyright_issue, wrong_information, piracy_concern, other |
| Report | `status` | new, reviewing, resolved, rejected, spam |
| Episode | `status` | draft, published, pending_review, rejected |
| Setting | `setting_type` | string, number, boolean, json, text |

---

*Document created: Step 4 — Quantum Mentor World Database Design*
*Version: 1.0*
