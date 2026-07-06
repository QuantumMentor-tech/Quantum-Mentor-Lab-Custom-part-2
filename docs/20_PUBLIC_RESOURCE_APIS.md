# 20 — Public Resource APIs
## Quantum Mentor World | Quantum Mentor Official

---

## Overview

Public API routes are exposed to allow the user frontend to browse, query, search, and load legal resources from the database. 

### Strict Public Visibility Rule
Every public endpoint uses the following filter to ensure draft, archived, rejected, private, or unchecked content is never exposed:
```sql
resources.status = 'published'
AND resources.visibility = 'public'
AND resources.legal_status = 'approved'
AND resources.safety_status IN ('safe', 'warning')
AND resources.deleted_at IS NULL
```

---

## Endpoint Index

### 1. Resources API

* **GET `/api/resources`** — Paginated resource list.
  * *Parameters:*
    * `page` (number): Page index (default: `1`).
    * `limit` (number): Records per page (default: `12`, max: `50`).
    * `q` (string): Search keyword (matches title, descriptions, platform, developer, author, language, license).
    * `type` (string): Resource type.
    * `category` (string): Category slug.
    * `tag` (string): Tag slug.
    * `access_type` (string): Access type.
    * `source_type` (string): Source origin type.
    * `featured` (boolean): Filter `is_featured = 1` if `true`.
    * `trending` (boolean): Filter `is_trending = 1` if `true`.
    * `sort` (string): Sorting logic (`latest`, `oldest`, `title_asc`, `title_desc`, `popular`).

* **GET `/api/resources/:slug`** — Retrieve a single resource by its slug. Returns nested categories, tags, safe links, related items, and episodes/servers (for watch resources). Safely increments `view_count` by 1.

* **GET `/api/resources/featured`** — Retrieve featured resources list. Supports `limit` parameter (max `20`).
* **GET `/api/resources/trending`** — Retrieve trending resources list (ordered by popularity).
* **GET `/api/resources/latest`** — Retrieve latest published resources list.
* **GET `/api/resources/type/:type`** — Retrieve resources of a specific type (e.g. `software`, `book`, etc.).

---

### 2. Section Resource Feeds

Specific listing feeds are exposed to list resources by category groups:
* **GET `/api/software`** — Fetch software resources.
* **GET `/api/books`** — Fetch book resources.
* **GET `/api/tools`** — Fetch tool resources.
* **GET `/api/games`** — Fetch game resources.
* **GET `/api/themes`** — Fetch theme/plugin resources.
* **GET `/api/watch`** — Fetch watch resources.
* **GET `/api/news`** — Fetch news resources.
* **GET `/api/github`** — Fetch GitHub repository resources.

All feed list endpoints support standard pagination, search keywords (`q`), and sorting selectors. Lookups by slug (e.g. `/api/software/:slug`) return 404 if the target resource does not belong to that section type.

---

### 3. Categories & Tags API

* **GET `/api/categories`** — Retrieve active categories index with active resources counts.
* **GET `/api/categories/:slug/resources`** — Retrieve paginated resources belonging to category.
* **GET `/api/tags`** — Retrieve active tags index with active resources counts.
* **GET `/api/tags/:slug/resources`** — Retrieve paginated resources mapped to tag.

---

## Response Formatting Examples

### Success List Layout (`GET /api/resources?limit=1`)
```json
{
  "success": true,
  "message": "Resources fetched successfully.",
  "data": [
    {
      "id": 1,
      "title": "Open Source Code Editor Demo",
      "slug": "open-source-code-editor-demo",
      "resource_type": "software",
      "short_description": "A safe demo code editor...",
      "featured_image": null,
      "access_type": "open_source",
      "view_count": 121,
      "platform": "Windows / macOS / Linux",
      "developer": "CodeCreator Team",
      "license_type": "MIT License",
      "release_year": 2026
    }
  ],
  "meta": {
    "page": 1,
    "limit": 1,
    "total": 16,
    "totalPages": 16
  }
}
```

### Detail Layout (`GET /api/resources/open-source-code-editor-demo`)
```json
{
  "success": true,
  "message": "Resource fetched successfully.",
  "data": {
    "id": 1,
    "title": "Open Source Code Editor Demo",
    "slug": "open-source-code-editor-demo",
    "resource_type": "software",
    "details": {
      "version": "1.2.0",
      "platform": "Windows / macOS / Linux",
      "developer": "CodeCreator Team",
      "license_type": "MIT License"
    },
    "categories": [
      { "id": 1, "name": "Software", "slug": "software" }
    ],
    "tags": [
      { "id": 1, "name": "Free", "slug": "free" }
    ],
    "links": [
      { "id": 1, "label": "Official Resource Page", "url": "https://example.com" }
    ],
    "related": []
  }
}
```

---

## Data Exposure Redactions

To preserve administrator privacy and database security, the following database columns are **never** returned by any public API endpoint:
* `created_by` & `updated_by` user foreign keys.
* `deleted_at` soft-delete timestamps.
* `password_hash` strings of administrative users.
* Unapproved or unsafe external resource links.
