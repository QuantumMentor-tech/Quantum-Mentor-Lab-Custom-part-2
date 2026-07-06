# 05 — UI/UX Direction
## Quantum Mentor World | Quantum Mentor Official

---

## Design Philosophy

Quantum Mentor World should feel like a **premium, trustworthy, and modern EdTech platform**. The design must immediately communicate professionalism, safety, and reliability to users — qualities that are critical for an educational resource directory.

Design pillars:
1. **Clarity** — Users must immediately understand what the site does
2. **Trust** — Every visual cue must reinforce the platform's safety and legitimacy
3. **Discovery** — Content must be easy to find and explore
4. **Consistency** — Every page follows the same visual language
5. **Performance** — Fast, lightweight, and accessible

---

## Design Style

| Attribute | Direction |
|---|---|
| **Overall Style** | Professional, Modern, Futuristic, Educational Technology |
| **Theme** | Dark theme (primary) |
| **Layout** | Clean, grid-based, spacious |
| **Feel** | Premium, trustworthy, tech-focused |
| **Inspiration** | Modern SaaS platforms, developer-focused dark UIs |
| **Tone** | Professional, informative, welcoming |

---

## Color System

### Primary Palette

| Color Name | Hex Value | Usage |
|---|---|---|
| **Main Background** | `#0F172A` | Page background, body |
| **Secondary Background** | `#1E293B` | Cards, sections, panels |
| **Tertiary Background** | `#263344` | Hover states, table rows |
| **Primary Accent** | `#00D4FF` | Primary buttons, highlights, links |
| **Secondary Accent** | `#7C3AED` | Secondary buttons, badges, gradients |
| **Success Accent** | `#22C55E` | Approved/safe status, success messages |
| **Warning Accent** | `#F59E0B` | Caution status, warnings |
| **Danger Accent** | `#EF4444` | Rejected/unsafe status, errors |
| **Main Text** | `#F8FAFC` | Primary body text, headings |
| **Muted Text** | `#94A3B8` | Secondary text, captions, labels |
| **Border Color** | `rgba(255,255,255,0.10)` | Card borders, dividers |

### Gradient Definitions

```css
/* Hero gradient */
background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%);

/* Primary button gradient */
background: linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%);

/* Card glow effect */
box-shadow: 0 0 20px rgba(0, 212, 255, 0.08);

/* Text gradient (headings) */
background: linear-gradient(135deg, #00D4FF, #7C3AED);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## Typography System

### Font Families

| Font | Usage | Google Fonts Link |
|---|---|---|
| **Outfit** | Primary headings, logo text | fonts.google.com/specimen/Outfit |
| **Inter** | Body text, paragraphs, UI labels | fonts.google.com/specimen/Inter |
| **JetBrains Mono** | Code blocks, technical fields, commands | fonts.google.com/specimen/JetBrains+Mono |

### Font Scale

| Name | Size | Weight | Usage |
|---|---|---|---|
| `--text-xs` | 12px | 400 | Captions, badges |
| `--text-sm` | 14px | 400 | Labels, muted text |
| `--text-base` | 16px | 400 | Body text, descriptions |
| `--text-lg` | 18px | 500 | Card titles, section labels |
| `--text-xl` | 20px | 600 | Subsection headings |
| `--text-2xl` | 24px | 600 | Section headings |
| `--text-3xl` | 30px | 700 | Page headings |
| `--text-4xl` | 36px | 700 | Hero headings |
| `--text-5xl` | 48px | 800 | Main hero title |

---

## Spacing System

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Minimal spacing |
| `--space-2` | 8px | Tight spacing |
| `--space-3` | 12px | Compact spacing |
| `--space-4` | 16px | Default spacing |
| `--space-6` | 24px | Card padding |
| `--space-8` | 32px | Section padding |
| `--space-12` | 48px | Large section gaps |
| `--space-16` | 64px | Page section spacing |
| `--space-24` | 96px | Hero spacing |

---

## Border Radius System

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 4px | Tags, small badges |
| `--radius-md` | 8px | Inputs, buttons |
| `--radius-lg` | 12px | Cards |
| `--radius-xl` | 16px | Large cards, modals |
| `--radius-2xl` | 24px | Hero sections |
| `--radius-full` | 9999px | Pills, avatar circles |

---

## Component Design Guidelines

### 1. Header / Navigation

- Fixed/sticky header at the top of all pages
- Background: `#0F172A` with a subtle bottom border
- Left side: Official logo (graphic + text)
- Center: Primary navigation links (Home, Software, Books, Tools, Games, Watch, News, GitHub)
- Right side: Search icon, dark mode toggle (future), Admin link
- Mobile: Hamburger menu with slide-in navigation drawer
- Active nav link: highlighted with `#00D4FF` underline or background

### 2. Footer

- Dark background `#0F172A`
- Top border with gradient accent
- Four columns:
  - Column 1: Logo + tagline + social links
  - Column 2: Quick Links (Home, Software, Books, Tools)
  - Column 3: More Links (Games, Watch, News, GitHub, Categories)
  - Column 4: Platform Links (About, Contact, Disclaimer, Privacy Policy)
- Bottom row: Copyright notice + "All resources are verified legal and safe"
- Mobile: Stacks to 2 columns then 1 column

### 3. Resource Cards

- Background: `#1E293B`
- Border: `rgba(255,255,255,0.10)`
- Border radius: `12px`
- Hover effect: subtle glow + slight scale up (transform: scale(1.02))
- Structure:
  - Featured image (16:9 ratio)
  - Resource type badge (colored by type)
  - Legal status badge (green = approved)
  - Title
  - Short description (2-3 lines, truncated)
  - Tags (max 3 visible)
  - "View Details" button

### Resource Type Badge Colors

| Resource Type | Badge Color |
|---|---|
| Software | `#00D4FF` (cyan) |
| Books | `#F59E0B` (amber) |
| Tools | `#22C55E` (green) |
| Games | `#EF4444` (red) |
| Themes & Plugins | `#A855F7` (purple) |
| Watch | `#EC4899` (pink) |
| News | `#64748B` (slate) |
| GitHub Repos | `#1D4ED8` (blue) |

### 4. Buttons

**Primary Button:**
```
Background: linear-gradient(135deg, #00D4FF, #7C3AED)
Text: #0F172A (dark)
Padding: 12px 24px
Border radius: 8px
Hover: brightness(1.1) + box-shadow glow
```

**Secondary Button:**
```
Background: transparent
Border: 1px solid #00D4FF
Text: #00D4FF
Padding: 12px 24px
Border radius: 8px
Hover: Background fills with #00D4FF, text turns dark
```

**Danger Button:**
```
Background: #EF4444
Text: white
Hover: darken background
```

### 5. Forms & Inputs

- Background: `#1E293B`
- Border: `1px solid rgba(255,255,255,0.10)`
- Border radius: `8px`
- Text color: `#F8FAFC`
- Placeholder color: `#94A3B8`
- Focus state: Border color changes to `#00D4FF`, subtle glow
- Padding: `12px 16px`
- Labels: `#94A3B8`, font-size 14px, margin-bottom 8px

### 6. Search Bar

- Prominent placement in hero section on homepage
- Full width with rounded pill shape
- Search icon on the left
- Placeholder: "Search software, books, tools, games..."
- Background: `#1E293B`
- Border: `1px solid rgba(0,212,255,0.3)`
- Submit button with gradient accent
- Autocomplete dropdown with matching results

### 7. Resource Detail Pages

- Full-width hero banner with resource image + overlay gradient
- Resource title in large heading
- Status badges row: Legal Status, Safety Status, License Type
- Description section with full rich-text content
- Details sidebar: Version, Developer, Platform, File Size, etc.
- External links section: Official Site, Download, GitHub (each clearly labeled)
- Related resources section at the bottom
- Breadcrumb navigation

### 8. Tables (Admin Dashboard)

- Background: `#1E293B`
- Row hover: `#263344`
- Header row: `#0F172A` with `#94A3B8` text
- Border: `1px solid rgba(255,255,255,0.05)`
- Action buttons: Edit (cyan), Delete (red), View (slate)
- Pagination at the bottom with current page highlighted

### 9. Modals

- Overlay background: `rgba(0,0,0,0.7)`
- Modal background: `#1E293B`
- Border: `1px solid rgba(255,255,255,0.10)`
- Border radius: `16px`
- Close button: top-right corner
- Animation: fade in + slide up

### 10. Admin Dashboard Layout

- Sidebar navigation (fixed on the left, collapsible on mobile)
  - Logo at top
  - Navigation menu items with icons
  - Active state: `#00D4FF` left border + highlighted background
- Main content area (right side, full width minus sidebar)
- Top bar with:
  - Page title
  - Admin username + avatar
  - Notifications bell
  - Logout button
- Dashboard stat cards with icons and counts

---

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile Small | < 480px | Single column, hamburger menu |
| Mobile | 480px – 768px | Single column, hamburger menu |
| Tablet | 768px – 1024px | 2-column grid, compressed nav |
| Desktop | 1024px – 1440px | Full layout, sidebar visible |
| Large Desktop | > 1440px | Max-width container (1400px), centered |

---

## Iconography

- Use **Lucide Icons** (open-source, modern, consistent)
- Alternative: **Phosphor Icons** (also open-source)
- Icons should match the accent color of their context
- Size standards: 16px (inline), 20px (buttons), 24px (navigation), 32px (section headers)

---

## Animation & Motion Guidelines

| Effect | CSS |
|---|---|
| Card hover scale | `transform: scale(1.02); transition: 0.2s ease` |
| Button hover | `filter: brightness(1.1); transition: 0.2s ease` |
| Page load | `opacity: 0 → 1; animation: fadeIn 0.4s ease` |
| Sidebar toggle | `width: 240px → 0; transition: 0.3s ease` |
| Modal open | `opacity + translateY(-20px) → 0; transition: 0.3s ease` |
| Search results | `opacity + translateY(10px) → 0; transition: 0.2s ease` |

---

## Accessibility Standards

- All images must have `alt` attributes
- Color contrast ratio must meet WCAG AA (4.5:1 for text)
- All interactive elements must be keyboard-focusable
- Focus rings must be visible
- Form labels must be associated with inputs
- ARIA labels for icon-only buttons

---

## Page Layout Templates

### Homepage Layout
```
[Header]
[Hero Section — Search + Tagline + Featured Stats]
[Featured Software (horizontal scroll cards)]
[Featured Books (horizontal scroll cards)]
[Featured Tools (grid cards)]
[Featured Watch Content (poster grid)]
[Featured GitHub Repos (list cards)]
[Latest News (3 column grid)]
[About Platform Banner]
[Footer]
```

### Resource Listing Page (e.g., Software Page)
```
[Header]
[Page Title + Breadcrumb]
[Filter Sidebar | Resource Cards Grid]
[Pagination]
[Footer]
```

### Resource Detail Page
```
[Header]
[Hero Banner with Resource Image]
[Breadcrumb]
[Two Column Layout]
  [Left: Title, Description, Details]
  [Right: Action Links, Legal Status, Tags, Related]
[Related Resources Section]
[Footer]
```

---

*Document created: Step 1 — Quantum Mentor World Planning Phase*
*Version: 1.0*
