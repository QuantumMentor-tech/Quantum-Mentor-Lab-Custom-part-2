# Database Setup Guide
## Quantum Mentor World — quantum_mentor_world

---

## Local Database Credentials

| Setting | Value |
|---|---|
| Host | `localhost` |
| Port | `3306` |
| Database | `quantum_mentor_world` |
| User | `root` |
| Password | *(empty — XAMPP default)* |
| Collation | `utf8mb4_unicode_ci` |

> If you set a MySQL root password, update `DB_PASSWORD` in `backend/.env`.

---

## Step-by-Step Setup

### 1. Open XAMPP Control Panel
- Start **Apache**
- Start **MySQL**
- Both must show green ✅

### 2. Open phpMyAdmin
```
http://localhost/phpmyadmin
```

### 3. Create the Database
1. Click **New** in the left panel
2. Database name: `quantum_mentor_world`
3. Collation: `utf8mb4_unicode_ci` or `utf8mb4_general_ci`
4. Click **Create**

> ✅ Already confirmed created. Database URL:
> `http://localhost/phpmyadmin/index.php?route=/database/structure&db=quantum_mentor_world`

---

## Step 5 Import Instructions

To import the database schema, perform the following actions:

1. Open XAMPP Control Panel.
2. Start **Apache**.
3. Start **MySQL**.
4. Open your browser and navigate to:
   ```text
   http://localhost/phpmyadmin
   ```
5. In the left-hand navigation pane, select the database `quantum_mentor_world`.
6. Click the **Import** tab in the top menu bar.
7. Click **Choose File** (or **Browse...**) and select the SQL file:
   ```text
   database/quantum_mentor_world.sql
   ```
8. Ensure the format is set to **SQL**.
9. Click **Import** (or **Go**).
10. Confirm that all 15 tables were successfully created. The tables should include:
    * `users`
    * `categories`
    * `tags`
    * `media`
    * `resources`
    * `resource_details`
    * `resource_categories`
    * `resource_tags`
    * `resource_links`
    * `watch_episodes`
    * `watch_servers`
    * `contact_messages`
    * `site_settings`
    * `admin_activity_logs`
    * `resource_reports`

---

## Troubleshooting Common Errors

### Error: Cannot add foreign key constraint
* **Fix:** Check table creation order and matching field types. Foreign key columns must be of the same type as referenced keys (e.g., both `BIGINT UNSIGNED`), and referenced tables must be created first. Ensure `SET FOREIGN_KEY_CHECKS = 0;` is run prior to creating tables.

### Error: Unknown database
* **Fix:** Make sure the SQL file starts with `CREATE DATABASE IF NOT EXISTS quantum_mentor_world;` and `USE quantum_mentor_world;`, and that you have appropriate root user permissions in phpMyAdmin.

### Error: Table already exists
* **Fix:** Local development schemas reset by dropping tables. The SQL file drops tables in safe reverse order. Ensure you do not overwrite production data. For local resets, make sure you selected the right database before running the script.

### Error: MySQL server has gone away
* **Fix:** Restart MySQL in the XAMPP Control Panel and try importing the file again.

---

## Step 6 Seed Data Import Instructions

Follow these instructions to import the legal demo seed data:

1. First, import the base database schema:
   ```text
   database/quantum_mentor_world.sql
   ```
2. Then, import the seed data file:
   ```text
   database/seed_data.sql
   ```
3. Open the phpMyAdmin interface, select the database `quantum_mentor_world`, and check the **Browse** tab for each table to confirm the demo records are populated:
   * `users`
   * `categories`
   * `tags`
   * `site_settings`
   * `resources`
   * `resource_details`
   * `resource_links`
   * `watch_episodes`
   * `watch_servers`
4. Confirm that the demo data is present, complies with safety rules, and has successfully initialized the website configurations.

---

## Connection Status (Step 3 Verified)

```
[Database] ✅ MySQL connected successfully.
[Database]    Host     : localhost:3306
```

---

## Security Notes

- Never commit `backend/.env` to Git.
- Change the default MySQL root password before going to production.
- Always use parameterized queries (`?` placeholders) — never string concatenation.
- Run regular database backups.

---

## Step 5 — Database Design Summary

### Tables Designed (15 Total)

| # | Table | Purpose |
|---|---|---|
| 1 | `users` | Admin and future user accounts |
| 2 | `resources` | All resource entries — base table |
| 3 | `resource_details` | Type-specific metadata (1:1 with resources) |
| 4 | `categories` | Resource categories (hierarchical) |
| 5 | `tags` | Resource tags |
| 6 | `resource_categories` | Resources ↔ Categories junction |
| 7 | `resource_tags` | Resources ↔ Tags junction |
| 8 | `resource_links` | Safe external links per resource |
| 9 | `media` | Uploaded image metadata |
| 10 | `watch_episodes` | Watch content episodes |
| 11 | `watch_servers` | Legal embed servers per episode |
| 12 | `contact_messages` | Contact form submissions |
| 13 | `site_settings` | Global key-value site config |
| 14 | `admin_activity_logs` | Admin action audit trail |
| 15 | `resource_reports` | User-submitted resource reports |

### Key Design Decisions

- **Soft delete** on 11 of 15 tables (`deleted_at` field).
- **Legal + safety status fields** on all public content tables.
- **Parameterized queries only** — no string concatenation in SQL.
- **URL validation** required before saving any `*_url` field.
- **bcryptjs hashing** for all passwords — never plain text.
- **Composite indexes** added on the `resources` table for standard queries.

---

*Quantum Mentor World — Database Setup Guide | Updated: Step 6*
