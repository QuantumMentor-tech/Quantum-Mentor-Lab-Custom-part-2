-- ============================================================
-- Quantum Mentor World — Database Optimization Indexes
-- database/optimization_indexes.sql
--
-- Applies indexes to optimize filters, slug lookups, relational joins,
-- and state queries. Run this migration on your MySQL server.
-- ============================================================

-- 1. Resources Indexing
CREATE INDEX idx_resources_slug ON resources (slug);
CREATE INDEX idx_resources_resource_type ON resources (resource_type);
CREATE INDEX idx_resources_status ON resources (status);
CREATE INDEX idx_resources_visibility ON resources (visibility);
CREATE INDEX idx_resources_legal_status ON resources (legal_status);
CREATE INDEX idx_resources_safety_status ON resources (safety_status);
CREATE INDEX idx_resources_published_at ON resources (published_at);
CREATE INDEX idx_resources_created_at ON resources (created_at);
CREATE INDEX idx_resources_deleted_at ON resources (deleted_at);

-- 2. Category & Tag Indexing
CREATE INDEX idx_categories_slug ON categories (slug);
CREATE INDEX idx_tags_slug ON tags (slug);

-- 3. Relation Joins Indexing
CREATE INDEX idx_resource_categories_resource ON resource_categories (resource_id);
CREATE INDEX idx_resource_categories_category ON resource_categories (category_id);
CREATE INDEX idx_resource_tags_resource ON resource_tags (resource_id);
CREATE INDEX idx_resource_tags_tag ON resource_tags (tag_id);

-- 4. Resource Links Indexing
CREATE INDEX idx_resource_links_resource ON resource_links (resource_id);

-- 5. Media Assets Indexing
CREATE INDEX idx_media_uploaded_by ON media (uploaded_by);

-- 6. Messages & Reports Indexing
CREATE INDEX idx_contact_messages_status ON contact_messages (status);
CREATE INDEX idx_resource_reports_status ON resource_reports (status);
