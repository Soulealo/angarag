const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Every route in this file requires a valid admin role or admin permission.
router.use(authMiddleware, adminMiddleware);

router.get('/dashboard', asyncHandler(adminController.getDashboard));
router.get('/payment-info', asyncHandler(adminController.getPaymentInfo));
router.put('/payment-info', asyncHandler(adminController.updatePaymentInfo));

module.exports = router;
