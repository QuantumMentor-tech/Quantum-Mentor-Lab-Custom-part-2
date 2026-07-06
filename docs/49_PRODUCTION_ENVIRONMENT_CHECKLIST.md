# Production Environment Checklist (Step 17)

This checklist provides a checklist to ensure the environment, database, and configurations are securely hardened before final production release.

---

## 1. Environment and Secret Keys Configuration

- [ ] **Configure NODE_ENV:** Ensure `NODE_ENV=production` is declared in the host environment variables.
- [ ] **Define High-Entropy JWT Secret:** Change the placeholder `JWT_SECRET` value to a secure, randomly generated string (minimum 32 characters).
- [ ] **Lock Down Allowed Origins:** Set `ALLOWED_ORIGINS` to contain only the final deployed domain names (e.g. `https://quantummentor.world`). Do NOT include wildcards or local addresses in production.
- [ ] **Enable HTTPS & SSL:** Enforce HTTPS redirects at the reverse proxy (e.g. Nginx or Cloudflare) to ensure all data in transit is encrypted.

---

## 2. MySQL / Database Setup & Hardening

- [ ] **Secure Root Credentials:** Ensure the MySQL root user password is strong.
- [ ] **Create Dedicated Database User:** Do NOT connect using the root user in production. Create a dedicated database user with privileges restricted strictly to the platform database.
- [ ] **Apply Custom Performance Indexes:** Import the [optimization_indexes.sql](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/database/optimization_indexes.sql) file to speed up lookups.
- [ ] **Validate Database Schemas:** Run `node scripts/check-db.js` on the production server to verify all required tables exist.

---

## 3. Directory and Storage Security

- [ ] **Uploads Directory Permissions:** Configure folder read/write permissions on the server (e.g. `chmod 755 uploads` or equivalent Windows ACL permissions) so that only the Node.js process can write files, and visitors can only retrieve resources.
- [ ] **Block Script Execution:** Configure the web server (Nginx/Apache) serving the `uploads` directory to reject execution of scripts (like `.php`, `.cgi`, or `.js`).

---

## 4. Administrative and Operational Audits

- [ ] **Change Initial Admin Credentials:** Immediately log into the administrator dashboard and update the initial temporary user account credentials to a secure password.
- [ ] **Verify sitemap.xml and robots.txt:** Check that paths inside [sitemap.xml](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/sitemap.xml) reflect the final production URL domain.
- [ ] **Final Legal Auditing:** Verify that all dynamic and static resources conform to the strict legal content requirements. Ensure zero Cracked, Pirated, or Nulled links/files exist.

---

## 5. Backup Procedures

- [ ] **Configure Database Backups:** Setup a daily automated cron task utilizing `mysqldump` to back up database structures and seed states to a separate secure storage container.
- [ ] **Uploaded Assets Storage Backup:** Configure weekly backups of the `backend/uploads/` storage folder.
