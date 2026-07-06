# 06 — Tech Stack Decision
## Quantum Mentor World | Quantum Mentor Official

---

## Overview

This document defines the final confirmed technology stack for the Quantum Mentor World platform. Every technology was chosen to meet the platform's requirements for performance, maintainability, security, and ease of local development.

---

## Final Tech Stack

### Frontend

| Technology | Version Target | Purpose |
|---|---|---|
| **HTML5** | Latest | Page structure and semantic markup |
| **CSS3** | Latest | Styling, animations, responsive design |
| **Vanilla JavaScript (ES6+)** | ES2020+ | Dynamic UI, API calls, interactivity |
| **Google Fonts** | CDN | Typography (Outfit, Inter, JetBrains Mono) |
| **Lucide Icons** | CDN | Icon system |

**No frontend frameworks (React, Vue, Angular) in the MVP.** Plain HTML/CSS/JS keeps the stack simple, fast, and maintainable for a custom site without build tooling complexity.

---

### Backend

| Technology | Version Target | Purpose |
|---|---|---|
| **Node.js** | v20 LTS (recommended) | Server runtime |
| **Express.js** | v4.x | HTTP server, routing, middleware |
| **MySQL2** | npm package | MySQL database driver for Node.js |
| **dotenv** | npm package | Environment variable management |
| **bcryptjs** | npm package | Admin password hashing |
| **jsonwebtoken (JWT)** | npm package | Admin authentication tokens |
| **express-session** | npm package | Server-side session management (alternative to JWT) |
| **cors** | npm package | Cross-Origin Resource Sharing control |
| **helmet** | npm package | HTTP security headers |
| **express-rate-limit** | npm package | Rate limiting for API endpoints |
| **express-validator** | npm package | Input validation and sanitization |
| **multer** | npm package | File uploads (featured images, media) |
| **morgan** | npm package | HTTP request logging |
| **nodemon** | npm dev | Auto-restart during development |

---

### Database

| Technology | Version Target | Purpose |
|---|---|---|
| **MySQL / MariaDB** | MySQL 8.x or MariaDB 10.x | Primary database |
| **XAMPP** | Latest stable | Local development server stack |
| **phpMyAdmin** | Included with XAMPP | Database GUI management |

**Database name:** `quantum_mentor_world`

---

### Development Environment

| Tool | Purpose |
|---|---|
| **XAMPP** | Runs Apache + MySQL locally |
| **phpMyAdmin** | Visual database management |
| **VS Code** | Primary code editor (recommended) |
| **Postman / Thunder Client** | API testing |
| **Git** | Version control |
| **Node.js v20 LTS** | Backend runtime |
| **npm** | Package manager |

---

## Project Folder Structure

```
quantum-mentor-world/
│
├── frontend/
│   ├── index.html
│   ├── software.html
│   ├── books.html
│   ├── tools.html
│   ├── games.html
│   ├── themes-plugins.html
│   ├── watch.html
│   ├── news.html
│   ├── github-repos.html
│   ├── search.html
│   ├── about.html
│   ├── contact.html
│   ├── disclaimer.html
│   ├── privacy.html
│   │
│   ├── admin/
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── resources.html
│   │   ├── add-resource.html
│   │   ├── edit-resource.html
│   │   ├── categories.html
│   │   ├── tags.html
│   │   ├── media.html
│   │   └── settings.html
│   │
│   └── assets/
│       ├── css/
│       │   ├── main.css
│       │   ├── variables.css
│       │   ├── components.css
│       │   ├── admin.css
│       │   └── responsive.css
│       ├── js/
│       │   ├── main.js
│       │   ├── api.js
│       │   ├── search.js
│       │   ├── admin.js
│       │   └── utils.js
│       └── images/
│           ├── logo.png
│           ├── logo-text.png
│           └── uploads/ (resource images)
│
├── backend/
│   ├── server.js
│   ├── app.js
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── resources.routes.js
│   │   ├── categories.routes.js
│   │   ├── tags.routes.js
│   │   ├── media.routes.js
│   │   ├── contact.routes.js
│   │   └── admin.routes.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── resources.controller.js
│   │   ├── categories.controller.js
│   │   ├── tags.controller.js
│   │   ├── media.controller.js
│   │   ├── contact.controller.js
│   │   └── admin.controller.js
│   │
│   ├── models/
│   │   ├── resource.model.js
│   │   ├── category.model.js
│   │   ├── tag.model.js
│   │   ├── user.model.js
│   │   └── contact.model.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── validate.middleware.js
│   │   ├── upload.middleware.js
│   │   └── rateLimit.middleware.js
│   │
│   └── utils/
│       ├── slugify.js
│       ├── response.js
│       └── logger.js
│
├── database/
│   └── quantum_mentor_world.sql
│
├── docs/
│   ├── 01_PROJECT_SCOPE_AND_FEATURES.md
│   ├── 02_USER_AND_ADMIN_JOURNEY.md
│   ├── 03_RESOURCE_TYPES_AND_FIELDS.md
│   ├── 04_LEGAL_AND_SAFETY_RULES.md
│   ├── 05_UI_UX_DIRECTION.md
│   ├── 06_TECH_STACK_DECISION.md
│   └── 07_MVP_FEATURE_LIST.md
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## Backend API Design

### REST API Architecture

The backend will expose a RESTful API that the frontend will consume via `fetch()` in JavaScript.

### API Base URL

```
Development: http://localhost:3000/api
Production:  https://api.quantumentorworld.com/api
```

### API Endpoint Groups

| Group | Prefix | Description |
|---|---|---|
| Auth | `/api/auth` | Admin login, logout, token refresh |
| Resources | `/api/resources` | CRUD for all resource types |
| Categories | `/api/categories` | CRUD for categories |
| Tags | `/api/tags` | CRUD for tags |
| Media | `/api/media` | File upload and management |
| Contact | `/api/contact` | Contact form submission |
| Admin | `/api/admin` | Protected admin-only operations |
| Search | `/api/search` | Global search endpoint |
| Settings | `/api/settings` | Site settings |

---

## Database Connection Strategy

```javascript
// backend/config/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

---

## Security Architecture

| Security Layer | Implementation |
|---|---|
| **Password Hashing** | bcryptjs with salt rounds = 12 |
| **Admin Auth** | JWT tokens stored in HTTP-only cookies |
| **Token Expiry** | 8 hours (configurable) |
| **Rate Limiting** | 100 requests / 15 min on API, 5 attempts / 15 min on login |
| **Input Validation** | express-validator on all form inputs |
| **SQL Injection** | Parameterized queries only (never string concatenation) |
| **XSS Protection** | helmet middleware + input sanitization |
| **CORS** | Strict origin whitelist |
| **HTTP Headers** | helmet sets secure headers (HSTS, X-Frame-Options, etc.) |
| **File Upload Security** | File type validation (images only), size limits, renamed files |
| **Environment Variables** | All secrets in `.env` file, never hardcoded |

---

## Environment Variables (.env)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=quantum_mentor_world

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=8h

# Admin
ADMIN_SESSION_SECRET=your_session_secret_here

# Upload
UPLOAD_PATH=./frontend/assets/images/uploads
MAX_FILE_SIZE=5242880
```

---

## npm package.json Scripts

```json
{
  "scripts": {
    "start": "node backend/server.js",
    "dev": "nodemon backend/server.js",
    "test": "echo \"No tests yet\""
  }
}
```

---

## Tech Stack Confirmation Checklist

| Technology | Confirmed |
|---|---|
| HTML5 | ✅ |
| CSS3 (Vanilla, no Tailwind) | ✅ |
| JavaScript (Vanilla ES6+, no React/Vue) | ✅ |
| Node.js v20 LTS | ✅ |
| Express.js v4.x | ✅ |
| MySQL / MariaDB | ✅ |
| XAMPP (local development) | ✅ |
| phpMyAdmin | ✅ |
| JWT Authentication | ✅ |
| bcryptjs | ✅ |
| helmet (security) | ✅ |
| express-rate-limit | ✅ |
| express-validator | ✅ |
| multer (file uploads) | ✅ |
| dotenv | ✅ |
| REST API architecture | ✅ |

---

*Document created: Step 1 — Quantum Mentor World Planning Phase*
*Version: 1.0*
