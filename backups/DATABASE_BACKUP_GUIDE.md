# Database Backup & Recovery Guide — Quantum Mentor World

This document covers procedures to export, verify, and restore MySQL database structures and data.

---

## 1. Automated Backups with CLI

To generate a database backup using the command line:

1. Open your terminal in the backend directory:
   ```bash
   cd backend
   ```
2. Execute the database backup utility:
   ```bash
   npm run backup:db
   ```
3. Run the generated `mysqldump` command. E.g.:
   ```bash
   mysqldump -h localhost -P 3306 -u root -p quantum_mentor_world > "../backups/generated/quantum_mentor_world_backup_TIMESTAMP.sql"
   ```
4. Enter your database password when prompted.

---

## 2. Manual Backup with phpMyAdmin

If the CLI utility is unavailable:
1. Open your browser and navigate to `http://localhost/phpmyadmin` (local) or your hosted service.
2. Select `quantum_mentor_world` in the database sidebar list.
3. Click the **Export** tab.
4. Keep the export method as **Quick** and format as **SQL**.
5. Click **Export** to download the dump.
6. Store the file inside `backups/generated/`.

---

## 3. Database Restoration Procedures

To restore a database dump:
1. Log into your mysql console or phpMyAdmin.
2. If tables are corrupted, drop the database and recreate:
   ```sql
   DROP DATABASE IF EXISTS quantum_mentor_world;
   CREATE DATABASE quantum_mentor_world CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
   ```
3. Import the target backup:
   ```bash
   mysql -h localhost -P 3306 -u root -p quantum_mentor_world < backups/generated/quantum_mentor_world_backup_TIMESTAMP.sql
   ```
