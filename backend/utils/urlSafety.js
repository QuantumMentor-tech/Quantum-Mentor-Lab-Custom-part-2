'use strict';

/**
 * Quantum Mentor World — URL Safety Utility
 * utils/urlSafety.js
 *
 * Implements strict checks to block forbidden protocols (javascript:, data:, file:, etc.)
 * and local/private subnets (localhost, loopback, private ranges).
 */

const dns = require('dns');

// Blocked protocol lists
const BLOCKED_PROTOCOLS = ['javascript:', 'data:', 'file:', 'ftp:', 'vbscript:'];

/**
 * Detects if the URL protocol matches any of the blocked schemes.
 * @param {string} urlStr
 * @returns {boolean}
 */
function isBlockedUrlProtocol(urlStr) {
  try {
    const parsed = new URL(urlStr);
    return BLOCKED_PROTOCOLS.includes(parsed.protocol.toLowerCase());
  } catch (err) {
    // If not parseable, check if it prefix matches
    const lower = urlStr.toLowerCase().trim();
    return BLOCKED_PROTOCOLS.some(proto => lower.startsWith(proto));
  }
}

/**
 * Detects if the domain host points to loopback or private ranges.
 * @param {string} urlStr
 * @returns {boolean}
 */
function isPrivateOrLocalUrl(urlStr) {
  try {
    const parsed = new URL(urlStr);
    const host = parsed.hostname.toLowerCase().trim();

    // 1. Loopback check
    if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || host === '[::1]') {
      return true;
    }

    // 2. Private IP subnets check
    // Matches 10.x.x.x, 192.168.x.x, 172.16.x.x to 172.31.x.x
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = host.match(ipv4Regex);
    if (match) {
      const p1 = parseInt(match[1], 10);
      const p2 = parseInt(match[2], 10);
      
      if (p1 === 10) return true; // Class A
      if (p1 === 192 && p2 === 168) return true; // Class C
      if (p1 === 172 && p2 >= 16 && p2 <= 31) return true; // Class B
      if (p1 === 169 && p2 === 254) return true; // Link-local
    }

    return false;
  } catch (err) {
    return true; // Treat invalid URL as unsafe
  }
}

/**
 * High-level check to determine if a URL is safe.
 * @param {string} urlStr
 * @returns {boolean}
 */
function isSafeUrl(urlStr) {
  if (!urlStr || typeof urlStr !== 'string' || urlStr.trim() === '') {
    return false;
  }

  // Basic sanity check to ensure it has a schema
  if (!/^https?:\/\//i.test(urlStr)) {
    return false;
  }

  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }
    
    // Check protocol blocklist
    if (isBlockedUrlProtocol(urlStr)) {
      return false;
    }

    // Check private domain/IP blocks
    if (isPrivateOrLocalUrl(urlStr)) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Formats and normalizes a URL.
 * @param {string} urlStr
 * @returns {string}
 */
function normalizeUrl(urlStr) {
  if (!urlStr) return '';
  return urlStr.trim();
}

/**
 * Returns domain host portion of URL.
 * @param {string} urlStr
 * @returns {string}
 */
function getUrlDomain(urlStr) {
  try {
    const parsed = new URL(urlStr);
    return parsed.hostname;
  } catch (err) {
    return '';
  }
}

/**
 * Validates a single link object properties.
 * @param {Object} link
 * @returns {boolean}
 */
function validateResourceLink(link) {
  if (!link || typeof link !== 'object') return false;
  if (!link.label || typeof link.label !== 'string' || link.label.trim() === '') return false;
  if (!link.url || !isSafeUrl(link.url)) return false;
  
  const allowedTypes = ['official', 'download', 'github', 'documentation', 'demo', 'read_online', 'launch_tool', 'source', 'other'];
  if (link.link_type && !allowedTypes.includes(link.link_type)) return false;

  return true;
}

module.exports = {
  isBlockedUrlProtocol,
  isPrivateOrLocalUrl,
  isSafeUrl,
  normalizeUrl,
  getUrlDomain,
  validateResourceLink
};
