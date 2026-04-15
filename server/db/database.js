const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;

async function getPool() {
  if (pool) return pool;

  // Create DB if it doesn't exist
  const tempConn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });
  await tempConn.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'amazon_clone'}\``);
  await tempConn.end();

  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'amazon_clone',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}

async function initDB() {
  const db = await getPool();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      icon VARCHAR(100)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      original_price DECIMAL(10,2),
      image_url VARCHAR(500),
      category_id INT,
      rating DECIMAL(2,1) DEFAULT 4.0,
      review_count INT DEFAULT 0,
      stock INT DEFAULT 100,
      badge VARCHAR(50),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      address TEXT
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT,
      product_id INT,
      quantity INT DEFAULT 1,
      UNIQUE KEY unique_cart (user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT,
      total DECIMAL(10,2) NOT NULL,
      status VARCHAR(50) DEFAULT 'Placed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      address TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT PRIMARY KEY AUTO_INCREMENT,
      order_id INT,
      product_id INT,
      quantity INT,
      price DECIMAL(10,2),
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  console.log('✅ Database tables initialized');
  return db;
}

module.exports = { getPool, initDB };
