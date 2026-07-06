'use strict';

/**
 * Quantum Mentor World — Production Admin Generator
 * scripts/create-production-admin.js
 *
 * Seeds or updates an administrative user account in the database.
 * Does not hardcode secrets or log password parameters.
 */

const bcrypt = require('bcryptjs');
const db = require('../config/db');

console.log('==================================================');
console.log('👤 PRODUCTION ADMINISTRATOR CREATOR / UPDATER');
console.log('==================================================\n');

// 1. Read parameters from environment variables
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const fullName = process.env.ADMIN_FULL_NAME || 'Production Admin';
const username = process.env.ADMIN_USERNAME || 'prodadmin';

if (!email || !password) {
  console.error('❌ ERROR: Missing required parameters in environment!');
  console.log('\nUsage:');
  console.log('  Windows Command Prompt:');
  console.log('    set ADMIN_EMAIL=admin@example.com');
  console.log('    set ADMIN_PASSWORD=StrongPassword123');
  console.log('    node scripts/create-production-admin.js');
  console.log('\n  PowerShell:');
  console.log('    $env:ADMIN_EMAIL="admin@example.com"');
  console.log('    $env:ADMIN_PASSWORD="StrongPassword123"');
  console.log('    node scripts/create-production-admin.js');
  console.log('\n  Linux/macOS Bash:');
  console.log('    ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=StrongPassword123 node scripts/create-production-admin.js');
  console.log('\n⚠️ Do not use "Admin@12345" in production. Change it immediately.');
  console.log('--------------------------------------------------');
  process.exit(1);
}

// Ensure password is not too short
if (password.length < 8) {
  console.error('❌ ERROR: Password must be at least 8 characters long.');
  process.exit(1);
}

async function run() {
  try {
    // Test database connection first
    const health = await db.testDatabaseConnection();
    if (!health.connected) {
      throw new Error(`Unable to connect to database: ${health.error}`);
    }

    console.log(`Email       : ${email}`);
    console.log(`Full Name   : ${fullName}`);
    console.log(`Username    : ${username}`);
    console.log('Password    : [REDACTED/SECURED]\n');
    console.log('Hashing password and inserting/updating record...');

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Check if user already exists
    const users = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);

    if (users.length > 0) {
      // Update existing admin user
      await db.query(
        `UPDATE users 
         SET full_name = ?, username = ?, password_hash = ?, role = 'admin', status = 'active', deleted_at = NULL 
         WHERE email = ?`,
        [fullName, username, passwordHash, email]
      );
      console.log(`\n✅ SUCCESS: Updated existing administrator account (${email}).`);
    } else {
      // Insert new admin user
      await db.query(
        `INSERT INTO users (full_name, username, email, password_hash, role, status) 
         VALUES (?, ?, ?, ?, 'admin', 'active')`,
        [fullName, username, email, passwordHash]
      );
      console.log(`\n✅ SUCCESS: Created new administrator account (${email}).`);
    }
    
    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ FAILURE: Could not create admin account.');
    console.error('Details:', error.message);
    console.log('--------------------------------------------------');
    process.exit(1);
  }
}

run();
