const express = require('express');
const router = express.Router();
const { getPool } = require('../db/database');

// POST place an order (move cart to order)
router.post('/', async (req, res) => {
  const db = await getPool();
  const conn = await db.getConnection();
  try {
    const { user_id, address } = req.body;

    await conn.beginTransaction();

    // Get cart items with price
    const [cartItems] = await conn.execute(
      `SELECT ci.product_id, ci.quantity, p.price, p.stock, p.name
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [user_id]
    );

    if (cartItems.length === 0) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Check stock
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        await conn.rollback();
        return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name}` });
      }
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const [orderResult] = await conn.execute(
      'INSERT INTO orders (user_id, total, address, status) VALUES (?, ?, ?, ?)',
      [user_id, total, address, 'Placed']
    );
    const orderId = orderResult.insertId;

    // Insert order items & update stock
    for (const item of cartItems) {
      await conn.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
      await conn.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await conn.execute('DELETE FROM cart_items WHERE user_id = ?', [user_id]);

    await conn.commit();

    res.json({
      success: true,
      message: 'Order placed successfully',
      data: { orderId, total, status: 'Placed', itemCount: cartItems.length }
    });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  } finally {
    conn.release();
  }
});

// GET order history for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const db = await getPool();
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.params.userId]
    );

    // Get items for each order
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const [items] = await db.execute(
          `SELECT oi.*, p.name, p.image_url
           FROM order_items oi
           JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = ?`,
          [order.id]
        );
        return { ...order, items };
      })
    );

    res.json({ success: true, data: enrichedOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET single order by ID
router.get('/:id', async (req, res) => {
  try {
    const db = await getPool();
    const [orders] = await db.execute('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    const [items] = await db.execute(
      `SELECT oi.*, p.name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );
    res.json({ success: true, data: { ...orders[0], items } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
