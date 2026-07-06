# Backup and Restoration Guide — Quantum Mentor World

This document covers backup, archiving, and restoration procedures for databases, files, and codebases.

---

## 1. Database SQL Backups
* Run the database backup assistant:
  ```bash
  npm run backup:db
  ```
  This creates a timestamped SQL dump path and prints the required `mysqldump` command.
* **Manual backup fallback:** Open phpMyAdmin, select your database, click **Export**, choose the Quick method, and download the SQL dump file.

---

## 2. Dynamic Uploaded Media Backups
* Run the uploads backup script:
  ```bash
  npm run backup:uploads
  ```
  This scans the folder recursively, verifies that only whitelisted image formats exist, and copies them to the backup directory.

---

## 3. Project Handover ZIP Archives
* Exclude heavy dependency folders and private environment configurations (`node_modules/`, `.env`, and local generated backup folders).
* **Git Archive Command (Recommended):**
  ```bash
  git archive --format=zip HEAD -o quantum_mentor_world_handover.zip
  ```

---

## 4. Restoration Sequence
1. Unzip the archive package.
2. Install packages: `npm install` inside the `backend` folder.
3. Import the SQL database schema (`database/quantum_mentor_world.sql`), seed content (`database/seed_data.sql`), and query indexes (`database/optimization_indexes.sql`).
4. Copy `.env.example` to `.env` and fill in DB credentials.
5. Start local server: `npm run dev`.

Refer to [DATABASE_BACKUP_GUIDE.md](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/backups/DATABASE_BACKUP_GUIDE.md) and [UPLOADS_BACKUP_GUIDE.md](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/backups/UPLOADS_BACKUP_GUIDE.md) for more details.
