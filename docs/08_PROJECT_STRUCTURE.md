# 08 — Project Structure
## Quantum Mentor World | Quantum Mentor Official

---

## Overview

This document describes the complete folder and file structure created in Step 2. It serves as a reference guide for any developer or AI agent working on this project.

---

## Root Structure

```
G:\Projects\Quantum Mentor Web For custom Part 2\
│
├── frontend/           → All frontend HTML, CSS, JavaScript
├── backend/            → Node.js + Express.js API server
├── database/           → SQL schema and seed files
├── docs/               → Planning and reference documentation
├── README.md           → Project overview
└── .gitignore          → Git ignore rules
```

---

## Frontend Structure

```
frontend/
│
├── index.html              → Homepage
├── software.html           → Software directory
├── books.html              → Books directory
├── tools.html              → Tools directory
├── games.html              → Games directory
├── themes-plugins.html     → Themes & Plugins directory
├── watch.html              → Watch content directory
├── news.html               → News directory
├── github-repos.html       → GitHub repositories directory
├── search.html             → Search results page
├── categories.html         → Category browsing page
├── about.html              → About page
├── contact.html            → Contact form page
├── disclaimer.html         → Legal disclaimer
├── privacy.html            → Privacy policy
│
├── admin/
│   ├── login.html          → Admin login page
│   ├── dashboard.html      → Admin dashboard overview
│   ├── resources.html      → Manage all resources
│   ├── add-resource.html   → Add new resource form
│   ├── edit-resource.html  → Edit existing resource
│   ├── categories.html     → Manage categories
│   ├── tags.html           → Manage tags
│   ├── media.html          → Media manager
│   └── settings.html       → Site settings
│
└── assets/
    ├── css/
    │   ├── style.css       → Core design system, variables, reset
    │   ├── responsive.css  → Responsive breakpoints
    │   ├── components.css  → Reusable UI components
    │   └── admin.css       → Admin dashboard styles
    │
    ├── js/
    │   ├── main.js         → Core initialization, utilities
    │   ├── api.js          → API communication layer
    │   ├── resources.js    → Resource card rendering
    │   ├── search.js       → Search functionality
    │   ├── forms.js        → Form handling and validation
    │   └── admin.js        → Admin dashboard JS
    │
    ├── images/
    │   └── PUT_EXISTING_LOGO_HERE.txt → Logo placeholder notice
    │
    └── icons/              → Icon files (if any)
```

---

## Backend Structure

```
backend/
│
├── server.js           → Server entry point (starts HTTP server)
├── app.js              → Express app config (middleware + routes)
├── package.json        → Node.js dependencies and scripts
├── .env.example        → Environment variable template
│
├── config/
│   └── db.js           → MySQL connection pool + query helper
│
├── routes/             → Express router files (15 total)
│   ├── auth.routes.js
│   ├── resources.routes.js
│   ├── software.routes.js
│   ├── books.routes.js
│   ├── tools.routes.js
│   ├── games.routes.js
│   ├── themes.routes.js
│   ├── watch.routes.js
│   ├── news.routes.js
│   ├── github.routes.js
│   ├── categories.routes.js
│   ├── tags.routes.js
│   ├── media.routes.js
│   ├── contact.routes.js
│   └── admin.routes.js
│
├── controllers/        → Request handler logic (7 files)
│   ├── auth.controller.js
│   ├── resources.controller.js
│   ├── categories.controller.js
│   ├── tags.controller.js
│   ├── media.controller.js
│   ├── contact.controller.js
│   └── admin.controller.js
│
├── models/             → Database query models (6 files)
│   ├── resource.model.js
│   ├── user.model.js
│   ├── category.model.js
│   ├── tag.model.js
│   ├── media.model.js
│   └── settings.model.js
│
├── middleware/         → Express middleware (5 files)
│   ├── auth.middleware.js
│   ├── admin.middleware.js
│   ├── error.middleware.js
│   ├── validation.middleware.js
│   └── upload.middleware.js
│
├── utils/              → Helper utilities (5 files)
│   ├── response.js     → Standardized API responses
│   ├── slugify.js      → URL slug generation
│   ├── sanitize.js     → Input sanitization
│   ├── validators.js   → Validation functions
│   └── logger.js       → Console logger with levels
│
└── uploads/
    ├── images/         → Uploaded resource images
    └── documents/      → Uploaded documents
```

---

## Database Structure

```
database/
├── quantum_mentor_world.sql  → Full SQL schema (populated in Step 4)
├── seed_data.sql             → Legal demo data (added in Step 6)
└── README_DATABASE_SETUP.md  → Setup instructions
```

---

## CSS Architecture

| File | Purpose |
|---|---|
| `style.css` | CSS variables (design tokens), global reset, base styles |
| `responsive.css` | Media queries for all breakpoints |
| `components.css` | Buttons, cards, badges, forms, search bar, pagination |
| `admin.css` | Admin sidebar, topbar, tables, forms, login page |

---

## JavaScript Architecture

| File | Responsibilities |
|---|---|
| `main.js` | DOM ready init, page animations, external link handling, global utilities |
| `api.js` | All fetch() calls, JWT token management, request/response handling |
| `resources.js` | Resource card HTML generation, grid rendering, skeleton loading |
| `search.js` | Search bar, query params, search results loading |
| `forms.js` | Contact form validation and submission |
| `admin.js` | Auth guard, login form, sidebar toggle, active nav highlight |

---

## Naming Conventions

| Type | Convention | Example |
|---|---|---|
| HTML files | kebab-case | `themes-plugins.html` |
| CSS files | kebab-case | `style.css`, `admin.css` |
| JS files | camelCase with dots | `main.js`, `admin.js` |
| Route files | `name.routes.js` | `auth.routes.js` |
| Controller files | `name.controller.js` | `auth.controller.js` |
| Model files | `name.model.js` | `resource.model.js` |
| Middleware files | `name.middleware.js` | `auth.middleware.js` |
| CSS variables | `--kebab-case` | `--bg-main`, `--primary` |

---

*Document created: Step 2 — Quantum Mentor World Project Structure*
*Version: 1.0*
