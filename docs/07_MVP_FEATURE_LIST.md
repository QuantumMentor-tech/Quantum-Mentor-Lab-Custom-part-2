# 07 — MVP Feature List
## Quantum Mentor World | Quantum Mentor Official

---

## What is the MVP?

The **Minimum Viable Product (MVP)** is the first fully functional version of Quantum Mentor World. It contains all core features needed to launch the platform as a working, professional educational resource directory.

The MVP is scoped to be **complete and production-ready**, not a rough prototype. After the MVP is built, additional features can be added in Phase 2 without rebuilding the foundation.

---

## MVP Core Principle

> "The MVP must be functional, professional, and legally compliant. Every feature in this list is required before launch."

---

## Section 1: MVP Frontend Pages

All pages listed below must be fully built and functional for the MVP.

### Public Pages

| Page | File | MVP Status |
|---|---|---|
| Homepage | `index.html` | ✅ Required |
| Software Directory | `software.html` | ✅ Required |
| Books Directory | `books.html` | ✅ Required |
| Tools Directory | `tools.html` | ✅ Required |
| Games Directory | `games.html` | ✅ Required |
| Themes & Plugins | `themes-plugins.html` | ✅ Required |
| Watch Content | `watch.html` | ✅ Required |
| News | `news.html` | ✅ Required |
| GitHub Repositories | `github-repos.html` | ✅ Required |
| Search Results | `search.html` | ✅ Required |
| Categories Browse | `categories.html` | ✅ Required |
| About Us | `about.html` | ✅ Required |
| Contact Us | `contact.html` | ✅ Required |
| Disclaimer | `disclaimer.html` | ✅ Required |
| Privacy Policy | `privacy.html` | ✅ Required |
| Resource Detail Page (dynamic) | `resource.html` | ✅ Required |

### Admin Pages

| Page | File | MVP Status |
|---|---|---|
| Admin Login | `admin/login.html` | ✅ Required |
| Admin Dashboard | `admin/dashboard.html` | ✅ Required |
| Manage Resources | `admin/resources.html` | ✅ Required |
| Add New Resource | `admin/add-resource.html` | ✅ Required |
| Edit Resource | `admin/edit-resource.html` | ✅ Required |
| Manage Categories | `admin/categories.html` | ✅ Required |
| Manage Tags | `admin/tags.html` | ✅ Required |
| Manage Media | `admin/media.html` | ✅ Required |
| Site Settings | `admin/settings.html` | ✅ Required |

---

## Section 2: MVP Frontend Features

| Feature | Priority | Notes |
|---|---|---|
| Responsive header with logo and navigation | ✅ Critical | Must include official logo |
| Mobile hamburger menu | ✅ Critical | Slide-in drawer |
| Professional footer with links | ✅ Critical | 4-column layout |
| Global search bar (homepage) | ✅ Critical | Search across all resource types |
| Resource cards grid | ✅ Critical | With image, badge, title, description |
| Resource type filtering | ✅ Critical | Filter by type on listing pages |
| Resource detail page | ✅ Critical | Full details, links, legal status |
| Legal/safety status badges | ✅ Critical | On every resource card and detail page |
| External link warning indicator | ✅ Critical | Icon + "opens in new tab" notice |
| Contact form | ✅ Critical | Name, email, subject, message |
| Pagination | ✅ Critical | On all listing pages |
| Category browsing | ✅ Critical | Category page with filters |
| Breadcrumb navigation | ✅ High | On all inner pages |
| Dark theme design system | ✅ Critical | As defined in docs/05 |
| Smooth CSS animations | ✅ High | Card hover, button effects |
| SEO meta tags | ✅ High | Title, description, OG tags |
| Loading states | ✅ High | Skeleton screens or spinners |
| Error states | ✅ High | 404 page, API error message |
| Watch content embeds | ✅ Critical | YouTube, Vimeo, Archive.org |
| Image lazy loading | ✅ High | Performance optimization |

---

## Section 3: MVP Backend Features

| Feature | Priority | Notes |
|---|---|---|
| Express.js server setup | ✅ Critical | Entry point |
| MySQL database connection pool | ✅ Critical | Via mysql2 |
| Environment variable config | ✅ Critical | .env file |
| Admin login endpoint | ✅ Critical | POST /api/auth/login |
| Admin logout endpoint | ✅ Critical | POST /api/auth/logout |
| JWT token authentication | ✅ Critical | HTTP-only cookie |
| Protected admin routes middleware | ✅ Critical | All /api/admin/* routes |
| Get all resources endpoint | ✅ Critical | GET /api/resources |
| Get single resource endpoint | ✅ Critical | GET /api/resources/:slug |
| Get resources by type | ✅ Critical | GET /api/resources?type=software |
| Search resources endpoint | ✅ Critical | GET /api/search?q=query |
| Create resource endpoint | ✅ Critical | POST /api/resources (admin only) |
| Update resource endpoint | ✅ Critical | PUT /api/resources/:id (admin only) |
| Delete resource endpoint | ✅ Critical | DELETE /api/resources/:id (admin only) |
| Get all categories endpoint | ✅ Critical | GET /api/categories |
| Create category endpoint | ✅ Critical | POST /api/categories (admin only) |
| Update category endpoint | ✅ Critical | PUT /api/categories/:id (admin only) |
| Delete category endpoint | ✅ Critical | DELETE /api/categories/:id (admin only) |
| Get all tags endpoint | ✅ Critical | GET /api/tags |
| Create/Update/Delete tag endpoints | ✅ Critical | Admin only |
| File upload endpoint | ✅ Critical | POST /api/media/upload (admin only) |
| Get media files endpoint | ✅ Critical | GET /api/media |
| Delete media endpoint | ✅ Critical | DELETE /api/media/:id (admin only) |
| Contact form submission endpoint | ✅ Critical | POST /api/contact |
| Get contact messages endpoint | ✅ Critical | GET /api/contact (admin only) |
| Site settings endpoint | ✅ High | GET/PUT /api/settings (admin only) |
| Rate limiting middleware | ✅ Critical | Login: 5/15min, API: 100/15min |
| Input validation middleware | ✅ Critical | All form inputs |
| Security headers middleware | ✅ Critical | helmet |
| CORS middleware | ✅ Critical | Strict origin control |
| Request logging | ✅ High | morgan |
| Admin activity logging | ✅ High | Log all admin CRUD operations |

---

## Section 4: MVP Database Tables

| Table | MVP Status | Description |
|---|---|---|
| `users` | ✅ Required | Admin user accounts |
| `resources` | ✅ Required | All resource types base table |
| `resource_details` | ✅ Required | Type-specific fields (JSON or separate columns) |
| `categories` | ✅ Required | Content categories |
| `tags` | ✅ Required | Content tags |
| `resource_categories` | ✅ Required | Many-to-many junction table |
| `resource_tags` | ✅ Required | Many-to-many junction table |
| `resource_links` | ✅ Required | External links for each resource |
| `media` | ✅ Required | Uploaded images and files |
| `watch_episodes` | ✅ Required | Watch content episodes |
| `watch_servers` | ✅ Required | Video embed servers per episode |
| `contact_messages` | ✅ Required | Contact form submissions |
| `site_settings` | ✅ Required | Key-value site configuration |
| `admin_activity_logs` | ✅ Required | Admin action audit trail |

---

## Section 5: MVP Resource Types

| Resource Type | MVP Status |
|---|---|
| Software | ✅ Required |
| Books | ✅ Required |
| Tools | ✅ Required |
| Games | ✅ Required |
| Themes & Plugins | ✅ Required |
| Watch Content | ✅ Required |
| News | ✅ Required |
| GitHub Repositories | ✅ Required |

---

## Section 6: MVP Admin Dashboard Features

| Feature | Priority |
|---|---|
| Dashboard overview stats (resource count by type) | ✅ Critical |
| Recent resources added | ✅ Critical |
| Recent contact messages | ✅ Critical |
| Pending legal review count | ✅ Critical |
| Add new resource with dynamic form | ✅ Critical |
| Resource type selector (changes form fields) | ✅ Critical |
| Rich text editor for descriptions | ✅ High |
| Image upload from device | ✅ Critical |
| Media picker for resource images | ✅ Critical |
| Set resource status (draft/published) | ✅ Critical |
| Legal status field | ✅ Critical |
| Safety status field | ✅ Critical |
| Edit existing resource | ✅ Critical |
| Delete resource (with confirmation) | ✅ Critical |
| Filter/search resources in admin table | ✅ Critical |
| Create/edit/delete categories | ✅ Critical |
| Create/edit/delete tags | ✅ Critical |
| View contact messages | ✅ Critical |
| Mark messages as read | ✅ High |
| Site settings page (site name, tagline, contact email) | ✅ High |
| Secure logout | ✅ Critical |

---

## Section 7: MVP Legal & Safety Features

| Feature | Priority |
|---|---|
| Legal status field on every resource | ✅ Critical |
| Safety status field on every resource | ✅ Critical |
| Legal status badge on resource cards | ✅ Critical |
| Legal status badge on resource detail pages | ✅ Critical |
| Disclaimer page | ✅ Critical |
| Privacy policy page | ✅ Critical |
| External link opens in new tab | ✅ Critical |
| External link icon indicator | ✅ High |
| Legal review section in admin dashboard | ✅ Critical |
| No pirated/illegal content policy enforcement via admin | ✅ Critical |
| Admin activity log | ✅ High |

---

## Section 8: MVP SEO Features

| Feature | Priority |
|---|---|
| Unique `<title>` tag per page | ✅ Critical |
| Meta description per page | ✅ Critical |
| Open Graph tags (og:title, og:description, og:image) | ✅ High |
| Semantic HTML5 structure (header, main, nav, footer) | ✅ Critical |
| Single `<h1>` per page | ✅ Critical |
| Breadcrumb navigation | ✅ High |
| Clean URL slugs for resources | ✅ Critical |
| Alt text on all images | ✅ Critical |
| Robots.txt file | ✅ High |
| Sitemap (manual XML) | ✅ Medium |
| Fast page load (optimized assets) | ✅ High |
| Mobile responsive design | ✅ Critical |

---

## Section 9: What Is NOT in the MVP

These features are planned for **Phase 2** after the MVP launches:

| Feature | Phase |
|---|---|
| User registration and accounts | Phase 2 |
| User-submitted resource requests | Phase 2 |
| Resource ratings or reviews | Phase 2 |
| User favorites / bookmarks | Phase 2 |
| Email notifications to admin | Phase 2 |
| Automated legal review checker | Phase 2 |
| Multi-language support | Phase 2 |
| Advanced analytics dashboard | Phase 2 |
| RSS feed | Phase 2 |
| Social media sharing integration | Phase 2 |
| Newsletter subscription | Phase 2 |
| GitHub API auto-sync | Phase 2 |
| Multiple admin roles | Phase 2 |
| Advanced search with filters | Phase 2 |
| Dark/Light mode toggle | Phase 2 |

---

## MVP Build Order (Recommended)

Follow this order when building the project to minimize rework:

| Step | Task |
|---|---|
| Step 2 | Set up project folder structure |
| Step 3 | Set up XAMPP and create MySQL database and tables |
| Step 4 | Set up Node.js and Express.js backend |
| Step 5 | Build all backend API routes and controllers |
| Step 6 | Build CSS design system (variables, components) |
| Step 7 | Build shared HTML components (header, footer) |
| Step 8 | Build all public frontend pages |
| Step 9 | Build admin dashboard pages |
| Step 10 | Connect frontend to backend API |
| Step 11 | Test all features end-to-end |
| Step 12 | Populate initial content via admin dashboard |
| Step 13 | Final review and launch preparation |

---

## MVP Success Criteria

Before declaring the MVP complete, the following must all be true:

- [ ] All 15 public pages are live and functional
- [ ] All 9 admin pages are live and functional
- [ ] All 8 resource types can be added and displayed
- [ ] Admin can log in and log out securely
- [ ] Search returns correct results
- [ ] Category filtering works on all listing pages
- [ ] Contact form submits and saves to database
- [ ] All external links open safely in new tabs
- [ ] Legal/safety badges appear on every resource
- [ ] Disclaimer and Privacy Policy pages are complete
- [ ] Website passes mobile responsiveness test
- [ ] No cracked, pirated, or illegal content is accessible
- [ ] All database tables are created and functional
- [ ] File uploads work for resource images
- [ ] Admin can manage all content without editing code

---

*Document created: Step 1 — Quantum Mentor World Planning Phase*
*Version: 1.0*
