# Frontend Deployment Guide — Quantum Mentor World

This document outlines the procedure to deploy the static user interface files of the **Quantum Mentor World** platform to production environments.

---

## 1. Hosting Architecture

The user interface of Quantum Mentor World is built with vanilla HTML5, CSS3, and standard ES Javascript. It contains no frontend build pipelines or frameworks, making it deployable on any standard static web server or CDN (such as Netlify, Vercel, Cloudflare Pages, GitHub Pages, or traditional Nginx/Apache directory serving).

* **Source Root:** The public static root is the [frontend/](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend) folder. All files inside this directory must be deployed.
* **Excluded Directories:** Do not deploy `backend/`, `database/`, or `docs/` within your static frontend host.

---

## 2. Setting the API Base URL

Before deploying, update the backend API endpoint location in the configuration script:

1. Open [config.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/assets/js/config.js).
2. Uncomment `window.QMW_API_BASE_URL` and configure it to point to your live backend API endpoint:
   ```javascript
   window.QMW_API_BASE_URL = 'https://api.your-domain.com/api';
   ```
3. Verify that [api.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/assets/js/api.js) is imported after `config.js` in all pages. This allows the frontend to target the live backend API automatically.

---

## 3. SEO Domain Name Replacements

By default, metadata tags and index configuration documents contain placeholder references (`https://quantummentorworld.com`). Before launching, perform a global search-and-replace to map the live domain (e.g. `https://your-domain.com`):

- **HTML Canonical URLs:** Update `<link rel="canonical" href="...">` in all HTML templates.
- **Sitemap XML:** Update URLs listed in [sitemap.xml](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/sitemap.xml).
- **Robots Directives:** Verify sitemap endpoints in [robots.txt](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/robots.txt).

---

## 4. Logo Assets Verification

* The platform utilizes the existing branding logo assets. No new logo assets should be created.
* Ensure the target logo image path is located at:
  ```text
  frontend/assets/images/logo.png
  ```
* If the real logo has not been imported yet, the text file [PUT_EXISTING_LOGO_HERE.txt](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/assets/images/PUT_EXISTING_LOGO_HERE.txt) must remain in the folder. Do not delete this file until the actual image is copied.
