const express = require('express');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const adminOnly = [authMiddleware, adminMiddleware];

router.get('/', asyncHandler(categoryController.getCategories));
router.get('/admin/all', adminOnly, asyncHandler(categoryController.getCategories));
router.get('/:id', asyncHandler(categoryController.getCategory));
router.post('/', adminOnly, asyncHandler(categoryController.createCategory));
router.put('/:id', adminOnly, asyncHandler(categoryController.updateCategory));
router.delete('/:id', adminOnly, asyncHandler(categoryController.deleteCategory));

module.exports = router;
