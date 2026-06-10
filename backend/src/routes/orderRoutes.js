const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/orders — create order (optionally attach user if logged in)
router.post('/', (req, res, next) => {
  // Try to attach user if token is present, but don't block if not
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      User.findById(decoded.id).select('-password').then((user) => {
        if (user) req.user = user;
        next();
      }).catch(() => next());
    } catch {
      next();
    }
  } else {
    next();
  }
}, addOrderItems);

// GET /api/orders/mine — get all orders for logged-in user (protected)
router.get('/mine', protect, getMyOrders);

// GET /api/orders/:id — get single order by ID (public)
router.get('/:id', getOrderById);

module.exports = router;
