const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

async function buildOrderItems(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Order must contain at least one item.');
  }

  const normalizedItems = [];

  for (const item of items) {
    if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
      throw new Error('Each item must include a valid product id.');
    }

    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      throw new Error(`Product is unavailable: ${item.product}`);
    }

    const quantity = Math.max(Number(item.quantity || 1), 1);
    normalizedItems.push({
      product: product._id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      quantity,
      color: item.color || '',
      size: item.size || '',
    });
  }

  return normalizedItems;
}

async function getOrders(req, res) {
  const orders = await Order.find()
    .populate('user', 'name email role')
    .populate('items.product', 'name slug')
    .sort({ createdAt: -1 });

  res.json({ orders });
}

async function createOrder(req, res) {
  const { customerName, email, phone, address, paymentMethod, notes } = req.body;

  if (!customerName || !email || !phone || !address) {
    return res.status(400).json({ message: 'Customer name, email, phone, and address are required.' });
  }

  try {
    const items = await buildOrderItems(req.body.items);
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      customerName,
      email,
      phone,
      address,
      items,
      totalAmount,
      paymentMethod: paymentMethod || 'bank_transfer',
      notes: notes || '',
      user: req.user ? req.user._id : null,
    });

    res.status(201).json({ order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function updateOrderStatus(req, res) {
  const { status } = req.body;
  const allowedStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid order status.' });
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  res.json({ order });
}

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
};
