# 36 — Media Upload Guide
## Quantum Mentor World | Quantum Mentor Official

---

## 1. Purpose of Media Upload
The Media Upload module provides administrators, editors, and moderators with the ability to upload safe cover images and screenshots for resource detail pages. This ensures the website remains visually engaging and informative while enforcing strict safety guards against malicious uploads.

---

## 2. File and Size Limits
* **Maximum Allowed Size:** 5 Megabytes (5,242,880 bytes).
* **Allowed MIME Types:**
  * `image/jpeg`
  * `image/jpg`
  * `image/png`
  * `image/webp`
  * `image/gif`
* **Allowed Suffix Extensions:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`.
* **Strictly Blocked Extensions:** `.exe`, `.bat`, `.cmd`, `.sh`, `.php`, `.js`, `.html`, `.htm`, `.svg`, `.zip`, `.rar`, `.7z`, `.msi`, `.dll`, `.scr`, `.jar` (to prevent XSS, script injection, and remote code execution).

---

## 3. Backend Endpoints (Protected by JWT and Roles)

All media management endpoints are protected by `protect` and `requireRole(['admin', 'editor', 'moderator'])`.

### `POST /api/media/upload`
Uploads a single image. Expects multipart form payload with file field named `image`.
* **Payload:**
  * `image`: Binary file payload
  * `alt_text` (optional): string
  * `caption` (optional): string
* **Response Example:**
  ```json
  {
    "success": true,
    "message": "Image uploaded successfully.",
    "data": {
      "id": 15,
      "file_name": "qmw_1719280000000_123456.png",
      "file_url": "http://localhost:5000/api/uploads/images/qmw_1719280000000_123456.png",
      "mime_type": "image/png",
      "file_size": 10240,
      "alt_text": "Blender Cover",
      "caption": "Blender 4.0 Interface mockup"
    }
  }
  ```

### `GET /api/media`
Returns a paginated list of active uploaded media assets.
* **Query Params:** `limit` (default: 24), `offset` (default: 0).

### `GET /api/media/:id`
Retrieves details of a single media record by ID.

### `PATCH /api/media/:id`
Updates `alt_text` and `caption` fields.
* **Payload:** `{ "alt_text": "New Alt", "caption": "New Caption" }`

### `DELETE /api/media/:id`
Soft deletes a media file. (Sets `deleted_at = CURRENT_TIMESTAMP`).

---

## 4. Frontend Workflows

### Admin Media Library Page (`media.html`)
1. Browse to **Media** in the sidebar.
2. Select or drag-and-drop an image. Write an Optional Alt text/caption.
3. Click **Upload Image**. The grid refreshes automatically.
4. Hover card icons let you:
  * **🔗 Copy Link:** Copies file URL to the clipboard.
  * **✏️ Edit Details:** Opens modal to change alt/caption.
  * **🗑️ Delete:** Triggers a confirm modal to soft-delete.

### Resource Form Media Picker Overlay (`media-picker.js`)
Inside Add/Edit Resource forms:
1. Locate the **Featured Image URL** input.
2. Click the **📁 Choose** button.
3. A modal pops up showing a grid of all images in the Media Library.
4. Click any image. Its safe public URL is automatically populated in the Featured Image field.

---

## 5. Testing Checklist
- [x] Verify calling `/api/media` without a JWT returns `401 Unauthorized`.
- [x] Verify uploading a `.exe` or `.php` file returns `400 Bad Request`.
- [x] Verify uploading a file larger than 5MB returns `400 Bad Request`.
- [x] Verify copying image URL copies the HTTP absolute link.
- [x] Verify deletion performs a soft-delete (image remains in uploads directory but disappears from dashboard lists).
