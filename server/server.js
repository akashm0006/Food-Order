require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

const User = require('./models/User');
const Category = require('./models/Category');
const FoodItem = require('./models/FoodItem');
const { categoriesData, foodItemsData } = require('./seedData');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Root & Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    message: 'Food Ordering API is running smoothly',
  });
});

// Auto-seed function if DB is empty
const autoSeedIfEmpty = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@foodhub.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
      const hash = await bcrypt.hash(adminPass, 10);
      await User.create({
        name: 'Restaurant Administrator',
        email: adminEmail,
        password: hash,
        role: 'admin',
        phone: '+91 98765 43210',
        address: 'HQ & Central Kitchen',
      });
      console.log(`[AutoSeed] Default admin created: ${adminEmail} / ${adminPass}`);
    }

    let customer = await User.findOne({ email: 'customer@foodhub.com' });
    if (!customer) {
      const hash = await bcrypt.hash('customer123', 10);
      await User.create({
        name: 'Aarav Sharma',
        email: 'customer@foodhub.com',
        password: hash,
        role: 'customer',
        phone: '+91 98123 45678',
        address: 'Flat 304, Green Heights, Rose Avenue',
      });
      console.log(`[AutoSeed] Default demo customer created: customer@foodhub.com / customer123`);
    }

    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      await Category.insertMany(categoriesData);
      console.log(`[AutoSeed] Seeded ${categoriesData.length} categories.`);
    }

    const foodCount = await FoodItem.countDocuments();
    if (foodCount === 0) {
      await FoodItem.insertMany(foodItemsData);
      console.log(`[AutoSeed] Seeded ${foodItemsData.length} food items.`);
    }
  } catch (err) {
    console.error('[AutoSeed] Error during initial seeding check:', err.message);
  }
};

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Database connection and server bootstrap
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food_ordering_db';

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log(`Connected to MongoDB database: ${MONGODB_URI}`);
    await autoSeedIfEmpty();
    app.listen(PORT, () => {
      console.log(`🚀 Food Ordering Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
