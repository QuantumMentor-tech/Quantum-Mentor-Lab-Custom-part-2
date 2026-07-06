# Post-Launch QA Verification Report — Quantum Mentor World

This report template outlines smoke checks and validation routines to run immediately after the application has been deployed to the live production server.

---

## 1. Production DNS and SSL/TLS Checks

- [ ] **HTTPS Enforce Check:** Access `http://quantummentor.world` (HTTP) and confirm that the request redirects to `https://quantummentor.world`.
- [ ] **Certificate Validity:** Click the padlock in the browser URL address bar and verify that the SSL certificate is valid and not self-signed.
- [ ] **API Endpoint Resolution:** Verify that the API is responding on the secure subdomain:
  `https://api.quantummentor.world/api/health`

---

## 2. Dynamic CORS Origins and Whitelisting Checks

- [ ] **Allowed Origin Test:** Open the browser console on `https://quantummentor.world` and check for CORS errors.
- [ ] **Blocked Origin Test:** Trigger an API call from an unapproved test origin (e.g. via Postman) and verify that the backend rejects the request if the Origin header is not whitelisted.

---

## 3. Dynamic Public Form Submissions Checks

- [ ] **Contact messages Submission:**
  * Navigate to `https://quantummentor.world/contact.html`.
  * Send a test contact query.
  * Verify that the UI displays a success confirmation toast.
- [ ] **Resource Issue Reporting:**
  * Open a resource detail page.
  * Click the "Report Broken/Unsafe Link" link.
  * Submit a dummy issue.
  * Confirm that the backend processes it.

---

## 4. Administrative Controls Handover Audits

- [ ] **Login with Production Account:** Navigate to `https://quantummentor.world/admin/login.html` and authenticate using your newly seeded production credentials.
- [ ] **Verify Default Admin Removal:** Ensure that the local demo account (`admin@quantummentor.local`) is disabled or deleted.
- [ ] **Dashboard Counters:** Verify that the dashboard overview displays database metrics.
- [ ] **Inboxes Review:** Check that the test contact message and test report card appear in the admin contact and reports manager inbox.
