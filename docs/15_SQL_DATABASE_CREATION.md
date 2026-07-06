# 15 — SQL Database Creation
## Quantum Mentor World | Quantum Mentor Official

---

## Overview

The database schema for **Quantum Mentor World** (`quantum_mentor_world`) has been implemented as a structured, security-focused MySQL/MariaDB SQL file.

* **Database File:** [quantum_mentor_world.sql](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/database/quantum_mentor_world.sql)
* **Storage Engine:** `InnoDB`
* **Default Charset:** `utf8mb4`
* **Default Collation:** `utf8mb4_general_ci`
* **Total Tables:** 15

---

## Creation and Reset Workflow

To support safe local development, the SQL script disables foreign key constraints, drops existing tables in reverse dependency order, creates the tables in dependency-first order, and re-enables foreign key checks under a transaction context.

### Safe Drop Order (Reverse Dependency)
1. `resource_reports` (depends on resources, resource_links)
2. `admin_activity_logs` (depends on users)
3. `site_settings`
4. `contact_messages`
5. `watch_servers` (depends on watch_episodes)
6. `watch_episodes` (depends on resources)
7. `resource_links` (depends on resources, users)
8. `resource_tags` (depends on resources, tags)
9. `resource_categories` (depends on resources, categories)
10. `resource_details` (depends on resources)
11. `resources` (depends on users)
12. `media` (depends on users)
13. `tags`
14. `categories` (depends on parent category)
15. `users`

### Creation Order (Dependency First)
1. `users`
2. `categories`
3. `tags`
4. `media`
5. `resources`
6. `resource_details`
7. `resource_categories`
8. `resource_tags`
9. `resource_links`
10. `watch_episodes`
11. `watch_servers`
12. `contact_messages`
13. `site_settings`
14. `admin_activity_logs`
15. `resource_reports`

---

## Schema Architecture and Security Features

### 1. Key Fields and Data Types
* **Primary Keys:** Every table features a primary key. Relational tables utilize `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY` for standardizing scalability. Junction tables and details tables use explicit unique keys to ensure clean relationships.
* **Foreign Keys:** References are mapped with matching type formats (`BIGINT UNSIGNED`). Cascades (`ON DELETE CASCADE`) are applied on resources, categories, tags, and episodes to ensure clean cascade deletions, whereas log and uploading fields use `ON DELETE SET NULL` to preserve logs or files when users are removed.

### 2. Indexes and Search Strategy
Comprehensive indexes have been added to query-intensive columns:
* **Lookup Indexes:** Indexes placed on slugs (`slug`), parent identifiers (`parent_id`), visibility status (`visibility`), and status ENUMs (`status`, `legal_status`, `safety_status`).
* **Composite Indexes (Resources Table):**
  * `(resource_type, status)` - For filtering by resource type and status
  * `(resource_type, legal_status, safety_status)` - For fetching safe, type-specific content
  * `(status, published_at)` - For loading recent published entries
  * `(is_featured, status)` - For homepage slider items
  * `(is_trending, status)` - For sidebar trending widgets

### 3. Legal and Safety Rules Enforcement
To prevent the exhibition of unsafe links (cracked software, piracy, nulled items, malware), the database incorporates:
* `legal_status` ENUM (`'pending'`, `'approved'`, `'rejected'`)
* `safety_status` ENUM (`'unchecked'`, `'safe'`, `'warning'`, `'unsafe'`)
* `source_type` ENUM (`'official'`, `'open_source'`, `'public_domain'`, `'freeware'`, `'creator_approved'`, `'licensed'`, `'educational'`, `'other'`)

#### Public Filtering Constraint
The backend must query public content using the following constraint:
```sql
SELECT * FROM resources
WHERE status = 'published'
  AND visibility = 'public'
  AND legal_status = 'approved'
  AND safety_status IN ('safe', 'warning')
  AND deleted_at IS NULL;
```

### 4. Soft Delete Capability
11 out of the 15 tables include `deleted_at DATETIME DEFAULT NULL`. Rows are kept in the database but ignored in normal public queries (`WHERE deleted_at IS NULL`), permitting administrators to restore mistakenly deleted resources or logs easily.

---

## Production warning

> [!WARNING]
> The database schema file contains `DROP TABLE IF EXISTS` statements. Importing this file into an active database will permanently delete all existing tables and data.
> Never import `quantum_mentor_world.sql` directly into a production environment without backing up existing data.
