# Backend Deployment Guide — Quantum Mentor World

This document outlines the procedure to install, configure, and manage the Express.js backend API on a production Node.js server.

---

## 1. Prerequisites
* **Runtime:** Node.js v18.0.0 or higher.
* **Database:** MySQL / MariaDB (hosted instance, do NOT run local XAMPP on production servers).
* **Reverse Proxy:** Recommended to place the API behind a reverse proxy (e.g. Nginx, Apache, or Cloudflare Tunnel) to handle HTTPS certificates termination.

---

## 2. Server Installation Commands

Navigate to the [backend/](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/backend) directory on your target host and install production-only dependencies:

```bash
# 1. Install dependencies, excluding devDependencies (like nodemon)
npm install --production

# 2. Check configuration variables sanity
npm run check:env

# 3. Audit database connectivity and structures
npm run check:db

# 4. Run preflight launch tests
npm run prelaunch

# 5. Start the production server process
npm start
```

---

## 3. Process Management (PM2)

To keep the Express app running continuously, restart on crashes, and boot on system restarts, it is recommended to use a process manager like **PM2**:

```bash
# Install PM2 globally
npm install -g pm2

# Start the application server
pm2 start server.js --name "quantum-mentor-backend"

# Ensure PM2 starts on system boot
pm2 startup
pm2 save
```

---

## 4. Reverse Proxy Mapping (Nginx Example)

Configure Nginx to route external requests safely to the local Node process (port 5000) and proxy connection headers:

```nginx
server {
    listen 80;
    server_name api.quantummentor.world;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
> [!IMPORTANT]
> Ensure you run Let's Encrypt `certbot` to generate SSL certificates and redirect all HTTP traffic to HTTPS.
