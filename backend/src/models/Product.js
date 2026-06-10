const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String }],
  brand: { type: String, required: true },
  category: { type: String, required: true },
  gender: { type: String, required: true, enum: ['Men', 'Women', 'Kids'] },
  description: { type: String, required: true },
  reviews: [reviewSchema],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  discountPrice: { type: Number, default: 0 },
  isSale: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  totalSales: { type: Number, default: 0 },
  countInStock: { type: Number, required: true, default: 0 },
  sizes: [{ type: String }],
  colors: [{ type: String }]
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
