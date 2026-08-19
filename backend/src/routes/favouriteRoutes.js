const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Product = require('../models/Product');

// GET /api/favourites — get current user's favourites (populated)
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favourites');
    res.json(user.favourites || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/favourites/:productId — add to favourites
router.post('/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    if (!user.favourites.includes(productId)) {
      user.favourites.push(productId);
      await user.save();
    }

    const populated = await User.findById(req.user._id).populate('favourites');
    res.json(populated.favourites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/favourites/:productId — remove from favourites
router.delete('/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.favourites = user.favourites.filter(
      (id) => id.toString() !== req.params.productId
    );
    await user.save();

    const populated = await User.findById(req.user._id).populate('favourites');
    res.json(populated.favourites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
