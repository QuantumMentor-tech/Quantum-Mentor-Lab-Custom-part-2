# Production Security Hardening Guide — Quantum Mentor World

This document serves as the operational checklist to verify security hardening parameters before public launch.

---

## 1. CORS origin configurations
* Verify that `ALLOWED_ORIGINS` in your environment contains only whitelisted domain URLs.
* Wildcard domains (`*`) are disallowed.

---

## 2. API Rate Limit Enforcements

Ensure the following limits are active on production endpoints:
* **API Global Rate Limit:** 100 requests per 15 minutes per IP.
* **Authentication Login Rate Limit:** 10 attempts per 15 minutes per IP.
* **Contact message Submission Rate Limit:** 5 submissions per 15 minutes per IP.
* **Resource Reports Rate Limit:** 10 reports per 15 minutes per IP.
* **Media Upload Rate Limit:** 30 attempts per 15 minutes per IP.

---

## 3. Parameterized SQL Queries

* Ensure no model interpolates raw query parameters into SQL strings.
* Run static code security check scripts to verify:
  ```bash
  npm run check:security
  ```

---

## 4. Administrative Page protections

* Keep routes under `/api/admin` locked behind the `protect` and `requireRole` middleware checks.
* Verify that frontend credentials storage in `sessionStorage` does not leak tokens into console log files.
* Change default credentials from `admin@quantummentor.local` / `Admin@12345` immediately after deployment.

---

## 5. Security Header Configurations (Helmet)

Ensure the central security headers middleware is mounted:
* Disable `x-powered-by` header.
* Frameguard settings block site inclusion inside external iframe tags.
* Content Security Policy (CSP) limits asset calls to whitelisted CDNs.
