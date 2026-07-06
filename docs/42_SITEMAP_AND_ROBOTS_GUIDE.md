# 42 — Sitemap and Robots Guide

## Project: Quantum Mentor World / Quantum Mentor Official
## Tech Stack: HTML, CSS, JavaScript, Node.js, Express.js, MySQL

---

## 1. Robots.txt Directives

The platform uses [robots.txt](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/robots.txt) to define access clearance rules for search engine crawlers.

### Crawler Configurations
```txt
User-agent: *
Allow: /

# Disallow private and administrative folders
Disallow: /admin/
Disallow: /api/
Disallow: /backend/
Disallow: /database/
Disallow: /docs/
Disallow: /uploads/

# Disallow sensitive dynamic query parameter patterns to prevent index duplication
Disallow: /*?token=
Disallow: /*?id=
Disallow: /*?admin=

# Point search engine crawlers to our XML sitemap catalog
Sitemap: https://quantummentorworld.com/sitemap.xml
```

---

## 2. Sitemap.xml Layout

The [sitemap.xml](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/sitemap.xml) contains structural entry pointers of all public static routes.

* **Priority 1.0 (Highest):** Home Page (`/index.html`).
* **Priority 0.9:** Standard Resource Listings catalogs (`/software.html`, `/books.html`, `/tools.html`).
* **Priority 0.8:** Secondary Listing catalogs (`/games.html`, `/watch.html`, `/news.html`, etc.).
* **Priority 0.7:** Taxonomy Index indices (`/categories.html`, `/tags.html`).
* **Priority 0.5-0.4 (Lowest):** Info & Legal pages (`/about.html`, `/contact.html`, `/disclaimer.html`, `/privacy.html`).

---

## 3. Dynamic Sitemap API Endpoint

To support future automated XML sitemap builders, we added a public dynamic sitemap query endpoint:
* **Endpoint:** `GET /api/seo/sitemap-data`
* **Visibility Rule:** Returns only published, legal, and safety-approved resources.

### Response Payload Structure
```json
{
  "success": true,
  "message": "Sitemap data fetched successfully.",
  "data": {
    "resources": [
      {
        "slug": "open-source-code-editor-demo",
        "updated_at": "2026-06-25T12:00:00.000Z"
      }
    ],
    "categories": [
      {
        "name": "Software",
        "slug": "software"
      }
    ],
    "tags": [
      {
        "name": "Free",
        "slug": "free"
      }
    ]
  }
}
```

---

## 4. Replacing the Production Domain

When deploying the application:
1. Open [robots.txt](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/robots.txt) and replace the sitemap URL domain prefix with the real registered target.
2. Open [sitemap.xml](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/sitemap.xml) and change the `<loc>` tags prefix to match the final canonical host.
3. Open [seo.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/assets/js/seo.js) and update the `BASE_URL` and `FALLBACK_IMAGE` variables.

---

## 5. Testing and Validation Checklist

### Robots.txt Validation
* Open the browser at `http://localhost:5000/robots.txt` (or front-end server path).
* Confirm administrative folders are listed under `Disallow:` blocks.
* Confirm `Sitemap:` directive points to a valid sitemap.xml.

### Sitemap.xml Check
* Submit the sitemap url to [Google Search Console Sitemap Tool](https://search.google.com/search-console/sitemaps) after live server DNS propagation.
* Ensure all XML nodes parse without XML layout syntax issues.
