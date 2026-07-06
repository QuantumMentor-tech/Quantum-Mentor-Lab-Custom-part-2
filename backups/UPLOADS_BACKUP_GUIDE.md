# Uploads Media Directory Backup Guide — Quantum Mentor World

This document covers backup procedures for uploaded media screenshots and resource mockups.

---

## 1. Automated Backups with CLI

To generate a backup copy of your dynamic uploaded media files:

1. Open your terminal in the backend directory:
   ```bash
   cd backend
   ```
2. Execute the uploads backup script:
   ```bash
   npm run backup:uploads
   ```
3. The script scans [backend/uploads/](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/backend/uploads) recursively, filters files by whitelisted image extensions (`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`), and copies them to:
   ```text
   backups/generated/uploads_backup_TIMESTAMP/
   ```

---

## 2. File Whitelists Integrity Checks

To prevent code injection, our backup script validates file extension suffixes:
* **Allowed Formats:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
* **Blocked Extensions:** `.exe`, `.php`, `.js`, `.py`, `.sh`, `.htaccess`

Any non-image/dangerous scripts found inside the uploads directory will be logged as warnings and skipped by the backup process.

---

## 3. Manual Backup Method

If you do not have Node.js access:
1. Navigate to `backend/uploads/images` folder.
2. Select all images (Ctrl+A), copy them (Ctrl+C), and paste them (Ctrl+V) into a separate secure backup folder.
3. Verify that zero scripts or configuration files are present in the copied files.
