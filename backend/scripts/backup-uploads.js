'use strict';

/**
 * Quantum Mentor World — Uploaded Media Backup Utility
 * scripts/backup-uploads.js
 *
 * Scans the local backend/uploads directory recursively, copies only whitelisted
 * image formats (.jpg, .jpeg, .png, .webp, .gif) to the backups directory,
 * and skips any executable/unsafe configuration files.
 */

const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '../uploads');
const BACKUPS_BASE_DIR = path.join(__dirname, '../../backups/generated');

const IMAGE_WHITELIST = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

console.log('==================================================');
console.log('📁 UPLOADS MEDIA BACKUP UTILITY');
console.log('==================================================\n');

if (!fs.existsSync(UPLOADS_DIR)) {
  console.warn(`⚠️ Warning: Source uploads directory does not exist yet at: ${UPLOADS_DIR}`);
  console.log('Nothing to back up.');
  process.exit(0);
}

// 1. Generate timestamped destination path
const now = new Date();
const timestamp = now.toISOString()
  .replace(/T/, '_')
  .replace(/\..+/, '')
  .replace(/:/g, '-');
const backupDirName = `uploads_backup_${timestamp}`;
const destDir = path.join(BACKUPS_BASE_DIR, backupDirName);

let filesCopied = 0;
let filesSkipped = 0;

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const children = fs.readdirSync(src);
    children.forEach(child => {
      copyRecursive(path.join(src, child), path.join(dest, child));
    });
  } else {
    const ext = path.extname(src).toLowerCase();
    
    // Only copy whitelisted image files
    if (IMAGE_WHITELIST.includes(ext)) {
      // Ensure target directory exists
      const parentDir = path.dirname(dest);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.copyFileSync(src, dest);
      filesCopied++;
    } else {
      console.warn(`⚠️ Skipping non-whitelisted/unsafe file format: ${path.basename(src)}`);
      filesSkipped++;
    }
  }
}

try {
  console.log(`Source Folder : ${UPLOADS_DIR}`);
  console.log(`Target Folder : ${destDir}\n`);
  console.log('Backing up files...');

  copyRecursive(UPLOADS_DIR, destDir);

  console.log('\n--------------------------------------------------');
  console.log('UPLOADS BACKUP SUMMARY:');
  console.log(`- Files Copied  : ${filesCopied}`);
  console.log(`- Files Skipped : ${filesSkipped}`);
  console.log(`- Backup Status : ✅ SUCCESSFUL`);
  console.log(`- Saved At      : backups/generated/${backupDirName}`);
  console.log('--------------------------------------------------');
  process.exit(0);
} catch (error) {
  console.error('\n❌ ERROR: Uploads backup failed!');
  console.error('Details:', error.message);
  console.log('--------------------------------------------------');
  process.exit(1);
}
