# 27 — Pagination and Sorting Guide
## Quantum Mentor World | Quantum Mentor Official

---

## 1. Overview

To maintain fast load times and a premium user experience, directories of **Quantum Mentor World** paginate all listings and searches. Sorting choices allow users to rearrange items dynamically based on creation date, popularity, or alphabetical order.

---

## 2. Dynamic Sorting Logic

Sorting parameters are captured by the backend REST APIs and mapped directly to SQL `ORDER BY` configurations.

### Sorting Options Mapping:
* **`latest` (Default):** `ORDER BY r.created_at DESC`
* **`oldest`:** `ORDER BY r.created_at ASC`
* **`title_asc`:** `ORDER BY r.title ASC`
* **`title_desc`:** `ORDER BY r.title DESC`
* **`popular`:** `ORDER BY r.clicks DESC, r.created_at DESC`

### Query Validator:
To ensure security, the sort parameter is validated against a white-list before being used in SQL generation. Invalid sort values fallback automatically to `latest` to prevent SQL injection or structural runtime exceptions.

---

## 3. Database Pagination Plan

Pagination is implemented using the standard `LIMIT` and `OFFSET` syntax, calculated safely using parameter math.

### Calculation Formulas:
For any requested `page` (1-indexed) and `limit`:
* **`LIMIT`** = `limit`
* **`OFFSET`** = `(page - 1) * limit`

### Dual-Query Approach:
To calculate meta details, the backend performs two queries or a combined count structure:
1. **Total Count Query:** Returns the total number of approved public resources matching the active filters.
   ```sql
   SELECT COUNT(*) AS total FROM resources r WHERE ...
   ```
2. **Paginated Data Query:** Returns only the current slice of records for the active page.
   ```sql
   SELECT r.* FROM resources r WHERE ... ORDER BY ... LIMIT ? OFFSET ?
   ```

### Metadata Response standard:
All paginated API endpoints return a unified payload structure:
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 142,
    "page": 1,
    "limit": 12,
    "totalPages": 12
  }
}
```

---

## 4. Frontend Pagination Renderer (`pagination.js`)

The client-side pager ([pagination.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/assets/js/pagination.js)) consumes the backend's metadata object and renders interactive controls.

### Design Features:
* **Responsive Numeric Range:** Displays neighboring page numbers relative to the active page.
* **Ellipsis Handling:** Automatically places a non-clickable ellipsis `...` separator if the total number of pages exceeds 5, preserving clean screen space:
  * Example: `[1] [2] [3] ... [12]`
* **Next and Previous Arrows:** Renders `‹` and `›` controls. Disables them automatically on the first and last page respectively.
* **Callback Interception:** When a page button is clicked, a custom page change handler updates the URL parameter `?page=N`, triggers a smooth scroll to the top of the resource grid, and fetches the next page's resources asynchronously.
