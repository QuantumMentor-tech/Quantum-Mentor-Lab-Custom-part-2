# Final Deployment Guide — Quantum Mentor World

This document serves as the primary checklist to configure and deploy **Quantum Mentor World** user interfaces and server engines.

---

## 1. Frontend Static Deployments
* The public directory is the [frontend/](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend) folder.
* Serve these static files on your hosting server or CDN (e.g. Cloudflare Pages, Netlify, Vercel).
* Update [config.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/assets/js/config.js) to configure the API base URL to target the live server URL.

---

## 2. Backend Express API Deployments
* Run production installs:
  ```bash
  cd backend
  npm install --production
  ```
* Set up a process manager (such as PM2) to monitor and restart the Node.js server.
* Mount a reverse proxy (e.g. Nginx) to bind traffic requests to port `5000` and handle SSL certificate validations.

---

## 3. Deployment Check Commands
Verify server configurations and dependencies before launching:
```bash
# Verify environment variable values
npm run check:env

# Audit database structures and tables
npm run check:db

# Run preflight checks
npm run prelaunch
```
Refer to [FRONTEND_DEPLOYMENT_GUIDE.md](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/deployment/FRONTEND_DEPLOYMENT_GUIDE.md) and [BACKEND_DEPLOYMENT_GUIDE.md](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/deployment/BACKEND_DEPLOYMENT_GUIDE.md) for step-by-step setup details.
