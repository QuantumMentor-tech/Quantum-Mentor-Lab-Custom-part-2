# Post-Launch Maintenance & Monitoring Guide — Quantum Mentor World

This document maps out routing maintenance checklists to keep **Quantum Mentor World** stable, secure, and fast.

---

## 1. Daily Health Audits

* **Verify Endpoint Status:** Check that the API returns success values:
  `https://api.your-domain.com/api/health`
* **Audit Contact Message Inbox:** Log into the admin panel and review user inquiries.
* **Review Link Issue Reports:** Review report cards and check reported URLs for safety.

---

## 2. Weekly Operations Checklists

* **Automated Database Backups:** Run the backup script:
  ```bash
  npm run backup:db
  ```
  Ensure the output file is copied to a secure secondary backup storage disk.
* **Automated Uploads Backups:** Run media upload backups:
  ```bash
  npm run backup:uploads
  ```
* **Verify External Links Status:** Check newly published links manually or using a crawler to ensure they resolve.

---

## 3. Monthly Operations Checklists

* **Review Admin Logs:** Scan administrative activity log directories.
* **Prune Deleted Media:** Clean up deleted images in phpMyAdmin to free up server disk space.
* **Audit Security and Packages:**
  * Run check commands locally:
    ```bash
    npm run check:security
    ```
  * Run `npm audit` to check for dependency security vulnerabilities. Update packages using `npm update` only after verifying compatibility in development.
* **SEO & Analytics Audits:** Verify that canonical URLs, canonical tags, and Open Graph cards are crawled.
* **Resource Reports cleanups:** Mark investigated and closed reports as completed.
