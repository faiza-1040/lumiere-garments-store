const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProductReview } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;
