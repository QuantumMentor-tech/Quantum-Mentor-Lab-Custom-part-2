# 21 — Model Layer Guide
## Quantum Mentor World | Quantum Mentor Official

---

## Overview

The Model Layer acts as the abstraction layer separating Express HTTP controller route handling from SQL database execution. In **Quantum Mentor World**, all raw SQL queries are written inside models (`backend/models/`) and use parameterized placeholders (`?`) to ensure maximum safety.

```text
Request Pipeline:
Route Config ---> Controller Action ---> Database Model ---> DB Connection Pool
```

---

## 1. SQL Security and Parameterization Rules

> [!CAUTION]
> **No String Concatenation in SQL:**
> Under no circumstances should user input be concatenated directly into SQL query strings. Doing so exposes the database to SQL injection attacks.

### Bad Pattern
```javascript
const sql = `SELECT * FROM resources WHERE title LIKE '%${req.query.q}%'`;
```

### Safe Pattern
```javascript
const keyword = `%${req.query.q}%`;
const sql = 'SELECT * FROM resources WHERE title LIKE ?';
const rows = await query(sql, [keyword]);
```

### Safety Rules
1. **Always Use Placeholders (`?`):** Pass variables separately in the params array.
2. **Whitelist Sort Keys & Types:** Check variables like sort parameters and enum classifications against hardcoded lists of approved values before executing SQL statements.
3. **Limit Pagination Bounds:** Default limits and parse parameters to ensure requests do not exceed maximum bounds.

---

## 2. Safe Public Resource Logic

To keep draft, archived, rejected, private, or soft-deleted resources protected, every resource model query must include this condition (imported from `backend/utils/constants.js`):

```sql
resources.status = 'published'
AND resources.visibility = 'public'
AND resources.legal_status = 'approved'
AND resources.safety_status IN ('safe', 'warning')
AND resources.deleted_at IS NULL
```

If a category or tag query is executed, it must enforce:
```sql
status = 'active' AND deleted_at IS NULL
```

---

## 3. Query Filtering and Pagination Architecture

### Pagination (`backend/utils/pagination.js`)
* `getPaginationParams(query)` extracts numeric offsets. Prevents offsets from dropping below `0` and caps maximum limit to `50`.
* `getPaginationMeta(total, page, limit)` returns structural metadata details showing total pages, limits, and records count.

### Query Building (`backend/utils/queryBuilder.js`)
* `buildResourceFilters(query)` maps request criteria (category, tags, access status, etc.) dynamically, resolving inner joins and appending parameterized array arguments.
* `buildSortClause(sort)` translates sort keys safely to raw `ORDER BY` structures.

---

## 4. How to Add New Model Functions Later

To append a new lookup query:
1. Declare the asynchronous function inside the model file (e.g. `backend/models/resource.model.js`).
2. Construct the SQL query with placeholders.
3. Call `const rows = await query(sql, params);`.
4. Export the function at the bottom of the file.
5. Invoke the function in the controllers module.

---

## 5. Common Errors and Fixes

### Error: "Cannot add/read property of undefined"
* **Cause:** The model is not exported properly, or the require path in the controller is incorrect.
* **Fix:** Check `module.exports` at the bottom of the model file and verify relative paths.

### Error: "Column 'id' in field list is ambiguous"
* **Cause:** Joining multiple tables that both have `id` columns without prefixing table names (e.g. `SELECT id` instead of `SELECT resources.id`).
* **Fix:** Always write columns with explicit table name references when joining tables (e.g. `resources.id`, `c.name`).

### Error: "ER_BAD_FIELD_ERROR"
* **Cause:** Typo in columns selection, or columns in query mismatch columns declared in MySQL tables schema.
* **Fix:** Review schema definitions inside `database/quantum_mentor_world.sql`.
