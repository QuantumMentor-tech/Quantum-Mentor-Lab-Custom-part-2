# Environment Variables Configuration Guide — Quantum Mentor World

This document serves as a comprehensive reference guide to managing the environment variables for **Quantum Mentor World**.

---

## 1. Environment Variable Schema

The backend uses a central configuration file [env.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/backend/config/env.js) to validate keys parsed from `.env`. The following parameters are configured on production servers:

| Variable Name | Required Value/Format | Purpose |
|---|---|---|
| **NODE_ENV** | `production` | Enforces production-safe security headers, compression, and error-masking behaviors. |
| **PORT** | `5000` | Port where the Express listener binds. |
| **DB_HOST** | Host IP / URL | Address of your hosted MySQL database. |
| **DB_PORT** | `3306` | MySQL port. |
| **DB_NAME** | Database name | target MySQL database name. |
| **DB_USER** | DB operator name | Privileged database user. |
| **DB_PASSWORD** | Strong password | Password for the database user. |
| **JWT_SECRET** | High-entropy string | Key used to sign user authentication cookies/tokens. |
| **JWT_EXPIRES_IN** | `7d` | Login token validity duration. |
| **FRONTEND_URL** | `https://your-domain.com` | Base domain of your user interface. |
| **ALLOWED_ORIGINS** | `https://your-domain.com,https://www.your-domain.com` | CORS whitelist parameters. |
| **UPLOAD_DIR** | `uploads` | Media library disk upload destination directory. |
| **MAX_UPLOAD_SIZE_MB** | `5` | File size limits (MB) per uploaded screenshot. |

---

## 2. Hardening Best Practices

* **Excluding Secrets:** Never commit the `.env` file to public code repositories. Validate that `.env` is listed inside [gitignore](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/.gitignore).
* **JWT Secret:** In production, do not use weak strings. Keep it longer than 32 characters, using mixed casing, digits, and special characters. The backend process will reject start attempts if weak keys are detected.
* **Origins:** Ensure CORS whitelists list the exact public domain of the user interface. Do not allow wildcards `*` or local endpoints in production.
