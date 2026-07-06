# Emergency Rollback Plan — Quantum Mentor World

This plan details recovery checklists and restoration sequences in the event of deployment failures or runtime anomalies.

---

## 1. When to Initiate Rollback

A rollback should be triggered under these circumstances:
* The production server crashes on startup or health endpoints return 500/502 errors repeatedly.
* A critical database schema migration fails, locking tables or breaking SQL query pools.
* Authentication credentials validation is broken, locking administrators out.
* The frontend site layout breaks, preventing access to public listing directories.

---

## 2. Emergency Backup Guidelines

Before attempting code changes, compile copies of live databases and uploads:
```bash
# 1. Export database schemas and logs
npm run backup:db

# 2. Export uploaded media screenshots
npm run backup:uploads
```

---

## 3. Frontend Static Restoration

If the user interface files are corrupted:
1. Log into your static hosting dashboard (e.g. Netlify/Vercel).
2. Select the previous build and click **Rollback/Redeploy**.
3. If hosting files manually on Nginx/Apache, delete target directory files and restore the files from the backup directory.

---

## 4. Backend Application Restoration

If the Node process fails:
1. Stop the active PM2 process:
   ```bash
   pm2 stop quantum-mentor-backend
   ```
2. Revert the repository to the last verified release tag:
   ```bash
   git checkout tags/v1.0.x
   ```
3. Re-install production packages:
   ```bash
   npm install --production
   ```
4. Restart the PM2 process:
   ```bash
   pm2 restart quantum-mentor-backend
   ```

---

## 5. Database Schema Restoration

If tables are corrupted or columns are missing:
1. Log into phpMyAdmin or connect via CLI.
2. If tables are unusable, drop tables safely and recreate the database:
   ```sql
   DROP DATABASE quantum_mentor_world;
   CREATE DATABASE quantum_mentor_world;
   ```
3. Re-import your last database dump:
   ```bash
   mysql -h your-db-host -u admin-user -p quantum_mentor_world < backups/generated/quantum_mentor_world_backup_TIMESTAMP.sql
   ```
4. Test database connectivity:
   ```bash
   npm run check:db
   ```
