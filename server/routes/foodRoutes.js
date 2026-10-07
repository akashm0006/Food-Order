const express = require('express');
const FoodItem = require('../models/FoodItem');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/food
// @desc    Get food items with filters, search, sorting
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category, featured, popular, dietary, isAvailable, sort } = req.query;
    let query = {};

    // Filter by availability (if specified or default all for admin, public usually sees available)
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    // Filter by Category
    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Filter by Featured
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Filter by Popular
    if (popular === 'true') {
      query.isPopular = true;
    }

    // Filter by Dietary
    if (dietary && dietary !== 'all') {
      query.dietary = dietary;
    }

    // Search by name or description
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating-desc') sortOption = { rating: -1 };
    else if (sort === 'name-asc') sortOption = { name: 1 };

    const foodItems = await FoodItem.find(query).sort(sortOption);
    res.json({
      success: true,
      count: foodItems.length,
      foods: foodItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/food/:id
// @desc    Get single food item details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    res.json({ success: true, food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/food
// @desc    Add a new food item
// @access  Private / Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      isAvailable,
      isFeatured,
      isPopular,
      rating,
      preparationTime,
      dietary,
      calories,
      ingredients,
    } = req.body;

    if (!name || !description || price === undefined || !category || !image) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, price, category, and image are required',
      });
    }

    const food = await FoodItem.create({
      name,
      description,
      price: Number(price),
      category,
      image,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isFeatured: Boolean(isFeatured),
      isPopular: Boolean(isPopular),
      rating: rating ? Number(rating) : 4.5,
      preparationTime: preparationTime || '20-25 mins',
      dietary: dietary || 'veg',
      calories: calories || '350 kcal',
      ingredients: Array.isArray(ingredients) ? ingredients : (ingredients ? ingredients.split(',').map(s => s.trim()) : []),
    });

    res.status(201).json({ success: true, food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/food/:id
// @desc    Edit food details
// @access  Private / Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    const {
      name,
      description,
      price,
      category,
      image,
      isAvailable,
      isFeatured,
      isPopular,
      rating,
      preparationTime,
      dietary,
      calories,
      ingredients,
    } = req.body;

    if (name) food.name = name;
    if (description) food.description = description;
    if (price !== undefined) food.price = Number(price);
    if (category) food.category = category;
    if (image) food.image = image;
    if (isAvailable !== undefined) food.isAvailable = isAvailable;
    if (isFeatured !== undefined) food.isFeatured = isFeatured;
    if (isPopular !== undefined) food.isPopular = isPopular;
    if (rating !== undefined) food.rating = Number(rating);
    if (preparationTime) food.preparationTime = preparationTime;
    if (dietary) food.dietary = dietary;
    if (calories) food.calories = calories;
    if (ingredients !== undefined) {
      food.ingredients = Array.isArray(ingredients) ? ingredients : ingredients.split(',').map(s => s.trim());
    }

    const updatedFood = await food.save();
    res.json({ success: true, food: updatedFood });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/food/:id/availability
// @desc    Quick toggle food availability
// @access  Private / Admin
router.patch('/:id/availability', protect, adminOnly, async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    food.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : !food.isAvailable;
    await food.save();

    res.json({
      success: true,
      message: `Food item is now ${food.isAvailable ? 'Available' : 'Unavailable'}`,
      isAvailable: food.isAvailable,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/food/:id
// @desc    Delete food item
// @access  Private / Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    await FoodItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
