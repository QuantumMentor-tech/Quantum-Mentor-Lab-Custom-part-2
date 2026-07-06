'use strict';

/**
 * Quantum Mentor World — Backend Constants
 * utils/constants.js
 *
 * Defines the constant sets matching the database ENUM values and standard public filters.
 * All arrays are frozen for integrity.
 */

const RESOURCE_TYPES = Object.freeze([
  'software',
  'book',
  'tool',
  'game',
  'theme_plugin',
  'watch',
  'news',
  'github_repo'
]);

const RESOURCE_STATUS = Object.freeze([
  'draft',
  'pending_review',
  'published',
  'rejected',
  'archived'
]);

const LEGAL_STATUS = Object.freeze([
  'pending',
  'approved',
  'rejected'
]);

const SAFETY_STATUS = Object.freeze([
  'unchecked',
  'safe',
  'warning',
  'unsafe'
]);

const VISIBILITY = Object.freeze([
  'public',
  'private'
]);

const USER_ROLES = Object.freeze([
  'admin',
  'editor',
  'moderator',
  'user'
]);

const USER_STATUS = Object.freeze([
  'active',
  'inactive',
  'suspended'
]);

const SOURCE_TYPES = Object.freeze([
  'official',
  'open_source',
  'public_domain',
  'freeware',
  'creator_approved',
  'licensed',
  'educational',
  'other'
]);

const ACCESS_TYPES = Object.freeze([
  'free',
  'paid',
  'freemium',
  'open_source',
  'public_domain',
  'external'
]);

const CONTACT_STATUS = Object.freeze([
  'new',
  'read',
  'replied',
  'archived',
  'spam'
]);

const REPORT_TYPES = Object.freeze([
  'broken_link',
  'unsafe_link',
  'copyright_issue',
  'wrong_information',
  'other'
]);

const REPORT_STATUS = Object.freeze([
  'new',
  'reviewing',
  'resolved',
  'rejected',
  'spam'
]);

// Step 8 updates: Public types and filter condition
const PUBLIC_RESOURCE_TYPES = RESOURCE_TYPES;

const PUBLIC_RESOURCE_CONDITION = `
  resources.status = 'published'
  AND resources.visibility = 'public'
  AND resources.legal_status = 'approved'
  AND resources.safety_status IN ('safe', 'warning')
  AND resources.deleted_at IS NULL
`.trim();

module.exports = {
  RESOURCE_TYPES,
  RESOURCE_STATUS,
  LEGAL_STATUS,
  SAFETY_STATUS,
  VISIBILITY,
  USER_ROLES,
  USER_STATUS,
  SOURCE_TYPES,
  ACCESS_TYPES,
  CONTACT_STATUS,
  REPORT_TYPES,
  REPORT_STATUS,
  PUBLIC_RESOURCE_TYPES,
  PUBLIC_RESOURCE_CONDITION
};
