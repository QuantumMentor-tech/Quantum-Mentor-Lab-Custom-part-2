# 29 — Authentication Security Rules
## Quantum Mentor World | Quantum Mentor Official

---

## 1. Overview

Administrative security on **Quantum Mentor World** is managed using defense-in-depth principles. The implementation incorporates strict input constraints, rate limiters, cryptographically sound token validation, and explicit role restrictions to prevent unauthorized access.

---

## 2. Password Hashing Rules

1. **One-Way Hashing:** Under no circumstances are plaintext admin passwords stored inside the MySQL database.
2. **Bcrypt Cryptography:** All passwords must be salted and hashed using `bcryptjs` with a work factor (salt rounds) of 10.
3. **Verification Isolation:** Credentials are evaluated using secure, timing-attack-resistant comparison:
   ```javascript
   bcrypt.compare(plainTextPassword, hashedPasswordFromDb)
   ```
4. **No Handoff:** Under no circumstances are password hashes returned in API response envelopes or stored in frontend browser session tokens.

---

## 3. JWT Security Rules

1. **Minimal Payload:** The generated JWT contains only the minimum required identification parameters:
   ```json
   {
     "id": 1,
     "email": "admin@quantummentor.local",
     "role": "admin"
   }
   ```
   *Secrets, database keys, or status flags are never embedded in the token payload.*
2. **Key Protection:** The token signature uses `env.jwt.secret` (loaded securely from `backend/.env`). This secret key is never logged to standard outputs or returned to client queries.
3. **Expiration Constraints:** Tokens automatically expire after the configured interval (e.g. `7d`), forcing session re-verification.

---

## 4. Login Attempt Protections

To block brute-force or dictionary attacks:
1. **Generic Failures:** If login fails, the response returns the generic string: `Invalid email or password.` It never indicates whether the email address exists in the database.
2. **Strict Rate Limiting:** Mapped routes are protected by a strict rate limiter ([rate-limit.middleware.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/backend/middleware/rate-limit.middleware.js)) restricting attempts to **10 requests per 15 minutes** per IP address.

---

## 5. Role and Status Enforcements

1. **Privilege Whitelist:** Only administrative roles (`admin`, `editor`, `moderator`) can pass the auth controller filters. Normal `user` roles are immediately rejected.
2. **Status Active Checks:** Authenticated requests check that `users.status === 'active'`. Inactive or suspended administrators are blocked immediately, even if they present a valid token signature.
3. **Endpoint Defense:** All modifying routes are wrapped with `protect` and `requireRole(['admin', 'editor', 'moderator'])`. Frontend protection acts only as a UX guard; database security is strictly enforced on the server-side.

---

## 6. Production Security Recommendations

The current implementation serves as a secure MVP. Before deploying to production, the following updates are recommended:
1. **HTTP-Only Cookies:** Shift token storage from `sessionStorage` to HTTP-Only secure cookies to completely mitigate Cross-Site Scripting (XSS) session stealing attacks.
2. **HTTPS Enforcement:** Enforce strict Transport Layer Security (TLS/HTTPS) across all API routes to prevent token intercepting on insecure networks.
3. **Account Lockout:** Implement a login failure counter inside the database to lock accounts temporarily after 5 sequential failures.
