# Resource Management UI Guide

This guide details the specifications, validation rules, compliance review controls, and interactive data structures implemented for the resource management tools in **Quantum Mentor World** (**Quantum Mentor Official**).

---

## 1. Purpose of Resource Management UI

The resource management interface allows site operators to search, filter, catalog, edit, and moderate software specifications, media watch links, tools, and developer assets. It enforces strict compliance audits to verify files source licenses and malware scans results before publication.

---

## 2. Resource Management Table (listings)

Path: `frontend/admin/resources.html`
* **Column Fields:**
  * Title, Type, status, Legal Status, Safety Status, Featured, Trending, Updated Date.
* **Interactive Filters:**
  * Search keywords text box (searches by title, developer, author).
  * Dropdown filters for: Type, Status, Legal Status, Safety Status, Sort rules.
* **Actions Panel:**
  * View: Opens the public page `detail.html?slug=RESOURCE_SLUG` in a new tab.
  * Edit: Redirects to `edit-resource.html?slug=RESOURCE_SLUG`.
  * Publish / Archive / Delete: Intercepted by `handleAdminResourceAction()` to show a warning toast: *"This action will be connected in Step 14."*

---

## 3. Add & Edit Form Structure

Paths: `frontend/admin/add-resource.html` & `frontend/admin/edit-resource.html`
The form is broken down into structured sections:
1. **Basic Information:** Title, slug (auto-generated from title), Type, short description, full description, featured image URL, status, visibility, featured/trending switches.
2. **Legal & Safety Compliance Review:** Status fields, source type, access type, and review log notes.
3. **Technical Details:** Version, platform OS, developer org, author, publisher, language, file size, license type, release year, system requirements, installation guides, features, limitations.
4. **URLs & Mirrors Links:** Homepages, documentation, demo, GitHub, read-online, and download mirrors.
5. **Taxonomies:** Checkbox matrices populated dynamically by API.

---

## 4. Legal & Safety Compliance Validation Controls

To ensure strict compliance, the UI enforces validation:
* **Upload Disclaimers Box:** Reminds administrators that cracked, nulled, pirated, or unauthorized copyrighted materials are strictly prohibited.
* **Publish Action Limit:** The Publish button is disabled by default. It enables *only* when:
  * `legal_status` is set to `approved`.
  * `safety_status` is set to `safe` or `warning`.
* **Download Mirror Warning:** If a download URL is inputted, but the legal review status is *not* approved, a warning alerts: *"A Download URL is provided, but Legal Status is not approved! Do not provide unsafe links."*

---

## 5. Front-End Validation Rules

* **Required Fields:** Title, Type, Short Description, Legal Status, Safety Status, Source Type, Access Type.
* **URL Formats:** All input links (Official, Documentation, Demo, GitHub, Read Online, Download URLs) must pass regex formatting checks.
* **Submissions:** Submits prevent default redirects and display a toast notice: *"Action will be connected in Step 14."*

---

## 6. What is NOT Functional Yet (Deferred to Step 14)

The following components are mock placeholders:
1. **Add Resource Submit:** Prevents backend save.
2. **Edit Resource Submit:** Prevents backend update.
3. **Table Mutations:** Publish, Archive, Delete buttons intercept without modifying records.
4. **Bulk Actions:** Bulk action dropdown is disabled.
5. **Categories/Tags creation:** Left panes forms in taxonomies pages show notifications.
6. **Media Uploads:** Drag-and-drop triggers simulation toasts.
7. **Settings Saves:** Identity saves show warnings.

---

## 7. Testing Checklist

- [ ] Typing in "Title" auto-populates a lowercase, hyphenated URL slug.
- [ ] Entering invalid URLs (e.g. `ftp://foo`) triggers toast validation error.
- [ ] Leaving Legal Status as `pending` keeps the "Publish" submit button disabled.
- [ ] Switching Legal Status to `approved` and Safety to `clean` enables the "Publish" button.
- [ ] Providing a download URL without legal approval displays a yellow alert warning box.
- [ ] Category and Tag check lists fetch and render checkboxes.
- [ ] Submit buttons display a warning: *"Action will be connected in Step 14."* and do not reload.
