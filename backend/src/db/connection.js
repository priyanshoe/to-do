const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false }
}).promise();

async function testConnection() {

  try {
    const connection = await pool.getConnection()
    console.log("✅ Database connected");
    connection.release();

  } catch (error) {
    console.error('❌ Error while creating database connection:', error.message);
  }
}

testConnection();
module.exports = pool;