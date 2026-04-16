const express = require('express');
const router = express.Router();
const { getPool } = require('../db/database');

// GET all products (with optional category and search filters)
router.get('/', async (req, res) => {
  try {
    const db = await getPool();
    const { category, search, limit = 50 } = req.query;

    // Sanitise limit to a safe integer — interpolated directly to avoid
    // ER_WRONG_ARGUMENTS from mysql2 prepared statements with LIMIT ?
    const safeLimit = Math.max(1, Math.min(200, parseInt(limit, 10) || 50));

    let query = `
      SELECT p.*, c.name AS category_name, c.icon AS category_icon
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category && category !== 'all') {
      query += ' AND c.name = ?';
      params.push(category);
    }
    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` LIMIT ${safeLimit}`;

    const [rows] = await db.execute(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const db = await getPool();
    const [rows] = await db.execute(
      `SELECT p.*, c.name AS category_name, c.icon AS category_icon
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET all categories
router.get('/meta/categories', async (req, res) => {
  try {
    const db = await getPool();
    const [rows] = await db.execute('SELECT * FROM categories ORDER BY name');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
