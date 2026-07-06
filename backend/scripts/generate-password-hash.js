'use strict';

/**
 * Quantum Mentor World — Local Admin Password Hash Generator
 * scripts/generate-password-hash.js
 *
 * Hashes the local-only development admin password "Admin@12345"
 * using the project-installed bcryptjs library.
 */

const bcrypt = require('bcryptjs');

const password = 'Admin@12345';
const saltRounds = 10;

async function generateHash() {
  try {
    const hash = await bcrypt.hash(password, saltRounds);

    console.log('========================================================');
    console.log('QUANTUM MENTOR WORLD — ADMIN PASSWORD HASH GENERATOR');
    console.log('========================================================');
    console.log('Local development password only:');
    console.log(`  ${password}`);
    console.log('');
    console.log('Generated bcrypt hash:');
    console.log(`  ${hash}`);
    console.log('');
    console.log('👉 Copy this hash into database/seed_data.sql for the admin user.');
    console.log('👉 Do not use this password or hash in production.');
    console.log('========================================================');
  } catch (error) {
    console.error('Failed to generate password hash:', error.message);
    process.exit(1);
  }
}

generateHash();
