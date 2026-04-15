require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./db/database');

const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Validate required env vars before starting ──────────────────────────────
const REQUIRED_ENV = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length) {
  console.error('❌ Missing required environment variables:', missing.join(', '));
  console.error('   Set them in Render → Environment or in server/.env locally.');
  process.exit(1);
}

// Allowed origins — local dev + deployed frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://amazon-clone-six-amber.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Amazon Clone API is running 🚀' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server after DB init
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📦 API: http://localhost:${PORT}/api/health`);
    });
  })
  .catch(err => {
    console.error('❌ DB init failed:', err.message);
    console.error('   Check DB credentials and that Aiven allows connections from Render IPs.');
    process.exit(1);
  });

