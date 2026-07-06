# Admin Security & Validation Guide

This document outlines the security architecture, input validations, URL scanning rules, and role-based permissions implemented in the **Quantum Mentor World** administrative panel.

---

## 🛡️ Authentication and Access Controls

### 1. Token Verification
All administrative endpoints require a JSON Web Token (JWT) passed in the `Authorization` header:
```http
Authorization: Bearer <JWT_Token>
```
If a token is expired, tampered with, or missing, the API returns a `401 Unauthorized` error. The frontend automatically catches this code, clears session states, and redirects the user to `login.html`.

### 2. Role-Based Permissions (RBAC)
Administrative actions are protected by role clearance checks:
* **Admin**: Full read/write access on all assets, settings configurations, user logs, and soft deletes/restores.
* **Editor**: Can read and write resources/categories/tags, but cannot edit settings or delete/restore resource items.
* **Moderator**: Can view dashboard stats, change resource legal and safety statuses, but cannot edit basic resource descriptions, settings, or delete assets.
* **User**: Blocked from all `/api/admin` routes.

---

## 📋 Input and Data Validation

### 1. Safe URL Protocols
Both the frontend and the backend screen URLs to block malicious protocols:
* **Blocked Protocols**: `javascript:`, `data:`, `file:`, `ftp:`, `vbscript:`.
* **Blocked Hosts**: Localhost IP boundaries (`127.0.0.1`, `0.0.0.0`, `192.168.x.x`, `10.x.x.x`) are blocked on production configurations or flagged with warnings in the dashboard.
If an administrator attempts to save a resource with an unsafe URL protocol in any spec field or repeatable link row, the backend validation returns a `400 Bad Request` rejection.

### 2. Mandatory Fields and Enums
* Backend validates all fields against strict whitelist enums:
  * Resource types: `software`, `book`, `tool`, `game`, `theme_plugin`, `watch`, `news`, `github_repo`.
  * Status: `draft`, `pending_review`, `published`, `rejected`, `archived`.
  * Legal status: `pending`, `approved`, `rejected`.
  * Safety status: `unchecked`, `safe`, `warning`, `unsafe`.
  * Source types, Access types, and setting keys are whitelisted.

---

## 📝 Activity Auditing Logs

All administrative mutations are recorded inside the `admin_activity_logs` table for security audit reviews:
* **Logged Fields**: User ID, action identifier (e.g. `resource_create`, `settings_update`, `resource_delete`), entity type, entity ID, action description, IP address, and user agent.
* **Secrets Filtering**: Passwords, login tokens, secret configuration variables, and API keys are **never** logged to the database or written to terminal console logs.
