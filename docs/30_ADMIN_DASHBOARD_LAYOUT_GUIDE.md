# Admin Dashboard Layout Guide

This guide details the reusable user interface (UI) and user experience (UX) layout system deployed across all protected administration pages for **Quantum Mentor World** (**Quantum Mentor Official**).

---

## 1. Purpose of Admin Dashboard Layout

The administrator dashboard layout serves as a secure, high-contrast, responsive console allowing authorized administrators, editors, and moderators to organize resource listings, check legal compliance, monitor tags/categories, and manage site-wide settings.

---

## 2. Reusable Shell Structure

Admin pages share a unified two-column layout grid:
1. **Sidebar Navigation Pane (Left):** Houses brand identities and active sections links. Remains fixed on large viewports, collapses into a slide-drawer toggle on screens under `1024px`.
2. **Main Workspace Panel (Right):** Accommodates the sticky top bar, breadcrumb paths, and the dynamic scrollable workspace content area.

---

## 3. Sidebar Links

Sidebar links are divided into logical sections to group content operations and system maintenance:
* **Overview:**
  * `Dashboard` (links to `dashboard.html`)
* **Content Management:**
  * `Resources` (links to `resources.html`)
  * `Add Resource` (links to `add-resource.html`)
  * `Categories` (links to `categories.html`)
  * `Tags` (links to `tags.html`)
  * `Media Library` (links to `media.html`)
* **System Settings:**
  * `Site Settings` (links to `settings.html`)
  * `Logout` (invalidates sessionStorage credentials)

---

## 4. Topbar Actions & User Profile

The top sticky header accommodates:
* **Mobile Sidebar Toggle Button (`☰`):** Active below `1024px` to open/close menu.
* **Breadcrumbs Paths:** Displays current admin navigation hierarchy.
* **View Website Action Button (`View Website ↗`):** Opens a new tab referencing the public homepage `index.html`.
* **User Profile Pill:**
  * Rounded avatar container initialized dynamically with operator's name first letter.
  * Operator's display name (`#admin-user-name`).
  * Role Badge (`#admin-user-role`) styled color-codes (`badge-admin` (Cyan), `badge-editor` (Green), `badge-moderator` (Orange)).

---

## 5. Protected Page Flow (Auth Guard)

To prevent un-authorized "content flash" before authentication resolves:
1. Every admin HTML header contains:
   ```html
   <script src="../assets/js/api.js"></script>
   <script src="../assets/js/admin-auth.js"></script>
   <script>
     window.AdminAuth.requireAdminPage();
   </script>
   ```
2. `requireAdminPage()` runs synchronously inside `<head>` to evaluate the presence of token:
   * Checks `sessionStorage` for `qmw_admin_token`.
   * Fires a validating `/api/auth/me` check.
   * If invalid, resolves redirect to `login.html` immediately.
   * If valid, updates UI name pills and allows page rendering.

---

## 6. Dashboard Overview Metrics

The dashboard overview screen fetches and aggregates statistics count metrics dynamically from `GET /api/admin/overview`:
* **Total Resources:** Global resources cataloged in database.
* **Published:** Live visible listings.
* **Drafts:** Private records.
* **Pending Review:** Resources requiring moderator validation.
* **Categories:** Number of active categories.
* **Tags:** Number of active index tags.
* **Media Files:** Total uploaded assets files.

If the backend server is offline or fails, cards safely fall back to "Coming soon".

---

## 7. Responsive Breakpoints

Responsive reflows are configured across CSS variables:
* **`1200px`:** Forms grid reflows to single columns on split views.
* **`1024px`:** Sidebar drawer collapses to hamburger toggle, overlay active.
* **`768px`:** Forms stack 1-column, form buttons stretch to full width.
* **`480px`:** Hides breadcrumbs and public links to save header space. Stats cards stack.
* **`360px`:** Title font sizes shrink, avatar wraps.

---

## 8. Script Loading Order

Script elements must compile in the following order:
```html
<script src="../assets/js/api.js"></script>
<script src="../assets/js/admin-auth.js"></script>
<script src="../assets/js/admin-ui.js"></script>
<script src="../assets/js/admin-layout.js"></script>
<script src="../assets/js/admin.js"></script>
```

---

## 9. Security Rules

* **Zero Password Logs:** Password characters or token strings must never be printed to logs.
* **Clean Session Storage:** Token credentials must clear immediately upon logout or validation checks failures.
* **No HTML Rendering:** Dynamic variables must pass through `escapeAdminHtml()` before injection.

---

## 10. Testing Checklist

- [ ] Direct page load redirects to `login.html` without login session.
- [ ] Valid credentials login redirects to `dashboard.html`.
- [ ] User profile pill displays correct full name and role badge.
- [ ] Sidebar highlights current active page accurately.
- [ ] Hamburger toggle opens drawer and dark overlay on mobile views.
- [ ] Clicking logout terminates session and redirects back to login.

---

## 11. Common Errors and Fixes

### Error: Admin page flashes content before redirecting
* **Fix:** Verify `window.AdminAuth.requireAdminPage()` is declared inside the document `<head>`, above body tags, to execute before DOM parsing.

### Error: User name remains "Loading..."
* **Fix:** Ensure the HTML top bar includes the element `<div id="admin-user-name">` and script `admin-layout.js` loads at the bottom.
