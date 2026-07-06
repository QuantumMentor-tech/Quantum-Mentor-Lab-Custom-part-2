'use strict';

/**
 * Quantum Mentor World — Express Application Configuration
 * app.js
 *
 * Configures the Express app, mounts middleware layers, handles static assets,
 * maps routing groups, and establishes 404 and global error handlers.
 */

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const compression = require('compression');
const env = require('./config/env');

// Import standard middlewares
const applySecurityMiddleware = require('./middleware/security.middleware');
const { generalLimiter } = require('./middleware/rate-limit.middleware');
const notFoundMiddleware = require('./middleware/not-found.middleware');
const errorMiddleware = require('./middleware/error.middleware');


// Import routes
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const resourcesRoutes = require('./routes/resources.routes');
const softwareRoutes = require('./routes/software.routes');
const booksRoutes = require('./routes/books.routes');
const toolsRoutes = require('./routes/tools.routes');
const gamesRoutes = require('./routes/games.routes');
const themesRoutes = require('./routes/themes.routes');
const watchRoutes = require('./routes/watch.routes');
const newsRoutes = require('./routes/news.routes');
const githubRoutes = require('./routes/github.routes');
const categoriesRoutes = require('./routes/categories.routes');
const tagsRoutes = require('./routes/tags.routes');
const mediaRoutes = require('./routes/media.routes');
const contactRoutes = require('./routes/contact.routes');
const reportsRoutes = require('./routes/reports.routes');
const adminRoutes = require('./routes/admin.routes');
const seoRoutes = require('./routes/seo.routes');
const { sendSuccess } = require('./utils/response');


const app = express();

// Apply gzip response compression
app.use(compression());

// HTTP Request logging
if (env.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing parameters
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static Files: Serve uploaded images safely from /api/uploads/images
app.use('/api/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
// Backward compatibility for general uploads folder
app.use('/uploads', express.static(path.join(__dirname, env.uploadDir)));

// Apply Security middlewares (CORS, Helmet)
applySecurityMiddleware(app);

// Apply Global Rate Limiting to all /api routes
app.use('/api', generalLimiter);

// Enforce Caching Rules
app.use((req, res, next) => {
  if (req.path.startsWith('/api/admin') || req.path.startsWith('/api/auth')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  } else if (req.path.startsWith('/api/uploads/images')) {
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day cache
  }
  next();
});

// Mount health check routes under /api
app.use('/api', healthRoutes);

// Root API welcome route
app.get('/api', (req, res) => {
  return sendSuccess(res, 'Welcome to Quantum Mentor World API.', {
    version: '1.0.0',
    status: 'running'
  });
});

// Mount placeholder API routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/software', softwareRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/themes', themesRoutes);
app.use('/api/watch', watchRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seo', seoRoutes);


// Route 404 Catch-All middleware
app.use(notFoundMiddleware);

// Global Unhandled Error handler middleware
app.use(errorMiddleware);

module.exports = app;
