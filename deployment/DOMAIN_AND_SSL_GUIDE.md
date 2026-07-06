# Domain and SSL Integration Guide — Quantum Mentor World

This document maps out DNS, SSL/TLS, and domain configurations to secure communication channels on the live web.

---

## 1. Domain Architecture Setup

We recommend splitting frontend static pages and backend API endpoints:
* **Frontend Site:** `https://quantummentor.world` (serves the static user interface)
* **Backend API Subdomain:** `https://api.quantummentor.world` (serves Express REST endpoints)

Configure your registrar DNS zone records:
* Add an **A Record** (or CNAME) mapping `@` and `www` to your static hosting provider.
* Add an **A Record** pointing `api` subdomain to your backend server host IP.

---

## 2. Let's Encrypt SSL/TLS Certificates

Enable HTTPS on your backend host using `certbot` for Nginx:

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Request certificate bindings
sudo certbot --nginx -d api.quantummentor.world
```
Follow the screen prompts to enforce global HTTP-to-HTTPS redirects.

---

## 3. Whitelist CORS Domains Configuration

Update [backend/.env](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/backend/.env) on your target host to lock down origins:

```env
FRONTEND_URL=https://quantummentor.world
ALLOWED_ORIGINS=https://quantummentor.world,https://www.quantummentor.world
```
This forces the Express server to reject REST requests originating from unlisted origins, preventing cross-domain spoofing.

---

## 4. Canonical Site Mapping

Ensure all frontend pages use the final live domains inside header tags:
```html
<link rel="canonical" href="https://quantummentor.world/index.html" />
```
Update sitemaps and robots settings:
* [sitemap.xml](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/sitemap.xml): Replace host URL with the final domain name.
* [robots.txt](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/robots.txt): Replace sitemap URL reference with `Sitemap: https://quantummentor.world/sitemap.xml`.
