# 28 — Admin Authentication Guide
## Quantum Mentor World | Quantum Mentor Official

---

## 1. Purpose of Admin Authentication

To protect the directories and system dashboards from unauthorized manipulation, all administrative views and write endpoints are protected by a secure JSON Web Token (JWT) authentication system. Administrators, editors, and moderators can authenticate using their registered emails and verify their active status.

---

## 2. API Endpoints

### A. Login Endpoint
* **Route:** `POST /api/auth/login`
* **Access:** Public (Rate limited to 10 attempts per 15 minutes per IP)
* **Request Body:**
  ```json
  {
    "email": "admin@quantummentor.local",
    "password": "Admin@12345"
  }
  ```
* **Success Payload (HTTP 200):**
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "full_name": "Local Admin",
        "username": "admin",
        "email": "admin@quantummentor.local",
        "role": "admin",
        "status": "active"
      }
    }
  }
  ```
* **Failure Payload (HTTP 401):**
  ```json
  {
    "success": false,
    "message": "Invalid email or password."
  }
  ```

### B. Fetch Profile Endpoint
* **Route:** `GET /api/auth/me`
* **Access:** Private (Valid Bearer JWT token required)
* **Headers:** `Authorization: Bearer <TOKEN>`
* **Success Payload (HTTP 200):**
  ```json
  {
    "success": true,
    "message": "Current user fetched successfully.",
    "data": {
      "user": {
        "id": 1,
        "full_name": "Local Admin",
        "username": "admin",
        "email": "admin@quantummentor.local",
        "role": "admin",
        "status": "active"
      }
    }
  }
  ```

### C. Logout Endpoint
* **Route:** `POST /api/auth/logout`
* **Access:** Private (Valid Bearer JWT token required)
* **Headers:** `Authorization: Bearer <TOKEN>`
* **Success Payload (HTTP 200):**
  ```json
  {
    "success": true,
    "message": "Logout successful."
  }
  ```

---

## 3. JWT Flow & Session Lifecycle

1. **Authentication:** The client submits plaintext email and password via `POST /api/auth/login`.
2. **Verification & Hashing:** The backend queries the user by email, validates the hash via bcrypt, and returns a JWT if valid.
3. **Session Capture:** The frontend client parses the JSON response and stores the `token` and `user` payload keys inside browser `sessionStorage`.
4. **Guarding Layouts:** Every protected admin page executes `AdminAuth.requireAdminPage()` immediately in the `<head>` of the DOM. This method performs a synchronized check against the `GET /api/auth/me` profile endpoint.
5. **Session Destruction:** Clicking the Logout link invokes `AdminAuth.logoutAdmin()`, which clears `sessionStorage` keys and forces a redirection back to `login.html`.

---

## 4. Protected Routes & Layouts

### Protected Backend Prefix:
All diagnostic or manipulation endpoints mapped under `/api/admin` or auth profile routes are protected by the `protect` middleware ([auth.middleware.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/backend/middleware/auth.middleware.js)) and role restrictions `requireRole` ([admin.middleware.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/backend/middleware/admin.middleware.js)).

### Protected Frontend Pages:
* [login.html](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/admin/login.html) (Auto-redirects to dashboard if already authenticated)
* [dashboard.html](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/admin/dashboard.html)
* [resources.html](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/admin/resources.html)
* [add-resource.html](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/admin/add-resource.html)
* [edit-resource.html](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/admin/edit-resource.html)
* [categories.html](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/admin/categories.html)
* [tags.html](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/admin/tags.html)
* [media.html](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/admin/media.html)
* [settings.html](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/admin/settings.html)

---

## 5. Local Demo Admin Account

Use the seeded admin parameters to authenticate local testing sessions:
* **Email:** `admin@quantummentor.local`
* **Password:** `Admin@12345`
* **Role:** `admin`
* **Status:** `active`

### Troubleshooting Login issues:
1. **API Connection Failure:** Confirm the backend server is active on `http://localhost:5000` (`npm run dev`).
2. **Incorrect Credentials:** Confirm the `users` table contains the matching bcrypt hash for `Admin@12345`. You can re-generate the hash using `npm run hash:password` inside the `backend` folder and update phpMyAdmin manually.
