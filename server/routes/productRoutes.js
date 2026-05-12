const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const adminOnly = [authMiddleware, adminMiddleware];

router.get('/', asyncHandler(productController.getProducts));
router.get('/admin/all', adminOnly, asyncHandler(productController.getProducts));
router.get('/:id', asyncHandler(productController.getProduct));
router.post('/', adminOnly, asyncHandler(productController.createProduct));
router.put('/:id', adminOnly, asyncHandler(productController.updateProduct));
router.delete('/:id', adminOnly, asyncHandler(productController.deleteProduct));

module.exports = router;
