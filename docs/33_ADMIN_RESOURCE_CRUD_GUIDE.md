# Admin Resource CRUD Workflow Guide

This document explains the processes, security rules, and user interfaces involved in managing resources inside the **Quantum Mentor World** administrative panel.

---

## 📋 Resource Workflows

### 1. Creation Workflow
When an administrator creates a resource:
1. Form inputs are validated on the frontend (e.g. required titles, valid URL formats, safe URL protocols).
2. The user can save the resource as a `draft` or attempt to `publish` it directly.
3. If they attempt to publish, the system checks the compliance status:
   * **Legal Status** must be `approved`.
   * **Safety Status** must be `safe` or `warning`.
   * If these are not met, the publish action is blocked.
4. On submit, a transaction inserts into:
   * `resources`
   * `resource_details` (specifications)
   * `resource_categories` (junction)
   * `resource_tags` (junction)
   * `resource_links` (mirrors list)

### 2. Editing Workflow
1. The admin clicks the Edit (✏️) button in the resources table.
2. The browser navigates to `edit-resource.html?id=RESOURCE_ID`.
3. The javascript reads `id` from query parameters and fetches details from the protected admin endpoint: `GET /api/admin/resources/:id`.
4. The form is populated with existing values, dynamic checkbox states, and repeatable link rows.
5. The admin edits settings, adds/removes link mirrors, or changes compliance statuses.
6. The submit handler pushes data back via `PATCH /api/admin/resources/:id`.

### 3. Soft Delete and Restore
* **Soft Delete**: Clicking Delete (🗑️) prompts confirmation. On approval, the system triggers `DELETE /api/admin/resources/:id`, which sets `deleted_at = CURRENT_TIMESTAMP`. The item is hidden from public visitor feeds but remains visible in the admin trash listing.
* **Restore**: Clicking Restore (🔄) triggers `PATCH /api/admin/resources/:id/restore`, which sets `deleted_at = NULL`. The status is not automatically changed to published unless compliance checks allow.

---

## 🔗 Repeatable Link Mirrors

Dynamic repeatable rows allow admins to manage multiple mirrors for a single resource:
* **Required Columns**: Label, URL.
* **Link Types**: `official`, `download`, `github`, `documentation`, `demo`, `read_online`, `launch_tool`, `source`, `other`.
* **Rules**:
  1. Unsafe protocols (e.g. `javascript:`, `data:`, `file:`) are blocked on frontend input and validated by backend.
  2. Local IPs/hosts are flagged with visual notices in the dashboard.
  3. If a link is set to type `download` and the resource's legal review is not `approved`, a prominent disclaimer warn box appears.

---

## 🛡️ Compliance Guards

To maintain strict compliance with legal, licensing, and security rules:
* Unsafe, cracked, nulled, pirated software, malware, scams, or unverified streams are prohibited.
* The frontend disables the "Publish" button and displays a compliance warning box if Legal review is not Approved or Safety scan has warnings/unsafe markers.
* The backend enforces this rule at the API level (returning Bad Request `400` if a request attempts to publish an unverified or rejected resource).
