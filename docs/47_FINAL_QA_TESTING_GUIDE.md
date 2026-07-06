# Final QA Testing Guide (Step 17)

This guide provides testing procedures, execution scripts parameters, and validation checklists to confirm that the **Quantum Mentor World** application is ready for final deployment.

---

## 1. Automated Scripts Suite

Run these validation commands inside [backend](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/backend) directory before any launch release:

```bash
# Verify Environment variables strength
npm run check:env

# Validate Database schema and required tables
npm run check:db

# Scan JS source code for insecure string templates/concatenations
npm run check:security

# Run smoke tests on public REST API endpoints
npm run check:api
```

---

## 2. Public Page Verification Checklist

Verify that these pages load correctly and have zero console exceptions:
- [ ] `index.html` (Dynamic cards load, header links function, categories dropdown populated)
- [ ] `software.html`, `books.html`, `tools.html`, `games.html`, `themes-plugins.html`, `watch.html`, `news.html`, `github-repos.html` (Ensure correct resource types are filtered)
- [ ] `search.html` (Verify query extraction, query display string is escaped, pagination triggers)
- [ ] `categories.html` & `category.html?slug=...`
- [ ] `tags.html` & `tag.html?slug=...`
- [ ] `resource-detail.html?slug=...` (Verifies content mapping, fallback icons appear if no image)
- [ ] `about.html`, `contact.html`, `disclaimer.html`, `privacy.html`

---

## 3. Administrative Control Panel Checklist

Authenticate as administrator and verify:
- [ ] **Login Screen:** Input checks block empty submissions, invalid attempts return generic error messages.
- [ ] **Dashboard Overview:** Displays resource counts, pending messages, and report metrics.
- [ ] **Resources Management:**
  * [ ] Add resource form allows selecting category, tags, and visibility status.
  * [ ] Edit resource form populates existing data correctly.
  * [ ] Search & Filters render paginated admin lists.
- [ ] **Media Library:** Image uploads generate direct asset cards. Non-image files are rejected.
- [ ] **Messages & Reports:** List views render incoming user logs; state transition buttons work.

---

## 4. Security Hardening Checklists

- [ ] **Upload Restrictions:**
  * Try uploading a `.exe` or `.js` file: Verify that the API returns a validation error.
  * Try uploading a large file (>5MB): Verify that it is blocked.
- [ ] **XSS Injection Checks:**
  * Enter `<script>alert(1)</script>` in search bar: Verify that it is safely rendered as plain text.
- [ ] **External Redirect Safe Links Modal:**
  * Click an external resource detail link: Verify that the warning modal layout intercept opens, and warning guidelines are displayed.
- [ ] **SQL Concatenation Prevention:**
  * Run the `check:security` command: Verify that zero regex anomalies are found.

---

## 5. QA Bug Report Template

Use the following template to log issues found during testing:

```markdown
### Bug Title
[Short, descriptive title]

**Component:** [Frontend / Backend / DB]
**URL / API Path:** [e.g., /api/resources]
**Browser/OS:** [e.g., Chrome Windows 11]

**Steps to Reproduce:**
1. Navigate to '...'
2. Input '...'
3. Click '...'

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens / error message / stack trace]

**Severity:** [High / Medium / Low]
```

---

## 6. Final Launch Approval Checklist

Before handing over to final deployment (Step 18), ensure:
* [ ] All 4 check scripts run with zero critical errors.
* [ ] CORS does not block localhost/Live Server.
* [ ] No default admin credentials remain in production configuration schemas.
* [ ] Legal restrictions remain absolute (zero cracked/pirated references).
