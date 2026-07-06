# 37 — Contact Messages Guide
## Quantum Mentor World | Quantum Mentor Official

---

## 1. Purpose of the Contact Form
The Contact Form allows public users to reach out to the Quantum Mentor World administrative team regarding resource suggestions, legal inquiries, questions, or general suggestions.

---

## 2. API Specifications

### Public Endpoints

#### `POST /api/contact`
Submits a contact message. Does **not** require authentication.
* **Payload Validation:**
  * `full_name`: Required, non-empty.
  * `email`: Required, valid email format.
  * `subject`: Required, non-empty.
  * `message`: Required, non-empty, max 5000 characters.
* **Rate Limits:** Restricted to **5 submissions per 15 minutes per IP**. If exceeded, returns:
  ```json
  { "success": false, "message": "Too many requests. Please try again later." }
  ```

---

### Admin Endpoints (Protected by JWT and Roles)

All admin contact endpoints require `protect` and `requireRole(['admin', 'editor', 'moderator'])`.

#### `GET /api/contact/admin/messages`
Lists messages. Supports query filters: `status` ('new', 'read', 'replied', 'archived', 'spam'), `search` (keyword name/email/subject), `limit`, and `offset`.

#### `GET /api/contact/admin/messages/:id`
Retrieves a single message, including the full message body text, sender IP, and User Agent header.

#### `PATCH /api/contact/admin/messages/:id/status`
Updates status.
* **Payload:** `{ "status": "read" }`
* **Allowed Statuses:** `new`, `read`, `replied`, `archived`, `spam`.

#### `DELETE /api/contact/admin/messages/:id`
Soft-deletes a contact message record. (Sets `deleted_at = CURRENT_TIMESTAMP`).

---

## 3. Frontend Workflows

### Public Contact Page (`contact.html`)
* Standard form with name, email, subject, message input areas.
* Uses `assets/js/contact.js` to run frontend validation.
* Displays success alert overlays and clears the form inputs upon completion.
* Includes a legal disclaimer detailing how personal name/email data is stored and utilized.

### Admin Inbox Page (`contact-messages.html`)
* Located under **Contact Messages** in the sidebar drawer.
* Renders a table of messages showing sender Name, Email, Subject, Status badge, and Date.
* Offers inline view `👁️` details overlay showing message body, user agent strings, and IP address.
* Automatically transitions status from `new` to `read` on open.
* Provides a status dropdown select to mark as Replied, Archived, or Spam.
* Trash icon triggers a confirmation popup to soft-delete the row.

---

## 4. Testing Checklist
- [x] Submit contact message with invalid email; verify validation error.
- [x] Submit contact message exceeding 5000 chars; verify size validation rejection.
- [x] Verify calling `GET /api/contact/admin/messages` without authorization token returns `401`.
- [x] Trigger submissions 6 times in a row; verify the 6th returns `Too many requests` rate limit warning.
- [x] Check user activity log after marking a message status to confirm the `contact_status_update` is written.
