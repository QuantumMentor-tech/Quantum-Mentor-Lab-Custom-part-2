# 02 — User & Admin Journey
## Quantum Mentor World | Quantum Mentor Official

---

## Section 1: Normal Visitor (Public User) Journey

### Journey Overview

A normal visitor is any person who opens the website without logging in. The public user journey is designed to be frictionless, intuitive, and informative.

---

### Step-by-Step User Journey

#### Step 1 — Arrive at Homepage
- User opens `https://quantumentorworld.com` (or local URL)
- User sees the full-width hero section with the site tagline and a search bar
- User sees featured resources in horizontal card rows categorized by type
- User notices the professional dark-themed design with the official logo in the header

#### Step 2 — Discover Resources via Search
- User types a keyword in the search bar (e.g., "Python book" or "free photo editor")
- Search results page loads showing matching resources across all types
- User can filter results by resource type, category, and legal status
- User clicks a result to open the resource detail page

#### Step 3 — Browse by Category
- User clicks on "Categories" in the navigation menu
- User sees a list of all available categories with icons
- User clicks a category (e.g., "Programming", "Design", "Linux")
- User sees all resources in that category organized by type

#### Step 4 — Browse a Specific Resource Section
- User clicks on "Software", "Books", "Tools", "Games", "Watch", "News", or "GitHub Repos" in navigation
- User sees a grid/list of all resources in that section
- User can filter and sort resources using sidebar options
- User scrolls through paginated results

#### Step 5 — Open a Resource Detail Page
- User clicks on any resource card
- User is taken to the full detail page for that resource
- User reads the title, description, version, developer, license, system requirements, etc.
- User sees the legal/safety status badge (e.g., "Verified Safe", "Legal - Open Source")

#### Step 6 — Read Legal and Safety Notes
- User sees a dedicated "Legal & Safety" section on each resource detail page
- User understands the license type, legal status, and safety verification
- User gains trust in the resource before clicking any external link

#### Step 7 — Click Official / External Links Safely
- User clicks the "Official Website", "Download", or "View on GitHub" button
- All external links open in a new browser tab
- A short notice appears: "You are leaving Quantum Mentor World. External links are verified but please proceed with caution."
- User proceeds to the official external resource

#### Step 8 — Watch Legal Video Content
- User navigates to the "Watch" section
- User sees categorized video content (tutorials, documentaries, educational content)
- User clicks a video to open the watch detail page
- Video plays via legal embed (YouTube, Vimeo, Archive.org)
- User does not download or stream any pirated content

#### Step 9 — Read News
- User navigates to the "News" section
- User reads summaries of educational and tech news
- Each news item shows the source name and source URL
- User clicks "Read Full Article" to visit the original source

#### Step 10 — Contact the Website Owner
- User navigates to "Contact Us"
- User fills in name, email, subject, and message
- User submits the form
- User sees a success confirmation message
- Admin receives the message in the admin dashboard

#### Step 11 — Read About, Disclaimer, and Privacy Policy
- User clicks "About Us" to learn about the platform's mission and team
- User clicks "Disclaimer" to read legal disclaimers about external links
- User clicks "Privacy Policy" to understand how their data is handled

---

### User Journey Flow Diagram (Text)

```
Homepage
    │
    ├── Search Bar ──────────────► Search Results ──► Resource Detail Page
    │                                                         │
    ├── Navigation                                            ├── Legal/Safety Section
    │   ├── Software                                          ├── Download / Visit Button
    │   ├── Books                                             └── (Exits to external site)
    │   ├── Tools
    │   ├── Games
    │   ├── Watch
    │   ├── News
    │   └── GitHub Repos
    │
    ├── Categories ────────────► Category Page ──► Resource Detail Page
    │
    ├── About Us
    ├── Contact Us ──────────────► Submit Form ──► Success Message
    ├── Disclaimer
    └── Privacy Policy
```

---

## Section 2: Admin Journey

### Admin Journey Overview

The admin is the website owner or authorized staff member who manages all content through the secure admin dashboard.

---

### Step-by-Step Admin Journey

#### Step 1 — Access Admin Login
- Admin navigates to `/admin/login.html`
- Admin enters username and password
- System validates credentials against the database
- Failed attempts are rate-limited and logged
- Brute-force protection is active

#### Step 2 — View Dashboard Overview
- Admin sees the dashboard with key stats:
  - Total resources by type
  - Total categories and tags
  - Recent contact messages
  - Recently added/edited resources
  - Pending legal review items
  - Quick action buttons (Add Resource, View Messages)

#### Step 3 — Add a New Resource
- Admin clicks "Add New Resource" from the dashboard or sidebar
- Admin selects the resource type (Software, Book, Tool, Game, etc.)
- The form adapts to show the correct fields for that resource type
- Admin fills in:
  - Title
  - Slug (auto-generated or manual)
  - Short description
  - Full description (rich text editor)
  - Categories and tags
  - External links
  - Legal/safety status
- Admin uploads featured image via the media manager
- Admin sets status: "Draft" or "Published"
- Admin clicks "Save" to submit

#### Step 4 — Upload Featured Image
- Admin opens the media manager panel
- Admin uploads an image from their local device
- Image is stored in the server media folder
- Admin selects the image to attach to the resource

#### Step 5 — Publish or Save as Draft
- Admin sets the resource status to "Published" (visible on the site) or "Draft" (hidden)
- Admin can preview the resource before publishing
- Admin clicks "Publish" or "Save Draft"

#### Step 6 — Edit Existing Resource
- Admin navigates to "Manage Resources"
- Admin searches or filters to find the resource to edit
- Admin clicks "Edit" on the resource
- Admin makes changes and clicks "Update"

#### Step 7 — Delete or Deactivate Resource
- Admin clicks "Delete" on a resource (with confirmation prompt)
- Or Admin sets the resource status to "Inactive" to hide without deleting

#### Step 8 — Manage Categories
- Admin navigates to "Manage Categories"
- Admin creates new categories with name, slug, and icon
- Admin edits existing categories
- Admin deletes unused categories

#### Step 9 — Manage Tags
- Admin navigates to "Manage Tags"
- Admin creates new tags
- Admin merges or deletes duplicate tags

#### Step 10 — Review Contact Messages
- Admin navigates to "Contact Messages"
- Admin reads incoming messages from the contact form
- Admin marks messages as read or resolved
- Admin can reply via their own email client

#### Step 11 — Manage Legal Review Status
- Admin navigates to "Legal Review Status"
- Admin reviews resources marked as "Pending Review"
- Admin updates the status to "Verified", "Approved", or "Rejected"
- Resources marked "Rejected" are automatically unpublished

#### Step 12 — Logout Securely
- Admin clicks "Logout" in the dashboard
- Session is destroyed on the server
- Admin is redirected to the login page
- Session tokens are invalidated

---

### Admin Journey Flow Diagram (Text)

```
Admin Login
    │
    ▼
Dashboard Overview
    │
    ├── Add New Resource
    │       ├── Select Resource Type
    │       ├── Fill Form Fields
    │       ├── Upload Image
    │       ├── Set Legal Status
    │       └── Publish / Save Draft
    │
    ├── Manage Resources
    │       ├── View All Resources
    │       ├── Edit Resource
    │       ├── Delete / Deactivate
    │       └── Legal Review Status
    │
    ├── Manage Categories & Tags
    │       ├── Create Category / Tag
    │       ├── Edit Category / Tag
    │       └── Delete Category / Tag
    │
    ├── Contact Messages
    │       ├── View Messages
    │       └── Mark as Read
    │
    ├── Site Settings
    │       └── Global Configuration
    │
    └── Logout
```

---

## Section 3: User Permission Levels

| Role | Access Level |
|---|---|
| **Public Visitor** | Read-only access to all published resources |
| **Admin** | Full access to dashboard, resource management, and settings |

> Note: No public user registration is required for this platform in the MVP phase. Users browse without accounts. Admin accounts are managed directly in the database or via admin settings.

---

*Document created: Step 1 — Quantum Mentor World Planning Phase*
*Version: 1.0*
