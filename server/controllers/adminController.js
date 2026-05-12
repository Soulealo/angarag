const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const PaymentInfo = require('../models/PaymentInfo');

async function getDashboard(req, res) {
  const [users, products, categories, orders, revenueAgg] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Category.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
  ]);

  res.json({
    stats: {
      users,
      products,
      categories,
      orders,
      revenue: revenueAgg[0]?.total || 0,
    },
  });
}

async function getPaymentInfo(req, res) {
  const paymentInfo = await PaymentInfo.findOne().sort({ updatedAt: -1 });
  res.json({ paymentInfo });
}

async function getPublicPaymentInfo(req, res) {
  const paymentInfo = await PaymentInfo.findOne({ isActive: true })
    .sort({ updatedAt: -1 })
    .select('-updatedBy -createdAt -updatedAt -__v');

  res.json({ paymentInfo });
}

async function updatePaymentInfo(req, res) {
  const payload = {
    bankName: req.body.bankName,
    accountName: req.body.accountName,
    accountNumber: req.body.accountNumber,
    iban: req.body.iban || '',
    qpayMerchantId: req.body.qpayMerchantId || '',
    instructions: req.body.instructions || '',
    isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
    updatedBy: req.user._id,
  };

  if (!payload.bankName || !payload.accountName || !payload.accountNumber) {
    return res.status(400).json({ message: 'Bank name, account name, and account number are required.' });
  }

  const existing = await PaymentInfo.findOne().sort({ updatedAt: -1 });
  const paymentInfo = existing
    ? await PaymentInfo.findByIdAndUpdate(existing._id, payload, { new: true, runValidators: true })
    : await PaymentInfo.create(payload);

  res.json({ paymentInfo });
}

module.exports = {
  getDashboard,
  getPaymentInfo,
  getPublicPaymentInfo,
  updatePaymentInfo,
};
