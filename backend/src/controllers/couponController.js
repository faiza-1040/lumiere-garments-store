const Coupon = require('../models/Coupon');

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    const created = await coupon.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Coupon removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code, orderValue } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date())
      return res.status(400).json({ message: 'Coupon has expired' });
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    if (coupon.minOrderValue && orderValue < coupon.minOrderValue)
      return res.status(400).json({ message: `Minimum order value is PKR ${coupon.minOrderValue}` });

    const discount = coupon.type === 'percentage'
      ? (orderValue * coupon.value) / 100
      : coupon.value;

    res.json({ valid: true, coupon, discount: Math.min(discount, orderValue) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon };
