# FoodHub — Food Ordering Management System (MERN Stack)

A modern, full-featured **MERN stack (MongoDB, Express.js, React.js, Node.js)** web application for seamless online food ordering and centralized restaurant administration.

---

## 🌟 Key Features

### 👤 Customer Experience
1. **User Authentication & Profiles:**
   - Registration with full validation and password hashing (bcrypt).
   - JWT-based authentication with automatic session persistence.
   - Quick 1-click **Demo Customer Login** for testing.
2. **Interactive Home Page:**
   - Hero banner with headline, order guarantees, and live search bar.
   - Category navigation pills.
   - Chef's Special (Featured) dishes and Trending / Popular section.
3. **Food Menu:**
   - Live real-time search by dish name, ingredients, or flavors.
   - Category filtering (Pizzas, Burgers & Wraps, Asian Bowls, Pastas, Desserts, Beverages).
   - Dietary badges (Pure Veg, Non-Veg, Vegan).
   - "In Stock Only" availability toggle.
   - Price & rating sorting (Low to High, High to Low, Top Rated).
4. **Food Item Details Modal:**
   - High-resolution food photography.
   - Calories, preparation time, and ingredients tag cloud.
   - Quantity selector with direct add to cart.
5. **Shopping Cart & Checkout:**
   - Slide-over cart drawer with live subtotal calculation.
   - Dynamic **Free Delivery Progress Meter** (Free delivery on orders over ₹300).
   - Address input form and payment method selection (Cash on Delivery, UPI QR Demo, Card Demo).
6. **Live Order Tracking (5-Stage Visual Stepper):**
   - **Placed ➔ Confirmed ➔ Preparing ➔ Out for Delivery ➔ Delivered** (or **Cancelled**).
   - Animated pulse on the active step with status history timestamps.

### 👑 Admin Management Center
1. **Overview & Analytics:**
   - Key Metrics: Total Revenue (₹), Total Orders, Active Kitchen Orders, Registered Customers.
   - Order status distribution cards.
   - Recent incoming orders feed.
2. **Food Menu Management:**
   - Add new food items with images, pricing, categories, and dietary tags.
   - Edit existing dish details.
   - One-click instant **Food Availability Toggle** (`Available` / `Sold Out`).
   - Delete dishes with confirmation dialog.
3. **Category Management:**
   - Add, inspect, and remove food categories.
4. **Orders Management:**
   - Filter orders by status (All, Placed, Confirmed, Preparing, Out for Delivery, Delivered, Cancelled).
   - Update order status dropdown with live synchronization to customer tracking.
5. **Customer Accounts Directory:**
   - View all registered users, phone numbers, delivery addresses, and order counts.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Modern Vanilla CSS Design System, Lucide React Icons
- **Backend:** Node.js, Express.js, Mongoose ODM
- **Database:** MongoDB (Local service or MongoDB Atlas)
- **Security:** JSON Web Tokens (JWT), bcryptjs password hashing, CORS
- **Architecture:** RESTful API with modular route controllers and middleware

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+ or v24+)
- **MongoDB** running locally on `mongodb://127.0.0.1:27017` or configured via `.env`

### 2. Backend Setup
```bash
cd server
npm install
npm run seed     # Seeds categories, foods, admin, customer, and sample orders
node server.js   # Starts API on http://localhost:5001
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev      # Starts Vite on http://localhost:5173
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@foodhub.com` | `admin123` |
| **Customer** | `customer@foodhub.com` | `customer123` |

> *Quick Demo Switcher:* You can also click the **"👤 Customer"** or **"👑 Admin"** buttons directly in the top navigation bar for instant one-click login!

---

## 📡 REST API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Get current authenticated user profile
- `PUT /api/auth/profile` — Update address or phone number

### Food Items (`/api/food`)
- `GET /api/food` — Get food items (with filters: `search`, `category`, `dietary`, `isAvailable`, `sort`)
- `GET /api/food/:id` — Get single food item
- `POST /api/food` — Admin: Create new food item
- `PUT /api/food/:id` — Admin: Update food details
- `PATCH /api/food/:id/availability` — Admin: Toggle in-stock status
- `DELETE /api/food/:id` — Admin: Delete food item

### Categories (`/api/categories`)
- `GET /api/categories` — Get active categories
- `GET /api/categories/all` — Admin: Get all categories
- `POST /api/categories` — Admin: Create category
- `PUT /api/categories/:id` — Admin: Update category
- `DELETE /api/categories/:id` — Admin: Delete category

### Orders (`/api/orders`)
- `POST /api/orders` — Customer: Place new order
- `GET /api/orders/my-orders` — Customer: List user orders
- `GET /api/orders/:id` — Get order details and tracking timeline
- `GET /api/orders/all` — Admin: List all orders with filters
- `GET /api/orders/stats` — Admin: Get sales and order statistics
- `PATCH /api/orders/:id/status` — Admin: Update order status (`Placed` ➔ `Confirmed` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered` / `Cancelled`)

### Users (`/api/users`)
- `GET /api/users` — Admin: List registered customers and order counts
- `DELETE /api/users/:id` — Admin: Remove customer account
