'use strict';

/**
 * Quantum Mentor World — Database Health Check Script
 * scripts/check-db.js
 *
 * Connects to the database using existing credentials, verifies that required tables exist,
 * reports count details, and fails gracefully if XAMPP MySQL is down.
 */

const env = require('../config/env');
const mysql = require('mysql2/promise');

console.log('==================================================');
console.log('🔍 DATABASE INTEGRITY & CONNECTIVITY CHECK');
console.log('==================================================\n');

console.log(`Connecting to database host: ${env.db.host}:${env.db.port}`);
console.log(`Database name: ${env.db.name}`);
console.log(`User: ${env.db.user}`);
console.log(`Password: [REDACTED/SECURED]\n`);

const requiredTables = [
  'users',
  'resources',
  'resource_details',
  'categories',
  'tags',
  'resource_links',
  'media',
  'contact_messages',
  'resource_reports',
  'site_settings',
  'admin_activity_logs'
];

async function checkDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: env.db.host,
      port: env.db.port,
      database: env.db.name,
      user: env.db.user,
      password: env.db.password
    });

    console.log('✅ Connection established successfully.');

    // Get list of tables
    const [rows] = await connection.execute('SHOW TABLES');
    const existingTables = rows.map(row => Object.values(row)[0]);
    
    console.log(`\nFound ${existingTables.length} total tables in database.`);

    let missingTables = [];
    console.log('\nChecking required tables & counting rows:');
    
    for (const table of requiredTables) {
      if (existingTables.includes(table)) {
        const [countRows] = await connection.execute(`SELECT COUNT(*) as count FROM \`${table}\``);
        const count = countRows[0].count;
        console.log(`✅ Table "${table}": exists (${count} records)`);
      } else {
        console.error(`❌ Table "${table}": MISSING!`);
        missingTables.push(table);
      }
    }

    console.log('\n--------------------------------------------------');
    if (missingTables.length > 0) {
      console.error(`❌ DATABASE FAILED INTEGRITY VERIFICATION: ${missingTables.length} required tables are missing.`);
      console.error('Please run/import the SQL schema database structure file.');
      process.exit(1);
    } else {
      console.log('✅ DATABASE HEALTH CHECKS COMPLETED SUCCESSFULLY.');
      process.exit(0);
    }

  } catch (error) {
    console.error('\n❌ DATABASE CONNECTION FAILURE!');
    console.error('Error details:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Troubleshooting hint: Is MySQL running? Start XAMPP Control Panel and run MySQL.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`\n💡 Troubleshooting hint: Database "${env.db.name}" does not exist. Please create it first.`);
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Troubleshooting hint: Check DB credentials in backend/.env.');
    }
    
    console.log('--------------------------------------------------');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkDatabase();
