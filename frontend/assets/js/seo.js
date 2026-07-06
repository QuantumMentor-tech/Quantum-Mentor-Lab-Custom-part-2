'use strict';

/**
 * Quantum Mentor World — SEO Metadata Helper
 * assets/js/seo.js
 *
 * Provides utilities to dynamically update document title, description,
 * canonical link tags, Open Graph meta tags, and structured JSON-LD schemas.
 */

window.SEO = {
  // Placeholder production base URL
  BASE_URL: 'https://quantummentorworld.com',
  FALLBACK_IMAGE: 'https://quantummentorworld.com/assets/images/logo.png',

  updatePageTitle(title) {
    if (title) {
      document.title = `${title} | Quantum Mentor World`;
    }
  },

  updateMetaDescription(description) {
    if (!description) return;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', this.escapeText(description));
  },

  updateCanonicalUrl(path) {
    if (!path) return;
    // Strip leading slash if present
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const url = `${this.BASE_URL}/${cleanPath}`;
    
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  },

  updateOpenGraphTags(data = {}) {
    this.setOrUpdateMeta('property="og:title"', 'og:title', data.title || document.title, true);
    this.setOrUpdateMeta('property="og:description"', 'og:description', data.description || '', true);
    if (data.path) {
      const cleanPath = data.path.startsWith('/') ? data.path.substring(1) : data.path;
      this.setOrUpdateMeta('property="og:url"', 'og:url', `${this.BASE_URL}/${cleanPath}`, true);
    }
    this.setOrUpdateMeta('property="og:image"', 'og:image', data.image || this.FALLBACK_IMAGE, true);
    this.setOrUpdateMeta('property="og:type"', 'og:type', data.type || 'website', true);
  },

  updateTwitterCardTags(data = {}) {
    this.setOrUpdateMeta('name="twitter:card"', 'twitter:card', 'summary_large_image', false);
    this.setOrUpdateMeta('name="twitter:title"', 'twitter:title', data.title || document.title, false);
    this.setOrUpdateMeta('name="twitter:description"', 'twitter:description', data.description || '', false);
    this.setOrUpdateMeta('name="twitter:image"', 'twitter:image', data.image || this.FALLBACK_IMAGE, false);
  },

  setNoIndex() {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow, noarchive');
  },

  setOrUpdateMeta(selector, attrName, attrValue, isProperty = false) {
    let meta = document.querySelector(`meta[${selector}]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(isProperty ? 'property' : 'name', attrName);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', this.escapeText(attrValue));
  },

  injectJSONLD(schemaData) {
    // Remove existing JSON-LD script if any to avoid duplication
    const oldScript = document.getElementById('qmw-jsonld');
    if (oldScript) {
      oldScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'qmw-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);
  },

  escapeText(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};
