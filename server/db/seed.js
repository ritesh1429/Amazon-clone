require('dotenv').config();
const { getPool, initDB } = require('./database');

const categories = [
  { name: 'Electronics', icon: '🔌' },
  { name: 'Books', icon: '📚' },
  { name: 'Clothing', icon: '👕' },
  { name: 'Home & Kitchen', icon: '🏠' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Toys', icon: '🧸' },
];

const products = [
  // Electronics
  { name: 'Apple iPhone 15 Pro Max 256GB Natural Titanium', description: 'The most advanced iPhone yet with A17 Pro chip, titanium design, and a 48MP main camera system.', price: 134900, original_price: 149900, image_url: 'https://picsum.photos/seed/iphone15/400/400', category: 'Electronics', rating: 4.8, review_count: 12489, stock: 50, badge: "Amazon's Choice" },
  { name: 'Samsung Galaxy S24 Ultra 5G 256GB Titanium Black', description: 'Built-in S Pen, powerful AI features, and a 200MP camera for the ultimate Galaxy experience.', price: 109999, original_price: 129999, image_url: 'https://picsum.photos/seed/samsung24/400/400', category: 'Electronics', rating: 4.7, review_count: 8923, stock: 30, badge: 'Best Seller' },
  { name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', description: 'Industry-leading noise canceling with 8 microphones, up to 30-hour battery life and crystal clear hands-free calling.', price: 24990, original_price: 34990, image_url: 'https://picsum.photos/seed/sonywh/400/400', category: 'Electronics', rating: 4.6, review_count: 23451, stock: 120, badge: 'Best Seller' },
  { name: 'Apple MacBook Air 15" M3 Chip 8GB RAM 256GB', description: 'Supercharged by M3 chip. Up to 18 hours battery life. Stunning 15.3-inch Liquid Retina display.', price: 134900, original_price: 149900, image_url: 'https://picsum.photos/seed/macbookm3/400/400', category: 'Electronics', rating: 4.9, review_count: 5672, stock: 25, badge: "Amazon's Choice" },
  { name: 'Amazon Echo Dot (5th Gen) Smart Speaker with Alexa', description: 'Our most popular smart speaker with improved sound and motion detection.', price: 4499, original_price: 5499, image_url: 'https://picsum.photos/seed/echodot5/400/400', category: 'Electronics', rating: 4.5, review_count: 45230, stock: 200, badge: 'Best Seller' },
  { name: 'LG 55" 4K OLED Smart TV with ThinQ AI', description: 'Self-lit OLED pixels, Dolby Vision IQ & Dolby Atmos, α9 Gen6 AI Processor 4K.', price: 89990, original_price: 119990, image_url: 'https://picsum.photos/seed/lgtvole/400/400', category: 'Electronics', rating: 4.7, review_count: 3781, stock: 15, badge: null },
  { name: 'Logitech MX Master 3S Wireless Mouse', description: 'Quiet clicks, 8K DPI, fast scrolling, ergonomic design for power users.', price: 9995, original_price: 12995, image_url: 'https://picsum.photos/seed/logimouse/400/400', category: 'Electronics', rating: 4.8, review_count: 18340, stock: 80, badge: "Amazon's Choice" },

  // Books
  { name: 'Atomic Habits by James Clear', description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. #1 New York Times Bestseller.', price: 399, original_price: 699, image_url: 'https://picsum.photos/seed/atomichabits/400/400', category: 'Books', rating: 4.9, review_count: 98432, stock: 500, badge: 'Best Seller' },
  { name: 'The Psychology of Money by Morgan Housel', description: 'Timeless lessons on wealth, greed, and happiness. A guide to navigating your financial life.', price: 329, original_price: 599, image_url: 'https://picsum.photos/seed/psychmoney/400/400', category: 'Books', rating: 4.8, review_count: 67123, stock: 400, badge: 'Best Seller' },
  { name: 'Deep Work by Cal Newport', description: 'Rules for Focused Success in a Distracted World. The ability to perform deep work is becoming increasingly rare.', price: 349, original_price: 599, image_url: 'https://picsum.photos/seed/deepwork/400/400', category: 'Books', rating: 4.7, review_count: 43210, stock: 350, badge: null },
  { name: 'Clean Code by Robert C. Martin', description: 'A Handbook of Agile Software Craftsmanship. Every programmer should read this book.', price: 649, original_price: 999, image_url: 'https://picsum.photos/seed/cleancode/400/400', category: 'Books', rating: 4.6, review_count: 29876, stock: 200, badge: "Amazon's Choice" },
  { name: 'The Alchemist by Paulo Coelho', description: 'A magical story about following your dreams and listening to your heart.', price: 199, original_price: 350, image_url: 'https://picsum.photos/seed/alchemist/400/400', category: 'Books', rating: 4.7, review_count: 120453, stock: 600, badge: 'Best Seller' },

  // Clothing
  { name: 'Levi\'s Men\'s 511 Slim Fit Jeans Dark Wash', description: 'Just right through the seat and thigh. A slim, not skinny, fit that works for any occasion.', price: 2999, original_price: 4299, image_url: 'https://picsum.photos/seed/levisjeans/400/400', category: 'Clothing', rating: 4.4, review_count: 34512, stock: 150, badge: 'Best Seller' },
  { name: 'Nike Men\'s Dri-FIT Running T-Shirt', description: 'Stay cool, dry and confident during your workout in this Nike t-shirt.', price: 1295, original_price: 1895, image_url: 'https://picsum.photos/seed/nikeshirt/400/400', category: 'Clothing', rating: 4.5, review_count: 18763, stock: 200, badge: null },
  { name: 'Adidas Women\'s Essentials Linear Hoodie', description: 'A cozy hoodie with the classic Adidas logo. Perfect for gym or casual wear.', price: 2499, original_price: 3499, image_url: 'https://picsum.photos/seed/adidashoodie/400/400', category: 'Clothing', rating: 4.6, review_count: 12345, stock: 100, badge: "Amazon's Choice" },
  { name: 'Peter England Men\'s Formal Shirt Sky Blue', description: 'Premium plain textured formal shirt with a regular fit for all-day comfort.', price: 899, original_price: 1599, image_url: 'https://picsum.photos/seed/peformal/400/400', category: 'Clothing', rating: 4.3, review_count: 8921, stock: 180, badge: null },

  // Home & Kitchen
  { name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker 6Qt', description: 'Replaces 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker & warmer.', price: 8999, original_price: 12999, image_url: 'https://picsum.photos/seed/instantpot/400/400', category: 'Home & Kitchen', rating: 4.7, review_count: 67890, stock: 90, badge: 'Best Seller' },
  { name: 'Dyson V15 Detect Cordless Vacuum Cleaner', description: 'Laser dust detection. Particle count and size display. 60 minutes run time.', price: 49900, original_price: 62900, image_url: 'https://picsum.photos/seed/dysonv15/400/400', category: 'Home & Kitchen', rating: 4.8, review_count: 9123, stock: 40, badge: "Amazon's Choice" },
  { name: 'Philips Air Fryer HD9200 4.1L Digital', description: 'Rapid Air Technology cooks crispy food with up to 90% less fat. Perfect for fries, chicken, fish.', price: 7995, original_price: 10995, image_url: 'https://picsum.photos/seed/philipsaf/400/400', category: 'Home & Kitchen', rating: 4.5, review_count: 23456, stock: 75, badge: 'Best Seller' },
  { name: 'Prestige Deluxe Alpha Stainless Steel Pressure Cooker 5L', description: 'Inner lid with metallic safety plug. No gasket needed. Life time warranty on body.', price: 1999, original_price: 2999, image_url: 'https://picsum.photos/seed/prestigepc/400/400', category: 'Home & Kitchen', rating: 4.4, review_count: 45678, stock: 120, badge: null },
  { name: 'Bombay Dyeing Microfiber Bedsheet Set King Size', description: 'Ultra-soft 300TC microfiber. Fade and shrink resistant. Includes 2 pillow covers.', price: 999, original_price: 1999, image_url: 'https://picsum.photos/seed/bedsheet/400/400', category: 'Home & Kitchen', rating: 4.2, review_count: 31245, stock: 200, badge: null },
  { name: 'Milton Thermosteel Flip Lid Flask 1000ml', description: 'Keeps hot for 24 hours and cold for 24 hours. Rust proof, food grade stainless steel.', price: 699, original_price: 1299, image_url: 'https://picsum.photos/seed/miltonflask/400/400', category: 'Home & Kitchen', rating: 4.5, review_count: 56789, stock: 300, badge: 'Best Seller' },

  // Sports
  { name: 'Yonex Nanoray 7000i Badminton Racket', description: 'Steep angled repulsion power frame design. Slim shaft design for aero performance.', price: 1299, original_price: 1999, image_url: 'https://picsum.photos/seed/yonexracket/400/400', category: 'Sports', rating: 4.5, review_count: 12890, stock: 80, badge: "Amazon's Choice" },
  { name: 'Nivia Pro Synthetic Football Size 5', description: 'FIFA approved, machine stitched hand-selected 100% polyurethane material.', price: 899, original_price: 1499, image_url: 'https://picsum.photos/seed/niviafootball/400/400', category: 'Sports', rating: 4.3, review_count: 8765, stock: 100, badge: null },
  { name: 'Boldfit Gym Gloves with Wrist Support', description: 'Anti-slip full palm protection, padded grip for safety during weight lifting.', price: 399, original_price: 799, image_url: 'https://picsum.photos/seed/gymgloves/400/400', category: 'Sports', rating: 4.4, review_count: 23456, stock: 150, badge: 'Best Seller' },
  { name: 'Fitbit Charge 6 Advanced Fitness Tracker', description: 'Heart rate monitoring, GPS tracking, 7-day battery, sleep score, stress management.', price: 14999, original_price: 19999, image_url: 'https://picsum.photos/seed/fitbitc6/400/400', category: 'Sports', rating: 4.6, review_count: 7654, stock: 60, badge: "Amazon's Choice" },
  { name: 'TRX All-in-One Suspension Training System', description: 'Lightweight, portable, and professional gym-quality workout with a single anchor point.', price: 8999, original_price: 12999, image_url: 'https://picsum.photos/seed/trxsystem/400/400', category: 'Sports', rating: 4.7, review_count: 5432, stock: 45, badge: null },

  // Toys
  { name: 'LEGO Technic Bugatti Chiron 42083', description: '3599 pieces. Authentic design with moving pistons, steering, and a W16 engine model inside.', price: 34999, original_price: 44999, image_url: 'https://picsum.photos/seed/legobugatti/400/400', category: 'Toys', rating: 4.9, review_count: 4321, stock: 30, badge: "Amazon's Choice" },
  { name: 'Hot Wheels 20 Car Gift Pack Assorted', description: '20 die-cast Hot Wheels cars in 1:64 scale. Different styles, colors and designs.', price: 799, original_price: 1299, image_url: 'https://picsum.photos/seed/hotwheels/400/400', category: 'Toys', rating: 4.7, review_count: 23456, stock: 200, badge: 'Best Seller' },
  { name: 'Funskool Monopoly Classic Board Game', description: 'The world\'s most popular family board game. Includes gameboard, money, title deed cards.', price: 699, original_price: 1099, image_url: 'https://picsum.photos/seed/monopoly/400/400', category: 'Toys', rating: 4.5, review_count: 18765, stock: 180, badge: null },
  { name: 'Barbie Dreamhouse Adventures Doll & Accessories', description: 'Inspired by the Netflix animated series! Barbie doll comes with 10+ accessories.', price: 2499, original_price: 3499, image_url: 'https://picsum.photos/seed/barbiedream/400/400', category: 'Toys', rating: 4.6, review_count: 9876, stock: 90, badge: 'Best Seller' },
  { name: 'Play-Doh Kitchen Creations Ultimate Ice Cream Truck', description: '27 tools and accessories, 11 cans of Play-Doh including 3 brand new colors.', price: 1499, original_price: 2499, image_url: 'https://picsum.photos/seed/playdoh/400/400', category: 'Toys', rating: 4.4, review_count: 7654, stock: 120, badge: null },
  { name: 'UNO Playing Card Game', description: 'The classic family card game of matching colors and numbers.', price: 149, original_price: 199, image_url: 'https://picsum.photos/seed/unocards/400/400', category: 'Toys', rating: 4.8, review_count: 110200, stock: 600, badge: 'Best Seller' },
  { name: 'Hasbro Jenga Classic Game', description: 'The original wood block stacking game. Pull out a block without crashing the stack!', price: 899, original_price: 1299, image_url: 'https://picsum.photos/seed/jenga/400/400', category: 'Toys', rating: 4.7, review_count: 45600, stock: 120, badge: null },

  // Extra Electronics
  { name: 'Apple iPad Pro 11-inch (M2)', description: 'Brilliant Liquid Retina display. M2 chip. Supports Apple Pencil (2nd gen).', price: 81900, original_price: 89900, image_url: 'https://picsum.photos/seed/ipadpro/400/400', category: 'Electronics', rating: 4.8, review_count: 5120, stock: 45, badge: null },
  { name: 'Sony PlayStation 5 Console', description: 'Experience lightning-fast loading with an ultra-high speed SSD and 3D Audio technology.', price: 54990, original_price: 54990, image_url: 'https://picsum.photos/seed/ps5/400/400', category: 'Electronics', rating: 4.9, review_count: 14200, stock: 10, badge: 'Best Seller' },

  // Extra Books
  { name: 'Sapiens: A Brief History of Humankind', description: 'From a renowned historian comes a groundbreaking narrative of humanity’s creation and evolution.', price: 450, original_price: 699, image_url: 'https://picsum.photos/seed/sapiens/400/400', category: 'Books', rating: 4.7, review_count: 85200, stock: 150, badge: "Amazon's Choice" },
  { name: 'Think and Grow Rich', description: 'The landmark bestseller that teaches you the principles of success.', price: 150, original_price: 299, image_url: 'https://picsum.photos/seed/thinkrich/400/400', category: 'Books', rating: 4.6, review_count: 102500, stock: 300, badge: null },

  // Extra Clothing
  { name: 'PUMA Men\'s Smash v2 L Sneakers', description: 'Classic tennis-inspired silhouette. Durable leather upper and grippy rubber outsole.', price: 1999, original_price: 3499, image_url: 'https://picsum.photos/seed/pumashoes/400/400', category: 'Clothing', rating: 4.4, review_count: 18230, stock: 75, badge: null },
  { name: 'Allen Solly Men\'s Regular Fit Polo', description: 'Solid cotton polo shirt with contrast tipping on collar and cuffs.', price: 699, original_price: 1099, image_url: 'https://picsum.photos/seed/allenpolo/400/400', category: 'Clothing', rating: 4.2, review_count: 3100, stock: 220, badge: 'Best Seller' },

  // Extra Home
  { name: 'Pigeon by Stovekraft Amaze Plus Electric Kettle', description: '1.5 Litre, 1500 Watt electric kettle with stainless steel body.', price: 599, original_price: 1195, image_url: 'https://picsum.photos/seed/pigeonkettle/400/400', category: 'Home & Kitchen', rating: 4.3, review_count: 124500, stock: 500, badge: 'Best Seller' },
  { name: 'Wakefit Orthopedic Memory Foam Mattress', description: '72x60x6 inches King Size mattress with breathable fabric.', price: 11499, original_price: 18499, image_url: 'https://picsum.photos/seed/wakefitmattress/400/400', category: 'Home & Kitchen', rating: 4.6, review_count: 53100, stock: 20, badge: "Amazon's Choice" },

  // Extra Sports
  { name: 'Decathlon Quechua 10L Backpack', description: 'Lightweight hiking backpack for adults and kids. Extremely durable.', price: 399, original_price: 499, image_url: 'https://picsum.photos/seed/quechua/400/400', category: 'Sports', rating: 4.5, review_count: 42100, stock: 400, badge: 'Best Seller' },
  { name: 'Kobo Exercise Yoga Mat 6mm', description: 'Anti-slip yoga mat with carrying strap. Perfect for home workouts.', price: 499, original_price: 999, image_url: 'https://picsum.photos/seed/yogamat/400/400', category: 'Sports', rating: 4.3, review_count: 8900, stock: 150, badge: null },
];

async function seed() {
  await initDB();
  const db = await getPool();

  const isForce = process.argv.includes('--force');

  if (isForce) {
    console.log('⚠️ --force flag active: Wiping existing data...');
    // Delete in correct foreign-key order
    await db.execute('SET FOREIGN_KEY_CHECKS = 0');
    await db.execute('TRUNCATE TABLE order_items');
    await db.execute('TRUNCATE TABLE orders');
    await db.execute('TRUNCATE TABLE cart_items');
    await db.execute('TRUNCATE TABLE products');
    await db.execute('TRUNCATE TABLE categories');
    await db.execute('TRUNCATE TABLE users');
    await db.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Wiped successfully.');
  }

  // Check if already seeded
  const [existing] = await db.execute('SELECT COUNT(*) as count FROM categories');
  if (existing[0].count > 0) {
    console.log('✅ Database already seeded. Use "node db/seed.js --force" to wipe and re-seed.');
    process.exit(0);
  }

  // Seed categories
  const categoryIds = {};
  for (const cat of categories) {
    const [result] = await db.execute(
      'INSERT INTO categories (name, icon) VALUES (?, ?)',
      [cat.name, cat.icon]
    );
    categoryIds[cat.name] = result.insertId;
  }
  console.log(`✅ Seeded ${categories.length} categories`);

  // Seed default user
  await db.execute(
    'INSERT INTO users (name, email, address) VALUES (?, ?, ?)',
    ['John Doe', 'john.doe@example.com', '123 Main Street, Bangalore, Karnataka - 560001']
  );
  console.log('✅ Seeded default user');

  // Seed products
  for (const p of products) {
    await db.execute(
      `INSERT INTO products 
        (name, description, price, original_price, image_url, category_id, rating, review_count, stock, badge) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [p.name, p.description, p.price, p.original_price, p.image_url,
       categoryIds[p.category], p.rating, p.review_count, p.stock, p.badge || null]
    );
  }
  console.log(`✅ Seeded ${products.length} products`);

  console.log('\n🚀 Database seeded successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
