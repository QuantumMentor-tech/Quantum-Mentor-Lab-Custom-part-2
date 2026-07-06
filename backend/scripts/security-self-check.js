'use strict';

/**
 * Quantum Mentor World — Static Code Security Self-Check
 * scripts/security-self-check.js
 *
 * Scans backend JS files for potentially unsafe patterns like SQL string concatenation
 * or exposure of sensitive variables (JWT_SECRET, password_hash) in logs/responses.
 */

const fs = require('fs');
const path = require('path');

const BACKEND_DIR = path.join(__dirname, '..');
const IGNORE_DIRS = ['node_modules', 'scripts', 'uploads'];

console.log('==================================================');
console.log('🔍 STATIC SECURITY SELF-CHECK SCANNER');
console.log('==================================================\n');

// Unsafe patterns to check
const rules = [
  {
    id: 'SQL_CONCAT_QUERY',
    pattern: /\$\{.*req\.query.*\}/i,
    severity: 'ERROR',
    message: 'Potential raw request query parameter concatenated in a string (SQL Injection risk).'
  },
  {
    id: 'SQL_CONCAT_BODY',
    pattern: /\$\{.*req\.body.*\}/i,
    severity: 'ERROR',
    message: 'Potential raw request body parameter concatenated in a string (SQL Injection risk).'
  },
  {
    id: 'SQL_CONCAT_PARAMS',
    pattern: /\$\{.*req\.params.*\}/i,
    severity: 'ERROR',
    message: 'Potential raw request URL parameter concatenated in a string (SQL Injection risk).'
  },
  {
    id: 'RAW_PASSWORD_EXPOSURE',
    pattern: /password_hash\s*:\s*[^a-zA-Z0-9_\s'"]/i,
    severity: 'WARNING',
    message: 'Ensure "password_hash" is not being directly mapped to an outbound JSON response.'
  },
  {
    id: 'JWT_SECRET_LOGGING',
    pattern: /console\.log\(.*JWT_SECRET.*\)/i,
    severity: 'WARNING',
    message: 'Do not log JWT_SECRET to console/log files.'
  },
  {
    id: 'SELECT_ALL_WILDCARD',
    pattern: /SELECT\s+\*\s+FROM/i,
    severity: 'INFO',
    message: 'SQL queries using "SELECT *" should ideally list explicit columns for query performance and data exposure protection.'
  }
];

let issueCount = 0;
let warningCount = 0;
let errorCount = 0;

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(file) && !file.startsWith('.')) {
        scanDirectory(fullPath);
      }
    } else if (file.endsWith('.js')) {
      scanFile(fullPath);
    }
  }
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Skip comments
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
      return;
    }

    rules.forEach(rule => {
      if (rule.pattern.test(line)) {
        const relativePath = path.relative(BACKEND_DIR, filePath);
        issueCount++;

        if (rule.severity === 'ERROR') {
          errorCount++;
          console.error(`❌ [ERROR] ${rule.id} at ${relativePath}:${idx + 1}`);
        } else if (rule.severity === 'WARNING') {
          warningCount++;
          console.warn(`⚠️ [WARN]  ${rule.id} at ${relativePath}:${idx + 1}`);
        } else {
          console.log(`ℹ️ [INFO]  ${rule.id} at ${relativePath}:${idx + 1}`);
        }
        console.log(`   Line: ${trimmed}`);
        console.log(`   Message: ${rule.message}\n`);
      }
    });
  });
}

console.log('Scanning files in backend...');
scanDirectory(BACKEND_DIR);

console.log('--------------------------------------------------');
console.log('SCAN COMPLETE SUMMARY:');
console.log(`Total occurrences: ${issueCount}`);
console.log(`  - Info:     ${issueCount - warningCount - errorCount}`);
console.log(`  - Warnings: ${warningCount}`);
console.log(`  - Errors:   ${errorCount}`);
console.log('--------------------------------------------------');

if (errorCount > 0) {
  console.error('\n❌ SECURITY SELF-CHECK REJECTED: Critical concerns identified.');
  process.exit(1);
} else {
  console.log('\n✅ SECURITY SELF-CHECK COMPLETED: No critical SQL Injection or secret exposure risks found.');
  process.exit(0);
}
