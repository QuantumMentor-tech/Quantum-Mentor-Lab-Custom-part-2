# 13 — Database Security Rules
## Quantum Mentor World | Quantum Mentor Official

---

## Overview

This document defines all database-level and application-level security rules for the `quantum_mentor_world` database. Every developer and AI agent working on this project must follow these rules.

---

## 1. Password Security

| Rule | Detail |
|---|---|
| Never store plain-text passwords | Always hash with `bcryptjs` (salt rounds ≥ 12) |
| Never log passwords | No console.log, no error messages containing passwords |
| Never select passwords without purpose | Only compare hash in auth flow — never return to client |
| Never store temporary passwords in DB | Use token-based password reset instead |
| Never expose `password_hash` via API | Strip from all API responses |

**Correct flow:**
```
User submits password → bcrypt.hash() → store password_hash → DONE
Login attempt → bcrypt.compare(plain, hash) → success/fail → JWT issued
```

---

## 2. JWT and Secret Security

| Rule | Detail |
|---|---|
| Never store JWT secret in DB | Keep in `backend/.env` only |
| Never store active JWT tokens in DB | Use stateless JWT — verify on each request |
| Never store API keys in `site_settings` | Keep all secrets in `.env` |
| Never expose JWT secret via API | Admin-only env — never returned to client |
| Set JWT expiry | Use `JWT_EXPIRES_IN=7d` in `.env` |

---

## 3. SQL Injection Prevention

| Rule | Detail |
|---|---|
| Always use parameterized queries | `db.query(sql, [params])` — NEVER string concatenation |
| Never build SQL with user input | `WHERE id = ${req.params.id}` → **FORBIDDEN** |
| Use `mysql2/promise` execute | `.execute()` uses prepared statements internally |
| Validate before querying | Validate type, length, and format of all inputs |

**Correct:**
```javascript
const rows = await query('SELECT * FROM resources WHERE slug = ?', [slug]);
```

**Forbidden:**
```javascript
const rows = await query(`SELECT * FROM resources WHERE slug = '${slug}'`); // ❌ SQL INJECTION RISK
```

---

## 4. URL Security Rules

All URLs stored in `resource_links.url`, `resource_details.*_url`, and `watch_servers.embed_url` must be validated before saving.

### Blocked protocols:
```
javascript:
data:
file:
ftp:
telnet:
blob:
vbscript:
```

### Blocked destinations:
```
localhost
127.0.0.1
0.0.0.0
192.168.x.x
10.x.x.x
172.16.x.x – 172.31.x.x
```

### Allowed protocols:
```
https://   (preferred)
http://    (allowed but flagged as lower trust)
```

### Validation function (pseudocode):
```javascript
function isSafeUrl(url) {
  const parsed = new URL(url);
  const blocked = ['javascript:', 'data:', 'file:', 'ftp:', 'blob:'];
  if (blocked.includes(parsed.protocol)) return false;
  if (/localhost|127\.0\.0\.1|192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\./.test(parsed.hostname)) return false;
  return true;
}
```

---

## 5. File Upload Security

Only image uploads are permitted in the MVP.

| Rule | Detail |
|---|---|
| Validate MIME type server-side | Never trust `Content-Type` header alone |
| Validate file extension | Must match MIME type |
| Rename uploaded files | Never use original filename — generate safe name |
| Store outside web root if possible | Serve through Express static only |
| Set max file size | 5 MB maximum |
| Block executable extensions | `.exe`, `.php`, `.sh`, `.bat`, `.js`, `.py`, `.rb` |
| Block archive types | `.zip`, `.tar`, `.rar` (unless explicitly enabled later) |

**Allowed MIME types:**
```
image/jpeg
image/jpg
image/png
image/webp
image/gif
```

**File rename pattern:**
```
qmw_<timestamp>_<random>.<ext>
```

---

## 6. Input Sanitization Rules

Apply to all text fields received from user or admin input before storing in DB.

| Input Type | Rule |
|---|---|
| HTML content | Strip all HTML tags (use `stripHtml()` utility) |
| URLs | Validate protocol and destination |
| Email addresses | Validate format with regex |
| Slugs | Only allow `[a-z0-9-]` characters |
| Numeric IDs | Parse as integer — reject if NaN |
| Enum values | Validate against allowed list |
| Names | Allow letters, spaces, hyphens — max 255 chars |
| Descriptions | Allow plain text — strip HTML |

---

## 7. Public API Exposure Rules

### Resources
Public API must ONLY return resources where ALL of these conditions are true:

```sql
WHERE status = 'published'
  AND legal_status = 'approved'
  AND safety_status = 'safe'
  AND visibility = 'public'
  AND deleted_at IS NULL
```

### Resource Links
Public API must ONLY return links where:

```sql
WHERE legal_status = 'approved'
  AND safety_status = 'safe'
  AND deleted_at IS NULL
```

### Watch Servers
Public API must ONLY return servers where:

```sql
WHERE legal_status = 'approved'
  AND safety_status = 'safe'
  AND deleted_at IS NULL
```

### Categories and Tags
Return all where `status = 'active' AND deleted_at IS NULL`.

### Strictly Admin-Only Tables (Never expose via public API):
- `users` (especially `password_hash`, `email`)
- `contact_messages`
- `resource_reports`
- `admin_activity_logs`
- `site_settings` where `is_public = 0`

---

## 8. Admin Authentication Rules

| Rule | Detail |
|---|---|
| Require JWT for all admin routes | `/api/admin/*` must verify JWT |
| Rate limit login endpoint | Max 10 attempts per 15 minutes |
| Log all login attempts | Record to `admin_activity_logs` |
| Log all sensitive actions | Create, update, delete, approve, reject, publish |
| JWT must include role | `{ id, role, username }` |
| Reject expired tokens | `jwt.verify()` will throw on expiry |
| Never issue guest JWT | Only authenticated admins get tokens |

---

## 9. Legal and Safety Enforcement Rules

All content must go through this workflow before becoming public:

```
Admin creates resource (status = 'draft')
  ↓
Admin submits for review (status = 'pending_review')
  ↓
Admin verifies legal status (legal_status = 'approved')
  ↓
Admin verifies safety (safety_status = 'safe')
  ↓
Admin publishes (status = 'published')
  ↓
Resource becomes visible to public
```

**Rejected content rules:**
- `legal_status = 'rejected'` → hidden from all public views
- `safety_status = 'unsafe'` → hidden from all public views
- `status = 'rejected'` → hidden from all public views
- `deleted_at IS NOT NULL` → excluded from all queries

**No exceptions.** Content must never bypass this workflow.

---

## 10. Soft Delete Rules

Soft delete protects against accidental permanent data loss.

| Table | Soft Delete Field | Hard Delete Allowed? |
|---|---|---|
| `users` | `deleted_at` | Admin-only |
| `resources` | `deleted_at` | After 30 days in trash (future) |
| `categories` | `deleted_at` | After verifying no resources |
| `tags` | `deleted_at` | After verifying no resources |
| `resource_links` | `deleted_at` | Allowed |
| `media` | `deleted_at` | After unlinking from resources |
| `watch_episodes` | `deleted_at` | Allowed |
| `watch_servers` | `deleted_at` | Allowed |
| `contact_messages` | `deleted_at` | Allowed after archiving |
| `resource_reports` | `deleted_at` | Allowed after resolving |
| `admin_activity_logs` | ❌ None | **Never hard-deleted** |

**All public queries must include:** `AND deleted_at IS NULL`

---

## 11. Admin Activity Log — What to Record

Every sensitive admin action must be logged to `admin_activity_logs`.

| Action | When to Log |
|---|---|
| `login` | Successful admin login |
| `logout` | Admin logout |
| `login_failed` | Failed login attempt |
| `create` | Resource, category, tag, or user created |
| `update` | Any field updated on tracked entities |
| `delete` | Soft or hard delete performed |
| `restore` | Soft-deleted record restored |
| `publish` | Resource published |
| `unpublish` | Resource unpublished |
| `approve` | Legal or safety status set to approved |
| `reject` | Legal or safety status set to rejected |
| `upload` | Media file uploaded |
| `settings_update` | Site setting changed |
| `password_change` | Admin password changed |

**What NOT to log:**
- `password_hash` values
- JWT tokens
- API keys
- Full message bodies (log reference ID only)

---

## 12. Contact and Report Data Protection

- Contact messages are stored but never exposed via public API
- Reporter IP addresses are stored for spam/abuse detection only
- Admin can view, reply, archive, and soft-delete messages
- No contact data is shared with third parties
- Reports can only be accessed by admin
- Spam entries should be soft-deleted after review

---

## 13. Database Backup Rules

| Rule | Detail |
|---|---|
| Regular backups | Export SQL dump weekly minimum |
| Pre-migration backup | Always backup before running new SQL |
| Backup storage | Store outside web root |
| Test restores | Verify backup can be restored |
| Never commit DB dumps | Add `*.sql` to `.gitignore` if containing real data |

---

*Document created: Step 4 — Quantum Mentor World Database Security Rules*
*Version: 1.0*
