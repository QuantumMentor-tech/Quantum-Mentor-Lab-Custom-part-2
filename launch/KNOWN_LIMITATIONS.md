# Known System Limitations — Quantum Mentor World

This document outlines system constraints in the current MVP release of the **Quantum Mentor World** platform.

---

## 1. Static Metadata Crawling (SEO Limitations)

Because the user interface is built with vanilla HTML/CSS and queries the API dynamically using client-side JavaScript:
* **Search Engine Crawling:** Modern crawlers (like Googlebot) render client-side JavaScript, but simpler web crawlers, chat preview scrapers, or social media indexers may only read the raw static HTML files.
* **Result:** Dynamic descriptions/titles fetched via API on `resource-detail.html` might not show up in preview cards on some messaging apps.
* **Resolution Hint:** In future upgrades, migrate to server-side rendering (SSR) or pre-render templates to static HTML pages.

---

## 2. Local File Upload Persistence

* **Ephemeral Disks:** The server stores media uploads in a local filesystem path (`backend/uploads/`).
* **Result:** On servers with temporary/ephemeral container disks (like Heroku or AWS Fargate), uploaded files are erased during container restarts.
* **Resolution Hint:** Configure persistent disk volumes or update the storage layer to sync files with object storage (such as AWS S3 or Google Cloud Storage).

---

## 3. SessionStorage Token Storage

* **Authentication:** Admin tokens are stored on the client side inside `sessionStorage`.
* **Result:** While this separates user states and is standard for API-driven architectures, it is vulnerable to cross-site scripting (XSS) if data escaping is bypassed.
* **Resolution Hint:** Migrate to HttpOnly, secure, and SameSite=Strict cookies to store JWT tokens in the future.

---

## 4. Administrative Role Management Boundaries

* **RBAC:** Auth middlewares check user roles (`admin`, `editor`, `moderator`).
* **Result:** There is currently no administrative UI inside the dashboard to invite operators or change operator roles dynamically. Role changes must be done directly inside the `users` database table in phpMyAdmin.
* **Resolution Hint:** Implement an administrative operators management screen in a future iteration.
