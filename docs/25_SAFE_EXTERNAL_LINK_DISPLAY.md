# 25 — Safe External Link Display
## Quantum Mentor World | Quantum Mentor Official

---

## 1. Overview

To protect learners and developers, **Quantum Mentor World** does not redirect users to external websites immediately. Every external link undergoes strict validation and triggers a warning modal before forwarding.

---

## 2. Redirection Interceptor Workflow

When a user clicks any safe external link:
1. **Validation Checks:** The URL is scrutinized by the helper validator.
2. **Warning Modal Overlay:** Intercepts clicks to display a dark modal backdrop carrying:
   - The label of the resource link (e.g. Official Website, Documentation).
   - The target hostname domain (extracted safely to prevent spoofing).
   - Redirection compliance and safety notices.
3. **Explicit Consent:** Redirection only triggers if the user clicks the "Proceed to Link" button.
4. **Secure Window Instantiation:** Opens in a new tab using:
   ```javascript
   window.open(url, '_blank', 'noopener,noreferrer');
   ```
5. **Dismissals:** Clicking "Cancel", pressing the **Escape** key, or clicking the modal background backdrop overlay closes the modal immediately.

---

## 3. Allowed and Blocked URL Schemes

### Whitelisted Protocols:
* `https://` (Strict HTTPS required for external production links).
* `http://` (Allowed only for local developer testing on localhost).

### Blocked Protocols:
Any link matching these keywords is instantly blocked with a client-side alert warning of potential script execution:
* `javascript:` (prevents DOM XSS attacks).
* `data:` (prevents embedding inline documents/malware).
* `file:` (prevents local filesystem access).
* `ftp:` (prevents unencrypted file transfers).
* Empty, null, or malformed URL formats.

---

## 4. Legal and Safety Badge Configurations

* **Legal Status Badges:** Displays green Approved badges. Drafts or Rejected configurations do not display links.
* **Safety Status Badges:** Safe links display green badges. Cautions or Warning links show warning badges.
* **Redaction Rules:** Under no circumstances are links rendered if their legal status is pending/rejected or their safety status is unsafe.

---

## 5. Report Broken/Unsafe Link Placeholder

* In this release (Step 10), a disabled "Report Broken / Unsafe Link" button is displayed in the details sidebar.
* **Future Release (Admin Dashboard & Reports):** In a later step, this button will open a report modal form allowing visitors to flag links, which will notify administrators and automatically put the link under review.
