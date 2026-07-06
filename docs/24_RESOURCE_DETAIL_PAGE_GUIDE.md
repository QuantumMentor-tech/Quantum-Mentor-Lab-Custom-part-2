# 24 — Resource Detail Page Guide
## Quantum Mentor World | Quantum Mentor Official

---

## 1. Purpose

The resource detail page (`resource-detail.html`) displays comprehensive, safe, and legal metadata specifications for individual directory entries (software, books, watch lists, templates, developer utilities, news rollups, and repositories).

---

## 2. Page Invocation & URL Format

The detail page parses the unique routing `slug` query parameter from the URL:
* **Target Format:** `resource-detail.html?slug=RESOURCE_SLUG`
* **Example:** `resource-detail.html?slug=open-source-code-editor-demo`

If the page is invoked without a `slug` query parameter, it falls back to displaying a user-friendly error statement indicating the missing slug parameter.

---

## 3. Data Integration & Layout Structures

On execution, the page requests data from the backend:
* **API Route:** `GET /api/resources/:slug`
* **Response Mapping:**
  - `#detail-title` -> Resource Title (escaped)
  - `#detail-short-description` -> Short Description (escaped)
  - `#detail-badges-row` -> Resource Type, Access Type, Origin, Legal Status, and Safety Status Badges
  - `#detail-image-container` -> Featured image wrapper with onerror fallbacks
  - `#detail-description` -> Sanitized pre-wrap Description
  - `#detail-categories` -> Mapped active category badges
  - `#detail-tags` -> Mapped active tag labels
  - `#detail-safe-links` -> Intercepted safe redirection redirect keys
  - `#detail-info-grid` -> Sidebar spec parameters (Platform, Version, License, Release Year, etc.)

---

## 4. State Mappings & Error Boundaries

1. **Loading State:** Displays `#detail-loading` shimmers skeleton container cards while the fetch promise is pending.
2. **Error State:** Intercepts network exceptions (e.g. backend server offline) showing a warning notification banner and a "Try Again" trigger which re-invokes the loading lifecycles.
3. **Not Found State (404):** Handles invalid slugs, displaying a "Resource Not Found" placeholder box complete with category browse redirection links.
4. **Field Visibility Controls:** Filters empty values or unapproved properties, ensuring that admin properties are never exposed.

---

## 5. Responsive Design Spacing

* **Desktop View (>768px):** Two column layout (2/3 Main panel holding image/descriptions, 1/3 Sidebar holding specs grid and compliance summaries).
* **Tablet/Mobile View (<768px):** Single column stack. The main visual image rescales, navigation wrapping occurs, and metadata grids wrap into single-item rows to fit screen widths.
* **XSS Sanitization:** All text parameters go through `escapeHtml` to prevent XSS scripting vectors.
