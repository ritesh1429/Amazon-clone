const express = require('express');
const router = express.Router();
const { getPool } = require('../db/database');

// GET cart for a user
router.get('/:userId', async (req, res) => {
  try {
    const db = await getPool();
    const [rows] = await db.execute(
      `SELECT ci.id, ci.quantity, ci.user_id, ci.product_id,
              p.name, p.price, p.original_price, p.image_url, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [req.params.userId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST add item to cart
router.post('/', async (req, res) => {
  try {
    const db = await getPool();
    const { user_id, product_id, quantity = 1 } = req.body;

    // Check if product exists and has stock
    const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [product_id]);
    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (products[0].stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    // Insert or update
    await db.execute(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [user_id, product_id, quantity]
    );

    res.json({ success: true, message: 'Item added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT update cart item quantity
router.put('/:id', async (req, res) => {
  try {
    const db = await getPool();
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    await db.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, req.params.id]);
    res.json({ success: true, message: 'Cart updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    const db = await getPool();
    await db.execute('DELETE FROM cart_items WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE clear entire cart for user
router.delete('/user/:userId', async (req, res) => {
  try {
    const db = await getPool();
    await db.execute('DELETE FROM cart_items WHERE user_id = ?', [req.params.userId]);
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
