const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getDashboardStats,
  getAllProducts, createProduct, updateProduct, deleteProduct,
  getAllOrders, updateOrderStatus, deleteOrder,
  getAllUsers, getUserById, updateUserRole, deleteUser,
  getAllReviews, deleteReview,
  getLowStockProducts, adjustStock,
} = require('../controllers/adminController');
const {
  getAllCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon,
} = require('../controllers/couponController');

// All routes require login + admin role
router.use(protect, admin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Products
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

// Users
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Reviews
router.get('/reviews', getAllReviews);
router.delete('/reviews/:productId/:reviewId', deleteReview);

// Inventory
router.get('/inventory/low-stock', getLowStockProducts);
router.put('/inventory/:id/adjust', adjustStock);

// Coupons
router.get('/coupons', getAllCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);
router.post('/coupons/validate', validateCoupon);

module.exports = router;
