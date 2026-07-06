-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 26, 2026 at 05:47 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quantum_mentor_world`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_activity_logs`
--

CREATE TABLE `admin_activity_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action` varchar(80) NOT NULL,
  `entity_type` varchar(80) DEFAULT NULL,
  `entity_id` bigint(20) UNSIGNED DEFAULT NULL,
  `description` text DEFAULT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_activity_logs`
--

INSERT INTO `admin_activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `old_values`, `new_values`, `ip_address`, `user_agent`, `created_at`) VALUES
(1, 1, 'create', 'seed_data', 1, 'Initial legal demo seed data inserted for local development.', NULL, NULL, '127.0.0.1', 'Local Seeder Script', '2026-06-24 19:44:05'),
(2, 1, 'login', NULL, NULL, 'Administrator user admin logged in successfully.', NULL, NULL, '::1', NULL, '2026-06-24 23:28:56'),
(3, 1, 'logout', NULL, NULL, 'Administrator admin logged out.', NULL, NULL, '::1', NULL, '2026-06-24 23:28:56'),
(4, 1, 'login', NULL, NULL, 'Administrator user admin logged in successfully.', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-25 19:25:16'),
(5, 1, 'logout', NULL, NULL, 'Administrator admin logged out.', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-25 19:28:20'),
(6, 1, 'login', NULL, NULL, 'Administrator user admin logged in successfully.', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-25 19:37:07'),
(7, 1, 'resource_create', 'resource', 17, 'Created resource \"Test Temp Draft\" successfully.', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-25 19:40:30'),
(8, 1, 'resource_create', 'resource', 18, 'Created resource \"Test Resource\" successfully.', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-25 19:40:34'),
(9, 1, 'resource_update', 'resource', 1, 'Updated resource \"Open Source Code Editor Demo\" successfully.', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-25 19:43:06'),
(10, 1, 'category_create', 'category', 16, 'Created category \"AI Models\" successfully.', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-25 19:43:47'),
(11, 1, 'category_update', 'category', 16, 'Updated category \"AI Models\" successfully.', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-25 19:44:24'),
(12, 1, 'login', NULL, NULL, 'Administrator user admin logged in successfully.', NULL, NULL, '::1', NULL, '2026-06-25 19:53:31'),
(13, 1, 'logout', NULL, NULL, 'Administrator admin logged out.', NULL, NULL, '::1', NULL, '2026-06-25 19:53:31'),
(14, 1, 'login', NULL, NULL, 'Administrator user admin logged in successfully.', NULL, NULL, '::1', NULL, '2026-06-25 19:53:45'),
(15, 1, 'resource_create', 'resource', 19, 'Created resource \"Auto Testing IDE Tool\" successfully.', NULL, NULL, '::1', NULL, '2026-06-25 19:53:45'),
(16, 1, 'resource_status_update', 'resource', 19, 'Updated status to \"published\" for resource \"Auto Testing IDE Tool\".', NULL, NULL, '::1', NULL, '2026-06-25 19:53:45'),
(17, 1, 'resource_feature_update', 'resource', 19, 'Featured resource \"Auto Testing IDE Tool\".', NULL, NULL, '::1', NULL, '2026-06-25 19:53:45'),
(18, 1, 'resource_delete', 'resource', 19, 'Soft-deleted resource \"Auto Testing IDE Tool\".', NULL, NULL, '::1', NULL, '2026-06-25 19:53:45'),
(19, 1, 'resource_restore', 'resource', 19, 'Restored resource \"Auto Testing IDE Tool\".', NULL, NULL, '::1', NULL, '2026-06-25 19:53:45'),
(20, 1, 'settings_update', 'settings', NULL, 'Updated site configuration parameters.', NULL, NULL, '::1', NULL, '2026-06-25 19:53:45'),
(21, 1, 'login', NULL, NULL, 'Administrator user admin logged in successfully.', NULL, NULL, '::1', NULL, '2026-06-25 19:54:11'),
(22, 1, 'resource_create', 'resource', 20, 'Created resource \"Auto Testing IDE Tool\" successfully.', NULL, NULL, '::1', NULL, '2026-06-25 19:54:11'),
(23, 1, 'resource_status_update', 'resource', 20, 'Updated status to \"published\" for resource \"Auto Testing IDE Tool\".', NULL, NULL, '::1', NULL, '2026-06-25 19:54:11'),
(24, 1, 'resource_feature_update', 'resource', 20, 'Featured resource \"Auto Testing IDE Tool\".', NULL, NULL, '::1', NULL, '2026-06-25 19:54:11'),
(25, 1, 'resource_delete', 'resource', 20, 'Soft-deleted resource \"Auto Testing IDE Tool\".', NULL, NULL, '::1', NULL, '2026-06-25 19:54:11'),
(26, 1, 'resource_restore', 'resource', 20, 'Restored resource \"Auto Testing IDE Tool\".', NULL, NULL, '::1', NULL, '2026-06-25 19:54:11'),
(27, 1, 'settings_update', 'settings', NULL, 'Updated site configuration parameters.', NULL, NULL, '::1', NULL, '2026-06-25 19:54:11'),
(28, 1, 'login', NULL, NULL, 'Administrator user admin logged in successfully.', NULL, NULL, '::1', NULL, '2026-06-25 19:54:49'),
(29, 1, 'resource_create', 'resource', 21, 'Created resource \"Auto Testing IDE Tool 1782442489344\" successfully.', NULL, NULL, '::1', NULL, '2026-06-25 19:54:49'),
(30, 1, 'resource_status_update', 'resource', 21, 'Updated status to \"published\" for resource \"Auto Testing IDE Tool 1782442489344\".', NULL, NULL, '::1', NULL, '2026-06-25 19:54:49'),
(31, 1, 'resource_feature_update', 'resource', 21, 'Featured resource \"Auto Testing IDE Tool 1782442489344\".', NULL, NULL, '::1', NULL, '2026-06-25 19:54:49'),
(32, 1, 'resource_delete', 'resource', 21, 'Soft-deleted resource \"Auto Testing IDE Tool 1782442489344\".', NULL, NULL, '::1', NULL, '2026-06-25 19:54:49'),
(33, 1, 'resource_restore', 'resource', 21, 'Restored resource \"Auto Testing IDE Tool 1782442489344\".', NULL, NULL, '::1', NULL, '2026-06-25 19:54:49'),
(34, 1, 'settings_update', 'settings', NULL, 'Updated site configuration parameters.', NULL, NULL, '::1', NULL, '2026-06-25 19:54:49'),
(35, 1, 'login', NULL, NULL, 'Administrator user admin logged in successfully.', NULL, NULL, '::1', NULL, '2026-06-25 20:13:17'),
(36, 1, 'media_upload', 'media', 1, 'Uploaded image \"integration-test.gif\" as \"qmw_1782443597440_175584.gif\"', NULL, '{\"id\":1,\"file_name\":\"qmw_1782443597440_175584.gif\",\"file_url\":\"http://localhost:5000/api/uploads/images/qmw_1782443597440_175584.gif\",\"mime_type\":\"image/gif\",\"file_size\":48,\"alt_text\":\"Integration Test Alt\",\"caption\":\"Integration Test Caption\"}', '::1', NULL, '2026-06-25 20:13:17'),
(37, 1, 'media_update', 'media', 1, 'Updated alt/caption metadata for media ID 1', '{\"alt_text\":\"Integration Test Alt\",\"caption\":\"Integration Test Caption\"}', '{\"alt_text\":\"Updated Alt Text\",\"caption\":\"Updated Caption\"}', '::1', NULL, '2026-06-25 20:13:17'),
(38, 1, 'media_delete', 'media', 1, 'Soft-deleted media file \"qmw_1782443597440_175584.gif\" (ID 1)', NULL, NULL, '::1', NULL, '2026-06-25 20:13:17'),
(39, 1, 'contact_status_update', 'contact_message', 1, 'Updated status of contact message from \"Test Submitter\" to \"read\"', '{\"status\":\"new\"}', '{\"status\":\"read\"}', '::1', NULL, '2026-06-25 20:13:17'),
(40, 1, 'contact_delete', 'contact_message', 1, 'Soft-deleted contact message from \"Test Submitter\" (ID 1)', NULL, NULL, '::1', NULL, '2026-06-25 20:13:17'),
(41, 1, 'report_status_update', 'resource_report', 1, 'Updated report status on Resource ID 1 from \"new\" to \"reviewing\"', '{\"status\":\"new\"}', '{\"status\":\"reviewing\"}', '::1', NULL, '2026-06-25 20:13:18'),
(42, 1, 'report_delete', 'resource_report', 1, 'Soft-deleted report ID 1 for Resource ID 1', NULL, NULL, '::1', NULL, '2026-06-25 20:13:18'),
(43, 1, 'login', NULL, NULL, 'Administrator user admin logged in successfully.', NULL, NULL, '::1', NULL, '2026-06-25 20:31:11'),
(44, 1, 'media_upload', 'media', 2, 'Uploaded image \"integration-test.gif\" as \"qmw_1782444672095_987722.gif\"', NULL, '{\"id\":2,\"file_name\":\"qmw_1782444672095_987722.gif\",\"file_url\":\"http://localhost:5000/api/uploads/images/qmw_1782444672095_987722.gif\",\"mime_type\":\"image/gif\",\"file_size\":48,\"alt_text\":\"Integration Test Alt\",\"caption\":\"Integration Test Caption\"}', '::1', NULL, '2026-06-25 20:31:12'),
(45, 1, 'media_update', 'media', 2, 'Updated alt/caption metadata for media ID 2', '{\"alt_text\":\"Integration Test Alt\",\"caption\":\"Integration Test Caption\"}', '{\"alt_text\":\"Updated Alt Text\",\"caption\":\"Updated Caption\"}', '::1', NULL, '2026-06-25 20:31:12'),
(46, 1, 'media_delete', 'media', 2, 'Soft-deleted media file \"qmw_1782444672095_987722.gif\" (ID 2)', NULL, NULL, '::1', NULL, '2026-06-25 20:31:12'),
(47, 1, 'contact_status_update', 'contact_message', 3, 'Updated status of contact message from \"Test Submitter\" to \"read\"', '{\"status\":\"new\"}', '{\"status\":\"read\"}', '::1', NULL, '2026-06-25 20:31:12'),
(48, 1, 'contact_delete', 'contact_message', 3, 'Soft-deleted contact message from \"Test Submitter\" (ID 3)', NULL, NULL, '::1', NULL, '2026-06-25 20:31:12'),
(49, 1, 'report_status_update', 'resource_report', 9, 'Updated report status on Resource ID 1 from \"new\" to \"reviewing\"', '{\"status\":\"new\"}', '{\"status\":\"reviewing\"}', '::1', NULL, '2026-06-25 20:31:12'),
(50, 1, 'report_delete', 'resource_report', 9, 'Soft-deleted report ID 9 for Resource ID 1', NULL, NULL, '::1', NULL, '2026-06-25 20:31:12'),
(51, 1, 'login', NULL, NULL, 'Administrator user admin logged in successfully.', NULL, NULL, '::1', NULL, '2026-06-25 20:39:40'),
(52, 1, 'media_upload', 'media', 3, 'Uploaded image \"integration-test.gif\" as \"qmw_1782445180489_878328.gif\"', NULL, '{\"id\":3,\"file_name\":\"qmw_1782445180489_878328.gif\",\"file_url\":\"http://localhost:5000/api/uploads/images/qmw_1782445180489_878328.gif\",\"mime_type\":\"image/gif\",\"file_size\":48,\"alt_text\":\"Integration Test Alt\",\"caption\":\"Integration Test Caption\"}', '::1', NULL, '2026-06-25 20:39:40'),
(53, 1, 'media_update', 'media', 3, 'Updated alt/caption metadata for media ID 3', '{\"alt_text\":\"Integration Test Alt\",\"caption\":\"Integration Test Caption\"}', '{\"alt_text\":\"Updated Alt Text\",\"caption\":\"Updated Caption\"}', '::1', NULL, '2026-06-25 20:39:40'),
(54, 1, 'media_delete', 'media', 3, 'Soft-deleted media file \"qmw_1782445180489_878328.gif\" (ID 3)', NULL, NULL, '::1', NULL, '2026-06-25 20:39:40'),
(55, 1, 'contact_status_update', 'contact_message', 5, 'Updated status of contact message from \"Test Submitter\" to \"read\"', '{\"status\":\"new\"}', '{\"status\":\"read\"}', '::1', NULL, '2026-06-25 20:39:40'),
(56, 1, 'contact_delete', 'contact_message', 5, 'Soft-deleted contact message from \"Test Submitter\" (ID 5)', NULL, NULL, '::1', NULL, '2026-06-25 20:39:40'),
(57, 1, 'report_status_update', 'resource_report', 17, 'Updated report status on Resource ID 1 from \"new\" to \"reviewing\"', '{\"status\":\"new\"}', '{\"status\":\"reviewing\"}', '::1', NULL, '2026-06-25 20:39:40'),
(58, 1, 'report_delete', 'resource_report', 17, 'Soft-deleted report ID 17 for Resource ID 1', NULL, NULL, '::1', NULL, '2026-06-25 20:39:41');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon`, `parent_id`, `sort_order`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Software', 'software', 'Legal downloadable software, utilities, and applications.', 'software', NULL, 1, 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(2, 'Books', 'books', 'Legal open-access, public domain, and educational books.', 'book', NULL, 2, 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(3, 'Tools', 'tools', 'Web utilities, productivity tools, and development aides.', 'tool', NULL, 3, 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(4, 'Games', 'games', 'Free-to-play, educational, and open-source games.', 'gamepad', NULL, 4, 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(5, 'Themes & Plugins', 'themes-plugins', 'GPL-licensed and open-source website templates and plugins.', 'plugin', NULL, 5, 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(6, 'Watch', 'watch', 'Verified legal video content and tutorials.', 'video', NULL, 6, 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(7, 'News', 'news', 'Summarized industry news and resource rollups.', 'news', NULL, 7, 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(8, 'GitHub Repositories', 'github-repositories', 'Selected open-source repositories and educational roadmaps.', 'github', NULL, 8, 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(9, 'AI Tools', 'ai-tools', 'Free or freemium artificial intelligence resources.', 'ai', NULL, 9, 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(10, 'Web Development', 'web-development', 'Resources for modern web design and coding.', 'code', NULL, 10, 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(11, 'Productivity', 'productivity', 'Resources to optimize learning and work workflows.', 'productivity', NULL, 11, 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(12, 'Education', 'education', 'General learning resources and academic guides.', 'education', NULL, 12, 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(13, 'Open Source', 'open-source', 'Projects and resources with open source licenses.', 'open-source', NULL, 13, 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(14, 'Design', 'design', 'Graphic assets, templates, and UI design resources.', 'design', NULL, 14, 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(15, 'Programming', 'programming', 'Software programming languages and runtime frameworks.', 'programming', NULL, 15, 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(16, 'AI Models', 'ai-models', 'Artificial Intelligence models, LLMs, and neural networks.', 'brain', NULL, 0, 'active', '2026-06-25 19:43:47', '2026-06-25 19:44:24', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(190) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied','archived','spam') NOT NULL DEFAULT 'new',
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `full_name`, `email`, `subject`, `message`, `status`, `ip_address`, `user_agent`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Test Submitter', 'test@example.com', 'Integration Testing', 'Hello, this is a clean automated integration test message body.', 'read', '::1', NULL, '2026-06-25 20:13:17', '2026-06-25 20:13:17', '2026-06-25 20:13:17'),
(2, 'Rate Limit Test 0', 'ratelimit0@example.com', 'Rate Limit testing', 'A duplicate test message.', 'new', '::1', NULL, '2026-06-25 20:13:18', '2026-06-25 20:13:18', NULL),
(3, 'Test Submitter', 'test@example.com', 'Integration Testing', 'Hello, this is a clean automated integration test message body.', 'read', '::1', NULL, '2026-06-25 20:31:12', '2026-06-25 20:31:12', '2026-06-25 20:31:12'),
(4, 'Rate Limit Test 0', 'ratelimit0@example.com', 'Rate Limit testing', 'A duplicate test message.', 'new', '::1', NULL, '2026-06-25 20:31:12', '2026-06-25 20:31:12', NULL),
(5, 'Test Submitter', 'test@example.com', 'Integration Testing', 'Hello, this is a clean automated integration test message body.', 'read', '::1', NULL, '2026-06-25 20:39:40', '2026-06-25 20:39:40', '2026-06-25 20:39:40'),
(6, 'Rate Limit Test 0', 'ratelimit0@example.com', 'Rate Limit testing', 'A duplicate test message.', 'new', '::1', NULL, '2026-06-25 20:39:41', '2026-06-25 20:39:41', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `file_size` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `alt_text` varchar(255) DEFAULT NULL,
  `caption` text DEFAULT NULL,
  `uploaded_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`id`, `file_name`, `original_name`, `file_path`, `file_url`, `mime_type`, `file_size`, `alt_text`, `caption`, `uploaded_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'qmw_1782443597440_175584.gif', 'integration-test.gif', 'G:\\Projects\\Quantum Mentor Web For custom Part 2\\backend\\uploads\\images\\qmw_1782443597440_175584.gif', 'http://localhost:5000/api/uploads/images/qmw_1782443597440_175584.gif', 'image/gif', 48, 'Updated Alt Text', 'Updated Caption', 1, '2026-06-25 20:13:17', '2026-06-25 20:13:17', '2026-06-25 20:13:17'),
(2, 'qmw_1782444672095_987722.gif', 'integration-test.gif', 'G:\\Projects\\Quantum Mentor Web For custom Part 2\\backend\\uploads\\images\\qmw_1782444672095_987722.gif', 'http://localhost:5000/api/uploads/images/qmw_1782444672095_987722.gif', 'image/gif', 48, 'Updated Alt Text', 'Updated Caption', 1, '2026-06-25 20:31:12', '2026-06-25 20:31:12', '2026-06-25 20:31:12'),
(3, 'qmw_1782445180489_878328.gif', 'integration-test.gif', 'G:\\Projects\\Quantum Mentor Web For custom Part 2\\backend\\uploads\\images\\qmw_1782445180489_878328.gif', 'http://localhost:5000/api/uploads/images/qmw_1782445180489_878328.gif', 'image/gif', 48, 'Updated Alt Text', 'Updated Caption', 1, '2026-06-25 20:39:40', '2026-06-25 20:39:40', '2026-06-25 20:39:40');

-- --------------------------------------------------------

--
-- Table structure for table `resources`
--

CREATE TABLE `resources` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(280) NOT NULL,
  `resource_type` enum('software','book','tool','game','theme_plugin','watch','news','github_repo') NOT NULL,
  `short_description` text DEFAULT NULL,
  `full_description` longtext DEFAULT NULL,
  `featured_image` varchar(500) DEFAULT NULL,
  `status` enum('draft','pending_review','published','rejected','archived') NOT NULL DEFAULT 'draft',
  `visibility` enum('public','private') NOT NULL DEFAULT 'public',
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_trending` tinyint(1) NOT NULL DEFAULT 0,
  `legal_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `safety_status` enum('unchecked','safe','warning','unsafe') NOT NULL DEFAULT 'unchecked',
  `source_type` enum('official','open_source','public_domain','freeware','creator_approved','licensed','educational','other') DEFAULT 'other',
  `access_type` enum('free','paid','freemium','open_source','public_domain','external') DEFAULT 'free',
  `view_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `published_at` datetime DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resources`
--

INSERT INTO `resources` (`id`, `title`, `slug`, `resource_type`, `short_description`, `full_description`, `featured_image`, `status`, `visibility`, `is_featured`, `is_trending`, `legal_status`, `safety_status`, `source_type`, `access_type`, `view_count`, `published_at`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Open Source Code Editor Demo', 'open-source-code-editor-demo', 'software', 'A safe demo code editor for programmers.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents an editor with syntax highlighting.', '', 'published', 'public', 1, 0, 'approved', 'safe', 'open_source', 'open_source', 130, '2026-06-24 19:44:05', 1, 1, '2026-06-24 19:44:05', '2026-06-25 20:39:36', NULL),
(2, 'Free PDF Reader Demo', 'free-pdf-reader-demo', 'software', 'A clean, lightweight PDF reader simulation.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents a lightweight document viewer.', NULL, 'published', 'public', 0, 0, 'approved', 'safe', 'freeware', 'free', 45, '2026-06-24 19:44:05', 1, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(3, 'Beginner Web Development Guide', 'beginner-web-development-guide', 'book', 'An open access introductory book on HTML, CSS, and JS.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents a beginner tutorial handbook.', NULL, 'published', 'public', 1, 1, 'approved', 'safe', 'educational', 'free', 257, '2026-06-24 19:44:05', 1, 1, '2026-06-24 19:44:05', '2026-06-25 20:39:36', NULL),
(4, 'Public Domain Learning Book', 'public-domain-learning-book', 'book', 'A classic public domain educational manuscript.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents a digitized classic historical document.', NULL, 'published', 'public', 0, 0, 'approved', 'safe', 'public_domain', 'public_domain', 78, '2026-06-24 19:44:05', 1, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(5, 'Online Text Formatter Tool', 'online-text-formatter-tool', 'tool', 'A web utility to format and clean text blocks.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents a client-side text formatter.', NULL, 'published', 'public', 0, 1, 'approved', 'safe', 'creator_approved', 'free', 312, '2026-06-24 19:44:05', 1, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(6, 'Image Compression Tool Demo', 'image-compression-tool-demo', 'tool', 'A lightweight offline image shrinker.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents a secure browser utility to compress media.', NULL, 'published', 'public', 0, 0, 'approved', 'safe', 'open_source', 'free', 92, '2026-06-24 19:44:05', 1, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(7, 'Educational Puzzle Game', 'educational-puzzle-game', 'game', 'A logical puzzle game focused on learning algebra.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents an interactive math game.', NULL, 'published', 'public', 1, 0, 'approved', 'safe', 'educational', 'free', 143, '2026-06-24 19:44:05', 1, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(8, 'Typing Practice Game', 'typing-practice-game', 'game', 'A retro terminal typing tutor simulation.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents a fast-paced coding/typing speed tester.', NULL, 'published', 'public', 0, 1, 'approved', 'safe', 'freeware', 'free', 201, '2026-06-24 19:44:05', 1, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(9, 'Free Educational Website Template', 'free-educational-website-template', 'theme_plugin', 'A responsive HTML/CSS website template for educators.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents an open-source landing page template.', NULL, 'published', 'public', 0, 0, 'approved', 'safe', 'open_source', 'open_source', 88, '2026-06-24 19:44:05', 1, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(10, 'Open Source Contact Form Plugin Demo', 'open-source-contact-form-plugin-demo', 'theme_plugin', 'A modular contact form handler simulation.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents a customizable backend contact widget.', NULL, 'published', 'public', 0, 0, 'approved', 'safe', 'licensed', 'free', 53, '2026-06-24 19:44:05', 1, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(11, 'Web Development Tutorial Series', 'web-development-tutorial-series', 'watch', 'A step-by-step video training series for beginners.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents a curated educational playlist.', NULL, 'published', 'public', 1, 1, 'approved', 'safe', 'creator_approved', 'external', 422, '2026-06-24 19:44:05', 1, 1, '2026-06-24 19:44:05', '2026-06-25 20:39:36', NULL),
(12, 'Public Domain Educational Video Collection', 'public-domain-educational-video-collection', 'watch', 'Classic archival footage explaining history and science.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents vintage public educational movies.', NULL, 'published', 'public', 0, 0, 'approved', 'safe', 'public_domain', 'public_domain', 111, '2026-06-24 19:44:05', 1, 1, '2026-06-24 19:44:05', '2026-06-24 23:21:07', NULL),
(13, 'AI Learning Tools Weekly Update', 'ai-learning-tools-weekly-update', 'news', 'Weekly digest tracking the best new AI tools for teachers.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents an editorial news digest.', NULL, 'published', 'public', 0, 0, 'approved', 'safe', 'educational', 'free', 135, '2026-06-24 19:44:05', 1, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(14, 'Open Source Education Resources Roundup', 'open-source-education-resources-roundup', 'news', 'An overview of new free libraries and toolsets released.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents an educational resource report.', NULL, 'published', 'public', 0, 0, 'approved', 'safe', 'official', 'free', 67, '2026-06-24 19:44:05', 1, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(15, 'Beginner JavaScript Examples Repository', 'beginner-javascript-examples-repository', 'github_repo', 'Open-source repository containing easy JS tasks.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents a repository of basic script formulas.', NULL, 'published', 'public', 0, 1, 'approved', 'safe', 'open_source', 'open_source', 190, '2026-06-24 19:44:05', 1, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(16, 'Open Source Learning Roadmap Repository', 'open-source-learning-roadmap-repository', 'github_repo', 'Curated step-by-step roadmap diagrams for developers.', 'This is safe demo content used for local development and UI testing of our directory platform. Represents a graphical workflow roadmap repository.', NULL, 'published', 'public', 1, 0, 'approved', 'safe', 'open_source', 'open_source', 302, '2026-06-24 19:44:05', 1, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(17, 'Test Temp Draft', 'test-temp-draft', 'software', 'A test draft resource.', NULL, NULL, 'draft', 'public', 0, 0, 'approved', 'safe', 'open_source', 'free', 0, NULL, 1, 1, '2026-06-25 19:40:30', '2026-06-25 19:40:30', NULL),
(18, 'Test Resource', 'test-resource', 'software', 'This is a short description for the test resource.', NULL, NULL, 'draft', 'public', 0, 0, 'approved', 'safe', 'open_source', 'free', 0, NULL, 1, 1, '2026-06-25 19:40:34', '2026-06-25 19:40:34', NULL),
(19, 'Auto Testing IDE Tool', 'auto-testing-ide-tool', 'tool', 'A completely safe educational code editor.', NULL, NULL, 'published', 'public', 1, 0, 'approved', 'safe', 'open_source', 'free', 1, NULL, 1, 1, '2026-06-25 19:53:45', '2026-06-25 19:54:11', NULL),
(20, 'Auto Testing IDE Tool', 'auto-testing-ide-tool-2', 'tool', 'A completely safe educational code editor.', NULL, NULL, 'published', 'public', 1, 0, 'approved', 'safe', 'open_source', 'free', 0, NULL, 1, 1, '2026-06-25 19:54:11', '2026-06-25 19:54:11', NULL),
(21, 'Auto Testing IDE Tool 1782442489344', 'auto-testing-ide-tool-1782442489344', 'tool', 'A completely safe educational code editor.', NULL, NULL, 'published', 'public', 1, 0, 'approved', 'safe', 'open_source', 'free', 0, NULL, 1, 1, '2026-06-25 19:54:49', '2026-06-25 19:54:49', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `resource_categories`
--

CREATE TABLE `resource_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `resource_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resource_categories`
--

INSERT INTO `resource_categories` (`id`, `resource_id`, `category_id`, `created_at`) VALUES
(5, 2, 1, '2026-06-24 19:44:05'),
(6, 2, 11, '2026-06-24 19:44:05'),
(7, 3, 2, '2026-06-24 19:44:05'),
(8, 3, 10, '2026-06-24 19:44:05'),
(9, 3, 12, '2026-06-24 19:44:05'),
(10, 4, 2, '2026-06-24 19:44:05'),
(11, 4, 12, '2026-06-24 19:44:05'),
(12, 4, 13, '2026-06-24 19:44:05'),
(13, 5, 3, '2026-06-24 19:44:05'),
(14, 5, 11, '2026-06-24 19:44:05'),
(15, 6, 3, '2026-06-24 19:44:05'),
(16, 6, 13, '2026-06-24 19:44:05'),
(17, 6, 14, '2026-06-24 19:44:05'),
(18, 7, 4, '2026-06-24 19:44:05'),
(19, 7, 12, '2026-06-24 19:44:05'),
(20, 8, 4, '2026-06-24 19:44:05'),
(21, 8, 11, '2026-06-24 19:44:05'),
(22, 8, 15, '2026-06-24 19:44:05'),
(23, 9, 5, '2026-06-24 19:44:05'),
(24, 9, 10, '2026-06-24 19:44:05'),
(25, 9, 14, '2026-06-24 19:44:05'),
(26, 10, 5, '2026-06-24 19:44:05'),
(27, 10, 10, '2026-06-24 19:44:05'),
(28, 10, 13, '2026-06-24 19:44:05'),
(29, 11, 6, '2026-06-24 19:44:05'),
(30, 11, 10, '2026-06-24 19:44:05'),
(31, 11, 12, '2026-06-24 19:44:05'),
(32, 11, 15, '2026-06-24 19:44:05'),
(33, 12, 6, '2026-06-24 19:44:05'),
(34, 12, 12, '2026-06-24 19:44:05'),
(35, 12, 13, '2026-06-24 19:44:05'),
(36, 13, 7, '2026-06-24 19:44:05'),
(37, 13, 9, '2026-06-24 19:44:05'),
(38, 13, 12, '2026-06-24 19:44:05'),
(39, 14, 7, '2026-06-24 19:44:05'),
(40, 14, 12, '2026-06-24 19:44:05'),
(41, 14, 13, '2026-06-24 19:44:05'),
(42, 15, 8, '2026-06-24 19:44:05'),
(43, 15, 10, '2026-06-24 19:44:05'),
(44, 15, 13, '2026-06-24 19:44:05'),
(45, 15, 15, '2026-06-24 19:44:05'),
(46, 16, 8, '2026-06-24 19:44:05'),
(47, 16, 12, '2026-06-24 19:44:05'),
(48, 16, 13, '2026-06-24 19:44:05'),
(49, 16, 15, '2026-06-24 19:44:05'),
(50, 17, 1, '2026-06-25 19:40:30'),
(51, 1, 1, '2026-06-25 19:43:05'),
(52, 1, 10, '2026-06-25 19:43:05'),
(53, 1, 13, '2026-06-25 19:43:05'),
(54, 1, 15, '2026-06-25 19:43:05'),
(55, 19, 1, '2026-06-25 19:53:45'),
(56, 20, 1, '2026-06-25 19:54:11'),
(57, 21, 1, '2026-06-25 19:54:49');

-- --------------------------------------------------------

--
-- Table structure for table `resource_details`
--

CREATE TABLE `resource_details` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `resource_id` bigint(20) UNSIGNED NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  `platform` varchar(255) DEFAULT NULL,
  `developer` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `publisher` varchar(255) DEFAULT NULL,
  `language` varchar(100) DEFAULT NULL,
  `file_size` varchar(50) DEFAULT NULL,
  `license_type` varchar(100) DEFAULT NULL,
  `release_year` year(4) DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `installation_guide` text DEFAULT NULL,
  `features` text DEFAULT NULL,
  `limitations` text DEFAULT NULL,
  `documentation_url` varchar(500) DEFAULT NULL,
  `official_url` varchar(500) DEFAULT NULL,
  `demo_url` varchar(500) DEFAULT NULL,
  `trailer_url` varchar(500) DEFAULT NULL,
  `github_url` varchar(500) DEFAULT NULL,
  `read_online_url` varchar(500) DEFAULT NULL,
  `extra_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`extra_json`)),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resource_details`
--

INSERT INTO `resource_details` (`id`, `resource_id`, `version`, `platform`, `developer`, `author`, `publisher`, `language`, `file_size`, `license_type`, `release_year`, `requirements`, `installation_guide`, `features`, `limitations`, `documentation_url`, `official_url`, `demo_url`, `trailer_url`, `github_url`, `read_online_url`, `extra_json`, `created_at`, `updated_at`) VALUES
(1, 1, '1.2.0', 'Windows / macOS / Linux', 'CodeCreator Team', '', '', 'English', '45 MB', 'MIT License', '2026', 'Basic PC with 2GB RAM.', 'Download and run installer.', 'Syntax highlighting, plugin support, theme customizer.', 'Demo version for local server tests only.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-24 19:44:05', '2026-06-25 19:43:05'),
(2, 2, '2.0.1', 'Windows', 'DocFormatters Corp', NULL, NULL, 'English', '12 MB', 'Freeware', '2026', 'Windows 10 or above.', 'Extract ZIP and click exe.', 'Tabs, lightweight rendering, search function.', 'No annotation support in free mode.', 'https://example.com/docs', 'https://example.com', NULL, NULL, NULL, NULL, NULL, '2026-06-24 19:44:05', '2026-06-24 19:44:05'),
(3, 3, '1.0.0', 'eBook / Web', NULL, 'Jane Doe', 'MentorPress', 'English', '8 MB', 'Creative Commons BY-SA', '2026', 'ePub reader or web browser.', 'Open in any compatible browser or reader application.', 'Covers layouts, grids, flexbox, async functions.', 'Single developer focus.', 'https://example.com/docs', 'https://example.com', NULL, NULL, NULL, 'https://example.com/read', NULL, '2026-06-24 19:44:05', '2026-06-24 19:44:05'),
(4, 4, '1890 Edition', 'eBook', NULL, 'Classic Educator', 'Public Domain Hub', 'English', '4 MB', 'CC0 Public Domain', '2026', 'Standard PDF reader.', 'Open file directly.', 'Scanned illustrations, classic learning methodology.', 'Antiquated language structure.', NULL, 'https://example.com', NULL, NULL, NULL, 'https://example.com/read', NULL, '2026-06-24 19:44:05', '2026-06-24 19:44:05'),
(5, 5, '3.1.0', 'Web Browser', 'WebUtilities Dev', NULL, NULL, 'English', 'N/A (Web)', 'Free Use / Creator Approved', '2026', 'JavaScript-enabled browser.', 'Access directly via browser URL.', 'Format JSON, clean whitespaces, case converters.', 'Internet connection needed.', 'https://example.com/docs', 'https://example.com', 'https://example.com/demo', NULL, NULL, NULL, NULL, '2026-06-24 19:44:05', '2026-06-24 19:44:05'),
(6, 6, '0.9.5', 'Cross-platform (Electron)', 'CompressIO Project', NULL, NULL, 'English', '28 MB', 'GPL-3.0 License', '2026', 'Node.js runtime or cross-platform bundle.', 'Extract and run the execution command.', 'Compresses JPG, PNG, and WebP offline.', 'Batch processing is single-threaded.', 'https://example.com/docs', 'https://example.com', NULL, NULL, 'https://example.com/github-demo', NULL, NULL, '2026-06-24 19:44:05', '2026-06-24 19:44:05'),
(7, 7, '2.4.0', 'Web / HTML5', 'AlgebraLearn', NULL, NULL, 'English', '15 MB', 'Free / Academic', '2026', 'HTML5-capable browser.', 'Launch web launcher or embed canvas.', 'Equations puzzles, leveling roadmap, achievements.', 'Registration required for score tracking.', 'https://example.com/docs', 'https://example.com', 'https://example.com/demo', NULL, NULL, NULL, NULL, '2026-06-24 19:44:05', '2026-06-24 19:44:05'),
(8, 8, '1.1.0', 'Terminal / Cross-platform', 'RetroCoders', NULL, NULL, 'English', '2 MB', 'Freeware', '2026', 'Any standard terminal console shell.', 'Run npm install -g RetroTyping.', 'WPM analyzer, code snippets typing, sound effects.', 'Text-only layout.', 'https://example.com/docs', 'https://example.com', 'https://example.com/demo', NULL, 'https://example.com/github-demo', NULL, NULL, '2026-06-24 19:44:05', '2026-06-24 19:44:05'),
(9, 9, '1.0.0', 'HTML5 / CSS3', 'DesignGrid', NULL, NULL, 'English', '3 MB', 'MIT License', '2026', 'Standard text editor and browser.', 'Deploy source files to any host.', 'Responsive layout, navbar grid, CSS customized.', 'No backend structure included.', 'https://example.com/docs', 'https://example.com', 'https://example.com/demo', NULL, 'https://example.com/github-demo', NULL, NULL, '2026-06-24 19:44:05', '2026-06-24 19:44:05'),
(10, 10, '1.3.1', 'Node.js / Express', 'FormBuilders', NULL, NULL, 'English', '40 KB', 'GPL-2.0 License', '2026', 'Node.js environment.', 'Install dependency via npm.', 'Server validation, captcha support, modular templates.', 'Relies on Express backend.', 'https://example.com/docs', 'https://example.com', NULL, NULL, 'https://example.com/github-demo', NULL, NULL, '2026-06-24 19:44:05', '2026-06-24 19:44:05'),
(11, 11, 'N/A', 'Video Playlist', 'EduVideo Production', NULL, NULL, 'English', 'N/A', 'Creator Approved', '2026', 'YouTube or Vimeo access.', 'Navigate to legal video links to watch.', '10 hours of video lessons, source repos.', 'Advertisements depend on target platform.', 'https://example.com/docs', 'https://example.com', 'https://example.com/demo', 'https://example.com/demo', NULL, NULL, NULL, '2026-06-24 19:44:05', '2026-06-24 19:44:05'),
(12, 12, 'N/A', 'Video Playlist', NULL, 'Multiple Authors', 'Archive.org Education', 'English', 'N/A', 'Public Domain', '2026', 'Compatible web browser with video playback.', 'Load streaming archives online.', 'Rare vintage footages, captions translation.', 'Older low-resolution media.', NULL, 'https://example.com', NULL, NULL, NULL, NULL, NULL, '2026-06-24 19:44:05', '2026-06-24 19:44:05'),
(13, 13, 'N/A', 'News Summary', 'EdNews Team', NULL, NULL, 'English', 'N/A', 'Educational Use', '2026', 'Internet browser.', 'Open page link.', 'Ranked list of AI assistance sites, features reviews.', 'Information status as of publishing date.', NULL, 'https://example.com', NULL, NULL, NULL, NULL, NULL, '2026-06-24 19:44:05', '2026-06-24 19:44:05'),
(14, 14, 'N/A', 'News Summary', 'OpenSourceEd Org', NULL, NULL, 'English', 'N/A', 'Creative Commons Attribution', '2026', 'Internet browser.', 'Open page link.', 'Reviews of 5 new developer training platforms.', 'Requires attribution when sharing.', NULL, 'https://example.com', NULL, NULL, NULL, NULL, NULL, '2026-06-24 19:44:05', '2026-06-24 19:44:05'),
(15, 15, '1.0.0', 'Git Repository', 'JSBeginners Team', NULL, NULL, 'English', '1.5 MB', 'MIT License', '2026', 'Git client, Node.js.', 'Clone repository using git CLI.', 'Vanilla JS challenges, automated tests setup.', 'Basic scope focus.', 'https://example.com/docs', 'https://example.com', NULL, NULL, 'https://example.com/github-demo', NULL, NULL, '2026-06-24 19:44:05', '2026-06-24 19:44:05'),
(16, 16, '3.0.0', 'Git Repository', 'DevRoadmaps', NULL, NULL, 'English', '5 MB', 'Creative Commons BY-NC', '2026', 'GitHub access or browser.', 'Access repo files or browse roadmap graphics.', 'Visual career paths, skill tags, checklists.', 'Updated quarterly.', 'https://example.com/docs', 'https://example.com', NULL, NULL, 'https://example.com/github-demo', NULL, NULL, '2026-06-24 19:44:05', '2026-06-24 19:44:05'),
(17, 18, '', '', '', '', '', '', '', '', NULL, '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-25 19:40:34', '2026-06-25 19:40:34');

-- --------------------------------------------------------

--
-- Table structure for table `resource_links`
--

CREATE TABLE `resource_links` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `resource_id` bigint(20) UNSIGNED NOT NULL,
  `label` varchar(150) NOT NULL,
  `url` varchar(500) NOT NULL,
  `link_type` enum('official','download','github','documentation','demo','read_online','launch_tool','source','other') NOT NULL DEFAULT 'other',
  `source_type` enum('official','open_source','public_domain','freeware','creator_approved','licensed','educational','other') DEFAULT 'official',
  `legal_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `safety_status` enum('unchecked','safe','warning','unsafe') NOT NULL DEFAULT 'unchecked',
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `click_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resource_links`
--

INSERT INTO `resource_links` (`id`, `resource_id`, `label`, `url`, `link_type`, `source_type`, `legal_status`, `safety_status`, `is_primary`, `click_count`, `created_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'Official Resource Page', 'https://example.com', 'official', 'open_source', 'approved', 'safe', 1, 10, 1, '2026-06-24 19:44:05', '2026-06-25 19:43:06', '2026-06-25 19:43:06'),
(2, 1, 'View Repository', 'https://example.com/github-demo', 'github', 'open_source', 'approved', 'safe', 0, 2, 1, '2026-06-24 19:44:05', '2026-06-25 19:43:06', '2026-06-25 19:43:06'),
(3, 2, 'Official Resource Page', 'https://example.com', 'official', 'freeware', 'approved', 'safe', 1, 8, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(4, 3, 'Read Online', 'https://example.com/read', 'read_online', 'educational', 'approved', 'safe', 1, 42, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(5, 3, 'Official Documentation', 'https://example.com/docs', 'documentation', 'educational', 'approved', 'safe', 0, 5, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(6, 4, 'Read Online', 'https://example.com/read', 'read_online', 'public_domain', 'approved', 'safe', 1, 15, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(7, 5, 'Open Demo', 'https://example.com/demo', 'demo', 'creator_approved', 'approved', 'safe', 1, 55, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(8, 6, 'Official Resource Page', 'https://example.com', 'official', 'open_source', 'approved', 'safe', 1, 12, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(9, 6, 'View Repository', 'https://example.com/github-demo', 'github', 'open_source', 'approved', 'safe', 0, 1, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(10, 7, 'Open Demo', 'https://example.com/demo', 'demo', 'educational', 'approved', 'safe', 1, 23, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(11, 8, 'Open Demo', 'https://example.com/demo', 'demo', 'freeware', 'approved', 'safe', 1, 31, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(12, 9, 'Open Demo', 'https://example.com/demo', 'demo', 'open_source', 'approved', 'safe', 1, 19, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(13, 10, 'View Repository', 'https://example.com/github-demo', 'github', 'licensed', 'approved', 'safe', 1, 7, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(14, 11, 'Official Video Playlist', 'https://example.com', 'official', 'creator_approved', 'approved', 'safe', 1, 84, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(15, 12, 'Official Resource Page', 'https://example.com', 'official', 'public_domain', 'approved', 'safe', 1, 21, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(16, 13, 'Official Resource Page', 'https://example.com', 'official', 'educational', 'approved', 'safe', 1, 38, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(17, 14, 'Official Resource Page', 'https://example.com', 'official', 'official', 'approved', 'safe', 1, 14, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(18, 15, 'View Repository', 'https://example.com/github-demo', 'github', 'open_source', 'approved', 'safe', 1, 56, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(19, 16, 'View Repository', 'https://example.com/github-demo', 'github', 'open_source', 'approved', 'safe', 1, 99, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(20, 17, 'Official Website', 'https://example.com', 'official', 'official', 'approved', 'safe', 1, 0, 1, '2026-06-25 19:40:30', '2026-06-25 19:40:30', NULL),
(21, 18, 'Official Website', 'https://example.com', 'official', 'official', 'pending', 'unchecked', 1, 0, 1, '2026-06-25 19:40:34', '2026-06-25 19:40:34', NULL),
(22, 1, 'Official Resource Page', 'https://example.com', 'official', 'open_source', 'approved', 'safe', 1, 0, 1, '2026-06-25 19:43:06', '2026-06-25 19:43:06', NULL),
(23, 1, 'View Repository', 'https://example.com/github-demo', 'github', 'open_source', 'approved', 'safe', 0, 0, 1, '2026-06-25 19:43:06', '2026-06-25 19:43:06', NULL),
(24, 19, 'Official Site', 'https://example.com/editor', 'official', 'open_source', 'approved', 'safe', 1, 0, 1, '2026-06-25 19:53:45', '2026-06-25 19:53:45', NULL),
(25, 20, 'Official Site', 'https://example.com/editor', 'official', 'open_source', 'approved', 'safe', 1, 0, 1, '2026-06-25 19:54:11', '2026-06-25 19:54:11', NULL),
(26, 21, 'Official Site', 'https://example.com/editor', 'official', 'open_source', 'approved', 'safe', 1, 0, 1, '2026-06-25 19:54:49', '2026-06-25 19:54:49', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `resource_reports`
--

CREATE TABLE `resource_reports` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `resource_id` bigint(20) UNSIGNED NOT NULL,
  `link_id` bigint(20) UNSIGNED DEFAULT NULL,
  `report_type` enum('broken_link','unsafe_link','copyright_issue','wrong_information','other') NOT NULL DEFAULT 'other',
  `reporter_name` varchar(150) DEFAULT NULL,
  `reporter_email` varchar(190) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('new','reviewing','resolved','rejected','spam') NOT NULL DEFAULT 'new',
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resource_reports`
--

INSERT INTO `resource_reports` (`id`, `resource_id`, `link_id`, `report_type`, `reporter_name`, `reporter_email`, `message`, `status`, `ip_address`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, NULL, 'broken_link', 'Link Auditor', 'auditor@example.com', 'The link number 1 is returning a 404 error.', 'reviewing', '::1', '2026-06-25 20:13:17', '2026-06-25 20:13:18', '2026-06-25 20:13:18'),
(2, 1, NULL, 'wrong_information', NULL, NULL, 'Rate limit test report message number 0', 'new', '::1', '2026-06-25 20:13:18', '2026-06-25 20:13:18', NULL),
(3, 1, NULL, 'wrong_information', NULL, NULL, 'Rate limit test report message number 1', 'new', '::1', '2026-06-25 20:13:18', '2026-06-25 20:13:18', NULL),
(4, 1, NULL, 'wrong_information', NULL, NULL, 'Rate limit test report message number 2', 'new', '::1', '2026-06-25 20:13:18', '2026-06-25 20:13:18', NULL),
(5, 1, NULL, 'wrong_information', NULL, NULL, 'Rate limit test report message number 3', 'new', '::1', '2026-06-25 20:13:18', '2026-06-25 20:13:18', NULL),
(6, 1, NULL, 'wrong_information', NULL, NULL, 'Rate limit test report message number 4', 'new', '::1', '2026-06-25 20:13:18', '2026-06-25 20:13:18', NULL),
(7, 1, NULL, 'wrong_information', NULL, NULL, 'Rate limit test report message number 5', 'new', '::1', '2026-06-25 20:13:18', '2026-06-25 20:13:18', NULL),
(8, 1, NULL, 'wrong_information', NULL, NULL, 'Rate limit test report message number 6', 'new', '::1', '2026-06-25 20:13:18', '2026-06-25 20:13:18', NULL),
(9, 1, NULL, 'broken_link', 'Link Auditor', 'auditor@example.com', 'The link number 1 is returning a 404 error.', 'reviewing', '::1', '2026-06-25 20:31:12', '2026-06-25 20:31:12', '2026-06-25 20:31:12'),
(10, 1, NULL, 'wrong_information', NULL, NULL, 'Rate limit test report message number 0', 'new', '::1', '2026-06-25 20:31:12', '2026-06-25 20:31:12', NULL),
(11, 1, NULL, 'wrong_information', NULL, NULL, 'Rate limit test report message number 1', 'new', '::1', '2026-06-25 20:31:12', '2026-06-25 20:31:12', NULL),
(12, 1, NULL, 'wrong_information', NULL, NULL, 'Rate limit test report message number 2', 'new', '::1', '2026-06-25 20:31:12', '2026-06-25 20:31:12', NULL),
(13, 1, NULL, 'wrong_information', NULL, NULL, 'Rate limit test report message number 3', 'new', '::1', '2026-06-25 20:31:12', '2026-06-25 20:31:12', NULL),
(14, 1, NULL, 'wrong_information', NULL, NULL, 'Rate limit test report message number 4', 'new', '::1', '2026-06-25 20:31:12', '2026-06-25 20:31:12', NULL),
(15, 1, NULL, 'wrong_information', NULL, NULL, 'Rate limit test report message number 5', 'new', '::1', '2026-06-25 20:31:12', '2026-06-25 20:31:12', NULL),
(16, 1, NULL, 'wrong_information', NULL, NULL, 'Rate limit test report message number 6', 'new', '::1', '2026-06-25 20:31:12', '2026-06-25 20:31:12', NULL),
(17, 1, NULL, 'broken_link', 'Link Auditor', 'auditor@example.com', 'The link number 1 is returning a 404 error.', 'reviewing', '::1', '2026-06-25 20:39:40', '2026-06-25 20:39:40', '2026-06-25 20:39:40'),
(18, 1, NULL, 'wrong_information', NULL, NULL, 'Rate limit test report message number 0', 'new', '::1', '2026-06-25 20:39:41', '2026-06-25 20:39:41', NULL),
(19, 1, NULL, 'wrong_information', NULL, NULL, 'Rate limit test report message number 1', 'new', '::1', '2026-06-25 20:39:41', '2026-06-25 20:39:41', NULL),
(20, 1, NULL, 'wrong_information', NULL, NULL, 'Rate limit test report message number 2', 'new', '::1', '2026-06-25 20:39:41', '2026-06-25 20:39:41', NULL),
(21, 1, NULL, 'wrong_information', NULL, NULL, 'Rate limit test report message number 3', 'new', '::1', '2026-06-25 20:39:41', '2026-06-25 20:39:41', NULL),
(22, 1, NULL, 'wrong_information', NULL, NULL, 'Rate limit test report message number 4', 'new', '::1', '2026-06-25 20:39:41', '2026-06-25 20:39:41', NULL),
(23, 1, NULL, 'wrong_information', NULL, NULL, 'Rate limit test report message number 5', 'new', '::1', '2026-06-25 20:39:41', '2026-06-25 20:39:41', NULL),
(24, 1, NULL, 'wrong_information', NULL, NULL, 'Rate limit test report message number 6', 'new', '::1', '2026-06-25 20:39:41', '2026-06-25 20:39:41', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `resource_tags`
--

CREATE TABLE `resource_tags` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `resource_id` bigint(20) UNSIGNED NOT NULL,
  `tag_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resource_tags`
--

INSERT INTO `resource_tags` (`id`, `resource_id`, `tag_id`, `created_at`) VALUES
(7, 2, 1, '2026-06-24 19:44:05'),
(8, 2, 5, '2026-06-24 19:44:05'),
(9, 2, 6, '2026-06-24 19:44:05'),
(10, 2, 9, '2026-06-24 19:44:05'),
(11, 3, 1, '2026-06-24 19:44:05'),
(12, 3, 3, '2026-06-24 19:44:05'),
(13, 3, 4, '2026-06-24 19:44:05'),
(14, 3, 7, '2026-06-24 19:44:05'),
(15, 3, 12, '2026-06-24 19:44:05'),
(16, 3, 15, '2026-06-24 19:44:05'),
(17, 4, 1, '2026-06-24 19:44:05'),
(18, 4, 4, '2026-06-24 19:44:05'),
(19, 4, 12, '2026-06-24 19:44:05'),
(20, 4, 13, '2026-06-24 19:44:05'),
(21, 5, 1, '2026-06-24 19:44:05'),
(22, 5, 5, '2026-06-24 19:44:05'),
(23, 5, 6, '2026-06-24 19:44:05'),
(24, 5, 9, '2026-06-24 19:44:05'),
(25, 5, 15, '2026-06-24 19:44:05'),
(26, 6, 1, '2026-06-24 19:44:05'),
(27, 6, 2, '2026-06-24 19:44:05'),
(28, 6, 6, '2026-06-24 19:44:05'),
(29, 6, 9, '2026-06-24 19:44:05'),
(30, 6, 10, '2026-06-24 19:44:05'),
(31, 7, 1, '2026-06-24 19:44:05'),
(32, 7, 3, '2026-06-24 19:44:05'),
(33, 7, 4, '2026-06-24 19:44:05'),
(34, 7, 12, '2026-06-24 19:44:05'),
(35, 8, 1, '2026-06-24 19:44:05'),
(36, 8, 4, '2026-06-24 19:44:05'),
(37, 8, 9, '2026-06-24 19:44:05'),
(38, 8, 11, '2026-06-24 19:44:05'),
(39, 9, 1, '2026-06-24 19:44:05'),
(40, 9, 2, '2026-06-24 19:44:05'),
(41, 9, 3, '2026-06-24 19:44:05'),
(42, 9, 7, '2026-06-24 19:44:05'),
(43, 9, 10, '2026-06-24 19:44:05'),
(44, 10, 1, '2026-06-24 19:44:05'),
(45, 10, 2, '2026-06-24 19:44:05'),
(46, 10, 6, '2026-06-24 19:44:05'),
(47, 10, 7, '2026-06-24 19:44:05'),
(48, 10, 15, '2026-06-24 19:44:05'),
(49, 11, 1, '2026-06-24 19:44:05'),
(50, 11, 3, '2026-06-24 19:44:05'),
(51, 11, 4, '2026-06-24 19:44:05'),
(52, 11, 7, '2026-06-24 19:44:05'),
(53, 11, 11, '2026-06-24 19:44:05'),
(54, 11, 12, '2026-06-24 19:44:05'),
(55, 11, 14, '2026-06-24 19:44:05'),
(56, 12, 1, '2026-06-24 19:44:05'),
(57, 12, 4, '2026-06-24 19:44:05'),
(58, 12, 12, '2026-06-24 19:44:05'),
(59, 12, 13, '2026-06-24 19:44:05'),
(60, 13, 1, '2026-06-24 19:44:05'),
(61, 13, 4, '2026-06-24 19:44:05'),
(62, 13, 8, '2026-06-24 19:44:05'),
(63, 13, 9, '2026-06-24 19:44:05'),
(64, 14, 1, '2026-06-24 19:44:05'),
(65, 14, 2, '2026-06-24 19:44:05'),
(66, 14, 4, '2026-06-24 19:44:05'),
(67, 14, 12, '2026-06-24 19:44:05'),
(68, 15, 1, '2026-06-24 19:44:05'),
(69, 15, 2, '2026-06-24 19:44:05'),
(70, 15, 3, '2026-06-24 19:44:05'),
(71, 15, 7, '2026-06-24 19:44:05'),
(72, 15, 11, '2026-06-24 19:44:05'),
(73, 15, 12, '2026-06-24 19:44:05'),
(74, 15, 15, '2026-06-24 19:44:05'),
(75, 16, 1, '2026-06-24 19:44:05'),
(76, 16, 2, '2026-06-24 19:44:05'),
(77, 16, 3, '2026-06-24 19:44:05'),
(78, 16, 4, '2026-06-24 19:44:05'),
(79, 16, 5, '2026-06-24 19:44:05'),
(80, 16, 11, '2026-06-24 19:44:05'),
(81, 16, 12, '2026-06-24 19:44:05'),
(82, 16, 15, '2026-06-24 19:44:05'),
(83, 17, 1, '2026-06-25 19:40:30'),
(84, 1, 3, '2026-06-25 19:43:05'),
(85, 1, 15, '2026-06-25 19:43:05'),
(86, 1, 1, '2026-06-25 19:43:05'),
(87, 1, 2, '2026-06-25 19:43:06'),
(88, 1, 11, '2026-06-25 19:43:06'),
(89, 1, 6, '2026-06-25 19:43:06'),
(90, 19, 1, '2026-06-25 19:53:45'),
(91, 20, 1, '2026-06-25 19:54:11'),
(92, 21, 1, '2026-06-25 19:54:49');

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `setting_type` enum('text','textarea','number','boolean','json','url','email') NOT NULL DEFAULT 'text',
  `group_name` varchar(80) NOT NULL DEFAULT 'general',
  `description` varchar(255) DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `group_name`, `description`, `is_public`, `created_at`, `updated_at`) VALUES
(1, 'site_name', 'Quantum Mentor World', 'text', 'general', 'Main website title', 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05'),
(2, 'brand_name', 'Quantum Mentor Official', 'text', 'general', 'Corporate brand title', 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05'),
(3, 'site_tagline', 'Legal educational resources, tools, books, software, and learning links in one place.', 'text', 'general', 'Tagline under brand name', 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05'),
(4, 'site_email', 'support@example.com', 'email', 'general', 'Primary support email', 0, '2026-06-24 19:44:05', '2026-06-24 19:44:05'),
(5, 'legal_notice', 'This platform only supports legal, official, open-source, public-domain, freeware, creator-approved, or properly licensed resources.', 'textarea', 'general', 'Legal rules note shown to visitors', 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05'),
(6, 'footer_text', '© 2026 Quantum Mentor Official. All rights reserved.', 'text', 'general', 'Footer copyright note', 1, '2026-06-24 19:44:05', '2026-06-25 19:53:45'),
(7, 'allow_user_reports', 'true', 'boolean', 'general', 'Allow users to flag broken/unsafe links', 0, '2026-06-24 19:44:05', '2026-06-24 19:44:05'),
(8, 'maintenance_mode', 'false', 'boolean', 'general', 'Enable or disable maintenance mode', 0, '2026-06-24 19:44:05', '2026-06-24 19:44:05');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(80) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`, `slug`, `description`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Free', 'free', 'Available at no cost.', 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(2, 'Open Source', 'open-source', 'Source code is publicly available.', 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(3, 'Beginner Friendly', 'beginner-friendly', 'Tailored for newcomers.', 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(4, 'Educational', 'educational', 'Focuses on learning and growth.', 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(5, 'Official Link', 'official-link', 'Points to the primary creator website.', 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(6, 'Safe Resource', 'safe-resource', 'Verified safe for developers and users.', 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(7, 'Web Development', 'web-development', 'Relates to HTML, CSS, JS, Node, etc.', 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(8, 'AI', 'ai', 'Involves machine learning or neural systems.', 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(9, 'Productivity', 'productivity', 'Optimizes efficiency and project management.', 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(10, 'Design', 'design', 'Relates to layout, UI/UX, and graphic design.', 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(11, 'Programming', 'programming', 'Relates to code development.', 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(12, 'Learning', 'learning', 'Resource oriented for tutorial and lessons.', 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(13, 'Public Domain', 'public-domain', 'Free of copyright restrictions.', 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(14, 'Creator Approved', 'creator-approved', 'Endorsed by the original author.', 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(15, 'Documentation', 'documentation', 'Extensive guides and manuals included.', 'active', '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `username` varchar(80) NOT NULL,
  `email` varchar(190) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','editor','moderator','user') NOT NULL DEFAULT 'user',
  `status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
  `avatar` varchar(500) DEFAULT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `username`, `email`, `password_hash`, `role`, `status`, `avatar`, `last_login_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Quantum Mentor Admin', 'admin', 'admin@quantummentor.local', '$2a$10$gAs0BbK7RDBLM4pMZCm9YOjWs00BN/D/3GfKNTjhTVeryt./1bTpu', 'admin', 'active', NULL, '2026-06-25 20:39:40', '2026-06-24 19:44:05', '2026-06-25 20:39:40', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `watch_episodes`
--

CREATE TABLE `watch_episodes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `resource_id` bigint(20) UNSIGNED NOT NULL,
  `season_number` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `episode_number` smallint(5) UNSIGNED NOT NULL DEFAULT 1,
  `title` varchar(255) NOT NULL,
  `slug` varchar(280) NOT NULL,
  `description` text DEFAULT NULL,
  `thumbnail` varchar(500) DEFAULT NULL,
  `duration` varchar(20) DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `status` enum('draft','pending_review','published','rejected') NOT NULL DEFAULT 'draft',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `watch_episodes`
--

INSERT INTO `watch_episodes` (`id`, `resource_id`, `season_number`, `episode_number`, `title`, `slug`, `description`, `thumbnail`, `duration`, `release_date`, `status`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 11, 1, 1, 'Introduction to Web Development', 'intro-to-web-dev', 'Learn the basics of what web development is and how computers communicate.', NULL, '45:30', '2026-01-10', 'published', 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(2, 11, 1, 2, 'HTML, CSS, and JavaScript Basics', 'html-css-js-basics', 'A quick hands-on tour creating static pages with formatting and styles.', NULL, '55:12', '2026-01-12', 'published', 2, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(3, 12, 1, 1, 'Learning With Public Domain Media', 'learning-public-domain-media', 'An overview of why public domain databases are valuable learning engines.', NULL, '30:15', '2026-02-01', 'published', 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(4, 12, 1, 2, 'How to Verify Legal Video Sources', 'verify-legal-video-sources', 'A step-by-step checklist to auditing video copyright and reuse rights.', NULL, '35:40', '2026-02-05', 'published', 2, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `watch_servers`
--

CREATE TABLE `watch_servers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `episode_id` bigint(20) UNSIGNED NOT NULL,
  `server_name` varchar(100) NOT NULL,
  `embed_url` varchar(500) NOT NULL,
  `source_url` varchar(500) DEFAULT NULL,
  `source_type` enum('youtube','vimeo','archive_org','official','creator_approved','public_domain','educational','other') NOT NULL DEFAULT 'other',
  `legal_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `safety_status` enum('unchecked','safe','warning','unsafe') NOT NULL DEFAULT 'unchecked',
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `watch_servers`
--

INSERT INTO `watch_servers` (`id`, `episode_id`, `server_name`, `embed_url`, `source_url`, `source_type`, `legal_status`, `safety_status`, `is_primary`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'Official Educational Placeholder', 'https://example.com/video', NULL, 'educational', 'approved', 'safe', 1, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(2, 2, 'Official Educational Placeholder', 'https://example.com/video', NULL, 'educational', 'approved', 'safe', 1, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(3, 3, 'Official Educational Placeholder', 'https://example.com/video', NULL, 'educational', 'approved', 'safe', 1, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL),
(4, 4, 'Official Educational Placeholder', 'https://example.com/video', NULL, 'educational', 'approved', 'safe', 1, 1, '2026-06-24 19:44:05', '2026-06-24 19:44:05', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_activity_logs`
--
ALTER TABLE `admin_activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_logs_user_id` (`user_id`),
  ADD KEY `idx_logs_action` (`action`),
  ADD KEY `idx_logs_entity` (`entity_type`,`entity_id`),
  ADD KEY `idx_logs_created_at` (`created_at`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_categories_slug` (`slug`),
  ADD KEY `idx_categories_slug` (`slug`),
  ADD KEY `idx_categories_parent_id` (`parent_id`),
  ADD KEY `idx_categories_status` (`status`),
  ADD KEY `idx_categories_sort_order` (`sort_order`),
  ADD KEY `idx_categories_deleted_at` (`deleted_at`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_contact_email` (`email`),
  ADD KEY `idx_contact_status` (`status`),
  ADD KEY `idx_contact_created_at` (`created_at`),
  ADD KEY `idx_contact_deleted_at` (`deleted_at`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_media_uploaded_by` (`uploaded_by`),
  ADD KEY `idx_media_mime_type` (`mime_type`),
  ADD KEY `idx_media_deleted_at` (`deleted_at`);

--
-- Indexes for table `resources`
--
ALTER TABLE `resources`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_resources_slug` (`slug`),
  ADD KEY `fk_resources_created_by` (`created_by`),
  ADD KEY `fk_resources_updated_by` (`updated_by`),
  ADD KEY `idx_resources_slug` (`slug`),
  ADD KEY `idx_resources_resource_type` (`resource_type`),
  ADD KEY `idx_resources_status` (`status`),
  ADD KEY `idx_resources_visibility` (`visibility`),
  ADD KEY `idx_resources_legal_status` (`legal_status`),
  ADD KEY `idx_resources_safety_status` (`safety_status`),
  ADD KEY `idx_resources_is_featured` (`is_featured`),
  ADD KEY `idx_resources_is_trending` (`is_trending`),
  ADD KEY `idx_resources_published_at` (`published_at`),
  ADD KEY `idx_resources_deleted_at` (`deleted_at`),
  ADD KEY `idx_resources_type_status` (`resource_type`,`status`),
  ADD KEY `idx_resources_type_legal_safety` (`resource_type`,`legal_status`,`safety_status`),
  ADD KEY `idx_resources_status_published` (`status`,`published_at`),
  ADD KEY `idx_resources_featured_status` (`is_featured`,`status`),
  ADD KEY `idx_resources_trending_status` (`is_trending`,`status`);

--
-- Indexes for table `resource_categories`
--
ALTER TABLE `resource_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_resource_categories` (`resource_id`,`category_id`),
  ADD KEY `idx_res_cat_resource_id` (`resource_id`),
  ADD KEY `idx_res_cat_category_id` (`category_id`);

--
-- Indexes for table `resource_details`
--
ALTER TABLE `resource_details`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_resource_details_resource` (`resource_id`),
  ADD KEY `idx_resource_details_resource_id` (`resource_id`),
  ADD KEY `idx_resource_details_platform` (`platform`),
  ADD KEY `idx_resource_details_license_type` (`license_type`),
  ADD KEY `idx_resource_details_release_year` (`release_year`);

--
-- Indexes for table `resource_links`
--
ALTER TABLE `resource_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_res_links_resource_id` (`resource_id`),
  ADD KEY `idx_res_links_link_type` (`link_type`),
  ADD KEY `idx_res_links_legal_status` (`legal_status`),
  ADD KEY `idx_res_links_safety_status` (`safety_status`),
  ADD KEY `idx_res_links_is_primary` (`is_primary`),
  ADD KEY `idx_res_links_created_by` (`created_by`),
  ADD KEY `idx_res_links_deleted_at` (`deleted_at`);

--
-- Indexes for table `resource_reports`
--
ALTER TABLE `resource_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_reports_resource_id` (`resource_id`),
  ADD KEY `idx_reports_link_id` (`link_id`),
  ADD KEY `idx_reports_report_type` (`report_type`),
  ADD KEY `idx_reports_status` (`status`),
  ADD KEY `idx_reports_created_at` (`created_at`),
  ADD KEY `idx_reports_deleted_at` (`deleted_at`);

--
-- Indexes for table `resource_tags`
--
ALTER TABLE `resource_tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_resource_tags` (`resource_id`,`tag_id`),
  ADD KEY `idx_res_tags_resource_id` (`resource_id`),
  ADD KEY `idx_res_tags_tag_id` (`tag_id`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_site_settings_key` (`setting_key`),
  ADD KEY `idx_settings_key` (`setting_key`),
  ADD KEY `idx_settings_group_name` (`group_name`),
  ADD KEY `idx_settings_is_public` (`is_public`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_tags_slug` (`slug`),
  ADD KEY `idx_tags_slug` (`slug`),
  ADD KEY `idx_tags_status` (`status`),
  ADD KEY `idx_tags_deleted_at` (`deleted_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_users_username` (`username`),
  ADD UNIQUE KEY `uq_users_email` (`email`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_username` (`username`),
  ADD KEY `idx_users_role` (`role`),
  ADD KEY `idx_users_status` (`status`),
  ADD KEY `idx_users_deleted_at` (`deleted_at`);

--
-- Indexes for table `watch_episodes`
--
ALTER TABLE `watch_episodes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_watch_episodes_slug` (`slug`),
  ADD KEY `idx_watch_ep_resource_id` (`resource_id`),
  ADD KEY `idx_watch_ep_slug` (`slug`),
  ADD KEY `idx_watch_ep_status` (`status`),
  ADD KEY `idx_watch_ep_sort_order` (`sort_order`),
  ADD KEY `idx_watch_ep_deleted_at` (`deleted_at`),
  ADD KEY `idx_watch_ep_number` (`resource_id`,`season_number`,`episode_number`);

--
-- Indexes for table `watch_servers`
--
ALTER TABLE `watch_servers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_watch_srv_episode_id` (`episode_id`),
  ADD KEY `idx_watch_srv_legal_status` (`legal_status`),
  ADD KEY `idx_watch_srv_safety_status` (`safety_status`),
  ADD KEY `idx_watch_srv_is_primary` (`is_primary`),
  ADD KEY `idx_watch_srv_deleted_at` (`deleted_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_activity_logs`
--
ALTER TABLE `admin_activity_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `resources`
--
ALTER TABLE `resources`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `resource_categories`
--
ALTER TABLE `resource_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `resource_details`
--
ALTER TABLE `resource_details`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `resource_links`
--
ALTER TABLE `resource_links`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `resource_reports`
--
ALTER TABLE `resource_reports`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `resource_tags`
--
ALTER TABLE `resource_tags`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `watch_episodes`
--
ALTER TABLE `watch_episodes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `watch_servers`
--
ALTER TABLE `watch_servers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_activity_logs`
--
ALTER TABLE `admin_activity_logs`
  ADD CONSTRAINT `fk_activity_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `fk_categories_parent_id` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `fk_media_uploaded_by` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `resources`
--
ALTER TABLE `resources`
  ADD CONSTRAINT `fk_resources_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_resources_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `resource_categories`
--
ALTER TABLE `resource_categories`
  ADD CONSTRAINT `fk_res_cat_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_res_cat_resource` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `resource_details`
--
ALTER TABLE `resource_details`
  ADD CONSTRAINT `fk_resource_details_resource` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `resource_links`
--
ALTER TABLE `resource_links`
  ADD CONSTRAINT `fk_resource_links_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_resource_links_resource` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `resource_reports`
--
ALTER TABLE `resource_reports`
  ADD CONSTRAINT `fk_reports_link` FOREIGN KEY (`link_id`) REFERENCES `resource_links` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_reports_resource` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `resource_tags`
--
ALTER TABLE `resource_tags`
  ADD CONSTRAINT `fk_res_tags_resource` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_res_tags_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `watch_episodes`
--
ALTER TABLE `watch_episodes`
  ADD CONSTRAINT `fk_watch_ep_resource` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `watch_servers`
--
ALTER TABLE `watch_servers`
  ADD CONSTRAINT `fk_watch_srv_episode` FOREIGN KEY (`episode_id`) REFERENCES `watch_episodes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
