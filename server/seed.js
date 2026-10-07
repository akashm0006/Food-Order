require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const FoodItem = require('./models/FoodItem');
const Order = require('./models/Order');
const { categoriesData, foodItemsData } = require('./seedData');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food_ordering_db';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully!');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await FoodItem.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing collections.');

    // Seed Categories
    const categories = await Category.insertMany(categoriesData);
    console.log(`Seeded ${categories.length} categories.`);

    // Seed Food Items
    const foods = await FoodItem.insertMany(foodItemsData);
    console.log(`Seeded ${foods.length} food items.`);

    // Seed Default Admin User
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Restaurant Administrator',
      email: 'admin@foodhub.com',
      password: adminPasswordHash,
      role: 'admin',
      phone: '+91 98765 43210',
      address: 'Central Kitchen & HQ, Suite 402, Gourmet Street',
    });
    console.log('Seeded Admin account: admin@foodhub.com / admin123');

    // Seed Demo Customer User
    const customerPasswordHash = await bcrypt.hash('customer123', 10);
    const customerUser = await User.create({
      name: 'Aarav Sharma',
      email: 'customer@foodhub.com',
      password: customerPasswordHash,
      role: 'customer',
      phone: '+91 98123 45678',
      address: 'Flat 304, Green Heights, Rose Avenue, City',
    });
    console.log('Seeded Customer account: customer@foodhub.com / customer123');

    // Seed a couple of initial sample orders to showcase the status tracking & stats
    const sampleOrder1 = await Order.create({
      user: customerUser._id,
      items: [
        {
          foodItem: foods[0]._id,
          name: foods[0].name,
          price: foods[0].price,
          quantity: 2,
          image: foods[0].image,
        },
        {
          foodItem: foods[3]._id,
          name: foods[3].name,
          price: foods[3].price,
          quantity: 1,
          image: foods[3].image,
        },
      ],
      subtotal: foods[0].price * 2 + foods[3].price,
      deliveryFee: 0,
      tax: 49.85,
      totalAmount: 1046.85,
      deliveryAddress: {
        fullName: 'Aarav Sharma',
        phone: '+91 98123 45678',
        street: 'Flat 304, Green Heights, Rose Avenue',
        city: 'Metro City',
        pincode: '110001',
        notes: 'Please ring the bell twice and leave at doorstep.',
      },
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      status: 'Preparing',
      statusHistory: [
        {
          status: 'Placed',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          note: 'Order confirmed and payment verified',
        },
        {
          status: 'Confirmed',
          timestamp: new Date(Date.now() - 22 * 60 * 1000),
          note: 'Kitchen accepted the order',
        },
        {
          status: 'Preparing',
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          note: 'Chef is baking your artisan pizza in stone oven',
        },
      ],
    });

    const sampleOrder2 = await Order.create({
      user: customerUser._id,
      items: [
        {
          foodItem: foods[6]._id,
          name: foods[6].name,
          price: foods[6].price,
          quantity: 1,
          image: foods[6].image,
        },
        {
          foodItem: foods[10]._id,
          name: foods[10].name,
          price: foods[10].price,
          quantity: 1,
          image: foods[10].image,
        },
      ],
      subtotal: foods[6].price + foods[10].price,
      deliveryFee: 0,
      tax: 28.4,
      totalAmount: 596.4,
      deliveryAddress: {
        fullName: 'Aarav Sharma',
        phone: '+91 98123 45678',
        street: 'Flat 304, Green Heights, Rose Avenue',
        city: 'Metro City',
        pincode: '110001',
        notes: '',
      },
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Paid',
      status: 'Delivered',
      statusHistory: [
        { status: 'Placed', timestamp: new Date(Date.now() - 180 * 60 * 1000), note: 'Placed' },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 170 * 60 * 1000), note: 'Confirmed' },
        { status: 'Preparing', timestamp: new Date(Date.now() - 150 * 60 * 1000), note: 'Preparing' },
        { status: 'Out for Delivery', timestamp: new Date(Date.now() - 120 * 60 * 1000), note: 'Rider on the way' },
        { status: 'Delivered', timestamp: new Date(Date.now() - 95 * 60 * 1000), note: 'Delivered to customer' },
      ],
    });

    console.log('Seeded 2 sample orders for demo tracking.');
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
