# Categories, Tags, and Site Settings CRUD Guide

This document covers administrative procedures for managing categories taxonomies, indexing tags, and safe site-wide settings.

---

## 📂 Category Management

Categories classify resources on public directories listing pages.
* **Database fields**: `id`, `name`, `slug`, `icon` (emoji or SVG key), `description`, `status` (`active` or `inactive`), `created_at`, `updated_at`, `deleted_at`.
* **Slugification**: Category slugs are auto-generated from the category name but can be customized. Slugs are validated for database uniqueness.
* **Form Action**: 
  * Left pane: Form toggles dynamically between "Add New" and "Edit Category" (pre-populating values and changing submit actions on selection).
  * Right pane: Lists active categories. Includes interactive search filters.
* **Deletion**: Deleting a category sets `deleted_at` to the current timestamp. Categories are never deleted permanently to preserve integrity.

---

## 🏷️ Tag Management

Tags provide indexing keywords for advanced search filter queries.
* **Database fields**: `id`, `name`, `slug`, `description`, `created_at`, `updated_at`, `deleted_at`.
* **Slugification**: Tag slugs are auto-generated from the name.
* **Form Action**: Works exactly like Category panes with unified edit cancel flows.
* **Deletion**: Tags are soft-deleted by setting `deleted_at = CURRENT_TIMESTAMP`.

---

## ⚙️ Safe Settings Configuration

Site Settings allow the administrator to update global headers, copy elements, policies, and maintenance states.

### Allowed Configuration Keys
Only these key-value configurations can be updated by the settings endpoint:
1. `site_name`: Global title tag header prefix.
2. `brand_name`: Brand logo text.
3. `site_tagline`: Main header index subtitle.
4. `site_email`: Public support/contact mail destination.
5. `legal_notice`: Disclaimer copy at the footers.
6. `footer_text`: Footer copyrights notice line.
7. `allow_user_reports`: Toggles broken mirror flags reports.
8. `maintenance_mode`: Restricts visitor reads, routing to maintenance panel.

### Security Guards
The backend settings API **prohibits** updating system variables like:
* Database credentials (`DB_PASSWORD`, `DB_USER`, `DB_HOST`).
* API access secrets, environment keys, and tokens.
* Password hashes, JWT secrets, and private keys.
Any attempt to pass unauthorized configuration keys will trigger a Bad Request validation error (`400`).
