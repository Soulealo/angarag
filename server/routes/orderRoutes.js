const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const adminOnly = [authMiddleware, adminMiddleware];

router.get('/', adminOnly, asyncHandler(orderController.getOrders));
router.post('/', asyncHandler(orderController.createOrder));
router.put('/:id/status', adminOnly, asyncHandler(orderController.updateOrderStatus));

module.exports = router;
