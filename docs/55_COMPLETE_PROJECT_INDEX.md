# Complete Project Index Directory — Quantum Mentor World

This project index maps out all directories, frontend pages, backend REST API routes, databases, and operational documents.

---

## 1. Project Directory Structure

```text
quantum-mentor-world/
├── frontend/             # Static files (HTML, CSS variables, JS client scripts)
│   ├── admin/            # Administrative pages (Dashboard, Settings, Media)
│   └── assets/           # CSS design, client scripts, placeholder logos
├── backend/              # Node.js + Express backend API
│   ├── config/           # Environment load and Database pool
│   ├── controllers/      # Request handlers (auth, resources, media, reports)
│   ├── middleware/       # Auth validators, CORS limits, image uploads
│   ├── models/           # MySQL relational queries
│   ├── routes/           # REST endpoints definition
│   ├── scripts/          # Database backup, preflight checks, and summary exporters
│   └── utils/            # Logging, validation, URL scanners, and sanitizers
├── database/             # Database schemas, optimization indexes, and seeds
├── deployment/           # Production setup, PM2 process, and rollback plans
├── backups/              # generated backupSQL files and guides
├── launch/               # pre/post-launch QA reports and roadmaps
└── docs/                 # Platform planning, SEO, and handover documents
```

---

## 2. Public Frontend Pages
* Homepage: `index.html`
* 8 Category listings: `software.html`, `books.html`, `tools.html`, `games.html`, `themes-plugins.html`, `watch.html`, `news.html`, `github-repos.html`
* Search results page: `search.html`
* Taxonomy: `categories.html`, `category.html`, `tags.html`, `tag.html`
* Detail viewer: `resource-detail.html`
* Static Legal pages: `about.html`, `contact.html`, `disclaimer.html`, `privacy.html`

---

## 3. Administrative Dashboard Pages
* Login: `admin/login.html`
* Dashboard home: `admin/dashboard.html`
* Resource index list: `admin/resources.html`
* Add Resource Form: `admin/add-resource.html`
* Edit Resource Form: `admin/edit-resource.html`
* Taxonomies: `admin/categories.html`, `admin/tags.html`
* Library: `admin/media.html`
* Feedback & Reports: `admin/contact-messages.html`, `admin/reports.html`
* Site configuration: `admin/settings.html`

---

## 4. Backend REST API Endpoints Map

### Public API Endpoints
* `GET  /api/health` — Base server verification
* `GET  /api/health/database` — MySQL pool verification
* `GET  /api/resources` — Dynamic resource catalog feed
* `GET  /api/resources/:slug` — Single resource specification details
* `GET  /api/categories` — Categories directory catalog
* `GET  /api/tags` — Tags catalog
* `POST /api/contact` — User contact message submission
* `POST /api/reports` — Link issue reporting

### Protected Admin API Endpoints (Requires valid JWT Bearer header)
* `POST   /api/auth/login` — Authentication login
* `GET    /api/auth/me` — Operator identity check
* `GET    /api/admin/overview` — Dashboard statistics counter widgets
* `GET    /api/admin/resources` — Admin resource index
* `POST   /api/admin/resources` — Create resource record
* `PATCH  /api/admin/resources/:id` — Update resource record
* `DELETE /api/admin/resources/:id` — Soft-delete resource record
* `GET    /api/media` — media library catalog
* `POST   /api/media/upload` — media upload image file
* `GET    /api/contact/admin/messages` — Inbox message review
* `GET    /api/reports/admin` — Inbox reports review
* `PATCH  /api/admin/settings` — Save site settings

---

## 5. Main Audit Commands

### Codebase Audits
```bash
# Verify environment config strength
npm run check:env

# Audit database structures and tables
npm run check:db

# Scan JS source files for injection risks
npm run check:security

# Test public API health status
npm run check:api

# Run preflight checks
npm run prelaunch
```

### Backups Utilities
```bash
# Run database SQL backup
npm run backup:db

# Run uploaded images backup
npm run backup:uploads

# Export project summary
npm run export:summary
```
