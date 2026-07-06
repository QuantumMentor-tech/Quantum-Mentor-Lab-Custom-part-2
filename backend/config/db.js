'use strict';

/**
 * Quantum Mentor World — MySQL Database Connection Pool
 * config/db.js
 *
 * Configures connection pool using mysql2/promise and env settings.
 * All database queries must use parameterized placeholders (?) — NEVER string concatenation.
 */

const mysql = require('mysql2/promise');
const env = require('./env');
const logger = require('../utils/logger');

/* ─── Connection Pool ────────────────────────────────────────── */
const pool = mysql.createPool({
  host:               env.db.host,
  port:               env.db.port,
  database:           env.db.name,
  user:               env.db.user,
  password:           env.db.password,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  enableKeepAlive:    true,
  keepAliveInitialDelay: 0,
  charset:            'utf8mb4',
});

/* ─── Test Database Connection ───────────────────────────────── */
/**
 * Attempts to connect to MySQL and run a test query.
 * Non-fatal — logs a warning if DB not ready but does NOT crash the server.
 * Returns health summary object.
 */
async function testDatabaseConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [testRows] = await connection.execute('SELECT 1 AS test');
    const [tableRows] = await connection.execute('SHOW TABLES');

    const tableCount = tableRows.length;

    if (testRows[0].test === 1) {
      logger.info('MySQL connected successfully.', {
        host: `${env.db.host}:${env.db.port}`,
        database: env.db.name,
        tableCount
      });
      return { connected: true, database: env.db.name, tableCount };
    }
  } catch (error) {
    if (error.code === 'ER_BAD_DB_ERROR') {
      logger.warn(`Database "${env.db.name}" not found. Create it in phpMyAdmin and import SQL schema.`);
    } else if (error.code === 'ECONNREFUSED') {
      logger.warn('MySQL server is not running. Start MySQL in the XAMPP Control Panel.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      logger.warn('MySQL access denied. Verify user and password credentials in backend/.env.');
    } else {
      logger.warn(`MySQL connection warning: ${error.message}`);
    }
    return { connected: false, database: env.db.name, tableCount: 0, error: error.message };
  } finally {
    if (connection) connection.release();
  }
}

/* ─── Safe Query Helper ──────────────────────────────────────── */
/**
 * Executes a parameterized SQL query safely.
 * Always use ? placeholders — never build SQL with string concatenation.
 *
 * @param {string} sql    — SQL with ? placeholders
 * @param {Array}  params — Values for placeholders
 * @returns {Array}       — Query result rows
 */
async function query(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    logger.error('DB Query Error', { sql, message: error.message });
    throw error;
  }
}

/* ─── Safe Transaction Helper ────────────────────────────────── */
/**
 * Runs multiple queries in a transaction.
 * Automatically rolls back on error.
 *
 * @param {Function} callback — Receives a connection, must return a value
 */
async function withTransaction(callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  query,
  withTransaction,
  testDatabaseConnection
};
