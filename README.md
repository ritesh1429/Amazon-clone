# Amazon Clone — Full Stack Application

A full-featured Amazon-like e-commerce web application built with React, Node.js, Express, and MySQL.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + React Router + Context API |
| Styling | Vanilla CSS (Amazon design system) |
| Backend | Node.js + Express.js |
| Database | MySQL (via `mysql2`) |
| Dev Tools | Vite, Nodemon, Concurrently |

## ✨ Features

- 🏠 **Home Page** — Animated hero banner, category tabs, product grid
- 📦 **Product Detail** — Image, ratings, buy box, product tabs
- 🛒 **Shopping Cart** — Add/remove, quantity controls, free delivery threshold
- 💳 **Checkout** — Address, payment selection, order summary
- ✅ **Order Success** — Confirmation with delivery timeline
- 📱 **Fully Responsive** — Mobile, tablet, desktop

## 📋 Prerequisites

- Node.js ≥ 18
- MySQL (running locally)

## 🔧 Setup Instructions

### 1. Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd amazon-clone

# Install all dependencies (root + client + server)
npm run install:all
```

### 2. Configure MySQL

Edit `server/.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=amazon_clone
PORT=5000
```

> The database `amazon_clone` will be **automatically created** on first run.

### 3. Seed the Database

```bash
npm run seed
```

This populates the database with **30+ products** across **6 categories**:
- Electronics, Books, Clothing, Home & Kitchen, Sports, Toys

### 4. Run the Application

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 5173) simultaneously.

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/health

## 📁 Project Structure

```
amazon-clone/
├── client/                  # React Frontend (Vite)
│   └── src/
│       ├── components/      # Navbar, ProductCard, Footer
│       ├── context/         # CartContext
│       ├── pages/           # Home, ProductDetail, Cart, Checkout, OrderSuccess
│       └── services/        # API calls (axios)
├── server/                  # Node.js Backend
│   ├── db/
│   │   ├── database.js      # MySQL pool + schema init
│   │   └── seed.js          # Data seeder
│   ├── routes/
│   │   ├── products.js      # GET /api/products
│   │   ├── cart.js          # CRUD /api/cart
│   │   └── orders.js        # POST/GET /api/orders
│   └── index.js             # Express server
└── README.md
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (filter by category/search) |
| GET | `/api/products/:id` | Single product |
| GET | `/api/products/meta/categories` | All categories |
| GET | `/api/cart/:userId` | Get user cart |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:id` | Update quantity |
| DELETE | `/api/cart/:id` | Remove from cart |
| POST | `/api/orders` | Place order |
| GET | `/api/orders/user/:userId` | Order history |
| GET | `/api/orders/:id` | Single order |

## 👤 Default User

The app uses a pre-seeded default user (ID: 1):
- **Name:** John Doe
- **Email:** john.doe@example.com
- **Address:** 123 Main Street, Bangalore, Karnataka - 560001

## 📸 Screenshots

Homepage with product grid, product detail with buy box, cart with order summary, checkout flow, order confirmation page.

## 📄 License

MIT
"# Amazon-clone" 
