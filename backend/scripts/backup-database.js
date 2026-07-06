'use strict';

/**
 * Quantum Mentor World — Database Backup Script
 * scripts/backup-database.js
 *
 * Prepares timestamped database backup commands and explains safe manual/automatic
 * dump options without exposing passwords or keys in logs.
 */

const fs = require('fs');
const path = require('path');
const env = require('../config/env');

const backupsDir = path.join(__dirname, '../../backups/generated');

console.log('==================================================');
console.log('💾 DATABASE BACKUP UTILITY');
console.log('==================================================\n');

// 1. Create target backup directory if it does not exist
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
  console.log(`Created backup output folder: ${backupsDir}`);
}

// 2. Generate timestamped filename
const now = new Date();
const timestamp = now.toISOString()
  .replace(/T/, '_')
  .replace(/\..+/, '')
  .replace(/:/g, '-');
const backupFilename = `quantum_mentor_world_backup_${timestamp}.sql`;
const backupFilePath = path.join(backupsDir, backupFilename);

// 3. Print information and configuration
console.log(`Database Host     : ${env.db.host}:${env.db.port}`);
console.log(`Database Name     : ${env.db.name}`);
console.log(`Database User     : ${env.db.user}`);
console.log(`Database Password : [REDACTED/SECURED]`);
console.log(`Output Filename   : ${backupFilename}\n`);

// 4. Output command line execution recommendations
console.log('--------------------------------------------------');
console.log('👉 AUTOMATED CLI COMMAND (Run in terminal/CMD):');
console.log('--------------------------------------------------');

// Prepare mysqldump command layout safely
// Password is omitted from plain output so it remains secure on command screens
const dumpCmd = `mysqldump -h ${env.db.host} -P ${env.db.port} -u ${env.db.user} -p ${env.db.name} > "${backupFilePath}"`;
console.log(dumpCmd);
console.log('\n💡 Note: You will be prompted to enter the database password after running this command.');
console.log('--------------------------------------------------\n');

// 5. Output manual recovery instructions
console.log('--------------------------------------------------');
console.log('👉 MANUAL FALLBACK EXPORT (via phpMyAdmin):');
console.log('--------------------------------------------------');
console.log('1. Open your browser and navigate to http://localhost/phpmyadmin');
console.log(`2. Click the "${env.db.name}" database in the sidebar.`);
console.log('3. Select the "Export" tab from the top navigation bar.');
console.log('4. Keep the export method as "Quick" and format as "SQL".');
console.log('5. Click "Export" to download your file, and save it in:');
console.log(`   backups/generated/${backupFilename}`);
console.log('--------------------------------------------------\n');

console.log('✅ DATABASE BACKUP UTILITY RAN SUCCESSFULLY.');
process.exit(0);
