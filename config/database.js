const mysql = require('mysql2/promise');

// Database configuration - reads from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mehaal_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✓ MySQL database connected successfully');
    connection.release();
  } catch (error) {
    console.error('✗ MySQL connection failed:', error.message);
    console.error('  Check DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in environment variables');
  }
}

// Execute query helper
async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
}

module.exports = {
  pool,
  query,
  testConnection
};
