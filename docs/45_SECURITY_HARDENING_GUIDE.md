# Security Hardening Guide (Step 17)

This guide documents the security architecture, controls, and configurations implemented to safeguard the **Quantum Mentor World** platform from malicious use, injection, data leakage, and brute-force vectors.

---

## 1. Environment Security & Credentials

### Configuration Hardening
* All configuration details are parsed from the local `.env` configuration file and mapped onto central validation schemas inside [env.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/backend/config/env.js).
* In production, the system raises alerts and aborts start procedures if weak secrets or empty credentials are used.
* The script [check-env.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/backend/scripts/check-env.js) checks environments automatically before launching code pipelines.

> [!IMPORTANT]
> Never commit active `.env` files to git repositories. Always verify that `.env` is registered within `.gitignore`.

---

## 2. JWT and Authentication Security

### Token Protections
1. **Payload Isolation:** JWT tokens contain only public identifiers (`id`, `email`, `role`). Sensitive properties (like password hashes or raw logs) are excluded.
2. **Short Life & Expiration:** Expiration properties are set to a maximum window of `7d`.
3. **Secret Verification:** Secrets must be at least 12 characters, and are explicitly verified on server start.
4. **Auth State Protection:** The frontend removes stored credentials upon clicking logout to terminate current authorization tokens.

---

## 3. Password Security

* High-strength bcrypt password hashing algorithm (`bcryptjs`) is used during signup/reset.
* Login attempts fail with generic messages: `Invalid email or password`. This prevents username/email enumeration.

---

## 4. Admin Route Protection

* Admin pathways are shielded with the `protect` and `requireRole` middleware checks.
* Any route under `/api/admin` or administrative resource actions require valid tokens and allowed roles (`admin`, `editor`, `moderator`).
* Requests lacking headers or invalid payloads receive standard HTTP `401 Unauthorized` or `403 Forbidden` JSON responses.

---

## 5. CORS Configurations

* Wildcards (`*`) are disallowed in production mode.
* The system reads CORS configurations directly from the `ALLOWED_ORIGINS` env environment array.
* Any unauthorized client origin request is automatically rejected.

---

## 6. Rate Limit Hardening

Dedicated limiters are bound to backend Express endpoints:
* **General API:** 100 requests / 15 minutes per IP.
* **Login Endpoints:** 10 attempts / 15 minutes per IP.
* **Contact Submissions:** 5 attempts / 15 minutes per IP.
* **Report Forms:** 10 reports / 15 minutes per IP.
* **Upload Routes:** 30 attempts / 15 minutes per IP.

---

## 7. Security Headers

Using centralized `helmet` configuration layers, the following controls are set:
1. **Disable X-Powered-By:** Prevents banner-grabbing revealing server platform engines.
2. **Frameguard (Clickjacking):** Block framing layout inclusion.
3. **MIME Sniff Protection:** Force browser checks on static files.
4. **Referrer-Policy:** Enforces safe link headers.
5. **Content Security Policy (CSP):** Limits scripts execution scopes.

---

## 8. Upload Security

Our upload middleware ([upload.middleware.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/backend/middleware/upload.middleware.js)) enforces:
* Strict MIME-type validations (only `image/jpeg`, `image/png`, `image/gif`, `image/webp`).
* Maximum file size limit of `5MB`.
* Sanitization of the file names using random UUID generation to avoid path-traversal overrides.
* Block lists for executable extensions (`.exe`, `.sh`, `.php`, `.js`, `.svg` with payloads).

---

## 9. URL and Link Safety

* Unsafe protocol references like `javascript:`, `data:`, or `file:` are blocked.
* External navigation requires modal warning validation page confirmation.
* The target link configuration forces `rel="noopener noreferrer"` parameters on tags.

---

## 10. SQL Injection Prevention

* Every model utilizes prepared placeholders `?` with `mysql2/promise` execute pipelines.
* No raw string interpolation or templates are used to build MySQL queries.
* Query filters, limit properties, and sorting parameters are checked against a strict whitelist of fields.

---

## 11. XSS (Cross-Site Scripting) Protections

* Frontend rendering scripts escape all dynamically fetched text strings using central helper methods:
  * [escapeHtml](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/assets/js/ui.js) on public sites.
  * [escapeAdminHtml](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/assets/js/admin-ui.js) on administrative control panels.
* HTML injections inside search inputs, contacts, reports, or description cards are safely rendered as literal values.

---

## 12. Safe Error Handling

* Production database query errors are masked with a generic `Something went wrong` or `Database error` message.
* Full raw stack-traces or actual SQL statements are never sent back to the browser console.
* Real error details are logged securely to backend terminal streams.

---

## 13. Public Data Exposure Rules

* In order to be displayed publicly, resources must meet the following criteria:
  * `legal_status` is `approved`.
  * `safety_status` is either `safe` or `warning`.
  * `visibility` is `public`.
  * `deleted_at` is `null`.
* Admin columns like `password_hash`, `admin_notes`, `created_by`, and `updated_by` are excluded from all public-facing endpoints.
