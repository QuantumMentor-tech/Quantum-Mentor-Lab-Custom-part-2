# 03 — Resource Types & Fields
## Quantum Mentor World | Quantum Mentor Official

---

## Overview

Quantum Mentor World supports **8 distinct resource types**. Each resource type has its own set of fields to capture relevant metadata. All resource types share a common base set of fields, and then have their own type-specific fields.

---

## Common Base Fields (All Resource Types)

These fields apply to every resource regardless of type:

| Field | Type | Description |
|---|---|---|
| `id` | INT AUTO_INCREMENT | Unique resource ID |
| `resource_type` | ENUM | software, book, tool, game, theme_plugin, watch, news, github_repo |
| `title` | VARCHAR(255) | Resource title |
| `slug` | VARCHAR(255) UNIQUE | URL-friendly version of title |
| `short_description` | TEXT | Brief summary (max 300 chars) |
| `full_description` | LONGTEXT | Full description (supports rich text / HTML) |
| `featured_image` | VARCHAR(500) | Path or URL to featured image |
| `categories` | Relation | Many-to-many via resource_categories |
| `tags` | Relation | Many-to-many via resource_tags |
| `legal_status` | ENUM | pending, approved, rejected, under_review |
| `safety_status` | ENUM | safe, caution, unverified |
| `status` | ENUM | draft, published, inactive |
| `created_at` | DATETIME | Date resource was created |
| `updated_at` | DATETIME | Date resource was last updated |
| `created_by` | INT | Admin user who created the entry |

---

## Resource Type 1 — Software

Software includes legal desktop applications, open-source programs, freeware, and creator-approved tools.

### Software-Specific Fields

| Field | Type | Description |
|---|---|---|
| `version` | VARCHAR(50) | Current version (e.g., 3.4.1) |
| `platform` | VARCHAR(255) | Windows, macOS, Linux, Cross-platform |
| `developer` | VARCHAR(255) | Developer or company name |
| `license_type` | VARCHAR(100) | MIT, GPL, Apache, Freeware, etc. |
| `file_size` | VARCHAR(50) | File size (e.g., 45 MB) |
| `system_requirements` | TEXT | Minimum system requirements |
| `installation_guide` | TEXT | Step-by-step installation instructions |
| `official_website_url` | VARCHAR(500) | Official product homepage |
| `download_url` | VARCHAR(500) | Direct download link (legal only) |
| `github_url` | VARCHAR(500) | GitHub repository (optional) |

### Example Software Entry

```
Title: VLC Media Player
Version: 3.0.20
Platform: Windows, macOS, Linux
Developer: VideoLAN
License: GPL-2.0
File Size: 40 MB
Official URL: https://www.videolan.org
Download URL: https://www.videolan.org/vlc/
Legal Status: Approved
Safety Status: Safe
```

---

## Resource Type 2 — Books

Books include open-access books, public-domain books, freely available legal PDFs, and official e-books with open licenses.

### Books-Specific Fields

| Field | Type | Description |
|---|---|---|
| `cover_image` | VARCHAR(500) | Book cover image path or URL |
| `author` | VARCHAR(255) | Author name(s) |
| `publisher` | VARCHAR(255) | Publisher name |
| `language` | VARCHAR(100) | Language of the book |
| `pages` | INT | Number of pages |
| `format` | VARCHAR(100) | PDF, EPUB, HTML, Online only |
| `publication_year` | YEAR | Year of publication |
| `isbn` | VARCHAR(50) | ISBN number (if applicable) |
| `official_source_url` | VARCHAR(500) | Official page or source |
| `read_online_url` | VARCHAR(500) | Link to read online |
| `download_url` | VARCHAR(500) | Legal download link (if available) |
| `copyright_status` | VARCHAR(200) | Public domain, CC license, Open access |

### Example Book Entry

```
Title: Python Crash Course
Author: Eric Matthes
Publisher: No Starch Press
Language: English
Pages: 544
Format: PDF, EPUB
Publication Year: 2023
Legal Status: Approved (official open access)
Safety Status: Safe
```

---

## Resource Type 3 — Tools

Tools include web-based tools, developer utilities, productivity apps, online generators, and educational tools available via official URLs.

### Tools-Specific Fields

| Field | Type | Description |
|---|---|---|
| `tool_icon` | VARCHAR(500) | Tool icon/image |
| `tool_type` | VARCHAR(100) | Web tool, Desktop tool, CLI tool, Browser extension |
| `access_type` | VARCHAR(100) | Free, Freemium, Open Source |
| `features` | TEXT | Key features list |
| `instructions` | TEXT | How to use the tool |
| `limitations` | TEXT | Free plan limitations or restrictions |
| `launch_tool_url` | VARCHAR(500) | Direct link to launch the tool |
| `official_url` | VARCHAR(500) | Official website |

### Example Tool Entry

```
Title: Canva
Tool Type: Web Tool
Access Type: Freemium
Features: Graphic design, Presentations, Social media posts
Launch URL: https://www.canva.com
Official URL: https://www.canva.com
Legal Status: Approved
Safety Status: Safe
```

---

## Resource Type 4 — Games

Games include free-to-play games, open-source games, educational games, browser-based games, and legally downloadable games.

### Games-Specific Fields

| Field | Type | Description |
|---|---|---|
| `platform` | VARCHAR(255) | Windows, macOS, Linux, Browser, Android |
| `genre` | VARCHAR(100) | Puzzle, Strategy, Educational, RPG, etc. |
| `developer` | VARCHAR(255) | Game developer or studio |
| `license_type` | VARCHAR(100) | Free, Open Source, Freeware |
| `version` | VARCHAR(50) | Game version |
| `file_size` | VARCHAR(50) | File size (if downloadable) |
| `trailer_url` | VARCHAR(500) | YouTube trailer URL |
| `system_requirements` | TEXT | Minimum system requirements |
| `official_website_url` | VARCHAR(500) | Official game website |
| `download_url` | VARCHAR(500) | Legal download link |

### Example Game Entry

```
Title: 0 A.D.
Platform: Windows, macOS, Linux
Genre: Strategy
Developer: Wildfire Games
License: GPL-2.0 / CC BY-SA
Trailer URL: https://youtube.com/...
Official URL: https://play0ad.com
Legal Status: Approved
Safety Status: Safe
```

---

## Resource Type 5 — Themes & Plugins

Themes and plugins include GPL-licensed WordPress themes and plugins, open-source CMS extensions, and legally released design resources.

### Themes & Plugins-Specific Fields

| Field | Type | Description |
|---|---|---|
| `platform` | VARCHAR(100) | WordPress, Joomla, Drupal, Ghost, etc. |
| `type` | ENUM | theme, plugin, extension |
| `version` | VARCHAR(50) | Current version |
| `developer` | VARCHAR(255) | Developer or team name |
| `license_type` | VARCHAR(100) | GPL-2.0, MIT, etc. |
| `official_url` | VARCHAR(500) | Official product page |
| `demo_url` | VARCHAR(500) | Live demo link |
| `documentation_url` | VARCHAR(500) | Official documentation link |
| `download_url` | VARCHAR(500) | Legal download link |
| `gpl_status` | VARCHAR(100) | GPL compliant, Open source verified |

### Example Theme Entry

```
Title: Astra Theme
Platform: WordPress
Type: Theme
Version: 4.6.2
Developer: Brainstorm Force
License: GPL-2.0
Official URL: https://wpastra.com
Demo URL: https://wpastra.com/demo
Download URL: https://wordpress.org/themes/astra/
Legal Status: Approved
Safety Status: Safe
```

---

## Resource Type 6 — Watch Content

Watch content includes legal video embeds from YouTube, Vimeo, Archive.org, and creator-approved educational videos.

### Watch Content-Specific Fields

| Field | Type | Description |
|---|---|---|
| `poster_image` | VARCHAR(500) | Poster/thumbnail image |
| `banner_image` | VARCHAR(500) | Banner image for the watch page |
| `content_type` | ENUM | tutorial, documentary, course, series, short_film, lecture |
| `genre` | VARCHAR(100) | Tech, Science, Education, History, etc. |
| `language` | VARCHAR(100) | Primary language of the content |
| `release_year` | YEAR | Year of release |
| `watch_status` | ENUM | ongoing, completed, upcoming |
| `total_episodes` | INT | Number of episodes or parts |
| `source_attribution` | TEXT | Original creator/channel credit |
| `legal_approval_status` | VARCHAR(200) | Official embed, Public domain, Creator-approved |

### Watch Episodes Sub-Table Fields (watch_episodes)

| Field | Type | Description |
|---|---|---|
| `episode_id` | INT AUTO_INCREMENT | Episode ID |
| `resource_id` | INT | Parent resource ID |
| `episode_number` | INT | Episode number |
| `episode_title` | VARCHAR(255) | Episode title |
| `episode_description` | TEXT | Episode description |
| `thumbnail` | VARCHAR(500) | Episode thumbnail |
| `duration` | VARCHAR(20) | Duration (e.g., "45:30") |

### Watch Servers Sub-Table Fields (watch_servers)

| Field | Type | Description |
|---|---|---|
| `server_id` | INT AUTO_INCREMENT | Server entry ID |
| `episode_id` | INT | Linked episode ID |
| `server_name` | VARCHAR(100) | YouTube, Vimeo, Archive.org |
| `embed_url` | VARCHAR(500) | Legal embed URL |
| `quality` | VARCHAR(50) | 720p, 1080p, Auto |
| `is_primary` | BOOLEAN | Primary server flag |

### Allowed Embed Sources

| Source | Notes |
|---|---|
| YouTube | Official embeds via youtube.com/embed/ |
| Vimeo | Official embeds via player.vimeo.com |
| Archive.org | Public domain content |
| Creator-approved | Direct permission granted by creator |
| Educational platforms | Coursera, Khan Academy public content |

---

## Resource Type 7 — News

News includes summaries of educational and technology news with proper source attribution.

### News-Specific Fields

| Field | Type | Description |
|---|---|---|
| `article_summary` | TEXT | Short summary of the news (not full copy) |
| `full_content` | LONGTEXT | Commentary / editorial notes (original content only) |
| `source_name` | VARCHAR(255) | Original news source name |
| `source_url` | VARCHAR(500) | Link to original article |
| `author_name` | VARCHAR(255) | Article author (if available) |
| `published_date` | DATE | Original publication date |
| `updated_date` | DATE | Last update date |

> **Copyright Rule:** Full articles from external sources must NOT be copied. Only summaries, excerpts (clearly attributed), and original commentary are allowed.

### Example News Entry

```
Title: "Python 3.13 Released with New Features"
Summary: Python 3.13 brings improved error messages and experimental JIT compiler...
Source: Python.org
Source URL: https://www.python.org/downloads/release/python-3130/
Author: Python Core Team
Published Date: 2024-10-07
Legal Status: Approved (summary + attribution)
```

---

## Resource Type 8 — GitHub Repositories

GitHub Repositories are curated listings of useful open-source repositories for developers and learners.

### GitHub Repositories-Specific Fields

| Field | Type | Description |
|---|---|---|
| `repository_url` | VARCHAR(500) | Full GitHub repository URL |
| `owner` | VARCHAR(255) | Repository owner or organization |
| `programming_language` | VARCHAR(100) | Primary language (Python, JS, Rust, etc.) |
| `license` | VARCHAR(100) | Repository license (MIT, GPL, Apache, etc.) |
| `github_stars` | INT | Approximate star count (optional, manually updated) |
| `github_forks` | INT | Approximate fork count (optional) |
| `documentation_url` | VARCHAR(500) | Official docs or README link |
| `installation_command` | TEXT | Primary install command |
| `difficulty_level` | ENUM | beginner, intermediate, advanced |
| `open_source_note` | TEXT | Safety/open-source verification note |

### Example GitHub Repo Entry

```
Title: FreeCodeCamp
Owner: freeCodeCamp
Repository URL: https://github.com/freeCodeCamp/freeCodeCamp
Language: JavaScript
License: BSD-3-Clause
Stars: 400,000+
Difficulty Level: Beginner to Advanced
Open Source Note: Fully verified open-source, safe and legal
Legal Status: Approved
```

---

## Field Summary Table

| Resource Type | Total Unique Fields | Common Base Fields | Type-Specific Fields |
|---|---|---|---|
| Software | 25 | 15 | 10 |
| Books | 27 | 15 | 12 |
| Tools | 23 | 15 | 8 |
| Games | 25 | 15 | 10 |
| Themes & Plugins | 25 | 15 | 10 |
| Watch Content | 25+ | 15 | 10+ (+ episodes + servers) |
| News | 22 | 15 | 7 |
| GitHub Repositories | 25 | 15 | 10 |

---

*Document created: Step 1 — Quantum Mentor World Planning Phase*
*Version: 1.0*
