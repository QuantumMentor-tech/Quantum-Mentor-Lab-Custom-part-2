-- =====================================================
-- Quantum Mentor World Database Schema
-- Project: Quantum Mentor World / Quantum Mentor Official
-- Stack: HTML, CSS, JavaScript, Node.js, Express.js, MySQL
-- Database: quantum_mentor_world
-- =====================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- =====================================================
-- CREATE DATABASE
-- =====================================================
CREATE DATABASE IF NOT EXISTS quantum_mentor_world
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE quantum_mentor_world;

-- Disable foreign key checks during reset and creation
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- WARNING:
-- DROP TABLE statements are for local development only.
-- Do not use this file to reset production data.
-- =====================================================
DROP TABLE IF EXISTS resource_reports;
DROP TABLE IF EXISTS admin_activity_logs;
DROP TABLE IF EXISTS site_settings;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS watch_servers;
DROP TABLE IF EXISTS watch_episodes;
DROP TABLE IF EXISTS resource_links;
DROP TABLE IF EXISTS resource_tags;
DROP TABLE IF EXISTS resource_categories;
DROP TABLE IF EXISTS resource_details;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS media;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- =====================================================
-- TABLE 1 — users
-- =====================================================
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    username VARCHAR(80) NOT NULL,
    email VARCHAR(190) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor', 'moderator', 'user') NOT NULL DEFAULT 'user',
    status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
    avatar VARCHAR(500) DEFAULT NULL,
    last_login_at DATETIME DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL,
    UNIQUE KEY uq_users_username (username),
    UNIQUE KEY uq_users_email (email),
    INDEX idx_users_email (email),
    INDEX idx_users_username (username),
    INDEX idx_users_role (role),
    INDEX idx_users_status (status),
    INDEX idx_users_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- TABLE 2 — categories
-- =====================================================
CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    description TEXT DEFAULT NULL,
    icon VARCHAR(100) DEFAULT NULL,
    parent_id BIGINT UNSIGNED DEFAULT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL,
    UNIQUE KEY uq_categories_slug (slug),
    CONSTRAINT fk_categories_parent_id FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_categories_slug (slug),
    INDEX idx_categories_parent_id (parent_id),
    INDEX idx_categories_status (status),
    INDEX idx_categories_sort_order (sort_order),
    INDEX idx_categories_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- TABLE 3 — tags
-- =====================================================
CREATE TABLE tags (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT DEFAULT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL,
    UNIQUE KEY uq_tags_slug (slug),
    INDEX idx_tags_slug (slug),
    INDEX idx_tags_status (status),
    INDEX idx_tags_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- TABLE 4 — media
-- =====================================================
CREATE TABLE media (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) DEFAULT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT UNSIGNED NOT NULL DEFAULT 0,
    alt_text VARCHAR(255) DEFAULT NULL,
    caption TEXT DEFAULT NULL,
    uploaded_by BIGINT UNSIGNED DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL,
    CONSTRAINT fk_media_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_media_uploaded_by (uploaded_by),
    INDEX idx_media_mime_type (mime_type),
    INDEX idx_media_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- TABLE 5 — resources
-- =====================================================
CREATE TABLE resources (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) NOT NULL,
    resource_type ENUM('software', 'book', 'tool', 'game', 'theme_plugin', 'watch', 'news', 'github_repo') NOT NULL,
    short_description TEXT DEFAULT NULL,
    full_description LONGTEXT DEFAULT NULL,
    featured_image VARCHAR(500) DEFAULT NULL,
    status ENUM('draft', 'pending_review', 'published', 'rejected', 'archived') NOT NULL DEFAULT 'draft',
    visibility ENUM('public', 'private') NOT NULL DEFAULT 'public',
    is_featured TINYINT(1) NOT NULL DEFAULT 0,
    is_trending TINYINT(1) NOT NULL DEFAULT 0,
    legal_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    safety_status ENUM('unchecked', 'safe', 'warning', 'unsafe') NOT NULL DEFAULT 'unchecked',
    source_type ENUM('official', 'open_source', 'public_domain', 'freeware', 'creator_approved', 'licensed', 'educational', 'other') DEFAULT 'other',
    access_type ENUM('free', 'paid', 'freemium', 'open_source', 'public_domain', 'external') DEFAULT 'free',
    view_count INT UNSIGNED NOT NULL DEFAULT 0,
    published_at DATETIME DEFAULT NULL,
    created_by BIGINT UNSIGNED DEFAULT NULL,
    updated_by BIGINT UNSIGNED DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL,
    UNIQUE KEY uq_resources_slug (slug),
    CONSTRAINT fk_resources_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_resources_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_resources_slug (slug),
    INDEX idx_resources_resource_type (resource_type),
    INDEX idx_resources_status (status),
    INDEX idx_resources_visibility (visibility),
    INDEX idx_resources_legal_status (legal_status),
    INDEX idx_resources_safety_status (safety_status),
    INDEX idx_resources_is_featured (is_featured),
    INDEX idx_resources_is_trending (is_trending),
    INDEX idx_resources_published_at (published_at),
    INDEX idx_resources_deleted_at (deleted_at),
    -- Combined indexes
    INDEX idx_resources_type_status (resource_type, status),
    INDEX idx_resources_type_legal_safety (resource_type, legal_status, safety_status),
    INDEX idx_resources_status_published (status, published_at),
    INDEX idx_resources_featured_status (is_featured, status),
    INDEX idx_resources_trending_status (is_trending, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- TABLE 6 — resource_details
-- =====================================================
CREATE TABLE resource_details (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    resource_id BIGINT UNSIGNED NOT NULL,
    version VARCHAR(50) DEFAULT NULL,
    platform VARCHAR(255) DEFAULT NULL,
    developer VARCHAR(255) DEFAULT NULL,
    author VARCHAR(255) DEFAULT NULL,
    publisher VARCHAR(255) DEFAULT NULL,
    language VARCHAR(100) DEFAULT NULL,
    file_size VARCHAR(50) DEFAULT NULL,
    license_type VARCHAR(100) DEFAULT NULL,
    release_year YEAR DEFAULT NULL,
    requirements TEXT DEFAULT NULL,
    installation_guide TEXT DEFAULT NULL,
    features TEXT DEFAULT NULL,
    limitations TEXT DEFAULT NULL,
    documentation_url VARCHAR(500) DEFAULT NULL,
    official_url VARCHAR(500) DEFAULT NULL,
    demo_url VARCHAR(500) DEFAULT NULL,
    trailer_url VARCHAR(500) DEFAULT NULL,
    github_url VARCHAR(500) DEFAULT NULL,
    read_online_url VARCHAR(500) DEFAULT NULL,
    extra_json JSON DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_resource_details_resource (resource_id),
    CONSTRAINT fk_resource_details_resource FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    INDEX idx_resource_details_resource_id (resource_id),
    INDEX idx_resource_details_platform (platform),
    INDEX idx_resource_details_license_type (license_type),
    INDEX idx_resource_details_release_year (release_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- TABLE 7 — resource_categories
-- =====================================================
CREATE TABLE resource_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    resource_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_resource_categories (resource_id, category_id),
    CONSTRAINT fk_res_cat_resource FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    CONSTRAINT fk_res_cat_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_res_cat_resource_id (resource_id),
    INDEX idx_res_cat_category_id (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- TABLE 8 — resource_tags
-- =====================================================
CREATE TABLE resource_tags (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    resource_id BIGINT UNSIGNED NOT NULL,
    tag_id BIGINT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_resource_tags (resource_id, tag_id),
    CONSTRAINT fk_res_tags_resource FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    CONSTRAINT fk_res_tags_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    INDEX idx_res_tags_resource_id (resource_id),
    INDEX idx_res_tags_tag_id (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- TABLE 9 — resource_links
-- =====================================================
CREATE TABLE resource_links (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    resource_id BIGINT UNSIGNED NOT NULL,
    label VARCHAR(150) NOT NULL,
    url VARCHAR(500) NOT NULL,
    link_type ENUM('official', 'download', 'github', 'documentation', 'demo', 'read_online', 'launch_tool', 'source', 'other') NOT NULL DEFAULT 'other',
    source_type ENUM('official', 'open_source', 'public_domain', 'freeware', 'creator_approved', 'licensed', 'educational', 'other') DEFAULT 'official',
    legal_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    safety_status ENUM('unchecked', 'safe', 'warning', 'unsafe') NOT NULL DEFAULT 'unchecked',
    is_primary TINYINT(1) NOT NULL DEFAULT 0,
    click_count INT UNSIGNED NOT NULL DEFAULT 0,
    created_by BIGINT UNSIGNED DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL,
    CONSTRAINT fk_resource_links_resource FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    CONSTRAINT fk_resource_links_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_res_links_resource_id (resource_id),
    INDEX idx_res_links_link_type (link_type),
    INDEX idx_res_links_legal_status (legal_status),
    INDEX idx_res_links_safety_status (safety_status),
    INDEX idx_res_links_is_primary (is_primary),
    INDEX idx_res_links_created_by (created_by),
    INDEX idx_res_links_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- TABLE 10 — watch_episodes
-- =====================================================
CREATE TABLE watch_episodes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    resource_id BIGINT UNSIGNED NOT NULL,
    season_number TINYINT UNSIGNED NOT NULL DEFAULT 1,
    episode_number SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) NOT NULL,
    description TEXT DEFAULT NULL,
    thumbnail VARCHAR(500) DEFAULT NULL,
    duration VARCHAR(20) DEFAULT NULL,
    release_date DATE DEFAULT NULL,
    status ENUM('draft', 'pending_review', 'published', 'rejected') NOT NULL DEFAULT 'draft',
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL,
    UNIQUE KEY uq_watch_episodes_slug (slug),
    CONSTRAINT fk_watch_ep_resource FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    INDEX idx_watch_ep_resource_id (resource_id),
    INDEX idx_watch_ep_slug (slug),
    INDEX idx_watch_ep_status (status),
    INDEX idx_watch_ep_sort_order (sort_order),
    INDEX idx_watch_ep_deleted_at (deleted_at),
    INDEX idx_watch_ep_number (resource_id, season_number, episode_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- TABLE 11 — watch_servers
-- =====================================================
CREATE TABLE watch_servers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    episode_id BIGINT UNSIGNED NOT NULL,
    server_name VARCHAR(100) NOT NULL,
    embed_url VARCHAR(500) NOT NULL,
    source_url VARCHAR(500) DEFAULT NULL,
    source_type ENUM('youtube', 'vimeo', 'archive_org', 'official', 'creator_approved', 'public_domain', 'educational', 'other') NOT NULL DEFAULT 'other',
    legal_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    safety_status ENUM('unchecked', 'safe', 'warning', 'unsafe') NOT NULL DEFAULT 'unchecked',
    is_primary TINYINT(1) NOT NULL DEFAULT 0,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL,
    CONSTRAINT fk_watch_srv_episode FOREIGN KEY (episode_id) REFERENCES watch_episodes(id) ON DELETE CASCADE,
    INDEX idx_watch_srv_episode_id (episode_id),
    INDEX idx_watch_srv_legal_status (legal_status),
    INDEX idx_watch_srv_safety_status (safety_status),
    INDEX idx_watch_srv_is_primary (is_primary),
    INDEX idx_watch_srv_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- TABLE 12 — contact_messages
-- =====================================================
CREATE TABLE contact_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(190) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied', 'archived', 'spam') NOT NULL DEFAULT 'new',
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent VARCHAR(500) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL,
    INDEX idx_contact_email (email),
    INDEX idx_contact_status (status),
    INDEX idx_contact_created_at (created_at),
    INDEX idx_contact_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- TABLE 13 — site_settings
-- =====================================================
CREATE TABLE site_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT DEFAULT NULL,
    setting_type ENUM('text', 'textarea', 'number', 'boolean', 'json', 'url', 'email') NOT NULL DEFAULT 'text',
    group_name VARCHAR(80) NOT NULL DEFAULT 'general',
    description VARCHAR(255) DEFAULT NULL,
    is_public TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_site_settings_key (setting_key),
    INDEX idx_settings_key (setting_key),
    INDEX idx_settings_group_name (group_name),
    INDEX idx_settings_is_public (is_public)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- TABLE 14 — admin_activity_logs
-- =====================================================
CREATE TABLE admin_activity_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED DEFAULT NULL,
    action VARCHAR(80) NOT NULL,
    entity_type VARCHAR(80) DEFAULT NULL,
    entity_id BIGINT UNSIGNED DEFAULT NULL,
    description TEXT DEFAULT NULL,
    old_values JSON DEFAULT NULL,
    new_values JSON DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent VARCHAR(500) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_activity_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_logs_user_id (user_id),
    INDEX idx_logs_action (action),
    INDEX idx_logs_entity (entity_type, entity_id),
    INDEX idx_logs_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- TABLE 15 — resource_reports
-- =====================================================
CREATE TABLE resource_reports (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    resource_id BIGINT UNSIGNED NOT NULL,
    link_id BIGINT UNSIGNED DEFAULT NULL,
    report_type ENUM('broken_link', 'unsafe_link', 'copyright_issue', 'wrong_information', 'other') NOT NULL DEFAULT 'other',
    reporter_name VARCHAR(150) DEFAULT NULL,
    reporter_email VARCHAR(190) DEFAULT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'reviewing', 'resolved', 'rejected', 'spam') NOT NULL DEFAULT 'new',
    ip_address VARCHAR(45) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL,
    CONSTRAINT fk_reports_resource FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    CONSTRAINT fk_reports_link FOREIGN KEY (link_id) REFERENCES resource_links(id) ON DELETE SET NULL,
    INDEX idx_reports_resource_id (resource_id),
    INDEX idx_reports_link_id (link_id),
    INDEX idx_reports_report_type (report_type),
    INDEX idx_reports_status (status),
    INDEX idx_reports_created_at (created_at),
    INDEX idx_reports_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

COMMIT;
