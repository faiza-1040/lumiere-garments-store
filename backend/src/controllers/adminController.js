const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────

const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Revenue
    const allOrders = await Order.find({ status: { $ne: 'cancelled' } });
    const totalRevenue = allOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const monthlyRevenue = allOrders
      .filter(o => new Date(o.createdAt) >= startOfMonth)
      .reduce((sum, o) => sum + o.totalPrice, 0);
    const todayRevenue = allOrders
      .filter(o => new Date(o.createdAt) >= startOfDay)
      .reduce((sum, o) => sum + o.totalPrice, 0);

    // Orders
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

    // Users
    const totalUsers = await User.countDocuments();
    const newUsersToday = await User.countDocuments({ createdAt: { $gte: startOfDay } });
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfMonth } });

    // Products
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({ countInStock: { $lte: 5, $gt: 0 } });
    const outOfStockProducts = await Product.countDocuments({ countInStock: 0 });

    // Best selling products
    const bestSelling = await Product.find().sort({ totalSales: -1 }).limit(5).select('name totalSales price image');

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'firstName lastName email');

    // Monthly revenue chart data (last 6 months)
    const monthlyChart = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const monthOrders = await Order.find({
        createdAt: { $gte: start, $lt: end },
        status: { $ne: 'cancelled' }
      });
      const revenue = monthOrders.reduce((sum, o) => sum + o.totalPrice, 0);
      monthlyChart.push({
        month: start.toLocaleString('default', { month: 'short', year: 'numeric' }),
        revenue,
        orders: monthOrders.length
      });
    }

    res.json({
      revenue: { total: totalRevenue, monthly: monthlyRevenue, today: todayRevenue },
      orders: { total: totalOrders, pending: pendingOrders, processing: processingOrders, shipped: shippedOrders, delivered: deliveredOrders, cancelled: cancelledOrders },
      users: { total: totalUsers, newToday: newUsersToday, newThisMonth: newUsersThisMonth },
      products: { total: totalProducts, lowStock: lowStockProducts, outOfStock: outOfStockProducts },
      bestSelling,
      recentOrders,
      monthlyChart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

const getAllProducts = async (req, res) => {
  try {
    const { search, category, gender, status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (gender) query.gender = gender;
    if (status === 'instock') query.countInStock = { $gt: 0 };
    if (status === 'outofstock') query.countInStock = 0;
    if (status === 'lowstock') query.countInStock = { $lte: 5, $gt: 0 };
    if (status === 'featured') query.isFeatured = true;
    if (status === 'sale') query.isSale = true;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = new Product({ ...req.body, user: req.user._id });
    const created = await product.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    Object.assign(product, req.body);
    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── ORDERS ───────────────────────────────────────────────────────────────────

const getAllOrders = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { contactEmail: { $regex: search, $options: 'i' } },
        { 'shippingAddress.firstName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.lastName': { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('user', 'firstName lastName email');

    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const { status } = req.body;
    order.status = status;
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── USERS ────────────────────────────────────────────────────────────────────

const getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role === 'admin') query.isAdmin = true;
    if (role === 'user') query.isAdmin = false;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password -verificationToken')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -verificationToken');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const orders = await Order.find({ $or: [{ user: user._id }, { contactEmail: user.email }] })
      .sort({ createdAt: -1 });

    res.json({ user, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isAdmin = req.body.isAdmin;
    const updated = await user.save();
    res.json({ _id: updated._id, firstName: updated.firstName, lastName: updated.lastName, email: updated.email, isAdmin: updated.isAdmin });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    // Prevent deleting yourself
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── REVIEWS ──────────────────────────────────────────────────────────────────

const getAllReviews = async (req, res) => {
  try {
    const products = await Product.find({ 'reviews.0': { $exists: true } }).select('name reviews');
    const reviews = [];
    products.forEach(p => {
      p.reviews.forEach(r => {
        reviews.push({ ...r.toObject(), productId: p._id, productName: p.name });
      });
    });
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.reviews = product.reviews.filter(r => r._id.toString() !== reviewId);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.length
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

    await product.save();
    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── INVENTORY ────────────────────────────────────────────────────────────────

const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({ countInStock: { $lte: 10 } })
      .sort({ countInStock: 1 })
      .select('name countInStock price category gender image');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adjustStock = async (req, res) => {
  try {
    const { adjustment } = req.body; // positive or negative number
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.countInStock = Math.max(0, product.countInStock + adjustment);
    const updated = await product.save();
    res.json({ _id: updated._id, name: updated.name, countInStock: updated.countInStock });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllProducts, createProduct, updateProduct, deleteProduct,
  getAllOrders, updateOrderStatus, deleteOrder,
  getAllUsers, getUserById, updateUserRole, deleteUser,
  getAllReviews, deleteReview,
  getLowStockProducts, adjustStock,
};
