# 38 — Resource Reports Guide
## Quantum Mentor World | Quantum Mentor Official

---

## 1. Purpose of Resource Reports
The Reports system allows public users to report issues with links or directories (e.g. broken downloads, redirection to unsafe sites, wrong information, or copyright issues). This crowdsources quality control, keeping content accurate and verified.

---

## 2. API Specifications

### Public Endpoints

#### `POST /api/reports`
Submits a link report. Does **not** require login.
* **Payload Validation:**
  * `resource_id`: Required, valid number.
  * `link_id` (optional): Valid number if provided.
  * `report_type`: Required. Allowed values: `broken_link`, `unsafe_link`, `copyright_issue`, `wrong_information`, `other`.
  * `reporter_name` (optional): string.
  * `reporter_email` (optional): Valid email if provided.
  * `message`: Required, non-empty.
* **Rate Limits:** Restricted to **10 reports per 15 minutes per IP**.

---

### Admin Endpoints (Protected by JWT and Roles)

All admin report endpoints require `protect` and `requireRole(['admin', 'editor', 'moderator'])`.

#### `GET /api/reports/admin`
Lists submitted reports. Supports query filters: `status` ('new', 'reviewing', 'resolved', 'rejected', 'spam'), `report_type`, `limit`, and `offset`.

#### `GET /api/reports/admin/:id`
Retrieves single report details, including resource title, links references, reporter email, IP address, and date.

#### `PATCH /api/reports/admin/:id/status`
Updates status.
* **Payload:** `{ "status": "resolved" }`
* **Allowed Statuses:** `new`, `reviewing`, `resolved`, `rejected`, `spam`.

#### `DELETE /api/reports/admin/:id`
Soft-deletes a report record. (Sets `deleted_at = CURRENT_TIMESTAMP`).

---

## 3. Frontend Workflows

### Public Report Button & Modal (`resource-detail.html`)
* Located on the resource detail page sidebar.
* Clicking **Report Broken / Unsafe Link** opens a dialog modal.
* The modal automatically captures the current resource ID.
* User chooses report type, enters optional details, and submits.
* Confirms success and automatically closes modal after 1.5 seconds.

### Admin Reports Page (`reports.html`)
* Managed under **Reports** in the sidebar.
* Lists reports with Resource Title, Type, Reporter, Status, and Date.
* Offers inline view `👁️` overlay showing description text and IP address.
* Automatically transitions status from `new` to `reviewing` on open.
* Provides a status dropdown to mark as Resolved, Rejected, or Spam.
* provides confirm soft delete.

---

## 4. Safety Workflows
If an admin resolves an `unsafe_link` report:
1. They should inspect the reported link immediately.
2. Edit the link in the resource editor: set safety status to `unsafe` or delete the link.
3. Once corrected, mark the report status as `resolved`.

---

## 5. Testing Checklist
- [x] Submit report with missing resource_id; verify `400` error.
- [x] Submit report with invalid reporter email format; verify validation rejection.
- [x] Verify calling `GET /api/reports/admin` returns `401` if unauthenticated.
- [x] Check user activity log after marking a report status to confirm `report_status_update` is logged.
