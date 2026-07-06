# 44 — Launch SEO Checklist

## Project: Quantum Mentor World / Quantum Mentor Official
## Tech Stack: HTML, CSS, JavaScript, Node.js, Express.js, MySQL

---

Use this checklist to perform final verification checks before deploying **Quantum Mentor World** online.

## Domain & General Verification
- [ ] **Replace Placeholder Domain:** Open [robots.txt](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/robots.txt), [sitemap.xml](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/sitemap.xml), and [seo.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/assets/js/seo.js) and replace `https://quantummentorworld.com` with the real registered production domain name.
- [ ] **Add Real Logo:** Place the official logo at `frontend/assets/images/logo.png`. Remove any text placeholders.

## HTML Head Elements Audit
- [ ] **Verify Page Titles:** Confirm that every public HTML page has a unique `<title>` matching the specifications.
- [ ] **Verify Meta Descriptions:** Inspect `<meta name="description">` to verify length and uniqueness.
- [ ] **Verify Canonical Elements:** Ensure canonical tags point to unique page URLs.
- [ ] **Verify Open Graph Tags:** Verify presence of `og:title`, `og:description`, `og:image`, `og:type`, and `og:url` tags.
- [ ] **Verify Twitter/X Cards:** Ensure `twitter:card`, `twitter:title`, `twitter:description`, and `twitter:image` tags exist.

## Indexation Rules
- [ ] **Robots.txt Disallow Rules:** Verify that `/admin/`, `/api/`, `/backend/`, `/database/`, `/docs/`, and `/uploads/` are blocked from crawler access.
- [ ] **Sitemap Exclusion:** Confirm no private directories or API paths are listed in `sitemap.xml`.
- [ ] **Admin Noindex Verification:** Inspect every file under `/admin` and confirm `<meta name="robots" content="noindex, nofollow, noarchive" />` exists in the `<head>`.
- [ ] **Search Noindex Verification:** Verify search page includes `noindex, follow`.

## Layout & Accessibility Polish
- [ ] **Mobile Layout Audits:** Verify all static legal pages scale cleanly down to 320px screen width without clipping or horizontal overflows.
- [ ] **Focus Styles & Spacing:** Check buttons, interactive inputs, and link states for focus outlines and accessibility label references.
- [ ] **Anti-Piracy Verbiage Check:** Ensure about, disclaimer, and privacy pages carry explicit statements declaring that only legal, licensed assets are cataloged.

## Dynamic Scripts & Forms Verification
- [ ] **Structured JSON-LD Verification:** Open a resource detail view, inspect the generated JSON-LD schema, and validate it using the [Schema.org Validator](https://validator.schema.org/).
- [ ] **SEO Dynamic Update Verification:** Confirm page titles change to match resource details, category names, or tag labels dynamically on load.
- [ ] **Contact Form Submission:** Submit a contact inquiry. Confirm it saves to the backend database table and registers correct IP/User Agent metrics.
- [ ] **Link Report Modal Submission:** Submit a broken link report on a resource page. Verify it records to database table correctly.

## Launch
- [ ] **Register on Search Consoles:** Submit `sitemap.xml` to Google Search Console and Bing Webmaster Tools once live.
