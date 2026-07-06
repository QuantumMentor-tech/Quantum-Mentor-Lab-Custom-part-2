# Quantum Mentor World

> **Brand:** Quantum Mentor Official
> **Category:** Education / EdTech Resource Directory Platform

---

## Project Purpose

**Quantum Mentor World** is a custom-built, professional educational resource directory website where users can safely discover legal resources including:

- ✅ Legal software (open-source, freeware, creator-approved)
- ✅ Books (open-access, public domain, legally available)
- ✅ Developer and productivity tools
- ✅ Legal games (free-to-play, open-source, educational)
- ✅ GPL-licensed themes and plugins
- ✅ Legal watch content (YouTube, Vimeo, Archive.org embeds)
- ✅ Educational news summaries with attribution
- ✅ Open-source GitHub repositories

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js v26, Express.js |
| Database | MySQL / MariaDB |
| Local Dev DB | XAMPP + phpMyAdmin |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| File Uploads | multer |
| Security | helmet, cors, express-rate-limit, express-validator |

---

## ⚡ Quick Start

```bash
# 1. Start XAMPP — ensure MySQL is running
# 2. Open phpMyAdmin and verify database: quantum_mentor_world

# 3. Install backend dependencies
cd backend
npm install

# 4. Create .env from example (already done)
# backend/.env is ready — verify DB_PASSWORD if you set one

# 5. Start development server
npm run dev
```

**Test the API is live:**
```
http://localhost:5000/api/health
```

Expected:
```json
{ "success": true, "message": "Quantum Mentor World API is running." }
```

---

## Folder Structure

```
quantum-mentor-world/
├── frontend/          → HTML pages + CSS + JavaScript
│   ├── admin/         → Admin dashboard pages
│   └── assets/        → CSS, JS, images, icons
├── backend/           → Node.js + Express.js API
│   ├── config/        → DB connection
│   ├── routes/        → 15 route files
│   ├── controllers/   → Request handlers
│   ├── models/        → DB query models
│   ├── middleware/    → Auth, validation, uploads
│   └── utils/         → Helpers
├── database/          → SQL schema and seed files
└── docs/              → Planning & setup documentation
```

---

## Logo Rule

> ⚠️ **The existing official logos are used. No new logo will be created.**
>
> Logo files in project root:
> - `Quantum Mentor logo design.png` → graphic logo
> - `QuantumMentor Text Logo.png` → text logo
>
> Target path: `frontend/assets/images/`

---

## Legal & Safety Rules

This platform **strictly prohibits:**
- Cracked software or keygens
- Pirated movies, anime, donghua, or TV shows
- Nulled themes or plugins
- Leaked paid courses or pirated books
- Malware, phishing, or scam links
- Illegal license keys or activation bypasses

This platform **only** supports legal, licensed, and verified resources.

---

## Local URLs

| Service | URL |
|---|---|
| Backend API | `http://localhost:5000/api` |
| API Health Check | `http://localhost:5000/api/health` |
| phpMyAdmin | `http://localhost/phpmyadmin` |
| Frontend (Live Server) | `http://127.0.0.1:5500/frontend/index.html` |

---

## 💾 Database Import

Import the database structure and demo data in the following order using phpMyAdmin:
1. Open XAMPP and start Apache and MySQL.
2. Go to `http://localhost/phpmyadmin` in your browser.
3. Select the database `quantum_mentor_world`.
4. Click the **Import** tab.
5. First, select and import `database/quantum_mentor_world.sql`.
6. Next, select and import `database/seed_data.sql`.

---

## 🔑 Local Demo Admin Account

For testing the admin dashboard locally:
* **Email:** `admin@quantummentor.local`
* **Password:** `Admin@12345`

> [!WARNING]
> This account is for local development and testing only.
> Do not use this password in production. Change the password immediately before any real deployment.

## Current Status

```
Step 17 completed: Security hardening, performance optimization, accessibility review, QA scripts, production environment checklist, upload security review, public data exposure review, CORS/rate-limit review, and final regression testing preparation were added. ✅
```

## Next Step

```
Step 18: Final Deployment, Production Setup, Backup Package, and Launch Checklist.
```

---

## 🔍 Validation & Check Commands

Run the local checks in your terminal to verify database, environment, and security profiles:

```bash
# 1. Run local environment variable audits
node scripts/check-env.js

# 2. Run MySQL database integrity audits
node scripts/check-db.js

# 3. Run static security pattern audits
node scripts/security-self-check.js

# 4. Run public API smoke tests
node scripts/api-smoke-test.js
```

---

## 🔐 Admin Dashboard & Pages Test Instructions
1. Start XAMPP MySQL.
2. Start backend:
   ```bash
   cd backend
   npm run dev
   ```
3. Open frontend with Live Server.
4. Login page:
   `frontend/admin/login.html`
5. Login with local demo credentials:
   * **Email:** `admin@quantummentor.local`
   * **Password:** `Admin@12345`
6. Visit and verify admin routes:
   * Dashboard: `frontend/admin/dashboard.html`
   * Resources List: `frontend/admin/resources.html`
   * Add Resource Form: `frontend/admin/add-resource.html`
   * Edit Resource Form: `frontend/admin/edit-resource.html`
   * Categories Manager: `frontend/admin/categories.html`
   * Tags Indexer: `frontend/admin/tags.html`
   * Media Library Tool: `frontend/admin/media.html`
   * Contact Messages Inbox: `frontend/admin/contact-messages.html`
   * Resource Reports: `frontend/admin/reports.html`
   * Site Settings Panel: `frontend/admin/settings.html`

---

## 🔗 Test Endpoints

You can verify the backend endpoints locally:

* Welcome Message: [http://localhost:5000/api](http://localhost:5000/api)
* Health Status: [http://localhost:5000/api/health](http://localhost:5000/api/health)
* Database Check: [http://localhost:5000/api/health/database](http://localhost:5000/api/health/database)
* All Public Resources: [http://localhost:5000/api/resources](http://localhost:5000/api/resources)
* Software Feed: [http://localhost:5000/api/software](http://localhost:5000/api/software)
* Categories Index: [http://localhost:5000/api/categories](http://localhost:5000/api/categories)
* Tags Index: [http://localhost:5000/api/tags](http://localhost:5000/api/tags)
* Admin Auth Login: `POST http://localhost:5000/api/auth/login`
* Admin Protected Overview: `GET http://localhost:5000/api/admin/overview`
* Admin Media Library: `GET http://localhost:5000/api/media`
* Admin Media Upload: `POST http://localhost:5000/api/media/upload`
* Public Contact Form Submission: `POST http://localhost:5000/api/contact`
* Admin Contact Inbox: `GET http://localhost:5000/api/contact/admin/messages`
* Public Link Issue Report: `POST http://localhost:5000/api/reports`
* Admin Reports list: `GET http://localhost:5000/api/reports/admin`

---

## Documentation Index

| Doc | Description |
|---|---|
| [01 — Project Scope](docs/01_PROJECT_SCOPE_AND_FEATURES.md) | Full feature plan |
| [02 — User Journey](docs/02_USER_AND_ADMIN_JOURNEY.md) | User & admin flows |
| [03 — Resource Types](docs/03_RESOURCE_TYPES_AND_FIELDS.md) | All resource fields |
| [04 — Legal Rules](docs/04_LEGAL_AND_SAFETY_RULES.md) | Safety policy |
| [05 — UI/UX](docs/05_UI_UX_DIRECTION.md) | Design system |
| [06 — Tech Stack](docs/06_TECH_STACK_DECISION.md) | Technology choices |
| [07 — MVP Features](docs/07_MVP_FEATURE_LIST.md) | MVP checklist |
| [08 — Project Structure](docs/08_PROJECT_STRUCTURE.md) | File/folder guide |
| [09 — Next Steps](docs/09_NEXT_STEPS.md) | Step-by-step roadmap |
| [10 — Local Setup](docs/10_LOCAL_ENVIRONMENT_SETUP.md) | Setup + troubleshooting |
| [11 — Database Design](docs/11_DATABASE_DESIGN.md) | All 15 tables, fields, types |
| [12 — DB Relationships](docs/12_DATABASE_RELATIONSHIPS.md) | ER map and cascade rules |
| [13 — DB Security](docs/13_DATABASE_SECURITY_RULES.md) | Security and safety rules |
| [14 — DB Index & Search](docs/14_DATABASE_INDEX_AND_SEARCH_PLAN.md) | Indexes and search strategy |
| [15 — SQL DB Creation](docs/15_SQL_DATABASE_CREATION.md) | Step 5 SQL schema and design |
| [16 — DB Import Guide](docs/16_DATABASE_IMPORT_GUIDE.md) | phpMyAdmin import walkthrough |
| [17 — Seed Data Guide](docs/17_SEED_DATA_GUIDE.md) | Step 6 database seeding |
| [18 — API Foundation](docs/18_BACKEND_API_FOUNDATION.md) | Step 7 Express server configuration |
| [19 — API Standards](docs/19_API_RESPONSE_STANDARDS.md) | Response envelopes and error payloads |
| [20 — Public Resource APIs](docs/20_PUBLIC_RESOURCE_APIS.md) | Step 8 backend public endpoints |
| [21 — Model Layer Guide](docs/21_MODEL_LAYER_GUIDE.md) | Query abstraction, security & pagination |
| [22 — Frontend Integration](docs/22_FRONTEND_API_INTEGRATION.md) | Step 9 frontend API integration guide |
| [23 — Public Listing Pages](docs/23_PUBLIC_LISTING_PAGES_GUIDE.md) | Step 9 standard DOM structure & grids |
| [24 — Resource Detail Guide](docs/24_RESOURCE_DETAIL_PAGE_GUIDE.md) | Step 10 detailed resource pages layout |
| [25 — Safe Redirection notice](docs/25_SAFE_EXTERNAL_LINK_DISPLAY.md) | Step 10 safe links validation modal |
| [26 — Search, Filters, Categories, and Tags](docs/26_SEARCH_FILTERS_CATEGORIES_TAGS_GUIDE.md) | Dynamic filtering & sync guidelines |
| [27 — Pagination and Sorting](docs/27_PAGINATION_AND_SORTING_GUIDE.md) | Dynamic ordering and paginating logic |
| [28 — Admin Authentication](docs/28_ADMIN_AUTHENTICATION_GUIDE.md) | Step 12 administrator login & token session flows |
| [29 — Authentication Security Rules](docs/29_AUTH_SECURITY_RULES.md) | Salt hashing, rate limiting & role restrictions rules |
| [30 — Admin Layout Guide](docs/30_ADMIN_DASHBOARD_LAYOUT_GUIDE.md) | Step 13 admin layouts structures, guards & navigation |
| [31 — Resource Management UI Guide](docs/31_ADMIN_RESOURCE_MANAGEMENT_UI_GUIDE.md) | Step 13 admin tables filters, specs forms & reviews |
| [32 — Admin CRUD API Guide](docs/32_ADMIN_CRUD_API_GUIDE.md) | Step 14 protected admin backend API routes and payloads |
| [33 — Resource CRUD Guide](docs/33_ADMIN_RESOURCE_CRUD_GUIDE.md) | Step 14 resource creations, repeatable links & compliance |
| [34 — Categories, Tags, and Settings Guide](docs/34_ADMIN_CATEGORY_TAG_SETTINGS_GUIDE.md) | Step 14 taxonomy and settings CRUD procedures |
| [35 — Admin Security & Validation Guide](docs/35_ADMIN_SECURITY_AND_VALIDATION_GUIDE.md) | Step 14 RBAC token clearance, URL scanners & activity auditing |
| [36 — Media Upload Guide](docs/36_MEDIA_UPLOAD_GUIDE.md) | Step 15 upload endpoints, file safety, and media picker UI |
| [37 — Contact Messages Guide](docs/37_CONTACT_MESSAGES_GUIDE.md) | Step 15 contact forms endpoints, validation and rate limit checks |
| [38 — Resource Reports Guide](docs/38_RESOURCE_REPORTS_GUIDE.md) | Step 15 public link issues report modal and admin review flows |
| [39 — Admin Polish Guide](docs/39_ADMIN_POLISH_GUIDE.md) | Step 15 unified dashboard counters, sidebars navigation, and tables status badges |
| [40 — Upload Security Rules](docs/40_UPLOAD_SECURITY_RULES.md) | Step 15 media whitelist filters, scripts bans, and server sandboxing rules |
| [45 — Security Hardening](docs/45_SECURITY_HARDENING_GUIDE.md) | Step 17 platform security, limits and header filters |
| [46 — Performance Optimization](docs/46_PERFORMANCE_OPTIMIZATION_GUIDE.md) | Step 17 caching, indexes and image deferrals |
| [47 — Final QA Testing](docs/47_FINAL_QA_TESTING_GUIDE.md) | Step 17 smoke tests, test paths and logs checking |
| [48 — Accessibility & Browser Testing](docs/48_ACCESSIBILITY_AND_BROWSER_TESTING_GUIDE.md) | Step 17 WCAG compliance and key trap hooks |
| [49 — Production Checklist](docs/49_PRODUCTION_ENVIRONMENT_CHECKLIST.md) | Step 17 setup guidelines and operational checks |

---

*Quantum Mentor World — Built for learners. Built for safety. Built to last.*
