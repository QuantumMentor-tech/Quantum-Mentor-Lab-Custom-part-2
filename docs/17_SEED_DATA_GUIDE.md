# 17 — Seed Data Guide
## Quantum Mentor World | Quantum Mentor Official

---

## Overview

Seed data is a pre-defined set of database records used to initialize a database. For **Quantum Mentor World**, this seed data populates categories, tags, site settings, and legal resource examples.

### Why Demo Data is Needed
* **UI/UX Testing:** Allows developers to test layouts, sliders, sidebar widgets, lists, and pages with realistic-looking content.
* **Backend Verification:** Ensures queries (filtering, search, relations) work correctly.
* **Authentication Bootstrap:** Creates an initial administrative user to allow logging into the admin panel for content moderation.

---

## Local Admin Credentials

For local development and testing only, a demo administrative user is seeded:

* **Email:** `admin@quantummentor.local`
* **Username:** `admin`
* **Role:** `admin`
* **Status:** `active`
* **Password:** `Admin@12345`

> [!IMPORTANT]
> The plain text password is never stored in the database. Instead, only its cryptographically secure bcrypt hash is stored in the `password_hash` column.

### How to Generate the Password Hash
A Node.js utility script is provided in the backend to generate the bcrypt hash:

1. Open a terminal.
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```
3. Run the script using the npm command:
   ```bash
   npm run hash:password
   ```
   Or run the file directly with node:
   ```bash
   node scripts/generate-password-hash.js
   ```
4. Copy the generated bcrypt hash into the admin `INSERT` statement in `database/seed_data.sql`.

---

## How to Import Seed Data

Follow these steps to initialize the database:

### 1. Import Base Schema
First, import the base database schema to create empty tables:
```text
database/quantum_mentor_world.sql
```

### 2. Import Seed Data
Next, import the seed data file:
```text
database/seed_data.sql
```

*Both operations can be performed using phpMyAdmin's **Import** tab or the MySQL CLI:*
```bash
# Example CLI import (using your MySQL CLI path)
& "E:\install softwares\xampp\mysql\bin\mysql.exe" -u root -e "source database/seed_data.sql"
```

---

## Demo Data Inserted

The seed script inserts the following records:

* **1 Admin User:** Initial administrator profile.
* **15 Categories:** Software, Books, Tools, Games, Themes & Plugins, Watch, News, GitHub Repositories, AI Tools, Web Development, Productivity, Education, Open Source, Design, Programming.
* **15 Tags:** Free, Open Source, Beginner Friendly, Educational, Official Link, Safe Resource, Web Development, AI, Productivity, Design, Programming, Learning, Public Domain, Creator Approved, Documentation.
* **8 Site Settings:** Brand and legal text configurations.
* **16 Legal Demo Resources:** 2 Software, 2 Books, 2 Tools, 2 Games, 2 Themes/Plugins, 2 Watch Resources, 2 News, 2 GitHub Repos.
* **16 Resource Details:** One detail record mapped to each resource.
* **19 Resource Links:** Links pointing to safe demo placeholders (`https://example.com`).
* **4 Watch Episodes & 4 Watch Servers:** Video playlist structure pointing to safe video placeholders.
* **1 Activity Log:** Seed creation event logged.

---

## Strict Legal and Safety Rules

To maintain absolute legality and safety, the seed data conforms to strict guidelines.

### What Should NEVER Be Added
* Cracked software or key generators.
* Pirated movies, anime, donghua, or TV shows.
* Nulled themes or plugins.
* Leaked paid courses or pirated books.
* Malware, phishing, scam, or download links from untrusted servers.

### How to Replace Placeholders with Real Links Later
When going live, replace the placeholder links with real, authenticated links:
1. Log in to the administrator dashboard.
2. Edit the selected resource.
3. Replace `https://example.com` in the **URL** field with the official link.
4. Set the legal review status to **Approved** and safety status to **Safe**.
5. Save changes.

---

## Resetting Local Seed Data Safely

To completely reset your local database to the initial seed state:
1. Re-import `database/quantum_mentor_world.sql` (which drops and recreates all tables).
2. Re-import `database/seed_data.sql` (which populates all default records).
