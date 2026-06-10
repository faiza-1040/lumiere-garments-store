const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ['percentage', 'fixed'], required: true },
  value: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  usageLimit: { type: Number, default: null }, // null = unlimited
  usedCount: { type: Number, default: 0 },
  expiresAt: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
  description: { type: String, default: '' },
}, { timestamps: true });

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
