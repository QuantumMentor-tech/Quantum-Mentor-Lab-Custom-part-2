'use strict';

/**
 * Quantum Mentor World — HTML Metadata Update Automation Script
 * backend/scripts/update-html-metadata.js
 */

const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = path.join(__dirname, '../../frontend');
const ADMIN_DIR = path.join(FRONTEND_DIR, 'admin');

const PUBLIC_PAGES = {
  'index.html': {
    title: 'Quantum Mentor World | Legal Educational Resources, Tools, Software, Books & Learning Links',
    description: 'Quantum Mentor World is an educational resource directory for legal software, books, tools, games, themes, plugins, watch content, news, and GitHub repositories.'
  },
  'software.html': {
    title: 'Legal Software Resources | Quantum Mentor World',
    description: 'Browse legal, official, open-source, freeware, and properly licensed software resources for learning, productivity, development, and education.'
  },
  'books.html': {
    title: 'Educational Books & Learning Resources | Quantum Mentor World',
    description: 'Find legal educational books, public-domain books, open-access learning materials, and safe reading resources in one organized directory.'
  },
  'tools.html': {
    title: 'Online Tools & Educational Utilities | Quantum Mentor World',
    description: 'Discover useful legal tools for productivity, writing, development, image work, PDFs, SEO, AI learning, and education.'
  },
  'games.html': {
    title: 'Legal Educational Games & Learning Games | Quantum Mentor World',
    description: 'Browse legal, safe, educational, freeware, public-domain, or official game resources for learning and skill-building.'
  },
  'themes-plugins.html': {
    title: 'Legal Themes, Plugins & Templates | Quantum Mentor World',
    description: 'Explore legal, official, open-source, GPL-compliant, creator-approved, and properly licensed themes, plugins, and templates.'
  },
  'watch.html': {
    title: 'Legal Watch Content & Educational Videos | Quantum Mentor World',
    description: 'Watch or discover legal educational videos, official tutorials, public-domain content, and creator-approved learning media.'
  },
  'news.html': {
    title: 'Technology, AI & Education News | Quantum Mentor World',
    description: 'Read summaries and updates about AI, education, software, tools, open-source resources, technology, and learning trends.'
  },
  'github-repos.html': {
    title: 'Open Source GitHub Repositories | Quantum Mentor World',
    description: 'Discover educational and open-source GitHub repositories for programming, web development, AI, tools, and learning projects.'
  },
  'search.html': {
    title: 'Search Legal Educational Resources | Quantum Mentor World',
    description: 'Search across legal software, books, tools, games, watch content, news, themes, plugins, and GitHub repositories.',
    noindex: true
  },
  'categories.html': {
    title: 'Resource Categories | Quantum Mentor World',
    description: 'Browse Quantum Mentor World resources by category, including software, books, tools, games, AI, programming, education, and open-source resources.'
  },
  'category.html': {
    title: 'Category Resources | Quantum Mentor World',
    description: 'Browse legal educational resources in specific categories on Quantum Mentor World.',
    dynamic: true
  },
  'tags.html': {
    title: 'Resource Tags | Quantum Mentor World',
    description: 'Explore legal educational resources by tags such as free, open source, beginner friendly, AI, productivity, programming, and learning.'
  },
  'tag.html': {
    title: 'Tag Resources | Quantum Mentor World',
    description: 'Browse legal educational resources tagged on Quantum Mentor World.',
    dynamic: true
  },
  'resource-detail.html': {
    title: 'Resource Details | Quantum Mentor World',
    description: 'View safe links, custom fields, and official details for resources on Quantum Mentor World.',
    dynamic: true
  },
  'about.html': {
    title: 'About Quantum Mentor World | Educational Resource Directory',
    description: 'Learn about Quantum Mentor World, a legal educational resource directory built to help users discover safe tools, software, books, learning links, and open-source resources.',
    static: true
  },
  'contact.html': {
    title: 'Contact Quantum Mentor World | Support & Resource Questions',
    description: 'Contact Quantum Mentor World for questions, feedback, resource reports, suggestions, and support related to legal educational resources.',
    static: true
  },
  'disclaimer.html': {
    title: 'Disclaimer | Quantum Mentor World',
    description: 'Read the Quantum Mentor World disclaimer about third-party resources, external links, copyright, educational use, and legal content guidelines.',
    static: true
  },
  'privacy.html': {
    title: 'Privacy Policy | Quantum Mentor World',
    description: 'Read how Quantum Mentor World handles contact form submissions, reports, basic technical data, cookies if used, and privacy-related information.',
    static: true
  }
};

const BASE_URL = 'https://quantummentorworld.com';
const LOGO_URL = 'https://quantummentorworld.com/assets/images/logo.png';

function processPublicPages() {
  console.log('Processing public HTML pages...');

  for (const [filename, data] of Object.entries(PUBLIC_PAGES)) {
    const filePath = path.join(FRONTEND_DIR, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`File missing: ${filePath}`);
      continue;
    }

    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Strip existing title, meta tags, and canonical tags inside <head>
    html = html.replace(/<title>[\s\S]*?<\/title>/gi, '');
    html = html.replace(/<meta name="description"[\s\S]*?\/>/gi, '');
    html = html.replace(/<meta name="robots"[\s\S]*?\/>/gi, '');
    html = html.replace(/<link rel="canonical"[\s\S]*?\/>/gi, '');
    html = html.replace(/<meta property="og:[\s\S]*?\/>/gi, '');
    html = html.replace(/<meta name="twitter:[\s\S]*?\/>/gi, '');

    // 2. Generate new metadata block
    const robotsText = data.noindex ? 'noindex, follow' : 'index, follow';
    const seoBlock = `  <title>${data.title}</title>
  <meta name="description" content="${data.description}" />
  <meta name="robots" content="${robotsText}" />
  <!-- Replace https://quantummentorworld.com with the real production domain before launch. -->
  <link rel="canonical" href="${BASE_URL}/${filename}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${data.title}" />
  <meta property="og:description" content="${data.description}" />
  <meta property="og:url" content="${BASE_URL}/${filename}" />
  <meta property="og:site_name" content="Quantum Mentor World" />
  <meta property="og:image" content="${LOGO_URL}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${data.title}" />
  <meta name="twitter:description" content="${data.description}" />
  <meta name="twitter:image" content="${LOGO_URL}" />`;

    // Insert block right after <head> tag
    html = html.replace(/<head>([\s\S]*?)/i, `<head>\n${seoBlock}\n`);

    // 3. Handle dynamic helper injection for seo.js
    if (data.dynamic || data.noindex) {
      // Check if seo.js script reference is already there, if not insert it
      if (!html.includes('assets/js/seo.js')) {
        // Find the place before main controller script files
        const scriptPatterns = [
          'src="assets/js/resource-detail.js"',
          'src="assets/js/categories.js"',
          'src="assets/js/tags.js"',
          'src="assets/js/search.js"'
        ];

        let replaced = false;
        for (const pattern of scriptPatterns) {
          if (html.includes(pattern)) {
            html = html.replace(`<script ${pattern}`, `<script src="assets/js/seo.js"></script>\n  <script ${pattern}`);
            html = html.replace(`<script async ${pattern}`, `<script src="assets/js/seo.js"></script>\n  <script async ${pattern}`);
            replaced = true;
            break;
          }
        }
      }
    }

    // 4. Handle static page helper injection for static-pages.js
    if (data.static) {
      if (!html.includes('assets/js/static-pages.js')) {
        const pattern = 'src="assets/js/main.js"';
        if (html.includes(pattern)) {
          html = html.replace(`<script ${pattern}`, `<script src="assets/js/static-pages.js"></script>\n  <script ${pattern}`);
        }
      }
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Updated: ${filename}`);
  }
}

function processAdminPages() {
  console.log('Processing admin HTML pages (Enforcing noindex, nofollow, noarchive)...');
  
  if (!fs.existsSync(ADMIN_DIR)) {
    console.warn(`Admin directory does not exist: ${ADMIN_DIR}`);
    return;
  }

  const files = fs.readdirSync(ADMIN_DIR);
  for (const filename of files) {
    if (!filename.endsWith('.html')) continue;

    const filePath = path.join(ADMIN_DIR, filename);
    let html = fs.readFileSync(filePath, 'utf8');

    // Remove any existing robots tags
    html = html.replace(/<meta name="robots"[\s\S]*?\/>/gi, '');

    // Place strict noindex tag at the top of <head>
    const noindexTag = '  <meta name="robots" content="noindex, nofollow, noarchive" />';
    html = html.replace(/<head>([\s\S]*?)/i, `<head>\n${noindexTag}\n`);

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Updated Admin page: admin/${filename}`);
  }
}

processPublicPages();
processAdminPages();
console.log('SEO & noindex script run complete!');
