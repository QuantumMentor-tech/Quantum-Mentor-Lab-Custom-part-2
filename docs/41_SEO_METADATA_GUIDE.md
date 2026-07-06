# 41 — SEO Metadata Guide

## Project: Quantum Mentor World / Quantum Mentor Official
## Tech Stack: HTML, CSS, JavaScript, Node.js, Express.js, MySQL

---

## 1. SEO Purpose and Architecture

For dynamic, custom educational platforms, Search Engine Optimization (SEO) is critical to organic traffic growth. Because **Quantum Mentor World** is built using vanilla HTML/JS and logs external resources client-side, the SEO strategy combines:
1. **Static HTML Head Meta Tags:** Rendered natively by the browser on load.
2. **Client-Side JS Overrides:** Managed by [seo.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/assets/js/seo.js) to dynamically inject page titles, canonical URLs, OG tags, and structured JSON-LD schemas.
3. **Strict Admin Blocking:** Keeping private back-office pages completely hidden from search engine indexes.

---

## 2. Meta Tag Conventions

Every public page contains unique, descriptive tags in the `<head>` section:

### Page Title Format
```html
<title>[Context Specific Title] | Quantum Mentor World</title>
```
* Max length: 60 characters.

### Meta Description
```html
<meta name="description" content="[Unique content summary]" />
```
* Max length: 155-160 characters.

### Canonical Link
```html
<link rel="canonical" href="https://quantummentorworld.com/[page-filename]" />
```
* Avoids duplicate content issues when multiple dynamic query parameters are appended (e.g. search page index filtering).

---

## 3. Social Media Sharing Tags

### Open Graph (OG) Tags
Used by Facebook, LinkedIn, Discord, and Slack to render card previews:
```html
<meta property="og:type" content="website" />
<meta property="og:title" content="Page Title | Quantum Mentor World" />
<meta property="og:description" content="Resource description summary..." />
<meta property="og:url" content="https://quantummentorworld.com/page-filename" />
<meta property="og:site_name" content="Quantum Mentor World" />
<meta property="og:image" content="https://quantummentorworld.com/assets/images/logo.png" />
```

### Twitter/X Cards
Used for Twitter/X social feeds:
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Page Title | Quantum Mentor World" />
<meta name="twitter:description" content="Resource description summary..." />
<meta name="twitter:image" content="https://quantummentorworld.com/assets/images/logo.png" />
```

---

## 4. Dynamic Pages and Javascript Metadata Overrides

Dynamic pages like `resource-detail.html`, `category.html`, and `tag.html` extract slug query parameters from the URL. On a successful backend response, [seo.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/assets/js/seo.js) handles updates programmatically:

```javascript
// Updates title tag
window.SEO.updatePageTitle(resource.title);

// Updates description tag
window.SEO.updateMetaDescription(resource.short_description);

// Updates canonical tag
window.SEO.updateCanonicalUrl(`resource-detail.html?slug=${resource.slug}`);

// Injects JSON-LD structured schema
window.SEO.injectJSONLD(schemaData);
```

> [!WARNING]
> **Limitations of Client-Side SEO:**
> Crawlers that do not run JavaScript (or have strict timeout settings) will read the original placeholder tags. For optimal SEO crawlers verification:
> 1. Set sensible fallback metadata inside public HTML templates.
> 2. For future launch stages, consider migrating to Next.js or Node.js server-side templates (EJS) so pages are pre-rendered with dynamic SEO headers.

---

## 5. Admin and Private Directory Safety

Search engines must **never** index administrative portals or private endpoints. Every file inside the `/admin` subdirectory includes:
```html
<meta name="robots" content="noindex, nofollow, noarchive" />
```
This forces bots to ignore the login page and dashboard views, protecting site security and preventing index bloat.

---

## 6. Recommendations for Structured Data Validation

When structured JSON-LD data is injected on `resource-detail.html`, test correctness by pasting the parsed script content into:
* [Google Rich Results Test](https://search.google.com/test/rich-results)
* [Schema.org Validator](https://validator.schema.org/)

Check that no warning or critical error flags are raised.
