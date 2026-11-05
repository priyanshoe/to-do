const mysql = require('mysql2');
const bcrypt = require('bcrypt');
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

  const dataseeder = async () => {
    try {
        // 1. Create table if it doesn't exist
          // users tabele
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
          // tasks table
          await pool.query( `
              CREATE TABLE IF NOT EXISTS tasks (
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  userId INT NOT NULL,
                  title VARCHAR(255) NOT NULL,
                  description TEXT,
                  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  
                  CONSTRAINT fk_tasks_user
                  FOREIGN KEY (userId)
                  REFERENCES users(id)
                  ON DELETE CASCADE
                  ON UPDATE CASCADE
              )
          `);

        // 2. Check whether table is empty
        const [users] = await pool.query(
            "SELECT COUNT(*) AS count FROM users"
        ); 
        const [tasks] = await pool.query(
            "SELECT COUNT(*) AS count FROM tasks"
        );

        // 3. Insert seed data if empty
          // users tabele
        if (users[0].count === 0) {
            const user1hash = await bcrypt.hash('user1pass', 5);
            const user2hash = await bcrypt.hash('user2pass', 5);
            await pool.query(`
                INSERT INTO users (id,name, email, password)
                VALUES
                (1, 'User 1 generated', 'user1@gmail.com', '${user1hash}'),
                (2, 'User 2 generated', 'user2@gmail.com', '${user2hash}')
            `);

            console.log("Users Seed data inserted successfully");
        } else {
            console.log("Users table already has data");
        }
        if (tasks[0].count === 0) {
            await pool.query(`
                INSERT INTO tasks (userId, title, description)
                VALUES
                (2, "Learn Node.js", "Learn Express.js and Node.js basics"),
                (2, "Learn MySQL", "Practice SQL queries and database operations"),
                (2, "Build Todo App", "Create a full-stack todo application")
            `);

            console.log("Tasks Seed data inserted successfully");
        } else {
            console.log("Tasks table already has data");
        }

    } catch (error) {
        console.error("Database seeding failed:", error);
    }
};



testConnection();
dataseeder();

module.exports = pool;