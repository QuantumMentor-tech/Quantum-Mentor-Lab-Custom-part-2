# Uploads and Storage Management Guide — Quantum Mentor World

This document maps out directory structures, write permissions, validation safety, and backups policies for uploaded assets.

---

## 1. Directory Structure & Permissions

* **Storage Root:** Uploaded media and screenshots are stored locally inside the [backend/uploads/](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/backend/uploads) folder.
* **Server Permissions:**
  * On Unix-like systems, configure permissions to permit writes to the Node process:
    ```bash
    chmod 755 backend/uploads
    ```
  * Do NOT use recursive `777` permissions. Keep permissions minimal to restrict unauthorized access to neighboring system directories.

---

## 2. File Safety Validation

Our upload middleware ([upload.middleware.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/backend/middleware/upload.middleware.js)) enforces safety checks before writing any files:
1. **MIME-Type & Extension Checks:** Only whitelisted image formats are accepted (`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`).
2. **Execution Blocks:** Scripts, executables, or configurations (e.g. `.php`, `.js`, `.py`, `.exe`, `.htaccess`, `.sh`) are rejected and discarded immediately.
3. **Randomized Filenames:** Written filenames are mapped to secure UUID strings to prevent directory path traversal overrides.

---

## 3. Persistent Hosting Storage Requirements

If you deploy your backend container on hosts with ephemeral file systems (like Heroku, AWS Fargate, or Render basic servers without disks):
* Local file uploads will be deleted every time the container restarts.
* **Solution:** Mount a persistent disk volume to `/backend/uploads` or, in a future upgrade phase, migrate the file storage layer to an external object storage service (e.g. AWS S3 or Cloudflare R2).

---

## 4. Backups Procedures

* Media assets must be backed up weekly.
* Run the backups script:
  ```bash
  npm run backup:uploads
  ```
  This scans the folder recursively, validates that only whitelisted formats exist, and copies them to the backup directory.
