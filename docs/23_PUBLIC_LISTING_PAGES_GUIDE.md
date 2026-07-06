# 23 — Public Listing Pages Guide
## Quantum Mentor World | Quantum Mentor Official

---

## 1. Public Listing Pages Index

The directory exposes 8 specialized listing pages that display published resources by category groups:

| File | Subroute Endpoint | Category Scope |
|---|---|---|
| [software.html](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/software.html) | `GET /api/software` | Verified software, freeware, open-source utilities. |
| [books.html](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/books.html) | `GET /api/books` | Legal text documents, books, open-access manuals. |
| [tools.html](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/tools.html) | `GET /api/tools` | Developer tools, formatting, testing aides. |
| [games.html](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/games.html) | `GET /api/games` | Math puzzles, logic games, coding simulators. |
| [themes-plugins.html](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/themes-plugins.html) | `GET /api/themes` | Open-source templates, GPL themes & plugins. |
| [watch.html](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/watch.html) | `GET /api/watch` | Online video tutorials, course playlist links. |
| [news.html](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/news.html) | `GET /api/news` | Industry reports, resource rollups, learning newsletters. |
| [github-repos.html](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/github-repos.html) | `GET /api/github` | Open-source repositories, development roadmaps. |

---

## 2. Standard DOM Architecture

To bind cleanly to [resources.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/assets/js/resources.js), every public listing page must implement this DOM template:

```html
<!-- Input controls: Search and sorting dropdowns -->
<input id="resource-search-input" type="search" placeholder="Search..." />
<button id="resource-search-btn">Search</button>

<select id="resource-sort-select">
  <option value="latest">Latest</option>
  <option value="oldest">Oldest</option>
  <option value="title_asc">Title A-Z</option>
  <option value="title_desc">Title Z-A</option>
  <option value="popular">Popular</option>
</select>

<!-- State placeholders -->
<div id="resource-loading" style="display: none;"></div>
<div id="resource-error" style="display: none;"></div>
<div id="resource-empty" style="display: none;"></div>

<!-- Display results grid -->
<div id="resource-grid" class="resource-grid"></div>

<!-- Pagination elements -->
<div id="resource-pagination" class="pagination"></div>
```

---

## 3. Resource Card Design System

Each dynamic card follows a rigid template layout that aligns with our visual structure rules:

```text
+------------------------------------------------------+
|                      CARD IMAGE                      |
|  [Type Badge: Watch]                                 |
+------------------------------------------------------+
|  [Access: Free] [Origin: Open Source]                |
|  [Legal: Approved] [Safety: Safe]                    |
|                                                      |
|  Title: React Tutorial Series                        |
|  Desc: Step-by-step logic lessons...                 |
+------------------------------------------------------+
|  Date: June 24, 2026                 [View Details]  |
+------------------------------------------------------+
```

### Badge Colors Mapping (`components.css`):
* **Software:** Light blue border / text.
* **Books:** Amber yellow.
* **Tools:** Emerald green.
* **Games:** Crimson red.
* **Themes:** Royal violet.
* **Watch:** Hot pink.
* **News:** Slate grey.
* **GitHub:** Dark blue.
* **Legal (Approved) & Safety (Safe):** Green highlights.
* **Safety (Warning):** Orange highlights.

---

## 4. Listing Interactions & Controls

### Search Throttling & Binding
* Search queries only execute when the user hits the **Search** button or presses the **Enter** key.
* Avoids overloading the database on every keystroke.

### Sort Options
* **Latest:** `published_at DESC, created_at DESC`
* **Oldest:** `published_at ASC, created_at ASC`
* **Title A-Z:** `title ASC`
* **Title Z-A:** `title DESC`
* **Popular:** `view_count DESC`

### Pagination Meta
* Displays direct page jumps.
* Exposes `‹` (previous page) and `›` (next page) controls.
* Resets to page `1` whenever filters (search/sort) are modified.

---

## 5. Responsive Spacing

Using [responsive.css](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/assets/css/responsive.css), resource grids adapt to screen widths:
* **Large Desktop (>1440px):** 4 columns.
* **Standard Desktop (1024–1440px):** 3 columns.
* **Tablet (768–1024px):** 2 columns.
* **Mobile (<768px):** 1 column list view.
* Under 768px, navigation links wrap and search inputs stack vertically to prevent side scrolling.

---

## 6. Upcoming Features (Step 10)

* **Detail Route Implementation:** The "View Details" button links to `resource-detail.html?slug=SLUG`. In Step 10, this page will be built to load full resource data, external links, episodes (if watch type), and licenses.
* **Link Redirect Notices:** External links will display safety warnings before forwarding users to external websites.
