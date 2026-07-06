-- =====================================================
-- Quantum Mentor World Seed Data
-- Project: Quantum Mentor World / Quantum Mentor Official
-- Stack: HTML, CSS, JavaScript, Node.js, Express.js, MySQL
-- Database: quantum_mentor_world
-- =====================================================

USE quantum_mentor_world;

START TRANSACTION;

-- =====================================================
-- 1. DEMO ADMIN USER
-- =====================================================
-- Hashed password for 'Admin@12345'
INSERT INTO users (id, full_name, username, email, password_hash, role, status, avatar, last_login_at, created_at, updated_at)
VALUES (
    1, 
    'Quantum Mentor Admin', 
    'admin', 
    'admin@quantummentor.local', 
    '$2a$10$gAs0BbK7RDBLM4pMZCm9YOjWs00BN/D/3GfKNTjhTVeryt./1bTpu', 
    'admin', 
    'active', 
    NULL, 
    NULL, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
)
ON DUPLICATE KEY UPDATE 
    full_name = VALUES(full_name),
    password_hash = VALUES(password_hash),
    updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- 2. CATEGORIES
-- =====================================================
INSERT INTO categories (id, name, slug, description, icon, parent_id, sort_order, status, created_at, updated_at)
VALUES 
(1, 'Software', 'software', 'Legal downloadable software, utilities, and applications.', 'software', NULL, 1, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Books', 'books', 'Legal open-access, public domain, and educational books.', 'book', NULL, 2, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Tools', 'tools', 'Web utilities, productivity tools, and development aides.', 'tool', NULL, 3, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Games', 'games', 'Free-to-play, educational, and open-source games.', 'gamepad', NULL, 4, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Themes & Plugins', 'themes-plugins', 'GPL-licensed and open-source website templates and plugins.', 'plugin', NULL, 5, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'Watch', 'watch', 'Verified legal video content and tutorials.', 'video', NULL, 6, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'News', 'news', 'Summarized industry news and resource rollups.', 'news', NULL, 7, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'GitHub Repositories', 'github-repositories', 'Selected open-source repositories and educational roadmaps.', 'github', NULL, 8, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 'AI Tools', 'ai-tools', 'Free or freemium artificial intelligence resources.', 'ai', NULL, 9, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 'Web Development', 'web-development', 'Resources for modern web design and coding.', 'code', NULL, 10, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 'Productivity', 'productivity', 'Resources to optimize learning and work workflows.', 'productivity', NULL, 11, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 'Education', 'education', 'General learning resources and academic guides.', 'education', NULL, 12, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 'Open Source', 'open-source', 'Projects and resources with open source licenses.', 'open-source', NULL, 13, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 'Design', 'design', 'Graphic assets, templates, and UI design resources.', 'design', NULL, 14, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 'Programming', 'programming', 'Software programming languages and runtime frameworks.', 'programming', NULL, 15, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    description = VALUES(description),
    icon = VALUES(icon),
    sort_order = VALUES(sort_order),
    status = VALUES(status),
    updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- 3. TAGS
-- =====================================================
INSERT INTO tags (id, name, slug, description, status, created_at, updated_at)
VALUES 
(1, 'Free', 'free', 'Available at no cost.', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Open Source', 'open-source', 'Source code is publicly available.', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Beginner Friendly', 'beginner-friendly', 'Tailored for newcomers.', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Educational', 'educational', 'Focuses on learning and growth.', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Official Link', 'official-link', 'Points to the primary creator website.', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'Safe Resource', 'safe-resource', 'Verified safe for developers and users.', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'Web Development', 'web-development', 'Relates to HTML, CSS, JS, Node, etc.', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'AI', 'ai', 'Involves machine learning or neural systems.', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 'Productivity', 'productivity', 'Optimizes efficiency and project management.', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 'Design', 'design', 'Relates to layout, UI/UX, and graphic design.', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 'Programming', 'programming', 'Relates to code development.', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 'Learning', 'learning', 'Resource oriented for tutorial and lessons.', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 'Public Domain', 'public-domain', 'Free of copyright restrictions.', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 'Creator Approved', 'creator-approved', 'Endorsed by the original author.', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 'Documentation', 'documentation', 'Extensive guides and manuals included.', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    description = VALUES(description),
    status = VALUES(status),
    updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- 4. SITE SETTINGS
-- =====================================================
INSERT INTO site_settings (id, setting_key, setting_value, setting_type, group_name, description, is_public, created_at, updated_at)
VALUES 
(1, 'site_name', 'Quantum Mentor World', 'text', 'general', 'Main website title', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'brand_name', 'Quantum Mentor Official', 'text', 'general', 'Corporate brand title', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'site_tagline', 'Legal educational resources, tools, books, software, and learning links in one place.', 'text', 'general', 'Tagline under brand name', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'site_email', 'support@example.com', 'email', 'general', 'Primary support email', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'legal_notice', 'This platform only supports legal, official, open-source, public-domain, freeware, creator-approved, or properly licensed resources.', 'textarea', 'general', 'Legal rules note shown to visitors', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'footer_text', 'Quantum Mentor World. Educational resource directory.', 'text', 'general', 'Footer copyright note', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'allow_user_reports', 'true', 'boolean', 'general', 'Allow users to flag broken/unsafe links', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'maintenance_mode', 'false', 'boolean', 'general', 'Enable or disable maintenance mode', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE 
    setting_value = VALUES(setting_value),
    setting_type = VALUES(setting_type),
    group_name = VALUES(group_name),
    description = VALUES(description),
    is_public = VALUES(is_public),
    updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- 5. DEMO RESOURCES
-- =====================================================
INSERT INTO resources (id, title, slug, resource_type, short_description, full_description, featured_image, status, visibility, is_featured, is_trending, legal_status, safety_status, source_type, access_type, view_count, published_at, created_by, updated_by, created_at, updated_at)
VALUES
-- 2 Software resources (id 1, 2)
(1, 'Open Source Code Editor Demo', 'open-source-code-editor-demo', 'software', 'A safe demo code editor for programmers.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents an editor with syntax highlighting.', NULL, 'published', 'public', 1, 0, 'approved', 'safe', 'open_source', 'open_source', 120, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Free PDF Reader Demo', 'free-pdf-reader-demo', 'software', 'A clean, lightweight PDF reader simulation.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents a lightweight document viewer.', NULL, 'published', 'public', 0, 0, 'approved', 'safe', 'freeware', 'free', 45, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- 2 Book resources (id 3, 4)
(3, 'Beginner Web Development Guide', 'beginner-web-development-guide', 'book', 'An open access introductory book on HTML, CSS, and JS.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents a beginner tutorial handbook.', NULL, 'published', 'public', 1, 1, 'approved', 'safe', 'educational', 'free', 250, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Public Domain Learning Book', 'public-domain-learning-book', 'book', 'A classic public domain educational manuscript.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents a digitized classic historical document.', NULL, 'published', 'public', 0, 0, 'approved', 'safe', 'public_domain', 'public_domain', 78, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- 2 Tool resources (id 5, 6)
(5, 'Online Text Formatter Tool', 'online-text-formatter-tool', 'tool', 'A web utility to format and clean text blocks.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents a client-side text formatter.', NULL, 'published', 'public', 0, 1, 'approved', 'safe', 'creator_approved', 'free', 312, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'Image Compression Tool Demo', 'image-compression-tool-demo', 'tool', 'A lightweight offline image shrinker.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents a secure browser utility to compress media.', NULL, 'published', 'public', 0, 0, 'approved', 'safe', 'open_source', 'free', 92, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- 2 Game resources (id 7, 8)
(7, 'Educational Puzzle Game', 'educational-puzzle-game', 'game', 'A logical puzzle game focused on learning algebra.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents an interactive math game.', NULL, 'published', 'public', 1, 0, 'approved', 'safe', 'educational', 'free', 143, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'Typing Practice Game', 'typing-practice-game', 'game', 'A retro terminal typing tutor simulation.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents a fast-paced coding/typing speed tester.', NULL, 'published', 'public', 0, 1, 'approved', 'safe', 'freeware', 'free', 201, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- 2 Theme/Plugin resources (id 9, 10)
(9, 'Free Educational Website Template', 'free-educational-website-template', 'theme_plugin', 'A responsive HTML/CSS website template for educators.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents an open-source landing page template.', NULL, 'published', 'public', 0, 0, 'approved', 'safe', 'open_source', 'open_source', 88, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 'Open Source Contact Form Plugin Demo', 'open-source-contact-form-plugin-demo', 'theme_plugin', 'A modular contact form handler simulation.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents a customizable backend contact widget.', NULL, 'published', 'public', 0, 0, 'approved', 'safe', 'licensed', 'free', 53, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- 2 Watch resources (id 11, 12)
(11, 'Web Development Tutorial Series', 'web-development-tutorial-series', 'watch', 'A step-by-step video training series for beginners.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents a curated educational playlist.', NULL, 'published', 'public', 1, 1, 'approved', 'safe', 'creator_approved', 'external', 415, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 'Public Domain Educational Video Collection', 'public-domain-educational-video-collection', 'watch', 'Classic archival footage explaining history and science.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents vintage public educational movies.', NULL, 'published', 'public', 0, 0, 'approved', 'safe', 'public_domain', 'public_domain', 110, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- 2 News resources (id 13, 14)
(13, 'AI Learning Tools Weekly Update', 'ai-learning-tools-weekly-update', 'news', 'Weekly digest tracking the best new AI tools for teachers.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents an editorial news digest.', NULL, 'published', 'public', 0, 0, 'approved', 'safe', 'educational', 'free', 135, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 'Open Source Education Resources Roundup', 'open-source-education-resources-roundup', 'news', 'An overview of new free libraries and toolsets released.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents an educational resource report.', NULL, 'published', 'public', 0, 0, 'approved', 'safe', 'official', 'free', 67, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- 2 GitHub repo resources (id 15, 16)
(15, 'Beginner JavaScript Examples Repository', 'beginner-javascript-examples-repository', 'github_repo', 'Open-source repository containing easy JS tasks.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents a repository of basic script formulas.', NULL, 'published', 'public', 0, 1, 'approved', 'safe', 'open_source', 'open_source', 190, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(16, 'Open Source Learning Roadmap Repository', 'open-source-learning-roadmap-repository', 'github_repo', 'Curated step-by-step roadmap diagrams for developers.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents a graphical workflow roadmap repository.', NULL, 'published', 'public', 1, 0, 'approved', 'safe', 'open_source', 'open_source', 302, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE 
    title = VALUES(title),
    short_description = VALUES(short_description),
    full_description = VALUES(full_description),
    status = VALUES(status),
    visibility = VALUES(visibility),
    is_featured = VALUES(is_featured),
    is_trending = VALUES(is_trending),
    legal_status = VALUES(legal_status),
    safety_status = VALUES(safety_status),
    source_type = VALUES(source_type),
    access_type = VALUES(access_type),
    updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- 6. RESOURCE DETAILS
-- =====================================================
INSERT INTO resource_details (id, resource_id, version, platform, developer, author, publisher, language, file_size, license_type, release_year, requirements, installation_guide, features, limitations, documentation_url, official_url, demo_url, trailer_url, github_url, read_online_url, extra_json)
VALUES
(1, 1, '1.2.0', 'Windows / macOS / Linux', 'CodeCreator Team', NULL, NULL, 'English', '45 MB', 'MIT License', 2026, 'Basic PC with 2GB RAM.', 'Download and run installer.', 'Syntax highlighting, plugin support, theme customizer.', 'Demo version for local server tests only.', 'https://example.com/docs', 'https://example.com', 'https://example.com/demo', NULL, 'https://example.com/github-demo', NULL, NULL),
(2, 2, '2.0.1', 'Windows', 'DocFormatters Corp', NULL, NULL, 'English', '12 MB', 'Freeware', 2026, 'Windows 10 or above.', 'Extract ZIP and click exe.', 'Tabs, lightweight rendering, search function.', 'No annotation support in free mode.', 'https://example.com/docs', 'https://example.com', NULL, NULL, NULL, NULL, NULL),
(3, 3, '1.0.0', 'eBook / Web', NULL, 'Jane Doe', 'MentorPress', 'English', '8 MB', 'Creative Commons BY-SA', 2026, 'ePub reader or web browser.', 'Open in any compatible browser or reader application.', 'Covers layouts, grids, flexbox, async functions.', 'Single developer focus.', 'https://example.com/docs', 'https://example.com', NULL, NULL, NULL, 'https://example.com/read', NULL),
(4, 4, '1890 Edition', 'eBook', NULL, 'Classic Educator', 'Public Domain Hub', 'English', '4 MB', 'CC0 Public Domain', 2026, 'Standard PDF reader.', 'Open file directly.', 'Scanned illustrations, classic learning methodology.', 'Antiquated language structure.', NULL, 'https://example.com', NULL, NULL, NULL, 'https://example.com/read', NULL),
(5, 5, '3.1.0', 'Web Browser', 'WebUtilities Dev', NULL, NULL, 'English', 'N/A (Web)', 'Free Use / Creator Approved', 2026, 'JavaScript-enabled browser.', 'Access directly via browser URL.', 'Format JSON, clean whitespaces, case converters.', 'Internet connection needed.', 'https://example.com/docs', 'https://example.com', 'https://example.com/demo', NULL, NULL, NULL, NULL),
(6, 6, '0.9.5', 'Cross-platform (Electron)', 'CompressIO Project', NULL, NULL, 'English', '28 MB', 'GPL-3.0 License', 2026, 'Node.js runtime or cross-platform bundle.', 'Extract and run the execution command.', 'Compresses JPG, PNG, and WebP offline.', 'Batch processing is single-threaded.', 'https://example.com/docs', 'https://example.com', NULL, NULL, 'https://example.com/github-demo', NULL, NULL),
(7, 7, '2.4.0', 'Web / HTML5', 'AlgebraLearn', NULL, NULL, 'English', '15 MB', 'Free / Academic', 2026, 'HTML5-capable browser.', 'Launch web launcher or embed canvas.', 'Equations puzzles, leveling roadmap, achievements.', 'Registration required for score tracking.', 'https://example.com/docs', 'https://example.com', 'https://example.com/demo', NULL, NULL, NULL, NULL),
(8, 8, '1.1.0', 'Terminal / Cross-platform', 'RetroCoders', NULL, NULL, 'English', '2 MB', 'Freeware', 2026, 'Any standard terminal console shell.', 'Run npm install -g RetroTyping.', 'WPM analyzer, code snippets typing, sound effects.', 'Text-only layout.', 'https://example.com/docs', 'https://example.com', 'https://example.com/demo', NULL, 'https://example.com/github-demo', NULL, NULL),
(9, 9, '1.0.0', 'HTML5 / CSS3', 'DesignGrid', NULL, NULL, 'English', '3 MB', 'MIT License', 2026, 'Standard text editor and browser.', 'Deploy source files to any host.', 'Responsive layout, navbar grid, CSS customized.', 'No backend structure included.', 'https://example.com/docs', 'https://example.com', 'https://example.com/demo', NULL, 'https://example.com/github-demo', NULL, NULL),
(10, 10, '1.3.1', 'Node.js / Express', 'FormBuilders', NULL, NULL, 'English', '40 KB', 'GPL-2.0 License', 2026, 'Node.js environment.', 'Install dependency via npm.', 'Server validation, captcha support, modular templates.', 'Relies on Express backend.', 'https://example.com/docs', 'https://example.com', NULL, NULL, 'https://example.com/github-demo', NULL, NULL),
(11, 11, 'N/A', 'Video Playlist', 'EduVideo Production', NULL, NULL, 'English', 'N/A', 'Creator Approved', 2026, 'YouTube or Vimeo access.', 'Navigate to legal video links to watch.', '10 hours of video lessons, source repos.', 'Advertisements depend on target platform.', 'https://example.com/docs', 'https://example.com', 'https://example.com/demo', 'https://example.com/demo', NULL, NULL, NULL),
(12, 12, 'N/A', 'Video Playlist', NULL, 'Multiple Authors', 'Archive.org Education', 'English', 'N/A', 'Public Domain', 2026, 'Compatible web browser with video playback.', 'Load streaming archives online.', 'Rare vintage footages, captions translation.', 'Older low-resolution media.', NULL, 'https://example.com', NULL, NULL, NULL, NULL, NULL),
(13, 13, 'N/A', 'News Summary', 'EdNews Team', NULL, NULL, 'English', 'N/A', 'Educational Use', 2026, 'Internet browser.', 'Open page link.', 'Ranked list of AI assistance sites, features reviews.', 'Information status as of publishing date.', NULL, 'https://example.com', NULL, NULL, NULL, NULL, NULL),
(14, 14, 'N/A', 'News Summary', 'OpenSourceEd Org', NULL, NULL, 'English', 'N/A', 'Creative Commons Attribution', 2026, 'Internet browser.', 'Open page link.', 'Reviews of 5 new developer training platforms.', 'Requires attribution when sharing.', NULL, 'https://example.com', NULL, NULL, NULL, NULL, NULL),
(15, 15, '1.0.0', 'Git Repository', 'JSBeginners Team', NULL, NULL, 'English', '1.5 MB', 'MIT License', 2026, 'Git client, Node.js.', 'Clone repository using git CLI.', 'Vanilla JS challenges, automated tests setup.', 'Basic scope focus.', 'https://example.com/docs', 'https://example.com', NULL, NULL, 'https://example.com/github-demo', NULL, NULL),
(16, 16, '3.0.0', 'Git Repository', 'DevRoadmaps', NULL, NULL, 'English', '5 MB', 'Creative Commons BY-NC', 2026, 'GitHub access or browser.', 'Access repo files or browse roadmap graphics.', 'Visual career paths, skill tags, checklists.', 'Updated quarterly.', 'https://example.com/docs', 'https://example.com', NULL, NULL, 'https://example.com/github-demo', NULL, NULL)
ON DUPLICATE KEY UPDATE 
    version = VALUES(version),
    platform = VALUES(platform),
    developer = VALUES(developer),
    author = VALUES(author),
    publisher = VALUES(publisher),
    language = VALUES(language),
    file_size = VALUES(file_size),
    license_type = VALUES(license_type),
    release_year = VALUES(release_year),
    requirements = VALUES(requirements),
    installation_guide = VALUES(installation_guide),
    features = VALUES(features),
    limitations = VALUES(limitations),
    documentation_url = VALUES(documentation_url),
    official_url = VALUES(official_url),
    demo_url = VALUES(demo_url),
    trailer_url = VALUES(trailer_url),
    github_url = VALUES(github_url),
    read_online_url = VALUES(read_online_url),
    updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- 7. RESOURCE CATEGORIES
-- =====================================================
INSERT INTO resource_categories (resource_id, category_id)
VALUES
(1, 1), (1, 10), (1, 13), (1, 15),
(2, 1), (2, 11),
(3, 2), (3, 10), (3, 12),
(4, 2), (4, 12), (4, 13),
(5, 3), (5, 11),
(6, 3), (6, 13), (6, 14),
(7, 4), (7, 12),
(8, 4), (8, 11), (8, 15),
(9, 5), (9, 10), (9, 14),
(10, 5), (10, 10), (10, 13),
(11, 6), (11, 10), (11, 12), (11, 15),
(12, 6), (12, 12), (12, 13),
(13, 7), (13, 9), (13, 12),
(14, 7), (14, 12), (14, 13),
(15, 8), (15, 10), (15, 13), (15, 15),
(16, 8), (16, 12), (16, 13), (16, 15)
ON DUPLICATE KEY UPDATE resource_id = resource_id;

-- =====================================================
-- 8. RESOURCE TAGS
-- =====================================================
INSERT INTO resource_tags (resource_id, tag_id)
VALUES
(1, 1), (1, 2), (1, 3), (1, 6), (1, 11), (1, 15),
(2, 1), (2, 5), (2, 6), (2, 9),
(3, 1), (3, 3), (3, 4), (3, 7), (3, 12), (3, 15),
(4, 1), (4, 4), (4, 12), (4, 13),
(5, 1), (5, 5), (5, 6), (5, 9), (5, 15),
(6, 1), (6, 2), (6, 6), (6, 9), (6, 10),
(7, 1), (7, 3), (7, 4), (7, 12),
(8, 1), (8, 4), (8, 9), (8, 11),
(9, 1), (9, 2), (9, 3), (9, 7), (9, 10),
(10, 1), (10, 2), (10, 6), (10, 7), (10, 15),
(11, 1), (11, 3), (11, 4), (11, 7), (11, 11), (11, 12), (11, 14),
(12, 1), (12, 4), (12, 12), (12, 13),
(13, 1), (13, 4), (13, 8), (13, 9),
(14, 1), (14, 2), (14, 4), (14, 12),
(15, 1), (15, 2), (15, 3), (15, 7), (15, 11), (15, 12), (15, 15),
(16, 1), (16, 2), (16, 3), (16, 4), (16, 5), (16, 11), (16, 12), (16, 15)
ON DUPLICATE KEY UPDATE resource_id = resource_id;

-- =====================================================
-- 9. RESOURCE LINKS
-- =====================================================
INSERT INTO resource_links (id, resource_id, label, url, link_type, source_type, legal_status, safety_status, is_primary, click_count, created_by, created_at, updated_at)
VALUES
-- Software links
(1, 1, 'Official Resource Page', 'https://example.com', 'official', 'open_source', 'approved', 'safe', 1, 10, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 1, 'View Repository', 'https://example.com/github-demo', 'github', 'open_source', 'approved', 'safe', 0, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 2, 'Official Resource Page', 'https://example.com', 'official', 'freeware', 'approved', 'safe', 1, 8, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Book links
(4, 3, 'Read Online', 'https://example.com/read', 'read_online', 'educational', 'approved', 'safe', 1, 42, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 3, 'Official Documentation', 'https://example.com/docs', 'documentation', 'educational', 'approved', 'safe', 0, 5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 4, 'Read Online', 'https://example.com/read', 'read_online', 'public_domain', 'approved', 'safe', 1, 15, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Tool links
(7, 5, 'Open Demo', 'https://example.com/demo', 'demo', 'creator_approved', 'approved', 'safe', 1, 55, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 6, 'Official Resource Page', 'https://example.com', 'official', 'open_source', 'approved', 'safe', 1, 12, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 6, 'View Repository', 'https://example.com/github-demo', 'github', 'open_source', 'approved', 'safe', 0, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Game links
(10, 7, 'Open Demo', 'https://example.com/demo', 'demo', 'educational', 'approved', 'safe', 1, 23, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 8, 'Open Demo', 'https://example.com/demo', 'demo', 'freeware', 'approved', 'safe', 1, 31, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Theme/Plugin links
(12, 9, 'Open Demo', 'https://example.com/demo', 'demo', 'open_source', 'approved', 'safe', 1, 19, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 10, 'View Repository', 'https://example.com/github-demo', 'github', 'licensed', 'approved', 'safe', 1, 7, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Watch links
(14, 11, 'Official Video Playlist', 'https://example.com', 'official', 'creator_approved', 'approved', 'safe', 1, 84, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 12, 'Official Resource Page', 'https://example.com', 'official', 'public_domain', 'approved', 'safe', 1, 21, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- News links
(16, 13, 'Official Resource Page', 'https://example.com', 'official', 'educational', 'approved', 'safe', 1, 38, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(17, 14, 'Official Resource Page', 'https://example.com', 'official', 'official', 'approved', 'safe', 1, 14, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Github links
(18, 15, 'View Repository', 'https://example.com/github-demo', 'github', 'open_source', 'approved', 'safe', 1, 56, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(19, 16, 'View Repository', 'https://example.com/github-demo', 'github', 'open_source', 'approved', 'safe', 1, 99, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE 
    label = VALUES(label),
    url = VALUES(url),
    link_type = VALUES(link_type),
    source_type = VALUES(source_type),
    legal_status = VALUES(legal_status),
    safety_status = VALUES(safety_status),
    is_primary = VALUES(is_primary),
    updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- 10. WATCH EPISODES
-- =====================================================
INSERT INTO watch_episodes (id, resource_id, season_number, episode_number, title, slug, description, thumbnail, duration, release_date, status, sort_order, created_at, updated_at)
VALUES
-- Resource 11 episodes
(1, 11, 1, 1, 'Introduction to Web Development', 'intro-to-web-dev', 'Learn the basics of what web development is and how computers communicate.', NULL, '45:30', '2026-01-10', 'published', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 11, 1, 2, 'HTML, CSS, and JavaScript Basics', 'html-css-js-basics', 'A quick hands-on tour creating static pages with formatting and styles.', NULL, '55:12', '2026-01-12', 'published', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Resource 12 episodes
(3, 12, 1, 1, 'Learning With Public Domain Media', 'learning-public-domain-media', 'An overview of why public domain databases are valuable learning engines.', NULL, '30:15', '2026-02-01', 'published', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 12, 1, 2, 'How to Verify Legal Video Sources', 'verify-legal-video-sources', 'A step-by-step checklist to auditing video copyright and reuse rights.', NULL, '35:40', '2026-02-05', 'published', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE 
    title = VALUES(title),
    description = VALUES(description),
    duration = VALUES(duration),
    release_date = VALUES(release_date),
    status = VALUES(status),
    sort_order = VALUES(sort_order),
    updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- 11. WATCH SERVERS
-- =====================================================
INSERT INTO watch_servers (id, episode_id, server_name, embed_url, source_url, source_type, legal_status, safety_status, is_primary, sort_order, created_at, updated_at)
VALUES
(1, 1, 'Official Educational Placeholder', 'https://example.com/video', NULL, 'educational', 'approved', 'safe', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 2, 'Official Educational Placeholder', 'https://example.com/video', NULL, 'educational', 'approved', 'safe', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 3, 'Official Educational Placeholder', 'https://example.com/video', NULL, 'educational', 'approved', 'safe', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 4, 'Official Educational Placeholder', 'https://example.com/video', NULL, 'educational', 'approved', 'safe', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE 
    server_name = VALUES(server_name),
    embed_url = VALUES(embed_url),
    source_type = VALUES(source_type),
    legal_status = VALUES(legal_status),
    safety_status = VALUES(safety_status),
    is_primary = VALUES(is_primary),
    sort_order = VALUES(sort_order),
    updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- 12. ADMIN ACTIVITY LOGS
-- =====================================================
INSERT INTO admin_activity_logs (id, user_id, action, entity_type, entity_id, description, old_values, new_values, ip_address, user_agent, created_at)
VALUES (
    1, 
    1, 
    'create', 
    'seed_data', 
    1, 
    'Initial legal demo seed data inserted for local development.', 
    NULL, 
    NULL, 
    '127.0.0.1', 
    'Local Seeder Script', 
    CURRENT_TIMESTAMP
)
ON DUPLICATE KEY UPDATE 
    description = VALUES(description),
    created_at = CURRENT_TIMESTAMP;

COMMIT;
