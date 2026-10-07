const express = require('express');
const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const VALID_STATUSES = ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

// @route   POST /api/orders
// @desc    Place a new order
// @access  Private (Customer)
router.post('/', protect, async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required to place an order' });
    }

    if (!deliveryAddress || !deliveryAddress.fullName || !deliveryAddress.phone || !deliveryAddress.street) {
      return res.status(400).json({ success: false, message: 'Full delivery address and phone number are required' });
    }

    // Calculate totals and verify items
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const food = await FoodItem.findById(item.foodId || item._id);
      if (!food) {
        return res.status(404).json({ success: false, message: `Item "${item.name}" is no longer available` });
      }
      if (!food.isAvailable) {
        return res.status(400).json({ success: false, message: `Item "${food.name}" is currently sold out` });
      }

      const itemQty = Number(item.quantity) || 1;
      const itemPrice = Number(food.price);
      subtotal += itemPrice * itemQty;

      orderItems.push({
        foodItem: food._id,
        name: food.name,
        price: itemPrice,
        quantity: itemQty,
        image: food.image,
      });
    }

    // Delivery fee rule: Free over $30 / ₹300, else $3.99 / ₹40
    const deliveryFee = subtotal > 300 ? 0 : 40;
    const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST/Tax
    const totalAmount = Math.round((subtotal + deliveryFee + tax) * 100) / 100;

    const initialHistory = [
      {
        status: 'Placed',
        timestamp: new Date(),
        note: 'Order placed by customer',
      },
    ];

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      subtotal,
      deliveryFee,
      tax,
      totalAmount,
      deliveryAddress: {
        fullName: deliveryAddress.fullName,
        phone: deliveryAddress.phone,
        street: deliveryAddress.street,
        city: deliveryAddress.city || 'Downtown',
        pincode: deliveryAddress.pincode || '110001',
        notes: notes || deliveryAddress.notes || '',
      },
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentMethod === 'Online / Card' || paymentMethod === 'UPI' ? 'Paid' : 'Pending',
      status: 'Placed',
      statusHistory: initialHistory,
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get logged in user orders
// @access  Private (Customer)
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/stats
// @desc    Get dashboard statistics for Admin
// @access  Private / Admin
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const pendingOrders = await Order.countDocuments({
      status: { $in: ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery'] },
    });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

    // Aggregate total revenue for non-cancelled orders
    const revenueData = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Status breakdown
    const statusCounts = {};
    for (const status of VALID_STATUSES) {
      statusCounts[status] = await Order.countDocuments({ status });
    }

    // Recent 5 orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    res.json({
      success: true,
      stats: {
        totalOrders,
        deliveredOrders,
        pendingOrders,
        cancelledOrders,
        totalRevenue,
        statusCounts,
      },
      recentOrders,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/all
// @desc    Get all orders for Admin
// @access  Private / Admin
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order details & tracking
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Allow owner or admin
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/orders/:id/status
// @desc    Update order status
// @access  Private / Admin
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, note } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status} by admin`,
    });

    if (status === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
