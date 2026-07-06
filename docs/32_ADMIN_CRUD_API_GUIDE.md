# Admin CRUD API Reference Guide

This document describes the administrative REST endpoints available for the **Quantum Mentor World** platform. All routes require Bearer token authentication and roles verification.

---

## Authentication & Route Configuration

All admin routes are mounted under `/api/admin` and require JWT verification:

```javascript
const { protect } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/admin.middleware');

router.use(protect);
router.use(requireRole(['admin', 'editor', 'moderator']));
```

Include the following header on all requests:
```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

## Endpoints Directory

### 1. Statistics Overview
* **GET** `/api/admin/overview`
  * **Role**: Admin, Editor, Moderator
  * **Description**: Returns quick metrics for dashboard widgets (Total resources, pending reviews, categories, tags count).

### 2. Resource Management
* **GET** `/api/admin/resources`
  * **Query Params**: `page`, `limit`, `q`, `resource_type`, `status`, `legal_status`, `safety_status`, `sort`, `show_deleted`
  * **Description**: Returns paginated list of all resources, including draft, private, or soft-deleted items.
* **GET** `/api/admin/resources/:id`
  * **Description**: Returns full configuration for a single resource (details, links, categories, tags).
* **POST** `/api/admin/resources`
  * **Description**: Inserts a new resource, detailed specifications, tags, categories, and link mirrors in a database transaction.
* **PATCH** `/api/admin/resources/:id`
  * **Description**: Updates resource configurations.
* **DELETE** `/api/admin/resources/:id`
  * **Description**: Soft deletes a resource (`deleted_at = CURRENT_TIMESTAMP`).
* **PATCH** `/api/admin/resources/:id/restore`
  * **Description**: Removes the soft-delete timestamp.
* **PATCH** `/api/admin/resources/:id/status`
  * **Body**: `{ "status": "published"|"draft"|"pending_review"|"rejected"|"archived" }`
  * **Description**: Updates resource publication status. Unsafe or pending review items cannot be set to `published`.
* **PATCH** `/api/admin/resources/:id/feature`
  * **Body**: `{ "is_featured": true|false }`
* **PATCH** `/api/admin/resources/:id/trending`
  * **Body**: `{ "is_trending": true|false }`

### 3. Categories Management
* **GET** `/api/admin/categories`
* **POST** `/api/admin/categories`
  * **Body**: `{ "name", "slug", "icon", "description", "status" }`
* **PATCH** `/api/admin/categories/:id`
* **DELETE** `/api/admin/categories/:id`

### 4. Tags Management
* **GET** `/api/admin/tags`
* **POST** `/api/admin/tags`
  * **Body**: `{ "name", "slug", "description" }`
* **PATCH** `/api/admin/tags/:id`
* **DELETE** `/api/admin/tags/:id`

### 5. Settings Configuration
* **GET** `/api/admin/settings`
* **PATCH** `/api/admin/settings`
  * **Description**: Saves site-wide settings. Secret keys are blocked.

---

## Response Formats

### Successful Response
All successful responses return HTTP status `200` (or `201` for creation) and standard JSON structure:
```json
{
  "success": true,
  "message": "Resource created successfully.",
  "data": {
    "id": 17
  }
}
```

### Error Response
Errors return appropriate HTTP status codes (e.g. `400` Bad Request, `401` Unauthorized, `403` Forbidden, `404` Not Found, `500` Internal Server Error):
```json
{
  "success": false,
  "message": "Publishing is blocked. Legal status must be approved first.",
  "data": null
}
```
