# 19 — API Response Standards
## Quantum Mentor World | Quantum Mentor Official

---

## Standard JSON Response Structures

To ensure the client frontend integrates cleanly and processes payloads predictably, all backend API controllers must utilize the helper functions defined in `backend/utils/response.js`.

### 1. Success Response Structure (`sendSuccess`)
Every successful HTTP request (status code 200, 201, etc.) must return:
```json
{
  "success": true,
  "message": "Request completed successfully.",
  "data": {
    "key": "value"
  }
}
```
* **`success`** (boolean): Always `true` for success.
* **`message`** (string): User-friendly, concise summary of the action.
* **`data`** (any, optional): Payload object or array. Null if no payload is returned.

### 2. Error Response Structure (`sendError`)
Every request failure (status code 4xx, 5xx) must return:
```json
{
  "success": false,
  "message": "Description of the error."
}
```
* **`success`** (boolean): Always `false` for errors.
* **`message`** (string): Concise summary explaining the failure.
* **`errors`** (array, optional): Present if there are nested details (such as input validation failures).

---

## Detailed Formatting Specifications

### Input Validation Error Payload
When validation fails, return status `422 Unprocessable Entity` with details:
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "type": "field",
      "value": "invalid-email-format",
      "msg": "Invalid email address format.",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### Pagination Metadata Format
For resource listings, include a `meta` block:
```json
{
  "success": true,
  "message": "Resources loaded successfully.",
  "data": [
    { "id": 1, "title": "Resource Title" }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "totalPages": 9
  }
}
```

---

## API Endpoint Standard Examples

### GET `/api`
```json
{
  "success": true,
  "message": "Welcome to Quantum Mentor World API.",
  "data": {
    "version": "1.0.0",
    "status": "running"
  }
}
```

### GET `/api/health`
```json
{
  "success": true,
  "message": "Quantum Mentor World API is running.",
  "data": {
    "project": "Quantum Mentor World",
    "brand": "Quantum Mentor Official",
    "environment": "development",
    "timestamp": "2026-06-25T03:03:55.123Z"
  }
}
```

### GET `/api/health/database`
```json
{
  "success": true,
  "message": "Database connection is healthy.",
  "data": {
    "connected": true,
    "database": "quantum_mentor_world",
    "tableCount": 15
  }
}
```

---

## Security Response Rules

> [!CAUTION]
> **No Sensitive Leaks:**
> * Never include user passwords, password hashes, secrets, JWT tokens, or DB configurations in logs or API responses.
> * Never return raw JavaScript or MySQL/MariaDB error messages to the frontend.
> * Global error handling must redact stack traces when `NODE_ENV=production`.
