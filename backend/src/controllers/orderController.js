const Order = require('../models/Order');
const nodemailer = require('nodemailer');

// ─── Email transporter ────────────────────────────────────────────────────────
const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    tls: { rejectUnauthorized: false },
  });

// ─── Build HTML confirmation email ───────────────────────────────────────────
const buildOrderEmailHTML = (order) => {
  const itemRows = order.orderItems.map((item) => `
    <tr>
      <td style="padding:12px 8px;border-bottom:1px solid #f0ece8;font-size:14px;color:#292524;">
        ${item.name}${item.selectedSize && item.selectedSize !== 'N/A' ? ` <span style="color:#78716c;font-size:12px;">(${item.selectedSize})</span>` : ''}
      </td>
      <td style="padding:12px 8px;border-bottom:1px solid #f0ece8;font-size:14px;color:#292524;text-align:center;">${item.qty}</td>
      <td style="padding:12px 8px;border-bottom:1px solid #f0ece8;font-size:14px;color:#292524;text-align:right;">PKR ${(item.price * item.qty).toLocaleString()}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#fafaf9;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf9;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e7e5e4;border-radius:4px;overflow:hidden;max-width:600px;width:100%;">
  <tr><td style="background:#292524;padding:32px 40px;text-align:center;">
    <h1 style="margin:0;color:#fafaf9;font-size:28px;font-weight:300;letter-spacing:6px;text-transform:uppercase;">LUMIÈRE</h1>
    <p style="margin:8px 0 0;color:#a8a29e;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Premium Fashion</p>
  </td></tr>
  <tr><td style="background:#f0fdf4;border-bottom:2px solid #86efac;padding:24px 40px;text-align:center;">
    <h2 style="margin:0;color:#15803d;font-size:20px;font-weight:600;">Order Confirmed!</h2>
    <p style="margin:8px 0 0;color:#166534;font-size:14px;">Your order has been placed successfully.</p>
  </td></tr>
  <tr><td style="padding:32px 40px;">
    <p style="margin:0 0 24px;color:#44403c;font-size:15px;">
      Hi <strong>${order.shippingAddress.firstName}</strong>,<br/>Thank you for shopping with Lumière.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf9;border:1px solid #e7e5e4;border-radius:4px;margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;border-bottom:1px solid #e7e5e4;">
          <span style="color:#78716c;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Order Number</span><br/>
          <strong style="color:#292524;font-size:14px;font-family:monospace;">${order._id}</strong>
        </td>
        <td style="padding:16px 20px;border-bottom:1px solid #e7e5e4;text-align:right;">
          <span style="color:#78716c;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Date</span><br/>
          <strong style="color:#292524;font-size:14px;">${new Date(order.createdAt).toLocaleDateString('en-PK', { year:'numeric', month:'long', day:'numeric' })}</strong>
        </td>
      </tr>
      <tr><td style="padding:16px 20px;" colspan="2">
        <span style="color:#78716c;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Payment Method</span><br/>
        <strong style="color:#292524;font-size:14px;">${order.paymentMethod}</strong>
      </td></tr>
    </table>
    <h3 style="margin:0 0 12px;font-size:13px;text-transform:uppercase;letter-spacing:2px;color:#292524;font-weight:600;">Order Items</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <thead><tr style="background:#f5f5f4;">
        <th style="padding:10px 8px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#78716c;text-align:left;font-weight:600;">Product</th>
        <th style="padding:10px 8px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#78716c;text-align:center;font-weight:600;">Qty</th>
        <th style="padding:10px 8px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#78716c;text-align:right;font-weight:600;">Price</th>
      </tr></thead>
      <tbody>${itemRows}</tbody>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid #e7e5e4;padding-top:16px;margin-bottom:28px;">
      <tr><td style="padding:6px 0;color:#78716c;font-size:14px;">Subtotal</td><td style="padding:6px 0;color:#292524;font-size:14px;text-align:right;">PKR ${order.itemsPrice.toLocaleString()}</td></tr>
      <tr><td style="padding:6px 0;color:#78716c;font-size:14px;">Shipping</td><td style="padding:6px 0;color:#292524;font-size:14px;text-align:right;">PKR ${order.shippingPrice.toLocaleString()}</td></tr>
      <tr>
        <td style="padding:10px 0 0;color:#292524;font-size:16px;font-weight:700;border-top:1px solid #e7e5e4;">Total</td>
        <td style="padding:10px 0 0;color:#292524;font-size:16px;font-weight:700;text-align:right;border-top:1px solid #e7e5e4;">PKR ${order.totalPrice.toLocaleString()}</td>
      </tr>
    </table>
    <h3 style="margin:0 0 12px;font-size:13px;text-transform:uppercase;letter-spacing:2px;color:#292524;font-weight:600;">Shipping Address</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf9;border:1px solid #e7e5e4;border-radius:4px;margin-bottom:28px;">
      <tr><td style="padding:16px 20px;color:#44403c;font-size:14px;line-height:1.8;">
        <strong>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</strong><br/>
        ${order.shippingAddress.address}<br/>
        ${order.shippingAddress.city}${order.shippingAddress.postalCode ? ', ' + order.shippingAddress.postalCode : ''}<br/>
        ${order.shippingAddress.country || 'Pakistan'}
      </td></tr>
    </table>
    <div style="text-align:center;margin-bottom:8px;">
      <a href="http://localhost:3000/order/${order._id}" style="display:inline-block;padding:14px 32px;background:#292524;color:#fafaf9;text-decoration:none;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:600;border-radius:2px;">View Order Status</a>
    </div>
  </td></tr>
  <tr><td style="background:#f5f5f4;padding:24px 40px;text-align:center;border-top:1px solid #e7e5e4;">
    <p style="margin:0;color:#a8a29e;font-size:12px;">
      © ${new Date().getFullYear()} Lumière. All rights reserved.<br/>
      Questions? <a href="mailto:${process.env.EMAIL_USER}" style="color:#292524;">${process.env.EMAIL_USER}</a>
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
};

// ─── Create new order ─────────────────────────────────────────────────────────
const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, contactEmail, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      // Link to logged-in user if token was provided
      user: req.user ? req.user._id : undefined,
      orderItems,
      shippingAddress,
      contactEmail,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      isPaid: paymentMethod === 'Cash on Delivery (COD)' ? false : true,
      paidAt: paymentMethod === 'Cash on Delivery (COD)' ? undefined : Date.now(),
    });

    const createdOrder = await order.save();

    // Send confirmation email (non-blocking)
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"Lumière" <${process.env.EMAIL_USER}>`,
        to: contactEmail,
        subject: `Order Confirmed – #${createdOrder._id}`,
        html: buildOrderEmailHTML(createdOrder),
      });
      console.log(`✅ Confirmation email sent to ${contactEmail}`);
    } catch (emailErr) {
      console.error('⚠️  Email failed:', emailErr.message);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── Get order by ID ──────────────────────────────────────────────────────────
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Get orders for logged-in user (by user ID + email fallback) ──────────────
const getMyOrders = async (req, res) => {
  try {
    // Find orders by user ID OR by contactEmail (covers orders before user linking was added)
    const orders = await Order.find({
      $or: [
        { user: req.user._id },
        { contactEmail: req.user.email },
      ],
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addOrderItems, getOrderById, getMyOrders };
