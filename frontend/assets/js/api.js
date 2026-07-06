'use strict';

/**
 * Quantum Mentor World
 * api.js — Centralized API communication layer.
 *
 * All fetch() calls to the backend go through this file.
 * Base URL is configured here and used by all other JS files.
 */

/* ─── API Base URL ───────────────────────────────────────────── */
const API_BASE_URL = window.QMW_API_BASE_URL || (
  ['localhost', '127.0.0.1'].some(h => window.location.hostname.includes(h))
    ? 'http://localhost:5000/api'
    : 'https://api.quantummentor.world/api'
);

/* ─── Query String Builder ───────────────────────────────────── */
function buildQueryString(params = {}) {
  const cleanParams = {};
  for (const key in params) {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      cleanParams[key] = params[key];
    }
  }
  const searchParams = new URLSearchParams(cleanParams);
  const str = searchParams.toString();
  return str ? `?${str}` : '';
}

/* ─── API Error Handler ──────────────────────────────────────── */
function handleApiError(error, endpoint) {
  console.error(`[API Connection Error] ${endpoint} —`, error.message);
  return {
    success: false,
    message: 'Unable to connect to the API. Please make sure the backend server is running.',
    data: null
  };
}

/* ─── Fetch Response Interceptor ───────────────────────────────── */
async function handleFetchResponse(response) {
  if (response.status === 401) {
    sessionStorage.removeItem('qmw_admin_token');
    sessionStorage.removeItem('qmw_admin_user');
    const path = window.location.pathname;
    const loginUrl = path.includes('/admin/') ? 'login.html' : 'admin/login.html';
    
    // Only redirect if we are on an admin page (not public pages) and not already on login
    if (path.includes('/admin/') && !path.includes('login.html')) {
      window.location.href = loginUrl;
    }
    return { success: false, message: 'Session expired. Please log in again.', data: null };
  }
  if (response.status === 403) {
    return { success: false, message: 'Access denied. You do not have permission to perform this action.', data: null };
  }
  try {
    return await response.json();
  } catch (err) {
    return { success: false, message: 'Invalid response format from server.', data: null };
  }
}

/* ─── Core GET Helper ────────────────────────────────────────── */
async function apiGet(endpoint, options = {}) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const token   = sessionStorage.getItem('qmw_admin_token');
    
    // Do not attach token for public resource GET requests
    const isPublic = endpoint.startsWith('/resources') || 
                     endpoint.startsWith('/categories') || 
                     endpoint.startsWith('/tags') || 
                     endpoint.startsWith('/health') ||
                     ['/software', '/books', '/tools', '/games', '/themes', '/watch', '/news', '/github'].some(p => endpoint.startsWith(p));
                     
    if (token && !isPublic) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const queryStr = buildQueryString(options);
    const fullUrl = `${API_BASE_URL}${endpoint}${queryStr}`;

    const response = await fetch(fullUrl, { headers });
    return await handleFetchResponse(response);
  } catch (error) {
    return handleApiError(error, endpoint);
  }
}

/* ─── Core POST Helper ───────────────────────────────────────── */
async function apiPost(endpoint, body = {}) {
  try {
    const headers = {};
    const token   = sessionStorage.getItem('qmw_admin_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const isFormData = body instanceof FormData;
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method:  'POST',
      headers,
      body:    isFormData ? body : JSON.stringify(body),
    });
    return await handleFetchResponse(response);
  } catch (error) {
    return handleApiError(error, endpoint);
  }
}

/* ─── Core PUT Helper ────────────────────────────────────────── */
async function apiPut(endpoint, body = {}) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const token   = sessionStorage.getItem('qmw_admin_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method:  'PUT',
      headers,
      body:    JSON.stringify(body),
    });
    return await handleFetchResponse(response);
  } catch (error) {
    return handleApiError(error, endpoint);
  }
}

/* ─── Core PATCH Helper ───────────────────────────────────────── */
async function apiPatch(endpoint, body = {}) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const token   = sessionStorage.getItem('qmw_admin_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method:  'PATCH',
      headers,
      body:    JSON.stringify(body),
    });
    return await handleFetchResponse(response);
  } catch (error) {
    return handleApiError(error, endpoint);
  }
}

/* ─── Core DELETE Helper ─────────────────────────────────────── */
async function apiDelete(endpoint) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const token   = sessionStorage.getItem('qmw_admin_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    return await handleFetchResponse(response);
  } catch (error) {
    return handleApiError(error, endpoint);
  }
}

/* ─── High-Level API Methods ─────────────────────────────────── */
const API = {
  /* Health */
  health: () => apiGet('/health'),
  healthDatabase: () => apiGet('/health/database'),

  /* Public Resources */
  getResources:      (params = {}) => apiGet('/resources', params),
  getResourceBySlug: (slug)        => apiGet(`/resources/${slug}`),
  getFeatured:       (limit = 8)   => apiGet('/resources/featured', { limit }),
  getTrending:       (limit = 8)   => apiGet('/resources/trending', { limit }),
  getLatest:         (limit = 8)   => apiGet('/resources/latest', { limit }),
  getByType:         (type, params = {})  => apiGet(`/resources/type/${type}`, params),

  /* Specific Feeds (Step 8 Subroutes) */
  getSectionFeed:    (section, params = {}) => apiGet(`/${section}`, params),

  /* Public Categories & Tags */
  getCategories: () => apiGet('/categories'),
  getCategoryResources: (slug, params = {}) => apiGet(`/categories/${slug}/resources`, params),
  getTags:       () => apiGet('/tags'),
  getTagResources: (slug, params = {}) => apiGet(`/tags/${slug}/resources`, params),

  /* Contact Form submission */
  submitContact: (data) => apiPost('/contact', data),

  /* Resource Reports submission */
  submitReport:  (data) => apiPost('/reports', data),

  /* Admin Auth */
  login:  (credentials) => apiPost('/auth/login', credentials),
  logout: ()            => apiPost('/auth/logout'),

  /* Admin Overview stats */
  getOverview: () => apiGet('/admin/overview'),

  /* Admin Resources CRUD */
  getAdminResources: (params = {}) => apiGet('/admin/resources', params),
  getAdminResource:  (id)          => apiGet(`/admin/resources/${id}`),
  createResource:    (data)        => apiPost('/admin/resources', data),
  updateResource:    (id, data)    => apiPatch(`/admin/resources/${id}`, data),
  deleteResource:    (id)          => apiDelete(`/admin/resources/${id}`),
  restoreResource:   (id)          => apiPatch(`/admin/resources/${id}/restore`),
  updateResourceStatus:   (id, status) => apiPatch(`/admin/resources/${id}/status`, { status }),
  updateResourceFeatured: (id, is_featured) => apiPatch(`/admin/resources/${id}/feature`, { is_featured }),
  updateResourceTrending: (id, is_trending) => apiPatch(`/admin/resources/${id}/trending`, { is_trending }),

  /* Admin Categories CRUD */
  getAdminCategories: (params = {}) => apiGet('/admin/categories', params),
  createCategory:     (data)        => apiPost('/admin/categories', data),
  updateCategory:     (id, data)    => apiPatch(`/admin/categories/${id}`, data),
  deleteCategory:     (id)          => apiDelete(`/admin/categories/${id}`),

  /* Admin Tags CRUD */
  getAdminTags: (params = {}) => apiGet('/admin/tags', params),
  createTag:     (data)        => apiPost('/admin/tags', data),
  updateTag:     (id, data)    => apiPatch(`/admin/tags/${id}`, data),
  deleteTag:     (id)          => apiDelete(`/admin/tags/${id}`),

  /* Admin Settings */
  getAdminSettings: ()     => apiGet('/admin/settings'),
  updateSettings:   (data) => apiPatch('/admin/settings', data),

  /* Admin Media Manager */
  getMedia:      (params = {}) => apiGet('/media', params),
  getMediaById:  (id)          => apiGet(`/media/${id}`),
  uploadMedia:   (formData)    => apiPost('/media/upload', formData),
  updateMedia:   (id, data)    => apiPatch(`/media/${id}`, data),
  deleteMedia:   (id)          => apiDelete(`/media/${id}`),

  /* Admin Contact Messages Inbox */
  getAdminMessages:    (params = {}) => apiGet('/contact/admin/messages', params),
  getAdminMessageById: (id)          => apiGet(`/contact/admin/messages/${id}`),
  updateMessageStatus: (id, status)  => apiPatch(`/contact/admin/messages/${id}/status`, { status }),
  deleteMessage:       (id)          => apiDelete(`/contact/admin/messages/${id}`),

  /* Admin Reports Manager */
  getAdminReports:      (params = {}) => apiGet('/reports/admin', params),
  getAdminReportById:   (id)          => apiGet(`/reports/admin/${id}`),
  updateReportStatus:   (id, status)  => apiPatch(`/reports/admin/${id}/status`, { status }),
  deleteReport:         (id)          => apiDelete(`/reports/admin/${id}`)
};

/* ─── Token Helpers ──────────────────────────────────────────── */
function saveToken(token)  { sessionStorage.setItem('qmw_admin_token', token); }
function clearToken()      { sessionStorage.removeItem('qmw_admin_token'); }
function getToken()        { return sessionStorage.getItem('qmw_admin_token'); }
function isLoggedIn()      { return !!getToken(); }

/* ─── Expose Globally ────────────────────────────────────────── */
window.API_BASE_URL = API_BASE_URL;
window.apiGet       = apiGet;
window.apiPost      = apiPost;
window.apiPut       = apiPut;
window.apiPatch     = apiPatch;
window.apiDelete    = apiDelete;
window.API          = API;
window.saveToken    = saveToken;
window.clearToken   = clearToken;
window.getToken     = getToken;
window.isLoggedIn   = isLoggedIn;
