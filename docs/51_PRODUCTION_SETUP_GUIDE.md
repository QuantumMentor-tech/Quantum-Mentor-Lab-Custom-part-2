# Production Environments Configuration Guide — Quantum Mentor World

This document maps out production configuration schemas, secret keys protection, and whitelisting.

---

## 1. Production Environment Variables (.env)
Use [.env.production.example](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/backend/.env.production.example) to configure environment variables.
Ensure the following settings are configured on your production server:
* `NODE_ENV=production`
* `PORT=5000`
* Hosted MySQL credentials (`DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`).

---

## 2. Security Hardening Configurations
* **JWT Secret:** Configure `JWT_SECRET` with a unique, high-entropy string (minimum 32 characters). The backend will refuse to start if weak placeholders are used.
* **CORS Whitelist:** Configure `ALLOWED_ORIGINS` to contain only the final deployed domain names (e.g. `https://quantummentor.world`). Do not use wildcards (`*`) or local endpoints in production.
* **Storage Folder:** Set the uploads directory to a persistent storage location so that uploaded media files are not lost when the server container restarts.
* **Error Handling:** Unhandled exceptions filter database structures and stack-traces to prevent data leakage in production.

Refer to [ENVIRONMENT_VARIABLES_GUIDE.md](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/deployment/ENVIRONMENT_VARIABLES_GUIDE.md) and [PRODUCTION_SECURITY_GUIDE.md](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/deployment/PRODUCTION_SECURITY_GUIDE.md) for more details.
