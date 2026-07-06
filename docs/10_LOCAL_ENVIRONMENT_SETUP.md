# 10 — Local Environment Setup Guide
## Quantum Mentor World | Quantum Mentor Official

---

## Overview

This guide explains how to set up and run the Quantum Mentor World project locally on your development machine.

---

## Required Software

| Software | Version | Download |
|---|---|---|
| **Node.js** | v18 LTS or higher | [nodejs.org](https://nodejs.org) |
| **npm** | Included with Node.js | — |
| **XAMPP** | Latest stable | [apachefriends.org](https://www.apachefriends.org) |
| **VS Code** | Latest | [code.visualstudio.com](https://code.visualstudio.com) |
| **Git** | Latest | [git-scm.com](https://git-scm.com) |

---

## Step 1 — Verify Node.js and npm

Open a terminal (PowerShell, CMD, or Git Bash) and run:

```bash
node -v
npm -v
```

Expected output:
```
v20.x.x   (or higher)
10.x.x    (or higher)
```

> If node is not found, install [Node.js LTS](https://nodejs.org) and restart your terminal.

---

## Step 2 — Start XAMPP

1. Open **XAMPP Control Panel**
2. Click **Start** next to **Apache**
3. Click **Start** next to **MySQL**
4. Both indicators should turn green ✅

---

## Step 3 — Verify Database Exists in phpMyAdmin

1. Open your browser
2. Go to: `http://localhost/phpmyadmin`
3. In the left panel, you should see: **quantum_mentor_world**

> If the database does not exist:
> - Click **New** in the left panel
> - Name: `quantum_mentor_world`
> - Collation: `utf8mb4_unicode_ci`
> - Click **Create**

> ⚠️ Do NOT create tables manually — SQL tables will be added in Step 4.

---

## Step 4 — Install Backend Packages

```bash
cd backend
npm install
```

This installs all dependencies listed in `backend/package.json`:
- `express` — HTTP server framework
- `mysql2` — MySQL driver
- `cors` — Cross-Origin Resource Sharing
- `dotenv` — Environment variable loader
- `helmet` — HTTP security headers
- `bcryptjs` — Password hashing
- `jsonwebtoken` — JWT authentication
- `multer` — File upload handling
- `express-validator` — Input validation
- `express-rate-limit` — API rate limiting
- `morgan` — HTTP request logger
- `nodemon` (dev) — Auto-restart on file changes

---

## Step 5 — Create the .env File

```bash
# From inside the backend/ folder:
copy .env.example .env
```

Then open `backend/.env` and verify:

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=quantum_mentor_world
DB_USER=root
DB_PASSWORD=

JWT_SECRET=change_this_secret_in_real_project
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000
UPLOAD_DIR=uploads/images
MAX_FILE_SIZE_MB=5
```

> Leave `DB_PASSWORD=` empty if you haven't set a MySQL root password (XAMPP default).

---

## Step 6 — Start the Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
╔══════════════════════════════════════════════════╗
║        QUANTUM MENTOR WORLD — BACKEND API        ║
╠══════════════════════════════════════════════════╣
║  Status      : ✅ Running                        ║
║  Port        : 5000                              ║
║  Mode        : development                       ║
║  Health URL  : http://localhost:5000/api/health  ║
╚══════════════════════════════════════════════════╝

[Database] ✅ MySQL connected successfully.
```

---

## Step 7 — Test API Health Route

Open your browser and visit:

```
http://localhost:5000/api/health
```

Expected JSON response:
```json
{
  "success": true,
  "message": "Quantum Mentor World API is running.",
  "environment": "development"
}
```

---

## Step 8 — Test Placeholder Routes

All of these should return `success: true`:

| Route | URL |
|---|---|
| Health | `http://localhost:5000/api/health` |
| Resources | `http://localhost:5000/api/resources` |
| Software | `http://localhost:5000/api/software` |
| Books | `http://localhost:5000/api/books` |
| Tools | `http://localhost:5000/api/tools` |
| Games | `http://localhost:5000/api/games` |
| Themes | `http://localhost:5000/api/themes` |
| Watch | `http://localhost:5000/api/watch` |
| News | `http://localhost:5000/api/news` |
| GitHub | `http://localhost:5000/api/github` |
| Categories | `http://localhost:5000/api/categories` |
| Tags | `http://localhost:5000/api/tags` |
| Contact | `http://localhost:5000/api/contact` |
| Admin | `http://localhost:5000/api/admin` |

---

## Step 9 — Open Frontend Locally

**Option A: Open directly in browser**
- Open `frontend/index.html` in Chrome or Firefox
- Note: API calls may fail due to CORS with `file://` protocol (fixed in Step 5)

**Option B: VS Code Live Server (Recommended)**
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Right-click `frontend/index.html`
3. Click **Open with Live Server**
4. Opens at: `http://127.0.0.1:5500/frontend/index.html`

---

## Common Errors & Fixes

### ❌ Error 1: `npm command not found`
**Fix:** Install [Node.js LTS](https://nodejs.org) and restart your terminal.

---

### ❌ Error 2: `EADDRINUSE — Port 5000 is already in use`
**Fix:** Change `PORT=5001` in `backend/.env` or stop the other process using port 5000.

---

### ❌ Error 3: `MySQL not starting in XAMPP`
**Fix:** Another MySQL service may already be using port 3306.
- Check Windows Task Manager for `mysqld.exe`
- Or change XAMPP MySQL port in `my.ini`

---

### ❌ Error 4: `ER_ACCESS_DENIED_ERROR — Access denied for root`
**Fix:** Check `DB_USER` and `DB_PASSWORD` in `backend/.env`.
- If you set a MySQL root password, add it to `DB_PASSWORD`

---

### ❌ Error 5: `ER_BAD_DB_ERROR — Unknown database quantum_mentor_world`
**Fix:** Create the database in phpMyAdmin:
1. Go to `http://localhost/phpmyadmin`
2. Click **New**
3. Enter: `quantum_mentor_world`
4. Click **Create**

---

### ❌ Error 6: `Cannot GET /api/health`
**Fix:** Make sure the backend server is running (`npm run dev`).

---

### ❌ Error 7: `CORS error in browser console`
**Fix:** The frontend origin must be in the `allowedOrigins` list in `backend/app.js`.
For VS Code Live Server, `http://127.0.0.1:5500` is already allowed.

---

### ❌ Error 8: `module not found — express`
**Fix:** Run `npm install` inside the `backend/` folder.

---

## Local URLs Reference

| Service | URL |
|---|---|
| Backend API | `http://localhost:5000/api` |
| API Health | `http://localhost:5000/api/health` |
| phpMyAdmin | `http://localhost/phpmyadmin` |
| Frontend (Live Server) | `http://127.0.0.1:5500/frontend/index.html` |
| Admin Login | `http://127.0.0.1:5500/frontend/admin/login.html` |

---

## What's Confirmed Working (Step 3)

| Component | Status |
|---|---|
| Node.js v26.2.0 | ✅ Installed |
| npm 11.13.0 | ✅ Installed |
| Backend packages | ✅ 152 packages installed |
| `.env` file | ✅ Created |
| Server startup | ✅ Starts on port 5000 |
| MySQL connection | ✅ Connected to quantum_mentor_world |
| `/api/health` | ✅ Returns 200 OK |
| All 14 placeholder routes | ✅ All return 200 OK |
| Logo placeholder | ✅ Intact (not modified) |
| No new logo created | ✅ Confirmed |
| No DB tables created | ✅ Confirmed (Step 4) |
| No illegal content | ✅ Confirmed |

---

*Document created: Step 3 — Quantum Mentor World Local Environment Setup*
*Version: 1.0*
