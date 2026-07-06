# 22 — Frontend API Integration Guide
## Quantum Mentor World | Quantum Mentor Official

---

## 1. Overview

The Frontend API Integration layer connects the static HTML pages of **Quantum Mentor World** to the Express backend API endpoints. It is written using pure Vanilla JavaScript, enabling fast, lightweight page interactions without the overhead of modern SPA frameworks.

---

## 2. API Configurations & Helper (`api.js`)

* **Base URL:** `http://localhost:5000/api`
* **File:** [api.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/assets/js/api.js)

`api.js` provides centralized, reusable methods to communicate with the server. It automatically appends administrative session tokens (JWT) when available and handles query parameter formatting.

### Key API functions:
1. `apiGet(endpoint, options)` — Performs HTTP `GET` requests, automatically mapping options keys to query string formats using `buildQueryString`. Returns a consistent fallback error object on connection exceptions.
2. `buildQueryString(params)` — Dynamically compiles query parameter lists, filtering out null, undefined, or empty parameters.
3. `handleApiError(error, endpoint)` — Traps networking errors (e.g. backend offline), logs warning metrics, and returns standard failure responses gracefully:
   ```javascript
   {
     success: false,
     message: 'Unable to connect to the API. Please make sure the backend server is running.',
     data: null
   }
   ```

---

## 3. Reusable UI Templates & State Renderers (`ui.js`)

* **File:** [ui.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/assets/js/ui.js)

`ui.js` provides rendering helpers, badge markup generators, and secure card template compilers.

### Visual State Functions:
* `showLoading(container, message)` — Renders a shimmer loading animation card to simulate async feedback.
* `showError(container, message)` — Injects styled failure warnings (red callout layout).
* `showEmpty(container, message)` — Injects friendly "No resources found" alerts (blue callout layout).

### Security & Escaping Functions:
* `escapeHtml(value)` — Crucial security barrier to prevent Cross-Site Scripting (XSS) attacks. Automatically sanitizes symbols (`&`, `<`, `>`, `"`, `'`) before outputting content in the DOM.

---

## 4. Frontend Data Flow Mappings

### A. Homepage Data Flow
1. Open [index.html](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/index.html).
2. [home.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/assets/js/home.js) executes 4 parallel requests to the API:
   - `GET /api/resources/featured` -> Renders inside `#featured-resources`.
   - `GET /api/resources/trending` -> Renders inside `#trending-resources`.
   - `GET /api/resources/latest` -> Renders inside `#latest-resources`.
   - `GET /api/categories` -> Renders category link grid inside `#category-list`.
3. If one API block fails, its container renders an error callout while remaining panels load normally.

### B. Section Listing Feeds Data Flow
1. Open listing feed (e.g., [software.html](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/software.html)).
2. [resources.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/assets/js/resources.js) detects context filename mapping:
   - `software.html` maps to subroute endpoint `/software`.
3. Reads parameters (`page`, `q`, `sort`, `category`, `tag`) from the URL query parameters.
4. Performs request `GET /api/software?page=1&sort=latest` via the API helper.
5. Injects compiled cards into `#resource-grid` and maps pagination buttons inside `#resource-pagination`.

### C. Search Page Data Flow
1. User enters text in any search bar.
2. Redirects browser to `search.html?q=input_query`.
3. [search.js](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/assets/js/search.js) reads `q` from search queries and fills the inputs element.
4. Queries API: `GET /api/resources?q=input_query` and renders matches.

---

## 5. Frontend Security Protocol

1. **Escape Dynamic Values:** Every single string returned by the API (title, description, version, etc.) must go through `UI.escapeHtml` before rendering.
2. **Read-Only Actions:** Public listing pages operate strictly in read-only mode. No admin session tokens, passwords, or modifying queries exist on these views.
3. **Redact Sensitive Metadata:** Technical columns (`created_by`, `updated_by`, `deleted_at`) or password details are excluded from all query cards.

---

## 6. Common Errors and Troubleshooting

### Error: "Failed to Fetch" (Network Blocked)
* **Cause:** The backend Express API server is not running, or connection config is blocked.
* **Fix:** Start Apache/MySQL in XAMPP. Execute `npm run dev` in `backend` folder. Verify base URL matches port `5000`.

### Error: "CORS Blocked Request"
* **Cause:** Express backend lacks permission for the port Live Server runs on.
* **Fix:** Verify `FRONTEND_URL` in `backend/.env` is configured to map `http://127.0.0.1:5500` or `http://localhost:5500` correctly.
